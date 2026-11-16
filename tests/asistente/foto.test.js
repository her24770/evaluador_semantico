// Servidor de /api/leer-foto: OpenAI simulado, sin gastar saldo.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { crearLectorFoto, validarFoto, interpretarLectura, MAX_CUERPO_FOTO, MAX_IMAGEN } from '../../src/asistente/foto.js';
import { crearManejador } from '../../src/asistente/http.js';

const IMAGEN = 'data:image/jpeg;base64,/9j/AAAA';
const completada = (texto) => Response.json({
  model: 'gpt-6-luna',
  choices: [{ finish_reason: 'stop', message: { content: texto } }],
  usage: { prompt_tokens: 1200, completion_tokens: 60, total_tokens: 1260 },
});

test('envía la imagen al mismo cliente de OpenAI del asistente y devuelve la lectura', async () => {
  const llamadas = [];
  const leer = crearLectorFoto({ env: { OPENAI_API_KEY: 'clave-servidor' }, fetchImpl: async (url, opciones) => {
    llamadas.push({ url, opciones, cuerpo: JSON.parse(opciones.body) });
    return completada('```json\n{"formula": "∀x (P(x) → R(x, y))", "legible": true, "dudas": [{"fragmento": "→", "alternativas": [">"], "motivo": "borroso"}]}\n```');
  } });
  const r = await leer({ imagen: IMAGEN, simbolos: ['P', 'R'] });
  assert.deepEqual(r, {
    formula: '∀x (P(x) → R(x, y))', legible: true,
    dudas: [{ fragmento: '→', alternativas: ['>'], motivo: 'borroso' }],
    modelo: 'gpt-6-luna', consumo: { entrada: 1200, salida: 60, total: 1260, entradaCache: null, razonamiento: null },
  });
  const [{ url, opciones, cuerpo }] = llamadas;
  assert.equal(url, 'https://api.openai.com/v1/chat/completions');
  assert.equal(opciones.headers.Authorization, 'Bearer clave-servidor');
  assert.equal(cuerpo.model, 'gpt-6-luna');
  const [texto, imagen] = cuerpo.messages[1].content;
  assert.match(texto.text, /P, R/);
  assert.deepEqual(imagen, { type: 'image_url', image_url: { url: IMAGEN, detail: 'high' } });
});

test('sin OPENAI_API_KEY responde un error de configuración', async () => {
  await assert.rejects(crearLectorFoto({ env: {}, fetchImpl: async () => assert.fail('no debe llamar') })({ imagen: IMAGEN }),
    { codigo: 'configuracion', estado: 503 });
});

test('valida la imagen y los símbolos', () => {
  assert.deepEqual(validarFoto({ imagen: IMAGEN }), { imagen: IMAGEN, simbolos: [] });
  for (const datos of [
    null, [], {}, { imagen: 'https://ejemplo.com/x.png' }, { imagen: 'data:image/gif;base64,AAAA' },
    { imagen: 'data:image/png;base64,AA AA' }, { imagen: `data:image/png;base64,${'A'.repeat(MAX_IMAGEN)}` },
    { imagen: IMAGEN, otro: 1 }, { imagen: IMAGEN, simbolos: 'P' }, { imagen: IMAGEN, simbolos: [''] },
    { imagen: IMAGEN, simbolos: Array(51).fill('P') },
  ]) assert.throws(() => validarFoto(datos), { codigo: 'foto_invalida', estado: 400 }, JSON.stringify(datos)?.slice(0, 60));
});

test('interpreta la respuesta del modelo con tolerancia y límites', () => {
  assert.deepEqual(interpretarLectura('{"formula": "", "legible": false, "dudas": []}'), { formula: '', legible: false, dudas: [] });
  assert.deepEqual(interpretarLectura('{"formula": "P(a)", "dudas": [{"fragmento": "", "motivo": "x"}, 3]}'), { formula: 'P(a)', legible: true, dudas: [] });
  assert.throws(() => interpretarLectura('No veo ninguna fórmula.'), { codigo: 'respuesta_invalida' });
  assert.throws(() => interpretarLectura('{"formula": 5}'), { codigo: 'respuesta_invalida' });
});

test('el manejador acepta fotos grandes en /api/leer-foto, pero /api/chat conserva su límite', async () => {
  const cuerpo = JSON.stringify({ imagen: `data:image/jpeg;base64,${'A'.repeat(500_000)}` });
  const solicitud = () => Object.assign(Readable.from([Buffer.from(cuerpo)]),
    { method: 'POST', headers: { host: 'localhost', 'content-type': 'application/json', 'content-length': String(cuerpo.length) } });
  const respuesta = () => ({ headers: {}, setHeader(n, v) { this.headers[n] = v; }, end(t) { this.datos = JSON.parse(t); } });

  const foto = crearManejador(async () => async () => ({ formula: 'P(a)', legible: true, dudas: [] }), { validar: validarFoto, maxBytes: MAX_CUERPO_FOTO });
  let res = respuesta();
  await foto(solicitud(), res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.datos.formula, 'P(a)');

  const chat = crearManejador(async () => assert.fail('no debe llegar al servicio'));
  res = respuesta();
  await chat(solicitud(), res);
  assert.equal(res.statusCode, 413);
});
