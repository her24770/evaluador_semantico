import test from 'node:test';
import assert from 'node:assert/strict';
import { validarLenguaje, analizar } from '../../src/sintaxis/index.js';
import { validarInterpretacion } from '../../src/semantica/interpretacion.js';
import { evaluar } from '../../src/semantica/evaluador.js';

/** Arma la firma y la interpretación igual que lo hará la interfaz, revisando que no haya errores. */
const preparar = (declaracion, datos) => {
  const { errores, firma } = validarLenguaje(declaracion);
  assert.deepEqual(errores, []);
  const r = validarInterpretacion(firma, datos);
  assert.deepEqual(r.errores, []);
  return { firma, interpretacion: r.interpretacion };
};

/** Evalúa el texto de una fórmula con la firma e interpretación dadas. */
const evaluarTexto = ({ firma, interpretacion }, texto, entorno) =>
  evaluar(analizar(texto, firma), interpretacion, entorno);

// Tema 11, diap. 8: 𝒟 = {0, 1, 2}, Pᴵ = {(0, 1), (0, 2), (1, 2)}.
const tema11 = preparar(
  { funciones: [], predicados: [{ nombre: 'P', aridad: 2 }, { nombre: 'R', aridad: 1 }] },
  { dominioTexto: '0, 1, 2', relaciones: { P: '(0, 1), (0, 2), (1, 2)', R: '1' } },
);

// Tema 10, diap. 7: 𝒟 = {a, b, c}, iᴵ = a, Rᴵ = {b, c}.
const tema10 = preparar(
  { funciones: [{ nombre: 'i', aridad: 0 }], predicados: [{ nombre: 'R', aridad: 1 }, { nombre: 'Q', aridad: 2 }] },
  { dominioTexto: '{a, b, c}', funciones: { i: { '': 'a' } }, relaciones: { R: 'b, c', Q: '(a, a), (a, b), (a, c), (b, c), (c, c)' } },
);

// Para las tablas de verdad: 𝒟 = {0, 1}, Vᴵ = {1}. Así V(x) es V si x ↦ 1 y F si x ↦ 0.
const tablas = preparar(
  { funciones: [], predicados: [{ nombre: 'V', aridad: 1 }] },
  { dominioTexto: '0, 1', relaciones: { V: '1' } },
);
const comoElemento = (valor) => (valor ? '1' : '0');

/**
 * Revisa una tabla de verdad. Las filas van en el orden del tema 03, diap. 8:
 * (F, F), (F, V), (V, F), (V, V), y "esperado" es la última columna.
 */
const revisarTabla = (conectivo, regla, esperado) => {
  const filas = [[false, false], [false, true], [true, false], [true, true]];
  filas.forEach(([p, q], i) => {
    const r = evaluarTexto(tablas, `V(x) ${conectivo} V(y)`, { x: comoElemento(p), y: comoElemento(q) });
    assert.equal(r.valor, esperado[i], `fila ${i + 1}: ${p ? 'V' : 'F'} ${conectivo} ${q ? 'V' : 'F'}`);
    assert.equal(r.regla, regla);
    // Siempre se evalúan los dos lados.
    assert.equal(r.hijos.length, 2);
    assert.deepEqual(r.hijos.map((h) => h.valor), [p, q]);
  });
};

test('tema 11, diap. 8a: P(x, y) con x ↦ 0, y ↦ 2 es V', () => {
  const r = evaluarTexto(tema11, 'P(x, y)', { x: '0', y: '2' });
  assert.equal(r.valor, true);
  assert.equal(r.regla, 'atómica');
  assert.equal(r.razon, 'P(x, y) con x ↦ 0, y ↦ 2: (0, 2) ∈ Pᴵ');
});

test('tema 11, diap. 8b: P(x, y) con x ↦ 2, y ↦ 1 es F', () => {
  const r = evaluarTexto(tema11, 'P(x, y)', { x: '2', y: '1' });
  assert.equal(r.valor, false);
  assert.equal(r.razon, 'P(x, y) con x ↦ 2, y ↦ 1: (2, 1) ∉ Pᴵ');
});

test('tema 10, diap. 7: ¬R(i) es V porque iᴵ = a y a ∉ Rᴵ', () => {
  const r = evaluarTexto(tema10, '¬R(i)', {});
  assert.equal(r.valor, true);
  assert.equal(r.regla, '¬');
  assert.equal(r.razon, 'Es verdadera porque R(i) es F');
  assert.equal(r.hijos.length, 1);
  assert.equal(r.hijos[0].valor, false);
  assert.equal(r.hijos[0].razon, 'R(i) con i = a: a ∉ Rᴵ');
});

test('∧ coincide con la tabla del tema 03, diap. 8', () => {
  revisarTabla('∧', '∧', [false, false, false, true]);
});

test('∨ coincide con la tabla del tema 03, diap. 8', () => {
  revisarTabla('∨', '∨', [false, true, true, true]);
});

test('→ coincide con la tabla del tema 03, diap. 8', () => {
  revisarTabla('→', '→', [true, true, false, true]);
});

test('↔ es V cuando los dos lados tienen el mismo valor (tema 03, diap. 4)', () => {
  revisarTabla('↔', '↔', [true, false, false, true]);
});

test('la razón de los conectivos dice qué lado decidió', () => {
  const razon = (texto, x, y) => evaluarTexto(tablas, texto, { x, y }).razon;
  assert.equal(razon('V(x) → V(y)', '1', '0'), 'Es falsa porque el lado izquierdo es V y el derecho es F');
  assert.equal(razon('V(x) → V(y)', '0', '1'), 'Es verdadera porque el lado izquierdo es F');
  assert.equal(razon('V(x) ∧ V(y)', '1', '0'), 'Es falsa porque el lado derecho es F');
  assert.equal(razon('V(x) ∨ V(y)', '0', '1'), 'Es verdadera porque el lado derecho es V');
  assert.equal(razon('V(x) ↔ V(y)', '0', '0'), 'Es verdadera porque los dos lados son F');
});

test('igualdad: x = y y x ≠ y con valores iguales y distintos', () => {
  const iguales = { x: '1', y: '1' };
  const distintos = { x: '0', y: '2' };

  const a = evaluarTexto(tema11, 'x = y', iguales);
  assert.equal(a.valor, true);
  assert.equal(a.regla, 'igualdad');
  assert.equal(a.razon, 'x = y con x ↦ 1, y ↦ 1: 1 = 1');

  const b = evaluarTexto(tema11, 'x = y', distintos);
  assert.equal(b.valor, false);
  assert.equal(b.razon, 'x = y con x ↦ 0, y ↦ 2: 0 ≠ 2');

  // x ≠ y llega como ¬(x = y): es lo contrario.
  assert.equal(evaluarTexto(tema11, 'x ≠ y', iguales).valor, false);
  assert.equal(evaluarTexto(tema11, 'x ≠ y', distintos).valor, true);
  assert.equal(evaluarTexto(tema11, 'x ≠ y', distintos).regla, '¬');
});

test('el nodo tiene exactamente los campos del contrato (CONTRATO.md §4)', () => {
  const r = evaluarTexto(tema11, 'P(x, y) ∧ ¬R(x)', { x: '0', y: '2' });
  assert.deepEqual(r, {
    formula: 'P(x, y) ∧ ¬R(x)',
    valor: true,
    regla: '∧',
    razon: 'Es verdadera porque los dos lados son V',
    entorno: '[x ↦ 0, y ↦ 2]',
    hijos: [
      {
        formula: 'P(x, y)', valor: true, regla: 'atómica',
        razon: 'P(x, y) con x ↦ 0, y ↦ 2: (0, 2) ∈ Pᴵ', entorno: '[x ↦ 0, y ↦ 2]', hijos: [],
      },
      {
        formula: '¬R(x)', valor: true, regla: '¬',
        razon: 'Es verdadera porque R(x) es F', entorno: '[x ↦ 0, y ↦ 2]',
        hijos: [{
          formula: 'R(x)', valor: false, regla: 'atómica',
          razon: 'R(x) con x ↦ 0: 0 ∉ Rᴵ', entorno: '[x ↦ 0, y ↦ 2]', hijos: [],
        }],
      },
    ],
  });
});

test('∀ y ∃ todavía no están (parte 5b)', () => {
  assert.throws(() => evaluarTexto(tema11, '∀x P(x, x)', {}), /Falta implementar ∀/);
  assert.throws(() => evaluarTexto(tema11, '∃x P(x, x)', {}), /Falta implementar ∃/);
});
