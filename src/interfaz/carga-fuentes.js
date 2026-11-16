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

async function cargarFuentes(fuentes) {
  if (!fuentes?.load) return false;
  try {
    const caras = await Promise.all(FUENTES.map((fuente) => fuentes.load(fuente)));
    // Una lista vacía significa que no existe una @font-face coincidente.
    if (caras.some((lista) => !lista.length)) return false;
    await fuentes.ready;
    return true;
  } catch {
    return false;
  }
}

async function esperarCarga(carga, tiempoMaximo) {
  let temporizador;
  try {
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

export async function esperarFuentes({ fuentes = globalThis.document?.fonts, tiempoMaximo = 2000 } = {}) {
  return esperarCarga(cargarFuentes(fuentes), tiempoMaximo);
}

export async function prepararFuentes(app, { fuentes = app.ownerDocument.fonts, tiempoMaximo = 2000 } = {}) {
  const raiz = app.ownerDocument.documentElement;
  raiz.dataset.fuentes = 'cargando';
  const carga = cargarFuentes(fuentes).then((listas) => {
    // También se actualiza si las fuentes llegan después del primer render.
    raiz.dataset.fuentes = listas ? 'listas' : 'alternativas';
    return listas;
  });
  // Una red lenta no bloquea la interfaz ni impide usar las fuentes al llegar.
  await esperarCarga(carga, tiempoMaximo);
  app.removeAttribute('aria-busy');
  app.removeAttribute('inert');
}
