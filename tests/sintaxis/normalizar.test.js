// Limpieza de fórmulas leídas de una foto y símbolos que faltan declarar.
import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizarFormula, simbolosNoDeclarados, validarLenguaje, analizar, aCadena } from '../../src/sintaxis/index.js';

test('pasa la notación de teclado y otras variantes a la del panel de símbolos', () => {
  const casos = [
    ['forall x (P(x) -> Q(x))', '∀x (P(x) → Q(x))'],
    ['∀ x ∃ y [R(x,y) & ~S(y)] .', '∀x ∃y (R(x,y) ∧ ¬S(y))'],
    ['exists z (P(z) \\/ Q(z))', '∃z (P(z) ∨ Q(z))'],
    ['P(a) <=> Q(a)', 'P(a) ↔ Q(a)'],
    ['P(a) ⇒ Q(a) ⊃ R(a)', 'P(a) → Q(a) → R(a)'],
    ['p —> q', 'p → q'],
    ['x != y', 'x ≠ y'],
    ['P(x) || Q(x) && !R(x)', 'P(x) ∨ Q(x) ∧ ¬R(x)'],
    ['  Paratodo x   P(x)  ', '∀x P(x)'],
  ];
  for (const [entrada, esperado] of casos) assert.equal(normalizarFormula(entrada), esperado, entrada);
});

test('no cambia el significado: la fórmula normalizada se lee igual', () => {
  const { firma } = validarLenguaje({ funciones: [{ nombre: 'f', aridad: 1 }], predicados: [{ nombre: 'P', aridad: 1 }, { nombre: 'R', aridad: 2 }] });
  for (const texto of ['forall x (P(x) -> exists y R(x, f(y)))', '~P(x) | P(f(x)) & x != f(x)', 'P(x) <-> ~~P(x)']) {
    assert.equal(aCadena(analizar(normalizarFormula(texto), firma)), aCadena(analizar(texto, firma)), texto);
  }
});

test('detecta predicados y funciones sin declarar, con su aridad', () => {
  const { firma } = validarLenguaje({ funciones: [], predicados: [{ nombre: 'P', aridad: 1 }] });
  assert.deepEqual(simbolosNoDeclarados('∀x (R(x, f(x)) ∧ P(x) ∧ (Q(x) → S(g(x, y, z))))', firma), [
    { nombre: 'R', aridad: 2, tipo: 'predicados' },
    { nombre: 'f', aridad: 1, tipo: 'funciones' },
    { nombre: 'Q', aridad: 1, tipo: 'predicados' },
    { nombre: 'S', aridad: 1, tipo: 'predicados' },
    { nombre: 'g', aridad: 3, tipo: 'funciones' },
  ]);
  // La variable de ∀x( no es un símbolo, y lo ya declarado no se repite.
  assert.deepEqual(simbolosNoDeclarados('∀x(P(x))', firma), []);
  assert.deepEqual(simbolosNoDeclarados('P(x) $ ', firma), []);
});
