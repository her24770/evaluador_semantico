import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { cargarCorpus } from '../../src/asistente/cargar-corpus.js';
import { leerDocumento } from '../../src/asistente/corpus.js';

const base = new URL('../../teoria/', import.meta.url);
const fuentes = JSON.parse(await readFile(new URL('fuentes.json', base), 'utf8'));
const corpus = await cargarCorpus();

test('incluye únicamente los temas 01–14 y no omite ninguna de sus 293 diapositivas', () => {
  assert.deepEqual(fuentes.map((f) => f.id), Array.from({ length: 14 }, (_, i) => `tema-${String(i + 1).padStart(2, '0')}`));
  assert.equal(corpus.length, 293);
  assert.equal(new Set(corpus.map((f) => f.id)).size, corpus.length);
  for (const fuente of fuentes) {
    const paginas = corpus.filter((f) => f.fuente.id === fuente.id).flatMap((f) => f.paginas);
    assert.deepEqual(paginas, Array.from({ length: fuente.paginas }, (_, i) => i + 1));
  }
});

test('verifica las copias locales de PDF cuando están disponibles', async (t) => {
  let archivos;
  try {
    archivos = await readdir(new URL('pdf/', base));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    t.skip('Los PDF son un respaldo local opcional y no se incluyen en Git.');
    return;
  }
  assert.equal(archivos.filter((archivo) => archivo.endsWith('.pdf')).length, 14);
  for (const fuente of fuentes) {
    const pdf = await readFile(new URL(fuente.original, base));
    assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
    assert.equal(createHash('sha256').update(pdf).digest('hex'), fuente.sha256, fuente.archivo);
  }
});

test('conserva ejercicios, demostraciones y el final de los temas, no solo definiciones', () => {
  const texto = (id) => corpus.find((f) => f.id === id).contenido;
  assert.match(texto('tema-07-24'), /árboles/);
  assert.match(texto('tema-08-7'), /∃𝑥\s*\(𝑃\(𝑦, 𝑧\)/u);
  assert.match(texto('tema-08-13'), /∀𝑧/);
  assert.match(texto('tema-08-9'), /𝜙\[𝑡\/𝑥\]/u);
  assert.match(texto('tema-11-7'), /⊨_\{𝑙\[𝑥⟼𝑎\]\}/u);
  assert.match(texto('tema-02-48'), /demostración/);
  assert.match(texto('tema-13-13'), /AP7/);
  assert.match(texto('tema-14-39'), /consistente y completa/);
  assert.equal(corpus.filter((f) => f.tipo === 'ejercicio').length > 10, true);
});

const fuentePrueba = { id: 'tema-01', contenido: 'prueba.md', paginas: 3 };
const documentoPrueba = (paginas = '1') => `# Prueba\n\nFuente: tema-01\n\n## Definición\nPáginas: ${paginas}\nPalabras clave: definición\nTipo: teoría\n\nLa sustitución conserva ∀ y ∃.\n`;

test('el lector conserva tildes y símbolos sin reformular el contenido', () => {
  const fragmentos = leerDocumento(fuentePrueba, '\uFEFF' + documentoPrueba().replace(/\n/g, '\r\n'));
  assert.equal(fragmentos[0].contenido, 'La sustitución conserva ∀ y ∃.');
  assert.deepEqual(fragmentos[0].paginas, [1]);
});

test('rechaza referencias inválidas, páginas repetidas y documentos sin fuente', () => {
  for (const rango of ['0', '4', '3-1', '1,', '1--2']) {
    assert.throws(() => leerDocumento(fuentePrueba, documentoPrueba(rango)));
  }
  const parte = documentoPrueba().split('## ')[1];
  assert.throws(() => leerDocumento(fuentePrueba, documentoPrueba() + '\n## ' + parte));
  assert.throws(() => leerDocumento(fuentePrueba, documentoPrueba().replace('Fuente: tema-01', '')));
});
