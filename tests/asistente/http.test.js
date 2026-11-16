import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { crearManejador } from '../../src/asistente/http.js';
import { ErrorAsistente } from '../../src/asistente/error.js';

function solicitud({ texto = '{"pregunta":"¿Qué es un entorno?"}', body, method = 'POST', headers = {} } = {}) {
  const req = Readable.from([Buffer.from(texto)]);
  Object.assign(req, { method, headers: { host: 'localhost:5173', 'content-type': 'application/json', ...headers } });
  if (body !== undefined) req.body = body;
  return req;
}
function respuesta() {
  return { headers: {}, setHeader(nombre, valor) { this.headers[nombre] = valor; },
    end(texto) { this.datos = JSON.parse(texto); } };
}
const resultado = { estado: 'respondido', respuesta: 'Explicación con tildes y ∀.', temas: [] };

test('atiende tanto el stream local como el cuerpo interpretado por Vercel', async () => {
  const manejar = crearManejador(async () => async (datos) => {
    assert.ok(datos.pregunta.includes('entorno'));
    return resultado;
  });
  for (const req of [solicitud(), solicitud({ body: { pregunta: '¿Qué es un entorno?' } }),
    solicitud({ body: '{"pregunta":"¿Qué es un entorno?"}' })]) {
    const res = respuesta();
    await manejar(req, res);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.datos, resultado);
    assert.equal(res.headers['Cache-Control'], 'no-store');
    assert.equal(res.headers['Content-Type'], 'application/json; charset=utf-8');
  }
});

for (const [nombre, opciones, estado] of [
  ['método', { method: 'GET' }, 405],
  ['tipo de contenido', { headers: { 'content-type': 'text/plain' } }, 415],
  ['otro origen', { headers: { origin: 'https://otro-sitio.test' } }, 403],
  ['origen inválido', { headers: { origin: 'null' } }, 403],
  ['JSON inválido', { texto: '{' }, 400],
  ['cuerpo de Vercel inválido', { body: '{' }, 400],
  ['pregunta inválida', { texto: '{"pregunta":false}' }, 400],
  ['tamaño declarado', { headers: { 'content-length': '9000' } }, 413],
  ['stream grande', { texto: 'a'.repeat(9000) }, 413],
  ['cuerpo interpretado grande', { body: { pregunta: 'a'.repeat(9000) } }, 413],
]) {
  test(`rechaza ${nombre} antes de ejecutar el servicio`, async () => {
    const manejar = crearManejador(async () => { assert.fail('No debe ejecutar el servicio.'); });
    const res = respuesta();
    await manejar(solicitud(opciones), res);
    assert.equal(res.statusCode, estado);
    assert.ok(res.datos.error.mensaje);
  });
}

test('permite el mismo origen y mantiene los errores internos fuera de la respuesta', async () => {
  const manejar = crearManejador(async () => { throw new Error('clave-secreta y ruta local'); });
  const res = respuesta();
  await manejar(solicitud({ headers: { origin: 'http://localhost:5173' } }), res);
  assert.equal(res.statusCode, 500);
  assert.ok(!JSON.stringify(res.datos).includes('clave-secreta'));
});

test('propaga la cuota sin exponer la clave y libera el espacio ocupado después del error', async () => {
  const manejar = crearManejador(async () => async () => { throw new ErrorAsistente('limite_openai', 'Límite de OpenAI.', 429, 12); });
  for (let i = 0; i < 2; i++) {
    const res = respuesta();
    await manejar(solicitud(), res);
    assert.equal(res.datos.error.codigo, 'limite_openai');
    assert.equal(res.headers['Retry-After'], '12');
  }
});

test('limita seis consultas por minuto y permite continuar al abrir la siguiente ventana', async () => {
  let tiempo = 100000;
  const manejar = crearManejador(async () => async () => resultado, { ahora: () => tiempo });
  for (let i = 0; i < 6; i++) {
    const res = respuesta();
    await manejar(solicitud(), res);
    assert.equal(res.statusCode, 200);
  }
  const limitada = respuesta();
  await manejar(solicitud(), limitada);
  assert.equal(limitada.statusCode, 429);
  assert.equal(limitada.headers['Retry-After'], '60');
  tiempo += 60000;
  const nueva = respuesta();
  await manejar(solicitud(), nueva);
  assert.equal(nueva.statusCode, 200);
});

test('una segunda consulta no comienza mientras se genera la primera', async () => {
  let liberar;
  let inicio;
  const iniciada = new Promise((resolve) => { inicio = resolve; });
  const manejar = crearManejador(async () => async () => {
    inicio();
    return new Promise((resolve) => { liberar = () => resolve(resultado); });
  });
  const primera = respuesta();
  const pendiente = manejar(solicitud(), primera);
  await iniciada;
  const segunda = respuesta();
  await manejar(solicitud(), segunda);
  assert.equal(segunda.statusCode, 429);
  liberar();
  await pendiente;
  assert.equal(primera.statusCode, 200);
});
