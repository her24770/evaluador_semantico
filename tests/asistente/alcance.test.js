import test from 'node:test';
import assert from 'node:assert/strict';
import { solicitaEvaluacion, respuestaParaEvaluacion, EXPLICAR_RESULTADO, SOLO_TEORIA } from '../../src/asistente/alcance.js';

test('permite conceptos generales sin bloquear preguntas sobre reglas de evaluación', () => {
  for (const pregunta of ['¿Qué es una variable libre?', '¿Cómo funciona el cuantificador universal?',
    '¿Por qué una implicación con antecedente falso es verdadera?', '¿Qué es un testigo?',
    '¿Qué diferencia hay entre satisfacibilidad y validez?', '¿Cómo se evalúa ∀ en una interpretación?',
    '¿Qué significa que una fórmula sea falsa?', '¿Por qué una fórmula puede ser verdadera en una interpretación y falsa en otra?',
    '¿Por qué la evaluación depende de la interpretación y del entorno?']) {
    assert.equal(solicitaEvaluacion(pregunta), false, pregunta);
  }
});

test('reconoce la pregunta reportada y variantes sobre un resultado concreto', () => {
  for (const pregunta of ['Por qué la evaluación de la fórmula es falsa?',
    '¿POR QUÉ LA EVALUACIÓN DE LA FÓRMULA ES FALSA?',
    'Por que la evaluacion de la formula es falsa?', '¿Por qué es falsa la fórmula?',
    '¿Por qué la fórmula es verdadera?', '¿Puedes explicarme el resultado de la evaluación?',
    'Explícame el resultado', '¿Cuál es el valor de verdad de la fórmula?']) {
    assert.equal(solicitaEvaluacion(pregunta), true, pregunta);
    assert.equal(respuestaParaEvaluacion(pregunta), EXPLICAR_RESULTADO, pregunta);
  }
});

test('orienta según se pide evaluar o entender un resultado sin solicitar datos en el chat', () => {
  assert.equal(respuestaParaEvaluacion('Evalúa la fórmula con IA'), SOLO_TEORIA);
  assert.match(SOLO_TEORIA, /Evaluar fórmula/);
  assert.match(EXPLICAR_RESULTADO, /Si aún no la has evaluado/);
  assert.match(EXPLICAR_RESULTADO, /pasos calculados por el algoritmo/);
});

test('intercepta fórmulas y peticiones explícitas, conservando la distinción teoría/ejercicio', () => {
  for (const pregunta of ['Evalúa mi fórmula', 'CALCULA EL VALOR', 'Resuelve el ejercicio', '¿Mi resultado es falso?',
    '∀x P(x)', 'Existe x: P(x)', 'Comprueba R(a,b)', 'Interpretación = {1,2}', '¿Por qué salió falso?']) {
    assert.equal(solicitaEvaluacion(pregunta), true, pregunta);
  }
});
