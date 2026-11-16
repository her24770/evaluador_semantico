/**
 * Formato y límites de las consultas de teoría, compartidos por navegador y servidor.
 * Una consulta lleva pregunta y, opcionalmente, hasta dos intercambios recientes.
 * Se limitan tanto los caracteres como los bytes: una tilde o un símbolo Unicode
 * puede ocupar más de un byte al enviarse como JSON en UTF-8.
 */
import { ErrorAsistente } from './error.js';

// Compartido por el navegador y el servidor; no contiene claves ni código de Node.
export const MAX_PREGUNTA = 1200;
export const MAX_HISTORIAL_BYTES = 6000;
export const MAX_CUERPO_BYTES = 12288;
/** Tamaño del JSON en bytes UTF-8, no en cantidad de caracteres. */
export const bytesJSON = (valor) => new TextEncoder().encode(JSON.stringify(valor)).length;
const objeto = (valor) => valor !== null && typeof valor === 'object' && !Array.isArray(valor);
const campos = (valor, permitidos) => objeto(valor) && Object.keys(valor).every((clave) => permitidos.includes(clave));
const texto = (valor, max) => typeof valor === 'string' && valor.length <= max;

/**
 * Revisa pares completos user/assistant, sus campos y sus límites de tamaño.
 * @param {object[]} [historial]  cero, dos o cuatro mensajes en orden cronológico
 * @returns {object[]} el mismo historial si es válido
 * @throws {ErrorAsistente} si el historial no cumple el contrato
 */
export function validarHistorial(historial = []) {
  if (!Array.isArray(historial) || historial.length > 4 || historial.length % 2
    || historial.some((m, i) => !campos(m, ['role', 'content'])
      || m.role !== (i % 2 ? 'assistant' : 'user') || !texto(m.content, i % 2 ? 6000 : MAX_PREGUNTA) || !m.content.trim())
    || bytesJSON(historial) > MAX_HISTORIAL_BYTES) {
    throw new ErrorAsistente('consulta_invalida', 'El historial debe contener hasta dos intercambios completos de usuario y tutor.', 400);
  }
  return historial;
}

/**
 * Conserva los dos últimos intercambios completos y elimina pares antiguos si exceden el límite.
 * No corta fórmulas para ahorrar espacio. Se espera un historial de pares válidos.
 * @param {object[]} historial
 * @returns {object[]} copia acotada; no modifica el arreglo original
 */
export function acotarHistorial(historial) {
  const reciente = historial.slice(-4);
  while (reciente.length && bytesJSON(reciente) > MAX_HISTORIAL_BYTES) reciente.splice(0, 2);
  return reciente;
}

/**
 * Acepta solo pregunta e historial y valida ambos antes de consultar el servicio.
 * @param {object} datos  cuerpo JSON recibido
 * @returns {string} pregunta sin espacios en los extremos
 * @throws {ErrorAsistente} si hay campos extra, texto vacío o límites excedidos
 */
export function validarConsulta(datos) {
  if (!campos(datos, ['pregunta', 'historial'])
    || !texto(datos.pregunta, MAX_PREGUNTA) || !datos.pregunta.trim()) {
    throw new ErrorAsistente('consulta_invalida', `Envía un objeto JSON con una pregunta de 1 a ${MAX_PREGUNTA} caracteres.`, 400);
  }
  validarHistorial(datos.historial);
  return datos.pregunta.trim();
}
