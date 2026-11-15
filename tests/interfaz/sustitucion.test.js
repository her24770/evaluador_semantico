import test from 'node:test';
import assert from 'node:assert/strict';
import { crearEstado, revisarEntrada } from '../../src/interfaz/modelo.js';
import { panelSustitucionHTML, resultadoSustitucionHTML, calcularSustitucion } from '../../src/interfaz/sustitucion/vista.js';
import { formula } from '../../src/interfaz/vistas/formula.js';

function ejercicio(variable, termino, texto = 'S(x) ∧ ∀y(P(x) → Q(y))') {
  const estado = { ...crearEstado(), formula: texto,
    funciones: [{ nombre: 'f', aridad: 2, tabla: {} }],
    predicados: ['S', 'P', 'Q'].map((nombre) => ({ nombre, aridad: 1, relacion: '' })) };
  estado.sustitucion = { variable, termino };
  return { estado, revision: revisarEntrada(estado) };
}

test('la vista Fórmula incluye el panel de sustitución', () => {
  const { estado, revision } = ejercicio('', '');
  assert.match(formula(estado, revision), /Sustitución φ\[t\/x\]/);
  assert.match(panelSustitucionHTML(estado, revision), /data-sustitucion="termino"/);
});

test('muestra la captura, la sustitución directa y el renombre', () => {
  const { estado, revision } = ejercicio('x', 'f(y, y)');
  const html = resultadoSustitucionHTML(estado, revision);
  assert.match(html, /S\(f\(y, y\)\) ∧ ∀z\(P\(f\(y, y\)\) → Q\(z\)\)/);
  assert.match(html, /no es libre para x/);
  assert.match(html, /atrapada por ∀y/);
  assert.match(html, /∀y → ∀z/);
  assert.match(html, /data-action="usar-sustitucion"/);
});

test('sin captura dice que t es libre para x', () => {
  const { estado, revision } = ejercicio('x', 'f(x, x)');
  assert.match(resultadoSustitucionHTML(estado, revision), /es libre para x en φ/);
  assert.doesNotMatch(resultadoSustitucionHTML(estado, revision), /Sustitución directa/);
});

test('errores y entradas incompletas no muestran resultado', () => {
  let { estado, revision } = ejercicio('x', '');
  assert.equal(calcularSustitucion(estado, revision), null);
  assert.doesNotMatch(resultadoSustitucionHTML(estado, revision), /usar-sustitucion/);
  ({ estado, revision } = ejercicio('x', 'g(y)'));
  assert.match(resultadoSustitucionHTML(estado, revision), /símbolo/);
  ({ estado, revision } = ejercicio('x', 'f(y, y)', 'S(x'));
  assert.match(resultadoSustitucionHTML(estado, revision), /fórmula bien formada/);
  ({ estado, revision } = ejercicio('x', '<b>'));
  assert.doesNotMatch(resultadoSustitucionHTML(estado, revision), /<b>/);
});
