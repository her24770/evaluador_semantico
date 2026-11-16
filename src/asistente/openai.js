/**
 * Cliente de OpenAI utilizado por el tutor y la lectura de fotos en el servidor.
 * Envía los mensajes, limita la espera y comprueba que la respuesta esté completa.
 * Los fallos del proveedor se traducen a errores propios con mensajes para la interfaz.
 * La clave se usa aquí y no se entrega al navegador.
 */
import { ErrorAsistente } from './error.js';

const URL_OPENAI = 'https://api.openai.com/v1/chat/completions';
export const MODELO_PREDETERMINADO = 'gpt-6-luna';

/**
 * Crea un generador que hace una petición por llamada, sin reintentos automáticos.
 * @param {{clave: string, modelo?: string, fetchImpl?: Function, esperaMs?: number}} opciones
 *   esperaMs es el plazo de la petición en milisegundos
 * @returns {Function} generar(mensajes) devuelve Promise<{texto, modelo, consumo}>
 * @throws {ErrorAsistente} al crear el cliente si falta la clave; al generar si falla la consulta
 */
export function crearClienteOpenAI({ clave, modelo = MODELO_PREDETERMINADO, fetchImpl = fetch, esperaMs = 20000 }) {
  if (typeof clave !== 'string' || !clave.trim() || clave.trim() === 'tu_clave') {
    throw new ErrorAsistente('configuracion', 'Falta configurar OPENAI_API_KEY en el servidor.', 503);
  }
  return async function generar(mensajes) {
    try {
      const respuesta = await fetchImpl(URL_OPENAI, {
        method: 'POST',
        headers: { Authorization: `Bearer ${clave.trim()}`, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(esperaMs),
        body: JSON.stringify({
          model: modelo, messages: mensajes, stream: false, store: false,
          max_completion_tokens: 1200,
          // Para explicar evidencia ya seleccionada se evita gastar tokens en razonamiento adicional.
          ...(modelo.startsWith('gpt-6') ? { reasoning_effort: 'none' } : {}),
        }),
      });
      if (!respuesta.ok) {
        // Se lee únicamente el código de error conocido; nunca se devuelve el cuerpo del proveedor.
        if (respuesta.status === 429) {
          const datosError = await respuesta.json().catch(() => null);
          if (['insufficient_quota', 'billing_hard_limit_reached'].includes(datosError?.error?.code)) {
            throw new ErrorAsistente('saldo_openai', 'OpenAI no tiene saldo o cuota de facturación disponible. Revisa la cuenta del proyecto.', 503);
          }
          const segundos = Number(respuesta.headers.get('retry-after'));
          const reintentarEn = Number.isFinite(segundos) && segundos > 0 ? Math.ceil(Math.min(segundos, 86400)) : 60;
          throw new ErrorAsistente('limite_openai', 'OpenAI alcanzó un límite de solicitudes o tokens. Espera antes de volver a consultar.', 429, reintentarEn);
        }
        await respuesta.body?.cancel();
        if ([401, 403, 404].includes(respuesta.status)) {
          throw new ErrorAsistente('configuracion_openai', 'Revisa la clave, el modelo y los permisos de OpenAI en el servidor.', 503);
        }
        throw new ErrorAsistente('servicio_openai', 'OpenAI no pudo procesar la consulta. Inténtalo más tarde.', 502);
      }
      const datos = await respuesta.json();
      const opcion = datos?.choices?.[0];
      if (opcion?.finish_reason === 'length') {
        throw new ErrorAsistente('respuesta_incompleta', 'La explicación superó el límite de respuesta. Haz una pregunta más específica.', 502);
      }
      const texto = opcion?.message?.content;
      if (opcion?.finish_reason !== 'stop' || typeof texto !== 'string' || !texto.trim() || texto.length > 12000) {
        throw new ErrorAsistente('respuesta_invalida', 'El modelo no devolvió una explicación completa. Inténtalo de nuevo.', 502);
      }
      return {
        texto: texto.trim(),
        modelo: typeof datos.model === 'string' ? datos.model : modelo,
        consumo: leerConsumo(datos.usage),
      };
    } catch (error) {
      if (error instanceof ErrorAsistente) throw error;
      if (['TimeoutError', 'AbortError'].includes(error.name)) {
        throw new ErrorAsistente('tiempo_agotado', 'La consulta a OpenAI tardó demasiado. Inténtalo más tarde.', 504);
      }
      throw new ErrorAsistente('conexion_openai', 'No se pudo leer la respuesta de OpenAI. Revisa la conexión e inténtalo más tarde.', 502);
    }
  };
}

/**
 * Adapta los contadores del proveedor a los nombres usados por la aplicación.
 * Comprueba que entrada + salida = total y que los detalles no superen sus totales.
 * @param {object|undefined} uso
 * @returns {object|null} contadores válidos; null si falta el consumo o es inconsistente
 */
function leerConsumo(uso) {
  const entero = (valor) => Number.isSafeInteger(valor) && valor >= 0;
  if (!uso || ![uso.prompt_tokens, uso.completion_tokens, uso.total_tokens].every(entero)
    || uso.total_tokens !== uso.prompt_tokens + uso.completion_tokens) return null;
  const cache = uso.prompt_tokens_details?.cached_tokens;
  const razonamiento = uso.completion_tokens_details?.reasoning_tokens;
  return {
    entrada: uso.prompt_tokens, salida: uso.completion_tokens, total: uso.total_tokens,
    entradaCache: entero(cache) && cache <= uso.prompt_tokens ? cache : null,
    razonamiento: entero(razonamiento) && razonamiento <= uso.completion_tokens ? razonamiento : null,
  };
}
