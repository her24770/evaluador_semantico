// Leer fórmula desde una foto: el servidor es simulado (no gasta saldo de OpenAI).
import test from 'node:test';
import assert from 'node:assert/strict';
import { crearEstado } from '../../src/interfaz/modelo.js';
import { leerFormulaDeFoto, RUTA_FOTO, ErrorLector } from '../../src/interfaz/foto/lector.js';
import { panelFotoHTML, revisionFotoHTML } from '../../src/interfaz/foto/vista.js';
import { formula } from '../../src/interfaz/vistas/formula.js';
import { revisarEntrada } from '../../src/interfaz/modelo.js';

const IMAGEN = 'data:image/jpeg;base64,AAAA';

function servidorFalso(respuesta, estado = 200) {
  const llamadas = [];
  const fetch = async (url, opciones) => {
    llamadas.push({ url, opciones, cuerpo: JSON.parse(opciones.body) });
    return { ok: estado < 400, status: estado, json: async () => respuesta };
  };
  return { fetch, llamadas };
}

test('envía la foto al servidor de la app (sin clave) y normaliza lo leído', async () => {
  const { fetch, llamadas } = servidorFalso({
    formula: 'forall x (P(x) -> E y R(x, y))', legible: true,
    dudas: [{ fragmento: 'E y', alternativas: ['∃y'], motivo: 'la E parece un ∃' }],
  });
  const r = await leerFormulaDeFoto({ imagen: IMAGEN, simbolos: ['P', 'R', 'P'], fetch });
  assert.equal(r.formula, '∀x (P(x) → E y R(x, y))');
  assert.equal(r.leida, 'forall x (P(x) -> E y R(x, y))');
  assert.equal(r.dudas.length, 1);
  const [{ url, opciones, cuerpo }] = llamadas;
  assert.equal(url, RUTA_FOTO);
  assert.equal(opciones.headers.Authorization, undefined);
  assert.deepEqual(cuerpo, { imagen: IMAGEN, simbolos: ['P', 'R'] });
});

test('muestra los mensajes del servidor y avisa si no está corriendo', async () => {
  const saldo = servidorFalso({ error: { codigo: 'saldo_openai', mensaje: 'OpenAI no tiene saldo.' } }, 503);
  await assert.rejects(leerFormulaDeFoto({ imagen: IMAGEN, fetch: saldo.fetch }), /OpenAI no tiene saldo/);
  const limite = servidorFalso({ error: { codigo: 'limite_local', mensaje: 'Espera.', reintentarEn: 12 } }, 429);
  await assert.rejects(leerFormulaDeFoto({ imagen: IMAGEN, fetch: limite.fetch }), /reintentar en 12 s/);
  await assert.rejects(leerFormulaDeFoto({ imagen: IMAGEN, fetch: servidorFalso(null, 404).fetch }), /npm run dev:asistente/);
  await assert.rejects(leerFormulaDeFoto({ imagen: IMAGEN, fetch: async () => { throw new TypeError('red'); } }), /No se pudo conectar/);
  await assert.rejects(leerFormulaDeFoto({ imagen: IMAGEN, fetch: servidorFalso({ nada: 1 }).fetch }), ErrorLector);
  await assert.rejects(leerFormulaDeFoto({ imagen: '', fetch: servidorFalso({}).fetch }), /Primero sube/);
});

test('una imagen sin fórmula no es legible', async () => {
  const r = await leerFormulaDeFoto({ imagen: IMAGEN, fetch: servidorFalso({ formula: '', legible: false, dudas: [] }).fetch });
  assert.equal(r.legible, false);
});

function conFoto(texto, extra = {}) {
  const estado = { ...crearEstado(), predicados: [{ nombre: 'P', aridad: 1, relacion: '1' }], dominioTexto: '1, 2', ...extra };
  Object.assign(estado.foto, { imagen: IMAGEN, fase: 'listo', texto, leida: texto });
  return estado;
}

test('el panel aparece en la vista Fórmula, con foto, texto editable y dudas', () => {
  const vacio = crearEstado();
  const html = formula(vacio, revisarEntrada(vacio));
  assert.match(html, /Leer fórmula desde una foto/);
  assert.match(html, /type="file" accept="image\/\*"/);
  assert.doesNotMatch(html, /API key|sk-/);

  const estado = conFoto('∀x P(x)');
  estado.foto.dudas = [{ fragmento: '∀x', alternativas: ['Ax'], motivo: 'trazo borroso' }];
  estado.foto.leida = 'forall x P(x)';
  const panel = panelFotoHTML(estado);
  assert.match(panel, /<img src="data:image\/jpeg;base64,AAAA"/);
  assert.match(panel, /id="foto-texto"[^>]*>∀x P\(x\)<\/textarea>/);
  assert.match(panel, /data-destino="foto-texto"/);
  assert.match(panel, /podría ser <span class="mono">Ax<\/span>/);
  assert.match(panel, /Texto original de la lectura/);
  assert.match(panel, /data-action="usar-foto"/);
});

test('dice si lo leído se puede operar', () => {
  assert.match(revisionFotoHTML(conFoto('∀x P(x)')), /bien formada · Cerrada[\s\S]*Se puede usar y evaluar/);
  assert.match(revisionFotoHTML(conFoto('P(y)')), /Abierta[\s\S]*dar valor a la variable libre y/);
  assert.match(revisionFotoHTML(conFoto('∀x (P(x) →')), /Todavía no es una fórmula válida/);
  const faltan = revisionFotoHTML(conFoto('∀x R(x, f(x))'));
  assert.match(faltan, /R<\/span> \(predicado, aridad 2\)/);
  assert.match(faltan, /f<\/span> \(función, aridad 1\)/);
  assert.match(faltan, /data-action="agregar-simbolos-foto"/);
  assert.match(revisionFotoHTML(conFoto('∀x P(x)', { dominioTexto: '' })), /falta completar la interpretación/);
});
