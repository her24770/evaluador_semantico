import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { cargarCorpus } from '../../src/asistente/cargar-corpus.js';
import { crearBuscador, terminosDeBusqueda } from '../../src/asistente/busqueda.js';

const corpus = await cargarCorpus();
const buscar = crearBuscador(corpus);
const consultas = JSON.parse(await readFile(new URL('./consultas.json', import.meta.url), 'utf8'));

for (const { pregunta, fragmento } of consultas) {
  test(`recupera evidencia del curso: ${pregunta}`, () => {
    const resultados = buscar(pregunta, { limite: 3 });
    assert.ok(resultados.some((r) => r.id === fragmento),
      `Se esperaba ${fragmento}; se recuperaron ${resultados.map((r) => r.id).join(', ')}`);
    assert.ok(resultados.every((r) => r.contenido && r.fuente.original && r.puntuacion > 0));
  });
}

test('encuentra lo mismo con tildes, sin ellas y con Unicode descompuesto', () => {
  const ids = (consulta) => buscar(consulta).map((r) => r.id);
  assert.deepEqual(ids('¿Qué es una interpretación?'), ids('que es una interpretacion'));
  assert.deepEqual(ids('sustitución'), ids('sustitución'.normalize('NFD')));
});

test('conserva las distinciones entre los símbolos lógicos al buscar', () => {
  assert.deepEqual(terminosDeBusqueda('∀'), terminosDeBusqueda('para todo'));
  assert.deepEqual(terminosDeBusqueda('∃'), terminosDeBusqueda('existe'));
  assert.notDeepEqual(terminosDeBusqueda('∀'), terminosDeBusqueda('∃'));
  assert.notDeepEqual(terminosDeBusqueda('='), terminosDeBusqueda('≠'));
});

test('una consulta ajena o vacía no devuelve fragmentos arbitrarios', () => {
  for (const consulta of ['', '   ', '¿Y qué?', '¿Cuál es la capital de Francia?', 'Receta de lasaña']) {
    assert.deepEqual(buscar(consulta), []);
  }
});

test('permite buscar dentro de un tema o únicamente ejercicios', () => {
  const resultados = buscar('ejercicio', { fuente: 'tema-08', tipo: 'ejercicio', limite: 2 });
  assert.equal(resultados.length, 2);
  assert.ok(resultados.every((r) => r.fuente.id === 'tema-08' && r.tipo === 'ejercicio'));
  assert.deepEqual(buscar('variable', { fuente: 'tema-inexistente' }), []);
});

test('valida el límite de resultados y no interpreta la consulta como código', () => {
  assert.throws(() => buscar(null), TypeError);
  for (const limite of [0, -1, 1.5, 11, Infinity]) {
    assert.throws(() => buscar('entorno', { limite }), RangeError);
  }
  assert.doesNotThrow(() => buscar('<script>alert(1)</script>'));
  assert.equal(buscar('fórmula', { limite: 1 }).length, 1);
});
