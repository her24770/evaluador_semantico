import { cargarCorpus } from '../src/asistente/cargar-corpus.js';
import { crearBuscador } from '../src/asistente/busqueda.js';

const pregunta = process.argv.slice(2).join(' ').trim();
if (!pregunta) {
  console.log('Uso: npm run buscar:teoria -- "¿Qué es una variable libre?"');
  process.exitCode = 1;
} else {
  try {
    const buscar = crearBuscador(await cargarCorpus());
    const resultados = buscar(pregunta);
    console.log('Fragmentos relacionados con la consulta (sin IA):');
    if (!resultados.length) console.log('No se encontraron coincidencias en la teoría.');
    for (const resultado of resultados) {
      console.log(`\n${resultado.titulo} [${resultado.tipo}]`);
      console.log(resultado.fuente.titulo);
      console.log(resultado.contenido);
    }
  } catch (error) {
    console.error(`No se pudo consultar la teoría: ${error.message}`);
    process.exitCode = 1;
  }
}
