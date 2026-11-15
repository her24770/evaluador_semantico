// Sustitución φ[t/x] con los ejemplos y ejercicios del tema 08.
import test from 'node:test';
import assert from 'node:assert/strict';
import { validarLenguaje, analizar, analizarTermino, aCadena, prepararSustitucion, sustituir } from '../../src/sintaxis/index.js';
import { validarInterpretacion, evaluar } from '../../src/semantica/index.js';
import { valorDeTermino } from '../../src/semantica/terminos.js';
import { variante } from '../../src/semantica/entorno.js';

const { firma } = validarLenguaje({
  funciones: [{ nombre: 'f', aridad: 2 }, { nombre: 'h', aridad: 1 }, { nombre: 'g', aridad: 2 }, { nombre: 'c', aridad: 0 }],
  predicados: [{ nombre: 'P', aridad: 1 }, { nombre: 'Q', aridad: 1 }, { nombre: 'S', aridad: 1 }, { nombre: 'T', aridad: 2 }],
});
const sust = (formula, x, t, f = firma) => prepararSustitucion(analizar(formula, f), x, t, f);

test('tema 08, diap. 13: renombra la variable ligada que captura a y', () => {
  const r = sust('S(x) ∧ ∀y(P(x) → Q(y))', 'x', 'f(y, y)');
  assert.equal(aCadena(r.directa), 'S(f(y, y)) ∧ ∀y(P(f(y, y)) → Q(y))');
  assert.equal(aCadena(r.resultado), 'S(f(y, y)) ∧ ∀z(P(f(y, y)) → Q(z))');
  assert.equal(r.libre, false);
  assert.deepEqual(r.capturas, [{ cuantificador: '∀y', variable: 'y' }]);
  assert.deepEqual(r.renombres, [{ cuantificador: '∀', de: 'y', a: 'z' }]);
  assert.equal(r.reemplazos, 2);
});

test('tema 08, diap. 10: las ocurrencias ligadas de x no se tocan', () => {
  const a = sust('∀x((P(x) → Q(x)) ∧ T(x, y))', 'x', 'f(x, y)');
  assert.equal(aCadena(a.resultado), '∀x((P(x) → Q(x)) ∧ T(x, y))');
  assert.equal(a.reemplazos, 0);
  assert.equal(a.libre, true);

  const b = sust('(∀x(P(x) ∧ Q(x))) → (¬P(x) ∨ Q(y))', 'x', 'f(x, y)');
  assert.equal(aCadena(b.resultado), '∀x(P(x) ∧ Q(x)) → ¬P(f(x, y)) ∨ Q(y)');
  assert.equal(b.reemplazos, 1);
  assert.equal(b.libre, true);
});

test('tema 08, ejercicio 2', () => {
  const lengua = validarLenguaje({
    funciones: [{ nombre: 'f', aridad: 1 }, { nombre: 'g', aridad: 2 }],
    predicados: [{ nombre: 'P', aridad: 2 }, { nombre: 'Q', aridad: 2 }],
  }).firma;
  const phi = '∃x(P(y, z) ∧ ∀y(¬Q(y, x) ∨ P(y, z)))';
  const casos = [
    ['w', 'x', '∃x(P(y, z) ∧ ∀y(¬Q(y, x) ∨ P(y, z)))', true],
    ['w', 'y', '∃x(P(w, z) ∧ ∀y(¬Q(y, x) ∨ P(y, z)))', true],
    ['f(x)', 'y', '∃w(P(f(x), z) ∧ ∀y(¬Q(y, w) ∨ P(y, z)))', false],
    ['g(y, z)', 'z', '∃x(P(y, g(y, z)) ∧ ∀w(¬Q(w, x) ∨ P(w, g(y, z))))', false],
  ];
  for (const [t, x, esperado, libre] of casos) {
    const r = sust(phi, x, t, lengua);
    assert.equal(aCadena(r.resultado), esperado, `φ[${t}/${x}]`);
    assert.equal(r.libre, libre, `¿${t} es libre para ${x}?`);
  }
  // b. Los tres términos son libres para x (x no tiene ocurrencias libres).
  for (const t of ['w', 'f(x)', 'g(y, z)']) assert.equal(sust(phi, 'x', t, lengua).libre, true);
  // c. Para y: w y g(y, z) sí; f(x) no.
  assert.deepEqual(['w', 'f(x)', 'g(y, z)'].map((t) => sust(phi, 'y', t, lengua).libre), [true, false, true]);
});

test('la variable nueva no choca con variables, símbolos ni otras renombradas', () => {
  // z, w, u, v, s y r ya están ocupadas: debe usar z1.
  const r = sust('∀y(P(x) ∧ T(z, w) ∧ T(u, v) ∧ T(s, r))', 'x', 'h(y)');
  assert.equal(aCadena(r.resultado), '∀z1(P(h(y)) ∧ T(z, w) ∧ T(u, v) ∧ T(s, r))');
  // Dos capturas distintas usan dos variables nuevas distintas.
  const dos = sust('∀y ∃w T(x, y)', 'x', 'f(y, w)');
  assert.equal(aCadena(dos.resultado), '∀z ∃u T(f(y, w), z)');
  // Un símbolo declarado (f, c, …) nunca se usa como variable nueva.
  const { firma: conZ } = validarLenguaje({ funciones: [{ nombre: 'z', aridad: 0 }], predicados: [{ nombre: 'P', aridad: 2 }] });
  assert.equal(aCadena(sust('∀y P(x, y)', 'x', 'y', conZ).resultado), '∀w P(y, w)');
});

test('si x no está libre, φ[t/x] es φ', () => {
  const r = sust('∀x P(x)', 'x', 'c');
  assert.equal(aCadena(r.resultado), '∀x P(x)');
  assert.equal(r.reemplazos, 0);
  assert.equal(aCadena(sust('P(y)', 'x', 'c').resultado), 'P(y)');
});

test('no hay captura si la x libre no está dentro del cuantificador', () => {
  const r = sust('P(x) ∧ ∀y Q(y)', 'x', 'h(y)');
  assert.equal(aCadena(r.resultado), 'P(h(y)) ∧ ∀y Q(y)');
  assert.equal(r.libre, true);
});

test('errores: x debe ser variable y t un término del lenguaje', () => {
  assert.throws(() => sust('P(x)', '', 'c'), { categoria: 'sustitución' });
  assert.throws(() => sust('P(x)', 'c', 'x'), { categoria: 'sustitución', message: /no una variable/ });
  assert.throws(() => sust('P(x)', 'x', ''), { categoria: 'sintaxis', message: /término está vacío/ });
  assert.throws(() => sust('P(x)', 'x', 'k(y)'), { categoria: 'símbolo' });
  assert.throws(() => sust('P(x)', 'x', 'h(y, y)'), { categoria: 'aridad' });
  assert.throws(() => sust('P(x)', 'x', 'P(y)'), { categoria: 'símbolo' });
  assert.throws(() => sust('P(x)', 'x', 'h(y) z'), { categoria: 'sintaxis', message: /término ya estaba completo/ });
  assert.throws(() => sust('P(x)', 'forall', 'c'), { categoria: 'sintaxis' });
  assert.equal(analizarTermino(' f(x, c) ', firma).tipo, 'fun');
});

test('no cambia la fórmula original', () => {
  const ast = analizar('S(x) ∧ ∀y(P(x) → Q(y))', firma);
  const copia = structuredClone(ast);
  sustituir(ast, 'x', analizarTermino('f(y, y)', firma));
  assert.deepEqual(ast, copia);
});

test('lema de sustitución: ℐ ⊨ₗ φ[t/x] si y solo si ℐ ⊨ l[x ↦ tᴵ] φ', () => {
  const { firma: f2 } = validarLenguaje({
    funciones: [{ nombre: 'h', aridad: 1 }, { nombre: 'c', aridad: 0 }],
    predicados: [{ nombre: 'P', aridad: 1 }, { nombre: 'T', aridad: 2 }],
  });
  const { interpretacion, errores } = validarInterpretacion(f2, {
    dominioTexto: '0, 1, 2',
    funciones: { h: { 0: '1', 1: '2', 2: '2' }, c: { '': '0' } },
    relaciones: { P: '1', T: '(0, 1), (1, 2), (2, 0), (2, 2)' },
  });
  assert.deepEqual(errores, []);
  const formulas = ['∀y T(x, y)', '∃y(T(y, x) ∧ P(y))', '∀y ∃z(T(x, z) → T(z, y))', 'P(x) ∨ ∃y(T(x, y) ∧ ∀x P(x))'];
  const terminos = ['y', 'h(y)', 'h(z)', 'c', 'x', 'h(h(y))'];
  let probados = 0;
  for (const texto of formulas) {
    const phi = analizar(texto, f2);
    for (const textoT of terminos) {
      const t = analizarTermino(textoT, f2);
      const { resultado } = sustituir(phi, 'x', t, { reservados: ['h', 'c', 'P', 'T'] });
      for (const vx of ['0', '1', '2']) for (const vy of ['0', '1', '2']) for (const vz of ['0', '1', '2']) {
        const l = { x: vx, y: vy, z: vz };
        const izquierda = evaluar(resultado, interpretacion, l).valor;
        const derecha = evaluar(phi, interpretacion, variante(l, 'x', valorDeTermino(t, interpretacion, l))).valor;
        assert.equal(izquierda, derecha, `${texto} [${textoT}/x] con ${JSON.stringify(l)}`);
        probados++;
      }
    }
  }
  assert.ok(probados > 500);
});
