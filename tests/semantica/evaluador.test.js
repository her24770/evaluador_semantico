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

// ─── Cuantificadores (parte 5b) ───────────────────────────────────────────

// Tema 10, diap. 5: 𝒟 = {1, 2, 3}, Pᴵ = {1, 2}, Rᴵ = {(1, 3), (2, 1), (3, 2)}.
const tema10d5 = preparar(
  { funciones: [], predicados: [{ nombre: 'P', aridad: 1 }, { nombre: 'R', aridad: 2 }] },
  { dominioTexto: '{1, 2, 3}', relaciones: { P: '1, 2', R: '(1, 3), (2, 1), (3, 2)' } },
);

/** Interpretación con 𝒟 = {1, 2} y P, Q unarios (tema 11, diap. 10 y 13). */
const conPyQ = (P, Q) => preparar(
  { funciones: [], predicados: [{ nombre: 'P', aridad: 1 }, { nombre: 'Q', aridad: 1 }] },
  { dominioTexto: '1, 2', relaciones: { P, Q } },
);

/** Revisa que el nodo tenga SOLO el campo especial que le toca (testigo, contraejemplo o completa). */
const soloCampo = (nodo, campo) => {
  for (const c of ['testigo', 'contraejemplo', 'completa']) {
    assert.equal(Object.hasOwn(nodo, c), c === campo, `campo ${c}`);
  }
};

test('tema 10, diap. 5: ∀x P(x) es F con contraejemplo x ↦ 3', () => {
  const r = evaluarTexto(tema10d5, '∀x P(x)', {});
  assert.equal(r.valor, false);
  assert.equal(r.regla, '∀');
  soloCampo(r, 'contraejemplo');
  assert.deepEqual(r.contraejemplo, { variable: 'x', elemento: '3' });
  assert.equal(r.razon, 'Contraejemplo: con x ↦ 3, P(x) es F');
  // Solo el caso que falla, con la variante en el entorno.
  assert.equal(r.hijos.length, 1);
  assert.equal(r.hijos[0].entorno, '[x ↦ 3]');
  assert.equal(r.hijos[0].valor, false);
});

test('tema 10, diap. 5: ∀x ∃y R(x, y) es V, completa, con testigos 1→3, 2→1, 3→2', () => {
  const r = evaluarTexto(tema10d5, '∀x ∃y R(x, y)', {});
  assert.equal(r.valor, true);
  soloCampo(r, 'completa');
  assert.equal(r.completa, true);
  assert.equal(r.razon, 'Comprobación completa: ∃y R(x, y) es V para x ↦ 1, 2 y 3');
  // Un hijo por cada elemento de 𝒟, en orden, y cada uno con su testigo.
  assert.equal(r.hijos.length, 3);
  assert.deepEqual(r.hijos.map((h) => h.entorno), ['[x ↦ 1]', '[x ↦ 2]', '[x ↦ 3]']);
  assert.deepEqual(r.hijos.map((h) => h.testigo.elemento), ['3', '1', '2']);
  r.hijos.forEach((h) => {
    soloCampo(h, 'testigo');
    assert.equal(h.hijos.length, 1);
  });
  assert.equal(r.hijos[0].hijos[0].entorno, '[x ↦ 1, y ↦ 3]');
});

test('tema 10, diap. 5: ∀x ∀y (P(x) → R(x, y)) es F con x ↦ 1 y, dentro, y ↦ 1', () => {
  const r = evaluarTexto(tema10d5, '∀x ∀y (P(x) → R(x, y))', {});
  assert.equal(r.valor, false);
  soloCampo(r, 'contraejemplo');
  assert.deepEqual(r.contraejemplo, { variable: 'x', elemento: '1' });
  assert.equal(r.hijos.length, 1);
  const dentro = r.hijos[0];
  soloCampo(dentro, 'contraejemplo');
  assert.deepEqual(dentro.contraejemplo, { variable: 'y', elemento: '1' });
  assert.equal(dentro.hijos.length, 1);
  // P(1) es V y R(1, 1) es F: V → F.
  assert.equal(dentro.hijos[0].entorno, '[x ↦ 1, y ↦ 1]');
  assert.equal(dentro.hijos[0].razon, 'Es falsa porque el lado izquierdo es V y el derecho es F');
});

test('tema 10, diap. 7: ∃y Q(i, y) es V con testigo y ↦ a (nodo completo)', () => {
  const r = evaluarTexto(tema10, '∃y Q(i, y)', {});
  assert.deepEqual(r, {
    formula: '∃y Q(i, y)',
    valor: true,
    regla: '∃',
    razon: 'Testigo: con y ↦ a, Q(i, y) es V',
    entorno: '[]',
    hijos: [{
      formula: 'Q(i, y)', valor: true, regla: 'atómica',
      razon: 'Q(i, y) con y ↦ a, i = a: (a, a) ∈ Qᴵ', entorno: '[y ↦ a]', hijos: [],
    }],
    testigo: { variable: 'y', elemento: 'a' },
  });
});

test('tema 10, diap. 7: ∀x ∀y ∀z ((Q(x, y) ∧ Q(x, z)) → y = z) es F con x ↦ a, y ↦ a, z ↦ b', () => {
  const r = evaluarTexto(tema10, '∀x ∀y ∀z ((Q(x, y) ∧ Q(x, z)) → y = z)', {});
  assert.equal(r.valor, false);
  // Bajamos por los tres ∀: cada uno con un solo hijo y su contraejemplo.
  const casos = [];
  let n = r;
  for (let k = 0; k < 3; k++) {
    soloCampo(n, 'contraejemplo');
    assert.equal(n.hijos.length, 1);
    casos.push(n.contraejemplo);
    n = n.hijos[0];
  }
  assert.deepEqual(casos, [
    { variable: 'x', elemento: 'a' }, { variable: 'y', elemento: 'a' }, { variable: 'z', elemento: 'b' },
  ]);
  assert.equal(n.entorno, '[x ↦ a, y ↦ a, z ↦ b]');
  assert.equal(n.valor, false);
});

test('tema 10, diap. 7: ∀x ∃y Q(x, y) es V, completa', () => {
  const r = evaluarTexto(tema10, '∀x ∃y Q(x, y)', {});
  assert.equal(r.valor, true);
  soloCampo(r, 'completa');
  assert.equal(r.hijos.length, 3);
  // Primer testigo de cada x: a → a, b → c, c → c.
  assert.deepEqual(r.hijos.map((h) => h.testigo.elemento), ['a', 'c', 'c']);
});

test('tema 11, diap. 8c: ∃x ∀y P(x, y) es F, completa, y cada x falla con y ↦ 0', () => {
  const r = evaluarTexto(tema11, '∃x ∀y P(x, y)', {});
  assert.equal(r.valor, false);
  soloCampo(r, 'completa');
  assert.equal(r.razon, 'Comprobación completa: ∀y P(x, y) es F para x ↦ 0, 1 y 2');
  assert.equal(r.hijos.length, 3);
  r.hijos.forEach((h) => {
    soloCampo(h, 'contraejemplo');
    assert.deepEqual(h.contraejemplo, { variable: 'y', elemento: '0' });
    assert.equal(h.hijos.length, 1);
  });
});

test('tema 11, diap. 10: ∀x P(x) → ∀x Q(x) es V pero ∀x (P(x) → Q(x)) es F', () => {
  // 𝒟 = {1, 2}, Pᴵ = {1}, Qᴵ = {2}: no hay implicación semántica.
  const datos = conPyQ('1', '2');

  const premisa = evaluarTexto(datos, '∀x P(x) → ∀x Q(x)', {});
  assert.equal(premisa.valor, true);
  assert.equal(premisa.razon, 'Es verdadera porque el lado izquierdo es F');
  // Los dos ∀ fallan: contraejemplos x ↦ 2 (P) y x ↦ 1 (Q).
  assert.deepEqual(premisa.hijos.map((h) => h.contraejemplo.elemento), ['2', '1']);

  const conclusion = evaluarTexto(datos, '∀x (P(x) → Q(x))', {});
  assert.equal(conclusion.valor, false);
  soloCampo(conclusion, 'contraejemplo');
  assert.deepEqual(conclusion.contraejemplo, { variable: 'x', elemento: '1' });
  assert.equal(conclusion.hijos.length, 1);
});

test('tema 11, diap. 13b: ∀x (P(x) ∨ Q(x)) → (∀x P(x) ∨ ∀x Q(x)) es F', () => {
  const r = evaluarTexto(conPyQ('1', '2'), '∀x (P(x) ∨ Q(x)) → (∀x P(x) ∨ ∀x Q(x))', {});
  assert.equal(r.valor, false);
  const [izq, der] = r.hijos;
  assert.equal(izq.valor, true);
  soloCampo(izq, 'completa');
  assert.equal(izq.hijos.length, 2);
  assert.equal(der.valor, false);
});

test('tema 11, diap. 13a: es V en todas las interpretaciones con 𝒟 = {1, 2}', () => {
  const formula = '(∀x P(x) → ∃y Q(y)) → ∀x ∃y (P(x) → Q(y))';
  const subconjuntos = ['1', '2', '1, 2']; // las relaciones vacías no se permiten
  for (const P of subconjuntos) {
    for (const Q of subconjuntos) {
      assert.equal(evaluarTexto(conPyQ(P, Q), formula, {}).valor, true, `P = {${P}}, Q = {${Q}}`);
    }
  }
  // Una Q vacía no llega a evaluarse: da error de relación.
  const { firma } = validarLenguaje({ funciones: [], predicados: [{ nombre: 'P', aridad: 1 }, { nombre: 'Q', aridad: 1 }] });
  const r = validarInterpretacion(firma, { dominioTexto: '1, 2', relaciones: { P: '1', Q: '' } });
  assert.equal(r.errores.length, 1);
  assert.equal(r.errores[0].categoria, 'relación');
});

test('variable libre y ligada con el mismo nombre: P(x) ∧ ∃x ¬P(x) con x ↦ 1', () => {
  const r = evaluarTexto(tema10d5, 'P(x) ∧ ∃x ¬P(x)', { x: '1' });
  assert.equal(r.valor, true);
  const [libre, existe] = r.hijos;
  // La x libre usa el entorno: x ↦ 1.
  assert.equal(libre.entorno, '[x ↦ 1]');
  assert.equal(libre.valor, true);
  // Dentro del ∃ se usa la variante l[x ↦ a]; el testigo es 3.
  soloCampo(existe, 'testigo');
  assert.deepEqual(existe.testigo, { variable: 'x', elemento: '3' });
  assert.equal(existe.hijos.length, 1);
  assert.equal(existe.hijos[0].entorno, '[x ↦ 3]');
});

test('los nodos sin cuantificador no tienen testigo, contraejemplo ni completa', () => {
  const r = evaluarTexto(tema11, 'P(x, y) ∧ ¬R(x)', { x: '0', y: '2' });
  const revisar = (n) => {
    soloCampo(n, null);
    n.hijos.forEach(revisar);
  };
  revisar(r);
});
