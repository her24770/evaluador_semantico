import test from 'node:test';
import assert from 'node:assert/strict';
import { analizar, validarLenguaje } from '../../src/sintaxis/index.js';
import { validarInterpretacion, evaluar, evaluarExhaustivo, contieneCuantificadores } from '../../src/semantica/index.js';

function preparar(relaciones = { P: '1, 2', Q: '2, 3', R: '(1, 1), (2, 2), (3, 3)' }) {
  const { firma, errores } = validarLenguaje({
    funciones: [{ nombre: 's', aridad: 1 }, { nombre: 'c', aridad: 0 }],
    predicados: [{ nombre: 'P', aridad: 1 }, { nombre: 'Q', aridad: 1 }, { nombre: 'R', aridad: 2 }],
  });
  assert.deepEqual(errores, []);
  const revision = validarInterpretacion(firma, {
    dominioTexto: '1, 2, 3', relaciones,
    funciones: { s: { 1: '2', 2: '3', 3: '1' }, c: { '': '1' } },
  });
  assert.deepEqual(revision.errores, []);
  return { firma, interpretacion: revision.interpretacion };
}

function comprobar(texto, esperado, datos = preparar(), entorno = {}) {
  const ast = analizar(texto, datos.firma);
  const copia = structuredClone({ ast, interpretacion: datos.interpretacion, entorno });
  const normal = evaluar(ast, datos.interpretacion, entorno);
  const traza = evaluarExhaustivo(ast, datos.interpretacion, entorno);
  assert.equal(traza.completa, true);
  assert.equal(traza.resultado.valor, esperado);
  assert.equal(traza.resultado.valor, normal.valor);
  assert.deepEqual({ ast, interpretacion: datos.interpretacion, entorno }, copia);
  assert.deepEqual(evaluar(ast, datos.interpretacion, entorno), normal);
  return traza.resultado;
}

test('universal verdadero recorre todo el dominio, incluido un cuantificador vacío', () => {
  const nodo = comprobar('∀x (P(x) ∨ Q(x))', true);
  assert.deepEqual(nodo.hijos.map((h) => h.valor), [true, true, true]);
  assert.deepEqual(nodo.decisivos, []);
  comprobar('∀z P(c)', true);
});

test('universal falso conserva uno o varios contraejemplos', () => {
  assert.deepEqual(comprobar('∀x P(x)', false).decisivos, ['3']);
  const datos = preparar({ P: '1', Q: '2', R: '(1, 1)' });
  assert.deepEqual(comprobar('∀x P(x)', false, datos).decisivos, ['2', '3']);
});

test('existencial verdadero conserva todos sus testigos y no corta en el primero', () => {
  const nodo = comprobar('∃x P(x)', true);
  assert.deepEqual(nodo.decisivos, ['1', '2']);
  assert.deepEqual(nodo.hijos.map((h) => h.valor), [true, true, false]);
  const datos = preparar({ P: '2', Q: '2', R: '(1, 1)' });
  assert.deepEqual(comprobar('∃x P(x)', true, datos).decisivos, ['2']);
  assert.equal(evaluar(analizar('∃x P(x)', datos.firma), datos.interpretacion, {}).hijos.length, 1);
});

test('existencial falso comprueba todos los casos', () => {
  const nodo = comprobar('∃x (P(x) ∧ ¬P(x))', false);
  assert.deepEqual(nodo.decisivos, []);
  assert.equal(nodo.hijos.length, 3);
});

for (const [texto, esperado] of [
  ['∀x ∀y R(x,y)', false], ['∃x ∀y R(x,y)', false],
  ['∀x ∃y R(x,y)', true], ['∃x ∃y R(x,y)', true],
  ['∀x (P(x) → ∃y R(x,y))', true],
  ['∀x (P(x) ∧ Q(x))', false], ['∀x (∃y R(x,y) → P(x))', false],
  ['¬∀x P(x)', true], ['∀x (P(x) ↔ Q(x))', false],
  ['∀x ∃y ∀z (R(x,y) ∨ z = x)', true],
]) {
  test(`la traza coincide con el evaluador en ${texto}`, () => comprobar(texto, esperado));
}

test('cuantificadores anidados mantienen el orden y el entorno de cada fila', () => {
  const nodo = comprobar('∀x ∃y R(x,y)', true);
  assert.deepEqual(nodo.hijos.map((h) => h.decisivos), [['1'], ['2'], ['3']]);
  assert.equal(nodo.hijos[1].hijos[2].entorno, '[x ↦ 2, y ↦ 3]');
  assert.deepEqual(nodo.hijos.map((h) => h.hijos.length), [3, 3, 3]);
});

test('ramas independientes no mezclan las asignaciones', () => {
  const nodo = comprobar('(∀x P(x)) ∧ (∃y Q(y))', false);
  assert.deepEqual(nodo.hijos.map((h) => h.regla), ['∀', '∃']);
  assert.equal(nodo.hijos[1].hijos[0].entorno, '[y ↦ 1]');
});

test('funciones, constantes, términos anidados e igualdad reutilizan su interpretación', () => {
  comprobar('∀x s(s(s(x))) = x', true);
  comprobar('∃x (s(s(c)) = x ∧ Q(x))', true);
  comprobar('∀x ∃y (s(x) = y ∧ s(s(y)) = x)', true);
});

test('las variables libres y las sombreadas conservan sus alcances', () => {
  const entorno = Object.freeze({ x: '1' });
  const nodo = comprobar('P(x) ∧ ∃x Q(x)', true, preparar(), entorno);
  assert.equal(nodo.hijos[0].entorno, '[x ↦ 1]');
  assert.equal(nodo.hijos[1].hijos[2].entorno, '[x ↦ 3]');
  const sombreado = comprobar('∀x (∃x Q(x) ∧ P(x))', false);
  assert.equal(sombreado.hijos[0].hijos[1].entorno, '[x ↦ 1]');
  assert.equal(sombreado.hijos[0].hijos[0].hijos[2].entorno, '[x ↦ 3]');
});

test('ejemplos de temas 10 y 11 usan las relaciones del curso', () => {
  comprobar('∀x ∃y R(x,y)', true, preparar({ P: '1, 2', Q: '2', R: '(1, 3), (2, 1), (3, 2)' }));
  const { firma } = validarLenguaje({ predicados: [{ nombre: 'P', aridad: 2 }], funciones: [] });
  const { interpretacion } = validarInterpretacion(firma, {
    dominioTexto: '0, 1, 2', relaciones: { P: '(0, 1), (0, 2), (1, 2)' },
  });
  comprobar('∀x ∃y P(x,y)', false, { firma, interpretacion });
});

test('límites de nodos y profundidad nunca entregan una conclusión parcial', () => {
  const { firma, interpretacion } = preparar();
  const ast = analizar('∀x ∃y R(x,y)', firma);
  for (const opciones of [{ maxNodos: 12 }, { maxProfundidad: 2 }]) {
    const r = evaluarExhaustivo(ast, interpretacion, {}, opciones);
    assert.equal(r.completa, false);
    assert.equal(r.resultado, null);
    assert.match(r.motivo, /No se muestra una tabla parcial/);
  }
  assert.equal(evaluarExhaustivo(ast, interpretacion, {}, { maxNodos: 13 }).completa, true);
  const enorme = analizar('∀x ∀y ∀z ∀u ∀v ∀w ∀a ∀b ∀d R(x,y)', firma);
  const r = evaluarExhaustivo(enorme, interpretacion, {});
  assert.equal(r.completa, false);
  assert.equal(r.nodosEvaluados, 10000);
  for (const maxNodos of [0, -1, Infinity, 1.5]) {
    assert.throws(() => evaluarExhaustivo(ast, interpretacion, {}, { maxNodos }), RangeError);
  }
});

test('los errores semánticos se propagan sin presentarse como límites', () => {
  const { firma, interpretacion } = preparar();
  assert.throws(() => evaluarExhaustivo(analizar('∀x R(x,y)', firma), interpretacion, {}), /variable y no tiene valor/);
  interpretacion.funciones.get('s').delete('3');
  assert.throws(() => evaluarExhaustivo(analizar('∀x P(s(x))', firma), interpretacion, {}), /s no tiene valor/);
});

test('la detección incluye cuantificación sin apariciones ligadas e ignora términos', () => {
  const { firma } = preparar();
  for (const texto of ['∀z P(c)', '¬∃z P(c)', 'P(c) ∧ ∀z Q(c)']) {
    assert.equal(contieneCuantificadores(analizar(texto, firma)), true);
  }
  assert.equal(contieneCuantificadores(analizar('P(s(c)) ∧ s(c) = c', firma)), false);
});
