import test from 'node:test';
import assert from 'node:assert/strict';
import { validarLenguaje } from '../../src/sintaxis/index.js';
import { validarInterpretacion } from '../../src/semantica/interpretacion.js';

/** Construye la firma a partir de listas cortas: firmaDe({ f: 1 }, { P: 1 }). */
const firmaDe = (funciones, predicados) => {
  const { errores, firma } = validarLenguaje({
    funciones: Object.entries(funciones).map(([nombre, aridad]) => ({ nombre, aridad })),
    predicados: Object.entries(predicados).map(([nombre, aridad]) => ({ nombre, aridad })),
  });
  assert.deepEqual(errores, []);
  return firma;
};

/** Revisa que haya exactamente un error, de la categoría dada, y ninguna interpretación. */
const unError = (firma, datos, categoria) => {
  const { errores, interpretacion } = validarInterpretacion(firma, datos);
  assert.equal(errores.length, 1, errores.map((e) => e.message).join(' | '));
  assert.equal(errores[0].categoria, categoria);
  assert.equal(interpretacion, null);
  return errores[0];
};

// Tema 10, diap. 5: 𝒟 = {1, 2, 3}, P unario, R binario.
const firma10a = firmaDe({}, { P: 1, R: 2 });
const datos10a = { dominioTexto: '{1, 2, 3}', relaciones: { P: '1, 2', R: '(1, 3), (2, 1), (3, 2)' } };

// Tema 10, diap. 7: 𝒟 = {a, b, c}, constante i, Q binario, R unario.
const firma10b = firmaDe({ i: 0 }, { Q: 2, R: 1 });
const datos10b = {
  dominioTexto: 'a, b, c',
  funciones: { i: { '': 'a' } },
  relaciones: { Q: '(a, a), (a, b), (a, c), (b, c), (c, c)', R: 'b, c' },
};

// Ejemplo propio con una función: 𝒟 = {0, 1, 2}, s(x) = x + 1 mod 3, P = "<".
const firmaS = firmaDe({ s: 1 }, { P: 2 });
const datosS = () => ({
  dominioTexto: '0, 1, 2',
  funciones: { s: { 0: '1', 1: '2', 2: '0' } },
  relaciones: { P: '(0, 1), (0, 2), (1, 2)' },
});

test('interpretación del tema 10, diap. 5', () => {
  const { errores, interpretacion } = validarInterpretacion(firma10a, datos10a);
  assert.deepEqual(errores, []);
  assert.deepEqual(interpretacion.dominio, ['1', '2', '3']);
  assert.deepEqual([...interpretacion.relaciones.get('P')], ['1', '2']);
  assert.deepEqual([...interpretacion.relaciones.get('R')], ['1,3', '2,1', '3,2']);
});

test('interpretación del tema 10, diap. 7 (constante i ↦ a)', () => {
  const { errores, interpretacion } = validarInterpretacion(firma10b, datos10b);
  assert.deepEqual(errores, []);
  assert.equal(interpretacion.funciones.get('i').get(''), 'a');
  assert.deepEqual([...interpretacion.relaciones.get('Q')], ['a,a', 'a,b', 'a,c', 'b,c', 'c,c']);
  assert.deepEqual([...interpretacion.relaciones.get('R')], ['b', 'c']);
  assert.ok(!interpretacion.relaciones.get('R').has('a')); // por eso ¬R(i) es V
});

test('interpretación del tema 11, diap. 8 (P es "<" en {0, 1, 2})', () => {
  const firma = firmaDe({}, { P: 2 });
  const { errores, interpretacion } = validarInterpretacion(firma, { dominioTexto: '0, 1, 2', relaciones: { P: '(0, 1), (0, 2), (1, 2)' } });
  assert.deepEqual(errores, []);
  assert.deepEqual([...interpretacion.relaciones.get('P')], ['0,1', '0,2', '1,2']);
  assert.ok(interpretacion.relaciones.get('P').has('0,2'));  // inciso a: P(0, 2)
  assert.ok(!interpretacion.relaciones.get('P').has('2,1')); // inciso b: P(2, 1)
});

test('función s(x) = x + 1 mod 3, y una función binaria con claves escritas de varias formas', () => {
  const { errores, interpretacion } = validarInterpretacion(firmaS, datosS());
  assert.deepEqual(errores, []);
  assert.deepEqual([...interpretacion.funciones.get('s')], [['0', '1'], ['1', '2'], ['2', '0']]);

  const firma = firmaDe({ g: 2 }, { P: 1 });
  const g = { '1, 1': '1', '1,2': '2', '(2, 1)': '2', ' 2 , 2 ': '1' }; // todas se normalizan a '1,1', '1,2', ...
  const r = validarInterpretacion(firma, { dominioTexto: '1, 2', funciones: { g }, relaciones: { P: '1' } });
  assert.deepEqual(r.errores, []);
  assert.equal(r.interpretacion.funciones.get('g').get('2,1'), '2');
});

test('las tuplas repetidas de una relación se juntan', () => {
  const firma = firmaDe({}, { P: 1 });
  const { interpretacion } = validarInterpretacion(firma, { dominioTexto: '1, 2', relaciones: { P: '1, 2, 1' } });
  assert.deepEqual([...interpretacion.relaciones.get('P')], ['1', '2']);
});

test('error: a la función le falta una tupla (o tiene una casilla vacía)', () => {
  const sinUna = datosS();
  delete sinUna.funciones.s[2];
  assert.match(unError(firmaS, sinUna, 'función').message, /s no está definida en: 2\./);

  const vacia = datosS();
  vacia.funciones.s[2] = '  ';
  assert.equal(unError(firmaS, vacia, 'función').categoria, 'función');
});

test('error: la función devuelve un valor fuera de 𝒟', () => {
  const datos = datosS();
  datos.funciones.s[1] = '7';
  assert.match(unError(firmaS, datos, 'función').message, /s\(1\) = "7"/);
});

test('error: la tabla de la función tiene una entrada que no es tupla de 𝒟ⁿ', () => {
  const datos = datosS();
  datos.funciones.s[4] = '0';
  unError(firmaS, datos, 'función');
});

test('error: relación vacía', () => {
  const datos = { ...datos10a, relaciones: { ...datos10a.relaciones, P: '' } };
  assert.match(unError(firma10a, datos, 'relación').message, /P está vacía/);
});

test('error: tupla (1, 2, 3) en una relación binaria', () => {
  const datos = { ...datos10a, relaciones: { ...datos10a.relaciones, R: '(1, 2, 3)' } };
  assert.match(unError(firma10a, datos, 'relación').message, /aridad 2/);
});

test('error: el elemento 4 no está en 𝒟', () => {
  const datos = { ...datos10a, relaciones: { ...datos10a.relaciones, R: '(1, 4)' } };
  assert.match(unError(firma10a, datos, 'relación').message, /"4"/);
});

test('error: la relación está mal escrita (el mensaje dice cuál es)', () => {
  const datos = { ...datos10a, relaciones: { ...datos10a.relaciones, R: '(1, 3' } };
  assert.match(unError(firma10a, datos, 'relación').message, /^Relación R:/);
});

test('error: símbolo declarado sin tabla o sin relación', () => {
  unError(firmaS, { ...datosS(), funciones: {} }, 'función');
  unError(firmaS, { ...datosS(), relaciones: {} }, 'relación');
});

test('error: constante sin valor', () => {
  assert.match(unError(firma10b, { ...datos10b, funciones: { i: {} } }, 'función').message, /constante i/);
  assert.match(unError(firma10b, { ...datos10b, funciones: { i: { '': '' } } }, 'función').message, /constante i/);
});

test('error de dominio: se detiene ahí y no revisa lo demás', () => {
  const { errores, interpretacion } = validarInterpretacion(firma10a, { ...datos10a, dominioTexto: '1, 1' });
  assert.deepEqual(errores.map((e) => e.categoria), ['dominio']);
  assert.equal(interpretacion, null);
});

test('se reportan todos los errores a la vez', () => {
  const { errores } = validarInterpretacion(firmaS, { dominioTexto: '0, 1, 2', funciones: { s: { 0: '1' } }, relaciones: { P: '' } });
  assert.deepEqual(errores.map((e) => e.categoria), ['función', 'relación']);
});
