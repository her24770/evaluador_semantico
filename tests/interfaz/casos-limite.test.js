// Errores encontrados al probar la app en el navegador:
// nombres que existen en los objetos de JavaScript y fórmulas demasiado grandes.
import test from 'node:test';
import assert from 'node:assert/strict';
import { crearEstado, evaluarEntrada, revisarEntrada } from '../../src/interfaz/modelo.js';
import { resumenEntornoHTML } from '../../src/interfaz/componentes/resumen.js';
import { dictamen } from '../../src/interfaz/vistas/resultados.js';
import { evaluar, MAX_NODOS_EVALUACION } from '../../src/semantica/index.js';
import { analizar, validarLenguaje } from '../../src/sintaxis/index.js';

function ejercicio(formula, extra = {}) {
  return { ...crearEstado(), formula, dominioTexto: '1, 2, 3',
    predicados: [{ nombre: 'P', aridad: 1, relacion: '1, 2' }], ...extra };
}

test('variables llamadas constructor, toString o __proto__ funcionan como cualquier otra', () => {
  for (const x of ['constructor', 'toString', '__proto__', 'hasOwnProperty']) {
    const revision = evaluarEntrada(ejercicio(`forall ${x} P(${x})`));
    assert.equal(revision.valido, true, x);
    assert.equal(revision.resultado.valor, false, x);
    assert.equal(revision.resultado.contraejemplo.elemento, '3', x);
  }
});

test('una variable libre toString sin asignar pide entorno con un mensaje normal', () => {
  const revision = revisarEntrada(ejercicio('P(toString)'));
  assert.equal(revision.errores.entorno.length, 1);
  assert.match(revision.errores.entorno[0].message, /La variable libre toString no tiene valor/);
  assert.doesNotMatch(resumenEntornoHTML(revision), /native code|function/);
});

test('variables libres __proto__ y constructor con valor se evalúan', () => {
  const entorno = {};
  for (const x of ['__proto__', 'constructor']) Object.defineProperty(entorno, x, { value: '1', enumerable: true, writable: true, configurable: true });
  const revision = evaluarEntrada(ejercicio('P(__proto__) & P(constructor)', { entorno }));
  assert.equal(revision.valido, true);
  assert.equal(revision.resultado.valor, true);
});

test('símbolos y elementos del dominio con nombres de JavaScript', () => {
  const tabla = {};
  Object.defineProperty(tabla, 'constructor', { value: 'toString', enumerable: true, writable: true, configurable: true });
  Object.defineProperty(tabla, 'toString', { value: 'constructor', enumerable: true, writable: true, configurable: true });
  const revision = evaluarEntrada({ ...crearEstado(), formula: 'forall x constructor(constructor(x)) = x',
    dominioTexto: 'constructor, toString',
    funciones: [{ nombre: 'constructor', aridad: 1, tabla }],
    predicados: [{ nombre: 'toString', aridad: 1, relacion: 'constructor' }] });
  assert.deepEqual(Object.values(revision.errores).flat(), []);
  assert.equal(revision.resultado.valor, true);
});

test('una fórmula demasiado grande da un error de límite en lugar de llenar la memoria', () => {
  // 70⁶ casos: antes la pestaña se caía antes del corte de 10 s.
  const dominioTexto = Array.from({ length: 70 }, (_, i) => i + 1).join(', ');
  const inicio = Date.now();
  const revision = evaluarEntrada(ejercicio('forall a forall b forall c forall d forall e forall f (P(a) | ~P(a))', { dominioTexto }));
  assert.ok(Date.now() - inicio < 3000);
  assert.equal(revision.valido, false);
  assert.equal(revision.resultado, null);
  const [error] = revision.errores.interpretacion;
  assert.equal(error.categoria, 'límite');
  assert.match(error.message, /más de 100\.000 pasos/);
  const html = dictamen({ resultado: null, evaluacionSolicitada: true }, revision);
  assert.match(html, /Fórmula demasiado grande/);
  assert.doesNotMatch(html, /data-valor-verdad/);
});

test('el límite cuenta solo los pasos que de verdad se evalúan', () => {
  // ∃ se detiene en el primer testigo: con 70⁶ casos posibles basta con muy pocos pasos.
  const dominioTexto = Array.from({ length: 70 }, (_, i) => i + 1).join(', ');
  const revision = evaluarEntrada(ejercicio('exists a exists b exists c exists d exists e exists f P(a)', { dominioTexto }));
  assert.equal(revision.valido, true);
  assert.equal(revision.resultado.valor, true);
});

test('evaluar acepta un límite propio y rechaza límites inválidos', () => {
  const { firma } = validarLenguaje({ funciones: [], predicados: [{ nombre: 'P', aridad: 1 }] });
  const interpretacion = { dominio: ['1', '2', '3'], funciones: new Map(), relaciones: new Map([['P', new Set(['1', '2', '3'])]]) };
  const ast = analizar('forall x forall y P(x)', firma);
  assert.equal(evaluar(ast, interpretacion, {}).valor, true);
  assert.throws(() => evaluar(ast, interpretacion, {}, { maxNodos: 5 }), { categoria: 'límite' });
  assert.throws(() => evaluar(ast, interpretacion, {}, { maxNodos: 0 }), RangeError);
  assert.equal(MAX_NODOS_EVALUACION, 100000);
});
