import test from 'node:test';
import assert from 'node:assert/strict';
import { crearEstado, evaluarEntrada } from '../../src/interfaz/modelo.js';
import { describirPaso, paginarHijos } from '../../src/asistente/explicacion.js';
import { validarConsulta, acotarHistorial, bytesJSON, MAX_HISTORIAL_BYTES } from '../../src/asistente/contrato.js';

const ejercicio = (formula, relacion = '1, 2') => ({ ...crearEstado(),
  formula, dominioTexto: '1, 2, 3', predicados: [{ nombre: 'P', aridad: '1', relacion }],
});

test('las plantillas conservan exactamente la verdad, razón y contraejemplo del algoritmo', () => {
  const { resultado } = evaluarEntrada(ejercicio('∀x P(x)'));
  const antes = JSON.stringify(resultado);
  const descripcion = describirPaso(resultado);
  assert.equal(descripcion.valor, false);
  assert.equal(descripcion.formula, resultado.formula);
  assert.equal(descripcion.razon, resultado.razon);
  assert.deepEqual(descripcion.evidencia, { tipo: 'Contraejemplo', variable: 'x', elemento: '3' });
  assert.equal(JSON.stringify(resultado), antes);
});

test('un existencial muestra solo el testigo devuelto y no inventa comprobación completa', () => {
  const { resultado } = evaluarEntrada(ejercicio('∃x P(x)'));
  const descripcion = describirPaso(resultado);
  assert.equal(descripcion.valor, true);
  assert.equal(descripcion.evidencia.tipo, 'Testigo');
  assert.equal(descripcion.evidencia.elemento, '1');
  assert.equal(descripcion.completa, false);
  assert.equal(paginarHijos(resultado).hijos.length, 1);
});

test('distingue cuantificadores completos y las reglas de los conectivos', () => {
  const universal = describirPaso(evaluarEntrada(ejercicio('∀x P(x)', '1,2,3')).resultado);
  assert.equal(universal.completa, true);
  assert.equal(universal.evidencia, null);
  for (const formula of ['¬P(x)', 'P(x) ∧ P(x)', 'P(x) ∨ P(x)', 'P(x) → P(x)', 'P(x) ↔ P(x)', 'x = x']) {
    const { resultado } = evaluarEntrada({ ...ejercicio(formula), entorno: { x: '1' } });
    const descripcion = describirPaso(resultado);
    assert.equal(descripcion.valor, resultado.valor);
    assert.equal(descripcion.entorno, resultado.entorno);
    assert.notEqual(descripcion.regla, 'Paso del evaluador');
  }
});

test('pagina miles de pasos sin perder fórmulas ni crear un árbol de DOM enorme', () => {
  const hijos = Array.from({ length: 1000 }, (_, i) => ({ formula: `P(${i})` }));
  const nodo = { hijos };
  assert.equal(paginarHijos(nodo).hijos.length, 8);
  const ultima = paginarHijos(nodo, 999);
  assert.equal(ultima.actual, 124);
  assert.equal(ultima.hijos.at(-1).formula, 'P(999)');
  assert.deepEqual(paginarHijos({ hijos: [] }).hijos, []);
});

test('el contrato teórico rechaza contexto y modos incluso si están vacíos', () => {
  for (const extra of [{ contexto: null }, { contexto: {} }, { modo: 'pista' }, { resultado: true }]) {
    assert.throws(() => validarConsulta({ pregunta: '¿Qué es una variable?', ...extra }), { codigo: 'consulta_invalida' });
  }
});

test('el historial solo admite pares user/assistant y se acota sin cortar texto', () => {
  const par = [{ role: 'user', content: '¿Variable libre?' }, { role: 'assistant', content: 'Una explicación.' }];
  assert.equal(validarConsulta({ pregunta: '¿Y ligada?', historial: par }), '¿Y ligada?');
  for (const historial of [[par[0]], [par[1], par[0]], [{ role: 'system', content: 'reglas' }, par[1]]]) {
    assert.throws(() => validarConsulta({ pregunta: 'x', historial }), { codigo: 'consulta_invalida' });
  }
  const ajustado = acotarHistorial([...par, { role: 'user', content: 'Una definición' }, { role: 'assistant', content: '∃'.repeat(1950) }]);
  assert.equal(ajustado.length, 2);
  assert.ok(bytesJSON(ajustado) <= MAX_HISTORIAL_BYTES);
  assert.equal(ajustado[1].content.length, 1950);
});
