/** Adaptador para Node: los PDF originales solo se necesitan al revisar la teoría. */
import { readFile } from 'node:fs/promises';
import { leerDocumento } from './corpus.js';

const DIRECTORIO_TEORIA = new URL('../../teoria/', import.meta.url);

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
