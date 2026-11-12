import test from 'node:test';
import assert from 'node:assert/strict';
import { crearEstado, evaluarEntrada, revisarEntrada, invalidarResultado, tuplaEn } from '../../src/interfaz/modelo.js';
import { dictamen, explicacionHTML } from '../../src/interfaz/vistas/resultados.js';

function ejercicio() {
  return {
    ...crearEstado(), dominioTexto: '1, 2, 3', formula: '∀x P(x)',
    predicados: [{ id: 'p1', nombre: 'P', aridad: '1', relacion: '1, 2' }],
  };
}

test('la interfaz obtiene el contraejemplo real y representa su explicación', () => {
  const estado = ejercicio();
  const revision = evaluarEntrada(estado);
  assert.equal(revision.resultado.valor, false);
  assert.deepEqual(revision.resultado.contraejemplo, { variable: 'x', elemento: '3' });
  estado.resultado = revision.resultado;
  assert.match(dictamen(estado, revision), /data-valor-verdad/);
  const explicacion = explicacionHTML(revision.resultado);
  assert.match(explicacion, /Contraejemplo: x ↦ 3/);
  assert.match(explicacion, /3 ∉ Pᴵ/);
  // El evaluador entrega solo el caso decisivo para este universal falso.
  assert.equal(revision.resultado.hijos.length, 1);
});

test('un existencial usa su testigo y un universal verdadero su comprobación completa', () => {
  const estado = ejercicio();
  estado.formula = '∃x P(x)';
  assert.deepEqual(evaluarEntrada(estado).resultado.testigo, { variable: 'x', elemento: '1' });
  estado.formula = '∀x P(x)';
  estado.predicados[0].relacion = '1, 2, 3';
  const { resultado } = evaluarEntrada(estado);
  assert.equal(resultado.completa, true);
  assert.equal(resultado.hijos.length, 3);
});

const invalidos = [
  ['lenguaje', (e) => { e.predicados.push({ id: 'p2', nombre: 'P', aridad: 2 }); }],
  ['sintaxis', (e) => { e.formula = 'P(x'; }],
  ['símbolo', (e) => { e.formula = 'Q(x)'; }],
  ['aridad', (e) => { e.formula = 'P(x, y)'; }],
  ['dominio', (e) => { e.dominioTexto = '1, 1'; }],
  ['función', (e) => { e.funciones = [{ id: 'f1', nombre: 'f', aridad: 1, tabla: { 1: '2' } }]; }],
  ['relación', (e) => { e.predicados[0].relacion = '(4)'; }],
  ['entorno', (e) => { e.formula = 'P(x)'; e.entorno = { x: '4' }; }],
];
for (const [categoria, modificar] of invalidos) {
  test(`un error de ${categoria} nunca produce ni representa valor de verdad`, () => {
    const estado = ejercicio();
    modificar(estado);
    const revision = evaluarEntrada(estado);
    assert.equal(revision.resultado, null);
    assert.equal(revision.valido, false);
    assert.ok(Object.values(revision.errores).flat().some((e) => e.categoria === categoria));
    estado.evaluacionSolicitada = true;
    assert.doesNotMatch(dictamen(estado, revision), /data-valor-verdad/);
  });
}

test('las tablas de funciones y las constantes se conectan al evaluador', () => {
  const estado = ejercicio();
  estado.funciones = [
    { id: 'f', nombre: 'f', aridad: 1, tabla: { 1: '2', 2: '3', 3: '1' } },
    { id: 'c', nombre: 'c', aridad: 0, tabla: { '': '1' } },
  ];
  estado.formula = 'P(f(c))';
  assert.equal(evaluarEntrada(estado).resultado.valor, true);
  estado.funciones[1].tabla[''] = '9';
  assert.equal(evaluarEntrada(estado).resultado, null);
});

test('las variables libres se asignan sin interferir con las ligadas del mismo nombre', () => {
  const estado = ejercicio();
  estado.formula = 'P(x) ∧ ∃x ¬P(x)';
  assert.deepEqual(revisarEntrada(estado).libres, ['x']);
  assert.equal(evaluarEntrada(estado).resultado, null);
  estado.entorno.x = '1';
  assert.equal(evaluarEntrada(estado).resultado.valor, true);
});

test('invalidar una conclusión conserva las entradas de todas las secciones', () => {
  const estado = ejercicio();
  estado.entorno = { y: '2' };
  estado.resultado = evaluarEntrada(estado).resultado;
  estado.evaluacionSolicitada = true;
  const entradas = structuredClone({ ...estado, resultado: null, evaluacionSolicitada: false });
  invalidarResultado(estado);
  assert.deepEqual(estado, entradas);
});

test('el límite de tablas evita construir productos cartesianos inabarcables', () => {
  const estado = ejercicio();
  estado.funciones = [{ id: 'f', nombre: 'f', aridad: 20, tabla: {} }];
  const revision = evaluarEntrada(estado);
  assert.equal(revision.resultado, null);
  assert.match(revision.errores.interpretacion[0].message, /4096/);
  assert.deepEqual(tuplaEn(['a', 'b'], 2, 2), ['b', 'a']);
  assert.deepEqual(tuplaEn(['a'], 0, 0), []);
});

test('las entradas del dominio se escapan al representar explicaciones', () => {
  const estado = ejercicio();
  estado.dominioTexto = '<img>, b';
  estado.predicados[0].relacion = '<img>';
  estado.formula = '∃x P(x)';
  const { resultado } = evaluarEntrada(estado);
  assert.equal(resultado.valor, true);
  const html = explicacionHTML(resultado);
  assert.doesNotMatch(html, /<img>/);
  assert.match(html, /&lt;img&gt;/);
});
