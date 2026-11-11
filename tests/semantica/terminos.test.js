import test from 'node:test';
import assert from 'node:assert/strict';
import { validarLenguaje, analizar } from '../../src/sintaxis/index.js';
import { validarInterpretacion } from '../../src/semantica/interpretacion.js';
import { valorDeTermino } from '../../src/semantica/terminos.js';

/** Arma la firma y la interpretación igual que lo hará la interfaz, revisando que no haya errores. */
const preparar = (declaracion, datos) => {
  const { errores, firma } = validarLenguaje(declaracion);
  assert.deepEqual(errores, []);
  const r = validarInterpretacion(firma, datos);
  assert.deepEqual(r.errores, []);
  return { firma, interpretacion: r.interpretacion };
};

/** Obtiene el término con el parser de verdad: lo mete en "T(...)" y saca el argumento. */
const terminoDe = (texto, firma) => analizar(`T(${texto})`, firma).args[0];

// Tema 10, diap. 7: 𝒟 = {a, b, c}, constante i ↦ a.
const tema10 = preparar(
  { funciones: [{ nombre: 'i', aridad: 0 }], predicados: [{ nombre: 'T', aridad: 1 }, { nombre: 'R', aridad: 1 }, { nombre: 'Q', aridad: 2 }] },
  {
    dominioTexto: '{a, b, c}',
    funciones: { i: { '': 'a' } },
    relaciones: { T: 'a', R: 'b, c', Q: '(a, a), (a, b), (a, c), (b, c), (c, c)' },
  },
);

// Ejemplo propio: 𝒟 = {0, 1, 2}, s(x) = x + 1 mod 3, suma(x, y) = x + y mod 3, constante c ↦ 1.
const sumaMod3 = {};
for (const a of [0, 1, 2]) for (const b of [0, 1, 2]) sumaMod3[`${a},${b}`] = String((a + b) % 3);
const mod3 = preparar(
  { funciones: [{ nombre: 's', aridad: 1 }, { nombre: 'suma', aridad: 2 }, { nombre: 'c', aridad: 0 }], predicados: [{ nombre: 'T', aridad: 1 }] },
  { dominioTexto: '0, 1, 2', funciones: { s: { 0: '1', 1: '2', 2: '0' }, suma: sumaMod3, c: { '': '1' } }, relaciones: { T: '0' } },
);
const valorMod3 = (texto, entorno) => valorDeTermino(terminoDe(texto, mod3.firma), mod3.interpretacion, entorno);

test('constante: i vale a (tema 10, diap. 7)', () => {
  assert.equal(valorDeTermino(terminoDe('i', tema10.firma), tema10.interpretacion, {}), 'a');
});

test('variable: x vale lo que dice el entorno', () => {
  assert.equal(valorMod3('x', { x: '2' }), '2');
  assert.equal(valorMod3('x', { x: '0', y: '1' }), '0');
});

test('función anidada: s(s(x)) con s(x) = x + 1 mod 3', () => {
  assert.equal(valorMod3('s(x)', { x: '0' }), '1');
  assert.equal(valorMod3('s(s(x))', { x: '0' }), '2');
  assert.equal(valorMod3('s(s(x))', { x: '2' }), '1'); // 2 → 0 → 1
  for (const x of ['0', '1', '2']) {
    assert.equal(valorMod3('s(s(s(x)))', { x }), x);   // sumar 3 veces 1 da la vuelta completa
  }
});

test('función binaria con variable y constante: suma(s(x), c)', () => {
  assert.equal(valorMod3('suma(x, y)', { x: '2', y: '2' }), '1');    // 2 + 2 = 4 ≡ 1
  assert.equal(valorMod3('suma(s(x), c)', { x: '0' }), '2');         // (0 + 1) + 1
  assert.equal(valorMod3('s(suma(c, c))', {}), '0');                 // (1 + 1) + 1 = 3 ≡ 0
});

test('protección: una variable sin valor da error de entorno', () => {
  assert.throws(() => valorMod3('s(z)', { x: '0' }), { name: 'ErrorLogico', categoria: 'entorno' });
});
