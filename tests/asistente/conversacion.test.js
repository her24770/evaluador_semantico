import test from 'node:test';
import assert from 'node:assert/strict';
import { crearConversacion } from '../../src/asistente/conversacion.js';

const respuesta = (texto = 'Regla del curso.') => Response.json({ estado: 'respondido', respuesta: texto, consumo: { total: 100 } });
const diferida = () => { let resolver; const promesa = new Promise((r) => { resolver = r; }); return { promesa, resolver }; };

test('envía solo pregunta e historial acotado, sin duplicar peticiones concurrentes', async () => {
  const pendiente = diferida();
  const llamadas = [];
  const chat = crearConversacion({ fetchImpl: async (_url, opciones) => { llamadas.push(JSON.parse(opciones.body)); return llamadas.length === 1 ? pendiente.promesa : respuesta(); } });
  const primera = chat.enviar('¿Variable libre?');
  assert.equal(await chat.enviar('otra'), false);
  pendiente.resolver(respuesta());
  assert.equal(await primera, true);
  assert.equal(await chat.enviar('¿Y ligada?'), true);
  assert.equal(llamadas.length, 2);
  assert.deepEqual(Object.keys(llamadas[0]).sort(), ['historial', 'pregunta']);
  assert.deepEqual(llamadas[1].historial.map((m) => m.role), ['user', 'assistant']);
  assert.equal(chat.estado.mensajes.length, 4);
});

test('una respuesta tardía no se inserta después de borrar o cancelar', async () => {
  for (const accion of ['limpiar', 'cancelar']) {
    const pendiente = diferida();
    let signal;
    const chat = crearConversacion({ fetchImpl: async (_url, opciones) => { signal = opciones.signal; return pendiente.promesa; } });
    const enviada = chat.enviar('¿Por qué?');
    chat[accion](undefined);
    assert.equal(signal.aborted, true);
    pendiente.resolver(respuesta('Antigua'));
    assert.equal(await enviada, false);
    assert.deepEqual(chat.estado.mensajes, []);
    assert.equal(chat.estado.pendiente, '');
  }
});

test('borrar después de leer cabeceras descarta también el cuerpo tardío', async () => {
  const cuerpo = diferida();
  const chat = crearConversacion({ fetchImpl: async () => ({ ok: true, json: () => cuerpo.promesa }) });
  const enviada = chat.enviar('¿Por qué?');
  await new Promise((r) => setTimeout(r, 0));
  chat.limpiar();
  cuerpo.resolver({ estado: 'respondido', respuesta: 'Antigua' });
  assert.equal(await enviada, false);
  assert.equal(chat.estado.mensajes.length, 0);
});

test('errores, desconexión y límites conservan el historial válido para reintentar', async () => {
  let fallar = false;
  const chat = crearConversacion({ fetchImpl: async () => fallar
    ? Response.json({ error: { mensaje: 'Límite local.', reintentarEn: 20 } }, { status: 429 }) : respuesta() });
  await chat.enviar('variable');
  fallar = true;
  assert.equal(await chat.enviar('ligada'), false);
  assert.equal(chat.estado.mensajes.length, 2);
  assert.match(chat.estado.error, /20 segundos/);
  assert.equal(chat.estado.pendiente, '');
  const desconectado = crearConversacion({ fetchImpl: async () => { throw new TypeError('fetch failed'); } });
  await desconectado.enviar('x');
  assert.match(desconectado.estado.error, /conectar/);
});

test('el tiempo agotado libera el envío y una pregunta vacía no hace solicitudes', async () => {
  let llamadas = 0;
  const chat = crearConversacion({ esperaMs: 10, fetchImpl: (_url, { signal }) => {
    llamadas++;
    return new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new DOMException('', 'AbortError'))));
  } });
  assert.equal(await chat.enviar('   '), false);
  assert.equal(llamadas, 0);
  await chat.enviar('x');
  assert.match(chat.estado.error, /demasiado/);
  assert.equal(chat.estado.pendiente, '');
});
