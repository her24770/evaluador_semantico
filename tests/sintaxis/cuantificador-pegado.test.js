// ∀xP(x): el predicado puede ir pegado a la variable del cuantificador.
import test from 'node:test';
import assert from 'node:assert/strict';
import { analizar, validarLenguaje, aCadena } from '../../src/sintaxis/index.js';

const { firma } = validarLenguaje({
  funciones: [{ nombre: 'f', aridad: 1 }, { nombre: 'c', aridad: 0 }],
  predicados: [{ nombre: 'P', aridad: 1 }, { nombre: 'R', aridad: 2 }, { nombre: 'PR', aridad: 1 }],
});
const leer = (texto) => aCadena(analizar(texto, firma));

test('separa la variable del predicado o la función pegados', () => {
  assert.equal(leer('∀xP(x)'), '∀x P(x)');
  assert.equal(leer('∃yR(y,c)'), '∃y R(y, c)');
  assert.equal(leer('∀x∃yR(x,y)'), '∀x ∃y R(x, y)');
  assert.equal(leer('forall xP(x) -> exists yP(y)'), '∀x P(x) → ∃y P(y)');
  assert.equal(leer('∀x1P(x1)'), '∀x1 P(x1)');
  assert.equal(leer('∀xf(x)=x'), '∀x f(x) = x');
  // Usa el símbolo declarado más largo: PR y no R.
  assert.equal(leer('∀xPR(x)'), '∀x PR(x)');
});

test('el resultado es el mismo árbol que con espacio', () => {
  for (const [pegado, separado] of [['∀xP(x)', '∀x P(x)'], ['∀x∃yR(x,y)', '∀x ∃y R(x, y)']]) {
    const sinPos = (texto) => JSON.stringify(analizar(texto, firma), (k, v) => (k === 'pos' ? undefined : v));
    assert.equal(sinPos(pegado), sinPos(separado));
  }
});

test('acepta un punto después de la variable: ∀x.P(x)', () => {
  assert.equal(leer('∀x.P(x)'), '∀x P(x)');
  assert.equal(leer('∀x. ∃y. R(x, y)'), '∀x ∃y R(x, y)');
  assert.throws(() => analizar('P(c).', firma), { categoria: 'sintaxis', message: /Sobra "\."/ });
  assert.throws(() => analizar('P(.c)', firma), { categoria: 'sintaxis' });
});

test('no cambia las variables de varias letras ni los nombres declarados', () => {
  assert.equal(leer('∀xy(P(xy))'), '∀xy P(xy)');
  assert.equal(leer('∀xy P(xy)'), '∀xy P(xy)');
  assert.throws(() => analizar('∀PR(x)', firma), { categoria: 'símbolo' });
  // Con espacio antes del paréntesis no se separa.
  assert.throws(() => analizar('∀xP (x)', firma));
});

test('si el símbolo pegado no está declarado, el error lo explica', () => {
  assert.throws(() => analizar('∀xQ(x)', firma), { message: /¿Querías escribir ∀x Q\(…\)\? Para eso Q debe estar declarado/ });
});
