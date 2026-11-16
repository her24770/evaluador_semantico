/**
 * Entrada HTTP del chat: reutiliza el servicio y su corpus entre consultas.
 * Si la preparación falla, permite intentarla de nuevo en la siguiente petición.
 * Las validaciones HTTP y la respuesta de errores se delegan a crearManejador.
 */
import { crearServicioAsistente } from '../src/asistente/servicio.js';
import { crearManejador } from '../src/asistente/http.js';

let servicio;
/** Conserva la promesa de inicialización para no cargar el corpus en cada consulta. */
function obtenerServicio() {
  servicio ??= crearServicioAsistente().catch((error) => { servicio = undefined; throw error; });
  return servicio;
}

// Misma entrada para el servidor local y la función de Vercel.
export default crearManejador(obtenerServicio);
