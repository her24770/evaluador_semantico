/** Lee secciones de Markdown sin depender de Node, Vite ni un proveedor de IA. */
export function leerDocumento(fuente, markdown) {
  const texto = markdown.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const [cabecera, ...secciones] = texto.split(/^## /m);
  if (!cabecera.split('\n').includes(`Fuente: ${fuente.id}`) || !secciones.length) {
    throw new Error(`El documento ${fuente.contenido} no declara su fuente o sus secciones.`);
  }
  const ids = new Set();
  return secciones.map((seccion) => {
    const [titulo, ...lineas] = seccion.split('\n');
    const metadatos = /^Páginas: ([\d, -]+)\nPalabras clave: (.+)\nTipo: (teoría|ejemplo|ejercicio)\n\n([\s\S]+)$/u
      .exec(lineas.join('\n').trim());
    if (!metadatos || !titulo.trim()) throw new Error(`Sección incompleta en ${fuente.contenido}: ${titulo}`);
    const [, referencia, claves, tipo, cuerpo] = metadatos;
    const paginas = leerPaginas(referencia, fuente.paginas);
    const id = `${fuente.id}-${paginas.join('-')}`;
    if (ids.has(id)) throw new Error(`Sección repetida: ${id}`);
    ids.add(id);
    return {
      id, titulo: titulo.trim(), contenido: cuerpo.trim(), tipo,
      palabrasClave: claves.split(';').map((clave) => clave.trim()), paginas,
      fuente: { id: fuente.id, titulo: fuente.titulo, archivo: fuente.archivo, original: fuente.original },
    };
  });
}

function leerPaginas(referencia, total) {
  const paginas = new Set();
  for (const parte of referencia.split(',')) {
    const rango = /^(\d+)(?:\s*-\s*(\d+))?$/.exec(parte.trim());
    if (!rango) throw new Error(`Referencia de páginas inválida: ${referencia}`);
    const inicio = Number(rango[1]);
    const fin = Number(rango[2] ?? rango[1]);
    if (inicio < 1 || fin < inicio || fin > total) {
      throw new Error(`Páginas fuera del documento: ${referencia}`);
    }
    for (let pagina = inicio; pagina <= fin; pagina++) paginas.add(pagina);
  }
  return [...paginas].sort((a, b) => a - b);
}
