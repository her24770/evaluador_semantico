/**
 * Lee una fórmula desde una foto con la API de OpenAI (Responses API, entrada de imagen).
 *
 * La API key la pega cada persona en la app y queda solo en su navegador:
 * nunca va en el código, en el repo ni en un .env con VITE_ (Vite la publicaría).
 */
import { normalizarFormula } from '../../sintaxis/index.js';

export const MODELO_PREDETERMINADO = 'gpt-5.4-mini';
const URL_API = 'https://api.openai.com/v1/responses';
const CLAVE_GUARDADA = 'evaluador-semantico.openai';

const INSTRUCCIONES = `Eres un lector de fórmulas de lógica de primer orden para un curso universitario.
Copia la fórmula de la imagen TAL COMO ESTÁ escrita: no la corrijas, no la simplifiques y no la resuelvas.
Usa solo esta notación: ∀ ∃ ¬ ∧ ∨ → ↔ = ≠ ( ) y comas entre argumentos. Ejemplo: ∀x (P(x) → ∃y R(x, y)).
Escribe "∀x" y "∃y" pegados a su variable. Conserva mayúsculas y minúsculas de los nombres.
Si hay varias fórmulas, copia la principal o la primera.
En "dudas" anota cada parte que no se lee con seguridad (por ejemplo ∃ que parece E, → que parece >, una v que puede ser ∨),
con el fragmento que escribiste, las alternativas posibles y el motivo. Si todo se lee bien, deja "dudas" vacío.
Si la imagen no contiene una fórmula, pon legible en false y formula vacía.`;

const ESQUEMA = {
  type: 'object',
  properties: {
    formula: { type: 'string' },
    legible: { type: 'boolean' },
    dudas: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          fragmento: { type: 'string' },
          alternativas: { type: 'array', items: { type: 'string' } },
          motivo: { type: 'string' },
        },
        required: ['fragmento', 'alternativas', 'motivo'],
        additionalProperties: false,
      },
    },
  },
  required: ['formula', 'legible', 'dudas'],
  additionalProperties: false,
};

export class ErrorLector extends Error {}

/**
 * @param {object} opciones
 * @param {string} opciones.imagen  data URL (data:image/jpeg;base64,…)
 * @param {string} opciones.clave   API key de OpenAI
 * @param {string} [opciones.modelo]
 * @param {string[]} [opciones.simbolos]  nombres declarados en el lenguaje, como pista
 * @param {AbortSignal} [opciones.senal]
 * @param {typeof fetch} [opciones.fetch]  para las pruebas
 * @returns {Promise<{formula: string, leida: string, legible: boolean, dudas: {fragmento: string, alternativas: string[], motivo: string}[]}>}
 */
export async function leerFormulaDeFoto({ imagen, clave, modelo = MODELO_PREDETERMINADO, simbolos = [], senal, fetch: pedir = globalThis.fetch }) {
  if (!clave?.trim()) throw new ErrorLector('Falta la API key de OpenAI. Pégala en ⚙ Configurar.');
  if (!imagen) throw new ErrorLector('Primero sube una foto.');
  const pista = simbolos.length
    ? `Símbolos declarados en el lenguaje del usuario (úsalos si coinciden con lo que ves): ${simbolos.join(', ')}.`
    : 'El usuario todavía no declaró símbolos.';

  let respuesta;
  try {
    respuesta = await pedir(URL_API, {
      method: 'POST',
      signal: senal,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${clave.trim()}` },
      body: JSON.stringify({
        model: modelo.trim() || MODELO_PREDETERMINADO,
        instructions: INSTRUCCIONES,
        input: [{
          role: 'user',
          content: [
            { type: 'input_text', text: `Lee la fórmula de esta imagen. ${pista}` },
            { type: 'input_image', image_url: imagen, detail: 'high' },
          ],
        }],
        text: { format: { type: 'json_schema', name: 'formula_leida', schema: ESQUEMA, strict: true } },
      }),
    });
  } catch (error) {
    if (error?.name === 'AbortError') throw error;
    throw new ErrorLector('No se pudo conectar con OpenAI. Revisa tu internet e inténtalo de nuevo.');
  }

  const datos = await respuesta.json().catch(() => null);
  if (!respuesta.ok) throw new ErrorLector(mensajeDeError(respuesta.status, datos?.error));

  const partes = (datos?.output ?? []).flatMap((item) => item.content ?? []);
  if (partes.some((p) => p.type === 'refusal')) throw new ErrorLector('OpenAI no quiso leer esta imagen. Prueba con otra foto.');
  const texto = partes.find((p) => p.type === 'output_text')?.text;
  if (datos?.status === 'incomplete' || !texto) throw new ErrorLector('OpenAI no terminó de leer la imagen. Inténtalo de nuevo.');

  let leido;
  try { leido = JSON.parse(texto); } catch { throw new ErrorLector('La respuesta de OpenAI no tiene el formato esperado. Inténtalo de nuevo.'); }
  const leida = String(leido.formula ?? '');
  return {
    leida,
    formula: normalizarFormula(leida),
    legible: leido.legible !== false && leida.trim() !== '',
    dudas: Array.isArray(leido.dudas) ? leido.dudas : [],
  };
}

function mensajeDeError(estado, error) {
  const codigo = error?.code ?? error?.type;
  if (estado === 401) return 'La API key no es válida. Revísala en ⚙ Configurar.';
  if (codigo === 'insufficient_quota') return 'Tu cuenta de OpenAI no tiene saldo. Revisa Billing en platform.openai.com.';
  if (estado === 429) return 'OpenAI recibió demasiadas solicitudes. Espera un momento e inténtalo de nuevo.';
  if (codigo === 'model_not_found' || estado === 404) return 'Tu cuenta no tiene acceso a ese modelo. Cambia el modelo en ⚙ Configurar.';
  if (estado === 400) return `OpenAI rechazó la solicitud: ${error?.message ?? 'revisa la imagen y el modelo'}.`;
  return `OpenAI respondió con un error (${estado}). Inténtalo de nuevo en un momento.`;
}

// --- Configuración guardada en este navegador ---------------------------------

/** localStorage puede fallar (modo privado, permisos): la app sigue sin recordar la key. */
export function cargarConfiguracion(almacen = globalThis.localStorage) {
  try {
    const guardada = JSON.parse(almacen?.getItem(CLAVE_GUARDADA) ?? 'null');
    return { clave: String(guardada?.clave ?? ''), modelo: String(guardada?.modelo || MODELO_PREDETERMINADO) };
  } catch {
    return { clave: '', modelo: MODELO_PREDETERMINADO };
  }
}

export function guardarConfiguracion(config, almacen = globalThis.localStorage) {
  try {
    if (!config.clave && (!config.modelo || config.modelo === MODELO_PREDETERMINADO)) almacen?.removeItem(CLAVE_GUARDADA);
    else almacen?.setItem(CLAVE_GUARDADA, JSON.stringify({ clave: config.clave, modelo: config.modelo }));
    return true;
  } catch {
    return false;
  }
}
