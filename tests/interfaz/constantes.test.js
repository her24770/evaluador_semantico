// Constantes declaradas aparte de las funciones. Para sintaxis y semántica siguen siendo funciones de aridad 0.
import test from 'node:test';
import assert from 'node:assert/strict';
import { validarLenguaje } from '../../src/sintaxis/index.js';
import { crearEstado, revisarEntrada, evaluarEntrada } from '../../src/interfaz/modelo.js';
import { lenguaje, firmaHTML } from '../../src/interfaz/vistas/lenguaje.js';
import { interpretacion } from '../../src/interfaz/vistas/interpretacion.js';
import { resumenInterpretacionHTML } from '../../src/interfaz/componentes/resumen.js';

function ejercicio(extra = {}) {
  return { ...crearEstado(), formula: 'P(c) ∧ f(c) = d', dominioTexto: '1, 2',
    constantes: [{ id: 'c1', nombre: 'c', valor: '1' }, { id: 'c2', nombre: 'd', valor: '2' }],
    funciones: [{ id: 'f1', nombre: 'f', aridad: '1', tabla: { 1: '2', 2: '1' } }],
    predicados: [{ id: 'p1', nombre: 'P', aridad: '1', relacion: '1' }], ...extra };
}

test('validarLenguaje acepta constantes aparte y las pone en la firma con aridad 0', () => {
  const { errores, firma } = validarLenguaje({ constantes: [{ nombre: 'c' }, { nombre: '0' }], funciones: [{ nombre: 'f', aridad: 1 }], predicados: [] });
  assert.deepEqual(errores, []);
  assert.deepEqual([...firma.funciones], [['c', 0], ['0', 0], ['f', 1]]);
  assert.match(validarLenguaje({ constantes: [{ nombre: '' }], funciones: [], predicados: [] }).errores[0].message, /^Constante #1: falta el nombre/);
  assert.match(validarLenguaje({ constantes: [{ nombre: 'f' }], funciones: [{ nombre: 'f', aridad: 1 }], predicados: [] }).errores[0].message, /más de una vez/);
});

test('se evalúa con el valor elegido para cada constante', () => {
  const revision = evaluarEntrada(ejercicio());
  assert.deepEqual(Object.values(revision.errores).flat(), []);
  assert.equal(revision.resultado.valor, true);
  assert.equal(evaluarEntrada(ejercicio({ formula: 'P(d)' })).resultado.valor, false);
});

test('una constante sin valor, o con un valor que ya no está en 𝒟, da un error claro', () => {
  const sinValor = ejercicio();
  sinValor.constantes[0].valor = '';
  assert.match(revisarEntrada(sinValor).errores.interpretacion.map((e) => e.message).join(' '), /Falta el valor de la constante c/);
  assert.match(revisarEntrada(ejercicio({ dominioTexto: '2, 3' })).errores.interpretacion.map((e) => e.message).join(' '), /constante c/);
});

test('Lenguaje muestra tres paneles y las constantes no piden aridad', () => {
  const estado = ejercicio();
  const html = lenguaje(estado, revisarEntrada(estado));
  for (const titulo of ['Constantes', 'Funciones', 'Predicados']) assert.match(html, new RegExp(`<h2 class="titulo-tiza">${titulo}</h2>`));
  assert.match(html, /data-tipo="constantes" data-id="c1" data-campo="nombre"/);
  assert.doesNotMatch(html, /data-tipo="constantes"[^>]*data-campo="aridad"/);
  assert.match(html, /data-action="agregar-simbolo" data-tipo="constantes">\+ Añadir constante/);
  assert.match(html, /id="aridad-f1" type="number" min="1"/);
  const firma = firmaHTML(revisarEntrada(estado));
  assert.match(firma, /CONSTANTES<\/p><p class="expresion">\{ c, d \}/);
  assert.match(firma, /FUNCIONES<\/p><p class="expresion">\{ f\/1 \}/);
});

test('Interpretación elige el valor de cada constante en una línea', () => {
  const estado = ejercicio();
  const html = interpretacion(estado, revisarEntrada(estado), {});
  assert.match(html, /cᴵ =<\/label>\s*<select id="constante-c1" data-constante="c1">[\s\S]*?<option value="1" selected>/);
  assert.doesNotMatch(html, /data-tabla="c1"/);
  assert.match(resumenInterpretacionHTML(estado, revisarEntrada(estado)), /Constantes: c ↦ 1, d ↦ 2/);
});

test('las funciones de aridad 0 declaradas como antes siguen funcionando', () => {
  const estado = { ...crearEstado(), formula: 'P(c)', dominioTexto: '1, 2',
    funciones: [{ id: 'f1', nombre: 'c', aridad: '0', tabla: { '': '1' } }],
    predicados: [{ id: 'p1', nombre: 'P', aridad: '1', relacion: '1' }] };
  assert.equal(evaluarEntrada(estado).resultado.valor, true);
});
