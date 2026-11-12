const FUENTES = [
  '400 16px "DM Sans"',
  '500 16px "DM Sans"',
  '600 16px "DM Sans"',
  '700 16px "DM Sans"',
  '400 16px "IBM Plex Mono"',
  '500 16px "IBM Plex Mono"',
  '700 16px "IBM Plex Mono"',
  '400 16px "Architects Daughter"',
];

export async function esperarFuentes({ fuentes = globalThis.document?.fonts, tiempoMaximo = 2000 } = {}) {
  if (!fuentes?.load) return false;
  let temporizador;
  try {
    const carga = Promise.all(FUENTES.map((fuente) => fuentes.load(fuente))).then(async (caras) => {
      // Una lista vacía significa que no existe una @font-face coincidente.
      if (caras.some((lista) => !lista.length)) return false;
      await fuentes.ready;
      return true;
    });
    const limite = new Promise((resolver) => {
      temporizador = setTimeout(() => resolver(false), tiempoMaximo);
    });
    return await Promise.race([carga, limite]);
  } catch {
    return false;
  } finally {
    clearTimeout(temporizador);
  }
}

export async function prepararFuentes(app) {
  const listas = await esperarFuentes();
  // Si se supera el límite, conservamos las fuentes del sistema durante esta
  // visita. Una descarga tardía no vuelve a cambiar la tipografía visible.
  app.ownerDocument.documentElement.dataset.fuentes = listas ? 'listas' : 'alternativas';
  app.removeAttribute('aria-busy');
  app.removeAttribute('inert');
}
