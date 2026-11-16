/**
 * Envía la foto al servidor de la app (POST /api/leer-foto), que la lee con OpenAI.
 * La clave de OpenAI está solo en el servidor (OPENAI_API_KEY); el navegador nunca la ve.
 * El servidor está en src/asistente/foto.js.
 */
import { normalizarFormula } from '../../sintaxis/index.js';

export const RUTA_FOTO = '/api/leer-foto';

export class ErrorLector extends Error {}

/**
 * @param {object} opciones
 * @param {string} opciones.imagen  data URL (data:image/jpeg;base64,…)
 * @param {string[]} [opciones.simbolos]  nombres declarados en el lenguaje, como pista
 * @param {AbortSignal} [opciones.senal]
 * @param {typeof fetch} [opciones.fetch]  para las pruebas
 * @returns {Promise<{formula: string, leida: string, legible: boolean, dudas: {fragmento: string, alternativas: string[], motivo: string}[]}>}
 */
export async function leerFormulaDeFoto({ imagen, simbolos = [], senal, fetch: pedir = globalThis.fetch }) {
  if (!imagen) throw new ErrorLector('Primero sube una foto.');
  let respuesta;
  try {
    respuesta = await pedir(RUTA_FOTO, {
      method: 'POST',
      signal: senal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imagen, simbolos: [...new Set(simbolos)].slice(0, 50) }),
    });
  } catch (error) {
    if (error?.name === 'AbortError') throw error;
    throw new ErrorLector('No se pudo conectar con el servidor de la app. En local, inicia también npm run dev:asistente.');
  }
  const datos = await respuesta.json().catch(() => null);
  if (!respuesta.ok) {
    if (respuesta.status === 404 || !datos?.error) {
      throw new ErrorLector('El servidor de lectura de fotos no está disponible. En local, inicia también npm run dev:asistente.');
    }
    const espera = datos.error.reintentarEn ? ` Puedes reintentar en ${datos.error.reintentarEn} s.` : '';
    throw new ErrorLector(`${datos.error.mensaje}${espera}`);
  }
  if (typeof datos?.formula !== 'string') throw new ErrorLector('La respuesta del servidor no tiene el formato esperado.');
  return {
    leida: datos.formula,
    formula: normalizarFormula(datos.formula),
    legible: datos.legible !== false && datos.formula.trim() !== '',
    dudas: Array.isArray(datos.dudas) ? datos.dudas : [],
  };
}
