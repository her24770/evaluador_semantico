// Leer fórmula desde una foto: la llamada a OpenAI es simulada (no gasta créditos).
import test from 'node:test';
import assert from 'node:assert/strict';
import { crearEstado } from '../../src/interfaz/modelo.js';
import { leerFormulaDeFoto, cargarConfiguracion, guardarConfiguracion, MODELO_PREDETERMINADO, ErrorLector } from '../../src/interfaz/foto/lector.js';
import { panelFotoHTML, revisionFotoHTML } from '../../src/interfaz/foto/vista.js';
import { formula } from '../../src/interfaz/vistas/formula.js';
import { revisarEntrada } from '../../src/interfaz/modelo.js';

const IMAGEN = 'data:image/jpeg;base64,AAAA';

function openaiFalso(respuesta, estado = 200) {
  const llamadas = [];
  const fetch = async (url, opciones) => {
    llamadas.push({ url, opciones, cuerpo: JSON.parse(opciones.body) });
    return { ok: estado < 400, status: estado, json: async () => respuesta };
  };
  return { fetch, llamadas };
}
const salida = (objeto) => ({ status: 'completed', output: [{ type: 'message', content: [{ type: 'output_text', text: JSON.stringify(objeto) }] }] });

test('envía la imagen a la Responses API y normaliza lo leído', async () => {
  const { fetch, llamadas } = openaiFalso(salida({
    formula: 'forall x (P(x) -> E y R(x, y))', legible: true,
    dudas: [{ fragmento: 'E y', alternativas: ['∃y'], motivo: 'la E parece un ∃' }],
  }));
  const r = await leerFormulaDeFoto({ imagen: IMAGEN, clave: ' sk-prueba ', simbolos: ['P', 'R'], fetch });
  assert.equal(r.formula, '∀x (P(x) → E y R(x, y))');
  assert.equal(r.leida, 'forall x (P(x) -> E y R(x, y))');
  assert.equal(r.dudas.length, 1);
  const [{ url, opciones, cuerpo }] = llamadas;
  assert.equal(url, 'https://api.openai.com/v1/responses');
  assert.equal(opciones.headers.Authorization, 'Bearer sk-prueba');
  assert.equal(cuerpo.model, MODELO_PREDETERMINADO);
  assert.deepEqual(cuerpo.input[0].content[1], { type: 'input_image', image_url: IMAGEN, detail: 'high' });
  assert.match(cuerpo.input[0].content[0].text, /P, R/);
  assert.equal(cuerpo.text.format.type, 'json_schema');
});

test('errores de OpenAI con mensajes claros', async () => {
  const casos = [
    [401, { error: { code: 'invalid_api_key' } }, /API key no es válida/],
    [429, { error: { code: 'insufficient_quota' } }, /no tiene saldo/],
    [429, { error: { code: 'rate_limit_exceeded' } }, /demasiadas solicitudes/],
    [404, { error: { code: 'model_not_found' } }, /Cambia el modelo/],
    [500, {}, /error \(500\)/],
  ];
  for (const [estado, cuerpo, mensaje] of casos) {
    const { fetch } = openaiFalso(cuerpo, estado);
    await assert.rejects(leerFormulaDeFoto({ imagen: IMAGEN, clave: 'sk', fetch }), mensaje);
  }
  await assert.rejects(leerFormulaDeFoto({ imagen: IMAGEN, clave: '', fetch: openaiFalso({}).fetch }), ErrorLector);
  await assert.rejects(leerFormulaDeFoto({ imagen: IMAGEN, clave: 'sk', fetch: async () => { throw new TypeError('red'); } }), /No se pudo conectar/);
  await assert.rejects(leerFormulaDeFoto({ imagen: IMAGEN, clave: 'sk', fetch: openaiFalso({ status: 'incomplete', output: [] }).fetch }), /no terminó/);
  await assert.rejects(leerFormulaDeFoto({ imagen: IMAGEN, clave: 'sk', fetch: openaiFalso({ output: [{ content: [{ type: 'refusal', refusal: 'no' }] }] }).fetch }), /no quiso/);
});

test('una imagen sin fórmula no es legible', async () => {
  const r = await leerFormulaDeFoto({ imagen: IMAGEN, clave: 'sk', fetch: openaiFalso(salida({ formula: '', legible: false, dudas: [] })).fetch });
  assert.equal(r.legible, false);
});

test('la configuración se guarda solo en el navegador y sobrevive si localStorage falla', () => {
  const datos = new Map();
  const almacen = { getItem: (k) => datos.get(k) ?? null, setItem: (k, v) => datos.set(k, v), removeItem: (k) => datos.delete(k) };
  assert.deepEqual(cargarConfiguracion(almacen), { clave: '', modelo: MODELO_PREDETERMINADO });
  guardarConfiguracion({ clave: 'sk-1', modelo: 'otro' }, almacen);
  assert.deepEqual(cargarConfiguracion(almacen), { clave: 'sk-1', modelo: 'otro' });
  guardarConfiguracion({ clave: '', modelo: MODELO_PREDETERMINADO }, almacen);
  assert.equal(datos.size, 0);
  const roto = { getItem() { throw new Error('bloqueado'); }, setItem() { throw new Error('bloqueado'); } };
  assert.deepEqual(cargarConfiguracion(roto), { clave: '', modelo: MODELO_PREDETERMINADO });
  assert.equal(guardarConfiguracion({ clave: 'x', modelo: 'y' }, roto), false);
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
  assert.match(html, /necesitas una API key de OpenAI/);

  const estado = conFoto('∀x P(x)');
  estado.foto.dudas = [{ fragmento: '∀x', alternativas: ['Ax'], motivo: 'trazo borroso' }];
  estado.foto.leida = 'forall x P(x)';
  const panel = panelFotoHTML(estado, { clave: 'sk', modelo: 'm' });
  assert.match(panel, /<img src="data:image\/jpeg;base64,AAAA"/);
  assert.match(panel, /id="foto-texto"[^>]*>∀x P\(x\)<\/textarea>/);
  assert.match(panel, /data-destino="foto-texto"/);
  assert.match(panel, /podría ser <span class="mono">Ax<\/span>/);
  assert.match(panel, /Texto original de la lectura/);
  assert.match(panel, /data-action="usar-foto"/);
  assert.doesNotMatch(panel, /necesitas una API key/);
  // La key nunca aparece en el HTML si no se abre la configuración.
  assert.doesNotMatch(panel, /value="sk"/);
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
