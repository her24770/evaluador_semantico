import { crearServicioAsistente } from '../src/asistente/servicio.js';
import { crearManejador } from '../src/asistente/http.js';

let servicio;
function obtenerServicio() {
  servicio ??= crearServicioAsistente().catch((error) => { servicio = undefined; throw error; });
  return servicio;
}

// Misma entrada para el servidor local y la función de Vercel.
export default crearManejador(obtenerServicio);
