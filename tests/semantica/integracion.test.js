import test from 'node:test';
import assert from 'node:assert/strict';
// Solo los puntos de entrada, como la interfaz.
import { validarLenguaje, analizar, variablesLibres, ErrorLogico } from '../../src/sintaxis/index.js';
import { validarInterpretacion, validarEntorno, evaluar } from '../../src/semantica/index.js';

/**
 * El flujo completo que hará la interfaz:
 * validarLenguaje → analizar → variablesLibres → validarInterpretacion → validarEntorno → evaluar.
 * En cuanto aparece un error se detiene y NO evalúa (requerimiento 7).
 * Devuelve en qué paso se quedó, los errores y, si llegó al final, el resultado.
 */
function flujo({ lenguaje, formula, datos, entorno = {} }) {
  const lengua = validarLenguaje(lenguaje);
  if (lengua.errores.length > 0) return { paso: 'lenguaje', errores: lengua.errores };

  let ast;
  try {
    ast = analizar(formula, lengua.firma);
  } catch (e) {
    if (!(e instanceof ErrorLogico)) throw e;
    return { paso: 'fórmula', errores: [e] };
  }
  const libres = variablesLibres(ast);

  const inter = validarInterpretacion(lengua.firma, datos);
  if (inter.errores.length > 0) return { paso: 'interpretación', errores: inter.errores };

  const ent = validarEntorno(libres, entorno, inter.interpretacion.dominio);
  if (ent.errores.length > 0) return { paso: 'entorno', errores: ent.errores };

  return { paso: 'evaluado', errores: [], resultado: evaluar(ast, inter.interpretacion, ent.entorno) };
}

/** Revisa que el flujo se detuvo en "paso", con errores de la categoría dada y sin valor de verdad. */
const sinEvaluar = (r, paso, categoria) => {
  assert.equal(r.paso, paso);
  assert.ok(r.errores.length > 0);
  assert.ok(r.errores.every((e) => e.categoria === categoria), r.errores.map((e) => e.message).join(' | '));
  assert.equal(r.resultado, undefined); // no hay V ni F
};

// Tema 10, diap. 5: 𝒟 = {1, 2, 3}, Pᴵ = {1, 2}, Rᴵ = {(1, 3), (2, 1), (3, 2)}.
const tema10 = {
  lenguaje: { funciones: [], predicados: [{ nombre: 'P', aridad: 1 }, { nombre: 'R', aridad: 2 }] },
  datos: { dominioTexto: '{1, 2, 3}', relaciones: { P: '1, 2', R: '(1, 3), (2, 1), (3, 2)' } },
};

// Tema 11, diap. 8: 𝒟 = {0, 1, 2}, Pᴵ = {(0, 1), (0, 2), (1, 2)}.
const tema11 = {
  lenguaje: { funciones: [], predicados: [{ nombre: 'P', aridad: 2 }] },
  datos: { dominioTexto: '0, 1, 2', relaciones: { P: '(0, 1), (0, 2), (1, 2)' } },
};

// Ejemplo propio con función: 𝒟 = {0, 1, 2}, s(x) = x + 1 mod 3.
const conFuncion = {
  lenguaje: { funciones: [{ nombre: 's', aridad: 1 }], predicados: [{ nombre: 'P', aridad: 2 }] },
  datos: { dominioTexto: '0, 1, 2', funciones: { s: { 0: '1', 1: '2', 2: '0' } }, relaciones: { P: '(0, 1), (1, 2), (2, 0)' } },
};

// ─── Casos que llegan a evaluar ────────────────────────────────────────────

test('fórmula cerrada: ∀x ∃y R(x, y) del tema 10, diap. 5 es V', () => {
  const r = flujo({ ...tema10, formula: '∀x ∃y R(x, y)' });
  assert.equal(r.paso, 'evaluado');
  assert.deepEqual(r.errores, []);
  assert.equal(r.resultado.valor, true);
  assert.equal(r.resultado.completa, true);
  assert.equal(r.resultado.entorno, '[]'); // cerrada: no necesita entorno
});

test('fórmula abierta: P(x, y) del tema 11, diap. 8 con x ↦ 0, y ↦ 2 es V', () => {
  const r = flujo({ ...tema11, formula: 'P(x, y)', entorno: { x: '0', y: '2' } });
  assert.equal(r.paso, 'evaluado');
  assert.equal(r.resultado.valor, true);
  assert.equal(r.resultado.razon, 'P(x, y) con x ↦ 0, y ↦ 2: (0, 2) ∈ Pᴵ');
  assert.equal(r.resultado.entorno, '[x ↦ 0, y ↦ 2]');
});

test('fórmula con función: ∀x P(x, s(x)) es V (s es "sumar 1")', () => {
  const r = flujo({ ...conFuncion, formula: '∀x P(x, s(x))' });
  assert.equal(r.paso, 'evaluado');
  assert.equal(r.resultado.valor, true);
});

// ─── Casos con error: no se muestra V ni F (requerimiento 7) ───────────────

test('error de dominio: 𝒟 vacío', () => {
  const r = flujo({ ...tema10, formula: '∀x P(x)', datos: { ...tema10.datos, dominioTexto: '  ' } });
  sinEvaluar(r, 'interpretación', 'dominio');
});

test('error de función: s no está definida en 2', () => {
  const datos = { ...conFuncion.datos, funciones: { s: { 0: '1', 1: '2' } } };
  const r = flujo({ ...conFuncion, formula: '∀x P(x, s(x))', datos });
  sinEvaluar(r, 'interpretación', 'función');
  assert.match(r.errores[0].message, /2/);
});

test('error de relación: R vacía', () => {
  const datos = { ...tema10.datos, relaciones: { ...tema10.datos.relaciones, R: '' } };
  const r = flujo({ ...tema10, formula: '∀x ∃y R(x, y)', datos });
  sinEvaluar(r, 'interpretación', 'relación');
});

test('error de entorno: falta el valor de la variable libre y', () => {
  const r = flujo({ ...tema11, formula: 'P(x, y)', entorno: { x: '0' } });
  sinEvaluar(r, 'entorno', 'entorno');
  assert.match(r.errores[0].message, /y/);
});

test('error de entorno: el valor no está en 𝒟', () => {
  const r = flujo({ ...tema11, formula: 'P(x, y)', entorno: { x: '0', y: '7' } });
  sinEvaluar(r, 'entorno', 'entorno');
});

test('error de sintaxis: falta un paréntesis', () => {
  const r = flujo({ ...tema11, formula: 'P(x, y' });
  sinEvaluar(r, 'fórmula', 'sintaxis');
});

test('error de aridad: P es binario y recibe un argumento', () => {
  const r = flujo({ ...tema11, formula: '∀x P(x)' });
  sinEvaluar(r, 'fórmula', 'aridad');
});
