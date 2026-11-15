import test from 'node:test';
import assert from 'node:assert/strict';
import { crearEstado, evaluarEntrada, revisarEntrada, invalidarResultado, seccionPendiente } from '../../src/interfaz/modelo.js';
import { formula, accionesFormulaHTML } from '../../src/interfaz/vistas/formula.js';
import { resultados } from '../../src/interfaz/vistas/resultados.js';

function ejercicio(texto = '∀x P(x)') {
  return { ...crearEstado(), formula: texto, dominioTexto: '1, 2, 3',
    predicados: [{ nombre: 'P', aridad: 1, relacion: '1, 2' }] };
}

function evaluar(estado) {
  const revision = evaluarEntrada(estado);
  estado.resultado = revision.resultado;
  estado.tablaCuantificadores = revision.tablaCuantificadores;
  estado.evaluacionSolicitada = true;
  return revision;
}

test('Fórmula se dedica a edición y sintaxis incluso con una evaluación previa', () => {
  const estado = ejercicio();
  const revision = evaluar(estado);
  const html = formula(estado, revision);
  assert.match(html, /<textarea[^>]+id="formula"/);
  assert.match(html, /Variables libres:/);
  assert.match(html, /arbol-sintactico/);
  for (const simbolo of ['¬', '∧', '∨', '→', '∀', '∃', '(', ')']) {
    assert.ok(html.includes(`data-simbolo="${simbolo}"`));
  }
  assert.doesNotMatch(html, /data-valor-verdad|Tabla de cuantificadores|Evaluación paso a paso|dictamen-contenedor/);
});

test('Resultados es de consulta y prioriza las razones antes de la tabla exhaustiva', () => {
  const estado = ejercicio();
  const html = resultados(estado, evaluar(estado));
  assert.match(html, /Fórmula evaluada/);
  assert.match(html, /∀x P\(x\)/);
  assert.match(html, /data-action="editar-formula"/);
  assert.match(html, /data-valor-verdad>FALSO/);
  assert.match(html, /Contraejemplo: con x ↦ 3/);
  assert.match(html, /Interpretación y entorno utilizados/);
  assert.ok(html.indexOf('Evaluación paso a paso') < html.indexOf('Tabla de cuantificadores'));
  assert.doesNotMatch(html, /<textarea|data-action="insertar"|arbol-sintactico|casos-preview/);
});

for (const [texto, entorno, etiqueta, pendiente] of [
  ['∀x P(x)', {}, 'Evaluar fórmula', null],
  ['P(x)', {}, 'Asignar variables libres', 'entorno'],
  ['P(x)', { x: '9' }, 'Asignar variables libres', 'entorno'],
  ['P(x)', { x: '2' }, 'Evaluar fórmula', null],
  ['P(x) ∧ ∃x P(x)', { x: '1' }, 'Evaluar fórmula', null],
]) {
  test(`la acción de ${texto} con ${JSON.stringify(entorno)} dirige a ${pendiente ?? 'evaluación'}`, () => {
    const estado = { ...ejercicio(texto), entorno };
    const revision = revisarEntrada(estado);
    assert.equal(seccionPendiente(revision), pendiente);
    const html = accionesFormulaHTML(revision);
    assert.ok(html.includes(etiqueta));
    assert.doesNotMatch(html, /disabled/);
  });
}

test('faltas de interpretación se corrigen antes de pedir las asignaciones', () => {
  const estado = { ...ejercicio('P(x)'), dominioTexto: '' };
  const revision = revisarEntrada(estado);
  assert.equal(seccionPendiente(revision), 'interpretacion');
  assert.match(accionesFormulaHTML(revision), /Revisar interpretación/);
});

test('sintaxis o firma inválidas impiden la acción del editor y muestran su sección pendiente', () => {
  const estado = ejercicio('∀x P(');
  let revision = revisarEntrada(estado);
  assert.equal(seccionPendiente(revision), 'formula');
  assert.match(accionesFormulaHTML(revision), /disabled/);
  estado.predicados.push({ nombre: 'P', aridad: 2 });
  revision = revisarEntrada(estado);
  assert.equal(seccionPendiente(revision), 'lenguaje');
  assert.match(accionesFormulaHTML(revision), /disabled/);
});

test('regresar al editor conserva las entradas y consultar no cambia la evaluación', () => {
  const estado = { ...ejercicio('P(x) ∧ ∃x P(x)'), entorno: { x: '1' } };
  const revision = evaluar(estado);
  const copia = structuredClone(estado);
  formula(estado, revision);
  resultados(estado, revision);
  assert.deepEqual(estado, copia);
  invalidarResultado(estado);
  assert.equal(estado.resultado, null);
  assert.equal(estado.tablaCuantificadores, null);
  assert.deepEqual(estado.entorno, copia.entorno);
  assert.equal(estado.formula, copia.formula);
});

test('una evaluación en curso permite volver a su pantalla sin reiniciarla', () => {
  const revision = revisarEntrada(ejercicio());
  const html = accionesFormulaHTML(revision, true);
  assert.match(html, /data-action="navegar" data-seccion="resultados"/);
  assert.doesNotMatch(html, /data-action="evaluar"/);
});

test('Resultados no presenta resultados previos durante carga, interrupción o entrada inválida', () => {
  const estado = ejercicio();
  const revision = evaluar(estado);
  for (const [r, ocupado, fallo] of [[revision, true, ''], [revision, false, 'Cancelaste la evaluación.'],
    [{ ...revision, valido: false }, false, '']]) {
    const html = resultados(estado, r, ocupado, fallo);
    assert.doesNotMatch(html, /data-valor-verdad|Tabla de cuantificadores|Evaluación paso a paso/);
  }
  assert.match(resultados(estado, revision, true), /Cancelar evaluación/);
  assert.match(resultados(estado, revision, false, 'Cancelaste la evaluación.'), /Reintentar evaluación/);
});

test('Resultados sin evaluación conserva una salida clara hacia el editor', () => {
  const estado = crearEstado();
  const html = resultados(estado, revisarEntrada(estado));
  assert.match(html, /Sin evaluar/);
  assert.match(html, /Ingresar fórmula/);
  assert.doesNotMatch(html, /data-valor-verdad|<textarea|Tabla de cuantificadores/);
});

test('la fórmula de consulta y los datos de interpretación se escapan', () => {
  const estado = { ...ejercicio('P('), dominioTexto: '<img>, b' };
  estado.formula = '<script>';
  const html = resultados(estado, revisarEntrada(estado));
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /&lt;img&gt;/);
  assert.doesNotMatch(html, /<script>|<img>/);
});
