/**
 * Carga del corpus: colección local de textos que puede consultar el tutor.
 * Solo se ejecuta en Node. Lee el inventario y sus transcripciones Markdown;
 * los PDF originales no se abren durante una consulta.
 */
import { readFile } from 'node:fs/promises';
import { leerDocumento } from './corpus.js';

const DIRECTORIO_TEORIA = new URL('../../teoria/', import.meta.url);

/**
 * Valida el inventario, lee sus archivos y reúne todas sus secciones.
 * @param {URL} [directorio]  directorio con fuentes.json y los Markdown, terminado en /
 * @returns {Promise<object[]>} fragmentos con contenido, palabras clave y referencia de origen
 * @throws {Error} si el inventario o algún documento no tienen el formato esperado
 */
export async function cargarCorpus(directorio = DIRECTORIO_TEORIA) {
  const fuentes = JSON.parse(await readFile(new URL('fuentes.json', directorio), 'utf8'));
  const ids = new Set();
  for (const fuente of fuentes) {
    if (!/^tema-\d{2}$/.test(fuente.id) || ids.has(fuente.id)
      || !/^[a-z0-9-]+\.md$/.test(fuente.contenido)
      || !Number.isSafeInteger(fuente.paginas) || fuente.paginas < 1) {
      throw new Error('El inventario de fuentes tiene una entrada inválida o repetida.');
    }
    ids.add(fuente.id);
  }
  const documentos = await Promise.all(fuentes.map(async (fuente) => {
    const markdown = await readFile(new URL(fuente.contenido, directorio), 'utf8');
    return leerDocumento(fuente, markdown);
  }));
  return documentos.flat();
}
