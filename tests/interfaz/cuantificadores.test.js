import test from 'node:test';
import assert from 'node:assert/strict';
import { crearEstado, evaluarEntrada, invalidarResultado } from '../../src/interfaz/modelo.js';
import { cuantificadoresEn, paginaCasos, panelCuantificadoresHTML, montarTablaCuantificadores } from '../../src/interfaz/cuantificadores/visor.js';
import { formula } from '../../src/interfaz/vistas/formula.js';

function ejercicio(texto = '∀x ∃y R(x,y)') {
  return { ...crearEstado(), dominioTexto: '1, 2, 3', formula: texto,
    predicados: [{ nombre: 'P', aridad: 1, relacion: '1, 2' },
      { nombre: 'R', aridad: 2, relacion: '(1, 1), (2, 2), (3, 3)' }] };
}

function representar(estado, opciones) {
  const revision = evaluarEntrada(estado, opciones);
  Object.assign(estado, { resultado: revision.resultado, tablaCuantificadores: revision.tablaCuantificadores });
  return { revision, html: formula(estado, revision, false, '') };
}

test('el panel se integra con resultados y conserva el árbol sintáctico', () => {
  const { html } = representar(ejercicio());
  assert.match(html, /Tabla de cuantificadores/);
  assert.match(html, /Resultado global de la fórmula/);
  assert.match(html, /arbol-sintactico/);
  assert.match(html, /Evaluación paso a paso/);
});

test('no se muestra un panel para fórmulas sin cuantificadores', () => {
  const { revision, html } = representar(ejercicio('P(x)'));
  assert.equal(revision.tablaCuantificadores, null);
  assert.doesNotMatch(html, /Tabla de cuantificadores/);
  const estado = ejercicio('P(x)');
  estado.entorno = { x: '1' };
  assert.equal(representar(estado).revision.tablaCuantificadores, null);
  assert.equal(montarTablaCuantificadores(null, null), null);
});

for (const [nombre, modificar] of [
  ['sintaxis', (e) => { e.formula = '∀x P('; }],
  ['dominio', (e) => { e.dominioTexto = '1, 1'; }],
  ['relación', (e) => { e.predicados[0].relacion = '9'; }],
  ['función', (e) => { e.funciones = [{ nombre: 's', aridad: 1, tabla: { 1: '2' } }]; }],
  ['entorno', (e) => { e.formula = 'P(x) ∧ ∃y P(y)'; }],
]) {
  test(`una entrada inválida de ${nombre} no muestra tabla ni verdad`, () => {
    const estado = ejercicio();
    modificar(estado);
    const { revision, html } = representar(estado);
    assert.equal(revision.valido, false);
    assert.equal(revision.resultado, null);
    assert.equal(revision.tablaCuantificadores, null);
    assert.doesNotMatch(html, /data-valor-verdad|Tabla de cuantificadores/);
  });
}

test('alcanzar un límite conserva el resultado normal y explica que no hay tabla completa', () => {
  const { revision, html } = representar(ejercicio(), { maxNodos: 3 });
  assert.equal(revision.valido, true);
  assert.equal(revision.resultado.valor, true);
  assert.equal(revision.tablaCuantificadores.completa, false);
  assert.equal(revision.tablaCuantificadores.resultado, null);
  assert.match(html, /Tabla exhaustiva no disponible/);
  assert.doesNotMatch(html, /data-cuant-tablas/);
});

test('invalidar elimina tanto la conclusión como la tabla anterior', () => {
  const estado = ejercicio();
  representar(estado);
  const entradas = { formula: estado.formula, dominio: estado.dominioTexto, predicados: structuredClone(estado.predicados) };
  invalidarResultado(estado);
  assert.equal(estado.resultado, null);
  assert.equal(estado.tablaCuantificadores, null);
  assert.deepEqual({ formula: estado.formula, dominio: estado.dominioTexto, predicados: estado.predicados }, entradas);
});

test('las ramas se distinguen y los cuantificadores internos aparecen por caso', () => {
  const { tablaCuantificadores } = evaluarEntrada(ejercicio('(∀x P(x)) ∧ (∃y R(y,y))'));
  const ramas = cuantificadoresEn(tablaCuantificadores.resultado);
  assert.deepEqual(ramas.map((r) => r.ruta), ['raíz.1', 'raíz.2']);
  assert.deepEqual(ramas.map((r) => r.nodo.regla), ['∀', '∃']);
  const anidada = evaluarEntrada(ejercicio()).tablaCuantificadores.resultado;
  assert.equal(cuantificadoresEn(anidada).length, 1);
  assert.deepEqual(cuantificadoresEn(anidada.hijos[1])[0].nodo.decisivos, ['2']);
});

test('resumen selecciona testigos y contraejemplos; sin ellos requiere todos los casos', () => {
  for (const [texto, indices] of [
    ['∀x P(x)', [2]], ['∃x P(x)', [0, 1]],
    ['∀x (P(x) ∨ ¬P(x))', [0, 1, 2]], ['∃x (P(x) ∧ ¬P(x))', [0, 1, 2]],
  ]) {
    const nodo = evaluarEntrada(ejercicio(texto)).tablaCuantificadores.resultado;
    assert.deepEqual(paginaCasos(nodo, true).indices, indices);
    assert.equal(paginaCasos(nodo).total, 3);
  }
});

test('tablas grandes se paginan sin omitir ni duplicar filas', () => {
  const estado = ejercicio('∀x P(x)');
  estado.dominioTexto = Array.from({ length: 31 }, (_, i) => String(i + 1)).join(', ');
  const nodo = evaluarEntrada(estado).tablaCuantificadores.resultado;
  const paginas = [0, 1, 2].map((p) => paginaCasos(nodo, false, p));
  assert.deepEqual(paginas.map((p) => p.indices.length), [12, 12, 7]);
  assert.deepEqual(paginas.flatMap((p) => p.indices), Array.from({ length: 31 }, (_, i) => i));
  assert.equal(paginaCasos(nodo, false, -5).pagina, 0);
  assert.equal(paginaCasos(nodo, false, 50).pagina, 2);
});

test('el visor escapa contenido y solo construye el primer nivel y la primera página', () => {
  const estado = ejercicio('∀x ∃y R(x,y)');
  const dominio = ['<img>', ...Array.from({ length: 30 }, (_, i) => String(i + 1))];
  estado.dominioTexto = dominio.join(', ');
  estado.predicados[0].relacion = '1';
  estado.predicados[1].relacion = '(<img>, <img>)';
  const tabla = evaluarEntrada(estado).tablaCuantificadores;
  const contenido = { innerHTML: '' };
  const escuchas = new Map();
  const contenedor = { querySelector: () => contenido,
    addEventListener: (tipo, fn) => escuchas.set(tipo, fn),
    removeEventListener: (tipo) => escuchas.delete(tipo) };
  const visor = montarTablaCuantificadores(contenedor, tabla);
  assert.equal((contenido.innerHTML.match(/<tbody>/g) ?? []).length, 1);
  assert.equal((contenido.innerHTML.match(/<tr/g) ?? []).length, 13);
  assert.match(contenido.innerHTML, /Página 1 de 3/);
  assert.match(contenido.innerHTML, /&lt;img&gt;/);
  assert.doesNotMatch(contenido.innerHTML, /<img>/);
  assert.equal(escuchas.size, 2);
  visor.destruir();
  assert.equal(escuchas.size, 0);
  assert.equal(panelCuantificadoresHTML(null), '');
});

test('el worker devuelve la tabla y serializa errores sin resultados parciales', async () => {
  const mensajes = [];
  const anterior = globalThis.self;
  globalThis.self = { postMessage: (data) => mensajes.push(structuredClone(data)) };
  try {
    await import('../../src/interfaz/evaluacion.worker.js');
    self.onmessage({ data: ejercicio() });
    assert.equal(mensajes[0].resultado.valor, true);
    assert.equal(mensajes[0].tablaCuantificadores.completa, true);
    self.onmessage({ data: ejercicio('∀x P(') });
    assert.equal(mensajes[1].resultado, null);
    assert.equal(mensajes[1].tablaCuantificadores, null);
    assert.ok(mensajes[1].errores.formula[0].message);
  } finally {
    if (anterior === undefined) delete globalThis.self;
    else globalThis.self = anterior;
  }
});
