import test from 'node:test';
import assert from 'node:assert/strict';
import { validarLenguaje, analizar, variablesLibres } from '../../src/sintaxis/index.js';
import { validarEntorno, variante, entornoACadena } from '../../src/semantica/entorno.js';

const { firma } = validarLenguaje({ funciones: [], predicados: [{ nombre: 'P', aridad: 2 }] });
const libresDe = (txt) => variablesLibres(analizar(txt, firma));

test('variante del tema 11, diap. 5: l[x ↦ b] cambia x y deja y, z como estaban', () => {
  const l = { x: 'c', y: 'a', z: 'c' };
  const l2 = variante(l, 'x', 'b');
  assert.deepEqual(l2, { x: 'b', y: 'a', z: 'c' });
  assert.deepEqual(l, { x: 'c', y: 'a', z: 'c' }); // l sigue igual
  assert.notEqual(l2, l);                          // es un entorno nuevo
  assert.equal(entornoACadena(l), '[x ↦ c, y ↦ a, z ↦ c]');
  assert.equal(entornoACadena(l2), '[x ↦ b, y ↦ a, z ↦ c]');
});

test('variante: una variable nueva va al final; una que ya estaba conserva su lugar', () => {
  const l = variante(variante({}, 'x', '1'), 'y', '3');
  assert.equal(entornoACadena(l), '[x ↦ 1, y ↦ 3]');
  assert.equal(entornoACadena(variante(l, 'x', '2')), '[x ↦ 2, y ↦ 3]');
  assert.equal(entornoACadena({}), '[]');
});

test('entorno del tema 11, diap. 8: P(x, y) con x ↦ 0, y ↦ 2', () => {
  const r = validarEntorno(libresDe('P(x, y)'), { x: '0', y: '2' }, ['0', '1', '2']);
  assert.deepEqual(r, { errores: [], entorno: { x: '0', y: '2' } });
});

test('error: falta el valor de una variable libre (o está vacío)', () => {
  const D = ['a', 'b', 'c'];
  for (const entorno of [{ x: 'a' }, { x: 'a', y: '' }, { x: 'a', y: '   ' }]) {
    const { errores } = validarEntorno(['x', 'y'], entorno, D);
    assert.equal(errores.length, 1);
    assert.equal(errores[0].categoria, 'entorno');
    assert.match(errores[0].message, /variable libre y/);
  }
});

test('error: el valor "d" no está en 𝒟 = {a, b, c}', () => {
  const { errores } = validarEntorno(['x'], { x: 'd' }, ['a', 'b', 'c']);
  assert.deepEqual(errores.map((e) => e.categoria), ['entorno']);
  assert.match(errores[0].message, /"d"/);
});

test('se reportan todos los errores del entorno a la vez', () => {
  const { errores } = validarEntorno(['x', 'y'], { y: 'd' }, ['a', 'b', 'c']);
  assert.equal(errores.length, 2);
});

test('las variables de más se ignoran y los espacios se quitan', () => {
  const r = validarEntorno(['x'], { z: 'b', x: ' a ' }, ['a', 'b', 'c']);
  assert.deepEqual(r, { errores: [], entorno: { x: 'a' } });
});

test('una fórmula cerrada no pide entorno', () => {
  const libres = libresDe('∃x ∀y P(x, y)'); // tema 11, diap. 8c
  assert.deepEqual(libres, []);
  assert.deepEqual(validarEntorno(libres, undefined, ['0', '1', '2']), { errores: [], entorno: {} });
});

test('en una fórmula con x libre y ligada, solo se pide la x libre', () => {
  // P(x, y) ∧ ∃x P(x, x): la x de la izquierda es libre, y también y.
  assert.deepEqual(libresDe('P(x, y) ∧ ∃x P(x, x)'), ['x', 'y']);
  // En ∀x P(x, y) la x es ligada: basta con darle valor a y.
  const r = validarEntorno(libresDe('∀x P(x, y)'), { y: '1' }, ['0', '1', '2']);
  assert.deepEqual(r, { errores: [], entorno: { y: '1' } });
});
