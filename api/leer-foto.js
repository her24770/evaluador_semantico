import { crearLectorFoto, validarFoto, MAX_CUERPO_FOTO } from '../src/asistente/foto.js';
import { crearManejador } from '../src/asistente/http.js';

// Lee la fórmula de una foto con la clave de OpenAI del servidor.
// Misma entrada para el servidor local y la función de Vercel.
const leer = crearLectorFoto();
export default crearManejador(async () => leer, { validar: validarFoto, maxBytes: MAX_CUERPO_FOTO });
