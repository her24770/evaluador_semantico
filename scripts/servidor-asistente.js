/**
 * Servidor local de los endpoints del asistente y de lectura de fotos.
 * Carga .env si existe y conecta las mismas entradas HTTP usadas en producción.
 * Se inicia con npm run dev:asistente; HOST y PORT permiten cambiar dónde escucha.
 */
import { createServer } from 'node:http';

try { process.loadEnvFile('.env'); }
catch (error) { if (error.code !== 'ENOENT') throw error; }

const rutas = {
  '/api/chat': (await import('../api/chat.js')).default,
  '/api/leer-foto': (await import('../api/leer-foto.js')).default,
};
const servidor = createServer((req, res) => {
  const ruta = rutas[req.url?.split('?')[0]];
  if (ruta) {
    void ruta(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: { codigo: 'ruta_no_encontrada', mensaje: 'Ruta no encontrada.' } }));
  }
});
servidor.requestTimeout = 15000;
servidor.headersTimeout = 10000;
// En local escucha solo en 127.0.0.1; en Docker se usa HOST=0.0.0.0 (ver Dockerfile.backend).
const HOST = process.env.HOST || '127.0.0.1';
const PUERTO = Number(process.env.PORT) || 3001;
servidor.listen(PUERTO, HOST, () => console.log(`Asistente disponible en http://${HOST}:${PUERTO}/api/chat y /api/leer-foto`));
servidor.on('error', (error) => {
  console.error(error.code === 'EADDRINUSE' ? `El puerto ${PUERTO} está ocupado. Cierra el servidor anterior.` : 'No se pudo iniciar el servidor del asistente.');
  process.exitCode = 1;
});
