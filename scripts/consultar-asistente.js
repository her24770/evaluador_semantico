/**
 * Consulta de teoría desde la terminal al servidor local ya iniciado.
 *   npm run consultar:asistente -- "¿Qué es una variable libre?"
 * Muestra la respuesta y los datos de la consulta; ante un fallo, termina con código 1.
 */
const pregunta = process.argv.slice(2).join(' ').trim();
if (!pregunta) {
  console.log('Uso: npm run consultar:asistente -- "¿Qué es una variable libre?"');
  process.exitCode = 1;
} else {
  try {
    const respuesta = await fetch('http://127.0.0.1:3001/api/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pregunta }), signal: AbortSignal.timeout(25000),
    });
    const datos = await respuesta.json();
    if (!respuesta.ok) {
      console.error(datos.error?.mensaje ?? 'No se pudo completar la consulta.');
      if (datos.error?.reintentarEn) console.error(`Espera al menos ${datos.error.reintentarEn} segundos.`);
      process.exitCode = 1;
    } else {
      console.log(datos.respuesta);
      if (datos.temas.length) console.log(`\nTemas consultados: ${datos.temas.map((tema) => tema.titulo).join('; ')}`);
      if (datos.modelo) console.log(`Modelo: ${datos.modelo}`);
      if (datos.consumo) {
        console.log(`Tokens: ${datos.consumo.entrada} de entrada + ${datos.consumo.salida} de salida = ${datos.consumo.total} en total.`);
      }
    }
  } catch {
    console.error('No se pudo consultar al asistente. Comprueba que npm run dev:asistente esté activo.');
    process.exitCode = 1;
  }
}
