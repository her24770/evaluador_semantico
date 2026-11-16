import { createServer } from 'node:http';

try { process.loadEnvFile('.env'); }
catch (error) { if (error.code !== 'ENOENT') throw error; }

const { default: chat } = await import('../api/chat.js');
const servidor = createServer((req, res) => {
  if (req.url?.split('?')[0] === '/api/chat') {
    void chat(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: { codigo: 'ruta_no_encontrada', mensaje: 'Ruta no encontrada.' } }));
  }
});
servidor.requestTimeout = 15000;
servidor.headersTimeout = 10000;
servidor.listen(3001, '127.0.0.1', () => console.log('Asistente disponible en http://127.0.0.1:3001/api/chat'));
servidor.on('error', (error) => {
  console.error(error.code === 'EADDRINUSE' ? 'El puerto 3001 está ocupado. Cierra el servidor anterior.' : 'No se pudo iniciar el servidor del asistente.');
  process.exitCode = 1;
});
