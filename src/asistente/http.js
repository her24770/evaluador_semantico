/**
 * Adaptación HTTP de los servicios de chat y foto.
 * Revisa método, origen, tipo y tamaño del cuerpo antes de usar el servicio.
 * También limita consultas y convierte los errores conocidos en respuestas JSON;
 * los errores inesperados salen con un mensaje genérico.
 */
import { ErrorAsistente } from './error.js';
import { validarConsulta } from './servicio.js';

import { MAX_CUERPO_BYTES } from './contrato.js';

/** Envía JSON en UTF-8 e indica que la respuesta no debe guardarse en caché. */
function enviar(res, estado, datos) {
  res.statusCode = estado;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(JSON.stringify(datos));
}

/**
 * Lee un cuerpo ya preparado o un flujo de datos, según el entorno del servidor.
 * Cuenta bytes reales además de revisar Content-Length, que puede faltar o ser incorrecto.
 * @param {object} req  petición HTTP
 * @param {number} maxBytes
 * @returns {Promise<unknown>} valor obtenido al interpretar el JSON
 */
async function leerJSON(req, maxBytes) {
  if (Number(req.headers['content-length']) > maxBytes) {
    throw new ErrorAsistente('cuerpo_grande', 'La consulta supera el tamaño permitido.', 413);
  }
  if (req.body !== undefined) {
    // Vercel puede entregar el cuerpo ya interpretado; el servidor local entrega un stream.
    const texto = typeof req.body === 'string' || Buffer.isBuffer(req.body) ? req.body.toString() : JSON.stringify(req.body);
    if (Buffer.byteLength(texto) > maxBytes) throw new ErrorAsistente('cuerpo_grande', 'La consulta supera el tamaño permitido.', 413);
    return JSON.parse(texto);
  }
  return new Promise((resolve, reject) => {
    const trozos = [];
    let bytes = 0;
    req.on('data', (trozo) => {
      bytes += trozo.length;
      if (bytes > maxBytes) {
        reject(new ErrorAsistente('cuerpo_grande', 'La consulta supera el tamaño permitido.', 413));
      } else trozos.push(trozo);
    });
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(trozos).toString('utf8'))); }
      catch { reject(new ErrorAsistente('json_invalido', 'El cuerpo debe ser JSON válido.', 400)); }
    });
    req.on('error', reject);
    req.on('aborted', () => reject(new ErrorAsistente('consulta_cancelada', 'La consulta se canceló.', 400)));
  });
}

/**
 * Crea un manejador con un límite de seis consultas por minuto y una en curso.
 * El contador pertenece a cada instancia del manejador, no a cada usuario.
 * Chat y foto usan esta misma función con su propia validación y tamaño máximo.
 *
 * @param {Function} obtenerServicio  obtiene o crea la función que procesa los datos validados
 * @param {{ahora?: Function, validar?: Function, maxBytes?: number}} [opciones]
 * @returns {Function} manejar(req, res), compatible con el servidor local y los endpoints
 */
export function crearManejador(obtenerServicio, { ahora = Date.now, validar = validarConsulta, maxBytes = MAX_CUERPO_BYTES } = {}) {
  let inicio = 0;
  let consultas = 0;
  let ocupado = false;
  return async function manejar(req, res) {
    let reservado = false;
    try {
      if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        throw new ErrorAsistente('metodo_no_permitido', 'Usa POST para consultar al asistente.', 405);
      }
      const origen = req.headers.origin;
      if (origen) {
        let hostOrigen;
        try { hostOrigen = new URL(origen).host; } catch { /* Un Origin inválido también se rechaza. */ }
        if (!hostOrigen || hostOrigen !== req.headers.host) {
          throw new ErrorAsistente('origen_no_permitido', 'La consulta debe salir del mismo sitio.', 403);
        }
      }
      if (req.headers['content-type']?.split(';')[0].trim().toLowerCase() !== 'application/json') {
        throw new ErrorAsistente('tipo_no_permitido', 'Envía la consulta como application/json.', 415);
      }
      let datos;
      try { datos = await leerJSON(req, maxBytes); }
      catch (error) {
        if (error instanceof SyntaxError) throw new ErrorAsistente('json_invalido', 'El cuerpo debe ser JSON válido.', 400);
        throw error;
      }
      validar(datos);
      const tiempo = ahora();
      if (tiempo - inicio >= 60000) { inicio = tiempo; consultas = 0; }
      if (ocupado || consultas >= 6) {
        throw new ErrorAsistente('limite_local', 'El asistente está ocupado o alcanzó su límite de consultas. Espera antes de continuar.', 429,
          ocupado ? 5 : Math.max(1, Math.ceil((inicio + 60000 - tiempo) / 1000)));
      }
      ocupado = true;
      reservado = true;
      consultas++;
      const responder = await obtenerServicio();
      enviar(res, 200, await responder(datos));
    } catch (error) {
      const conocido = error instanceof ErrorAsistente;
      const estado = conocido ? error.estado : 500;
      const datos = { error: {
        codigo: conocido ? error.codigo : 'error_interno',
        mensaje: conocido ? error.message : 'No se pudo atender la consulta. Inténtalo más tarde.',
      } };
      if (conocido && error.reintentarEn) {
        res.setHeader('Retry-After', String(error.reintentarEn));
        datos.error.reintentarEn = error.reintentarEn;
      }
      enviar(res, estado, datos);
    } finally {
      // Solo libera la reserva hecha por esta petición; un rechazo no debe liberar la de otra.
      if (reservado) ocupado = false;
    }
  };
}
