import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validarLenguaje, analizar, variablesLibres, variablesLigadas, esCerrada, aCadena, aCadenaCompleta,
} from '../../src/sintaxis/index.js';

const { firma } = validarLenguaje({
  funciones: [{ nombre: 'f', aridad: 1 }, { nombre: 'g', aridad: 2 }, { nombre: 'c', aridad: 0 }],
  predicados: [{ nombre: 'P', aridad: 1 }, { nombre: 'Q', aridad: 1 }, { nombre: 'R', aridad: 2 }, { nombre: 'S', aridad: 2 }],
});

const leer = (txt) => aCadena(analizar(txt, firma));
const completa = (txt) => aCadenaCompleta(analizar(txt, firma));
const errorDe = (txt) => {
  try { analizar(txt, firma); } catch (e) { return e; }
  return assert.fail(`"${txt}" debió dar error`);
};

test('lenguaje: detecta nombres vacíos, inválidos, repetidos, reservados y aridades malas', () => {
  const { errores } = validarLenguaje({
    funciones: [{ nombre: 'f', aridad: 1 }, { nombre: '', aridad: 1 }, { nombre: 'h', aridad: -1 }, { nombre: 'a b', aridad: 0 }],
    predicados: [{ nombre: 'f', aridad: 2 }, { nombre: 'P', aridad: 0 }, { nombre: 'forall', aridad: 1 }, { nombre: 'T', aridad: 1.5 }],
  });
  assert.equal(errores.length, 7);
});

test('lenguaje: constantes con nombre numérico (como 0 y 1 en el tema 07) son válidas', () => {
  const r = validarLenguaje({ funciones: [{ nombre: '0', aridad: 0 }], predicados: [] });
  assert.equal(r.errores.length, 0);
  assert.equal(aCadena(analizar('0 = 0', r.firma)), '0 = 0');
});

test('acepta símbolos Unicode y alternativas de teclado', () => {
  assert.equal(leer('forall x (P(x) -> Q(x))'), '∀x(P(x) → Q(x))');
  assert.equal(leer('exists x (P(x) & ~Q(x))'), '∃x(P(x) ∧ ¬Q(x))');
  assert.equal(leer('P(x) | Q(x)'), 'P(x) ∨ Q(x)');
  assert.equal(leer('P(x) <-> Q(x)'), 'P(x) ↔ Q(x)');
  assert.equal(leer('x != y'), '¬x = y');
});

test('precedencia: ¬ ∀ ∃ > ∧ > ∨ > → (por la derecha) > ↔', () => {
  assert.equal(completa('P(x) ∧ Q(x) ∨ R(x, y)'), '((P(x) ∧ Q(x)) ∨ R(x, y))');
  assert.equal(completa('P(x) → Q(x) → P(y)'), '(P(x) → (Q(x) → P(y)))');
  assert.equal(completa('¬P(x) ∧ Q(x)'), '(¬P(x) ∧ Q(x))');
  assert.equal(completa('∀x P(x) → Q(x)'), '(∀x P(x) → Q(x))');
  assert.equal(completa('∀x (P(x) → Q(x))'), '∀x (P(x) → Q(x))');
  assert.equal(completa('P(x) ↔ Q(x) → P(y)'), '(P(x) ↔ (Q(x) → P(y)))');
});

test('aCadena pone solo los paréntesis necesarios y conserva el significado', () => {
  for (const f of ['(P(x) ∨ Q(x)) ∧ P(y)', '(P(x) → Q(x)) → P(y)', '¬(P(x) ∧ Q(x))', '∃x ∀y R(x, y)', '∀x ∀y ∀z(S(x, y) ∧ S(x, z) → y = z)']) {
    const una = analizar(f, firma);
    const dos = analizar(aCadena(una), firma);
    assert.equal(aCadenaCompleta(una), aCadenaCompleta(dos), f);
  }
});

test('términos con funciones y constantes (tema 07)', () => {
  assert.equal(leer('R(g(f(x), c), y)'), 'R(g(f(x), c), y)');
  assert.equal(leer('f(f(c)) = g(x, c)'), 'f(f(c)) = g(x, c)');
});

test('errores de sintaxis', () => {
  for (const mal of ['', '   ', 'P(x', 'P(x))', 'P(x) ∧', '∧ P(x)', 'P(x) Q(x)', '∀ (P(x))', '∀x', 'x', 'f(x)', 'P(x) # Q(x)', 'P(x,)', '()']) {
    assert.equal(errorDe(mal).categoria, 'sintaxis', mal);
  }
});

test('errores de aridad', () => {
  for (const mal of ['P(x, y)', 'R(x)', 'P', 'P(f(x, y))', 'P(g(x))', 'P(c(x))', 'P(f)']) {
    assert.equal(errorDe(mal).categoria, 'aridad', mal);
  }
});

test('errores de símbolos', () => {
  assert.equal(errorDe('T(x)').categoria, 'símbolo');    // predicado no declarado
  assert.equal(errorDe('P(h(x))').categoria, 'símbolo'); // función no declarada
  assert.equal(errorDe('P(Q(x))').categoria, 'símbolo'); // predicado dentro de un término
  assert.equal(errorDe('∀P P(x)').categoria, 'símbolo'); // cuantificar un predicado
  assert.equal(errorDe('∀c P(c)').categoria, 'símbolo'); // cuantificar una constante
  assert.equal(errorDe('P(1)').categoria, 'símbolo');    // elemento de 𝒟 usado como término
});

test('el error indica la posición donde ocurre', () => {
  assert.equal(errorDe('P(x) ∧ ∧ Q(x)').pos, 7);
  assert.equal(errorDe('P(x) Q(x)').pos, 5);
});

test('variables libres y ligadas (ejemplos del tema 08)', () => {
  const libres = (txt) => variablesLibres(analizar(txt, firma));
  assert.deepEqual(libres('∀x(P(x) → Q(x) ∧ S(x, y))'), ['y']);
  assert.deepEqual(libres('∀x P(x) → ∃x Q(x)'), []);
  assert.deepEqual(libres('∀x(P(x) ∧ Q(x)) → ¬P(x) ∨ Q(y)'), ['x', 'y']);
  assert.deepEqual(libres('∃x(R(y, z) ∧ ∀y(¬S(y, x) ∨ R(y, z)))'), ['y', 'z']);
  assert.deepEqual(variablesLigadas(analizar('∃x(R(y, z) ∧ ∀y(¬S(y, x) ∨ R(y, z)))', firma)), ['y', 'x']);
});

test('fórmulas cerradas y abiertas (tema 10)', () => {
  assert.equal(esCerrada(analizar('∀x ∃y R(x, f(y))', firma)), true);
  assert.equal(esCerrada(analizar('∀x R(x, y)', firma)), false);
  assert.equal(esCerrada(analizar('P(c)', firma)), true);
});
