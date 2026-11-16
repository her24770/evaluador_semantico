import test from 'node:test';
import assert from 'node:assert/strict';
import { esperarFuentes, prepararFuentes } from '../../src/interfaz/carga-fuentes.js';

test('espera la descarga de las fuentes y la actualización de la disposición', async () => {
  let terminarDisposicion;
  const ready = new Promise((resolver) => { terminarDisposicion = resolver; });
  let termino = false;
  const pendiente = esperarFuentes({ fuentes: { load: async () => [{}], ready } }).then((resultado) => {
    termino = true;
    return resultado;
  });
  await new Promise((resolver) => setTimeout(resolver, 0));
  assert.equal(termino, false);
  terminarDisposicion();
  assert.equal(await pendiente, true);
});

test('una fuente que falla o no está declarada permite usar las alternativas', async () => {
  assert.equal(await esperarFuentes({ fuentes: { load: () => Promise.reject(new Error('Sin conexión')) } }), false);
  assert.equal(await esperarFuentes({ fuentes: { load: async () => [], ready: Promise.resolve() } }), false);
});

test('una descarga que no termina no bloquea el arranque', async () => {
  const resultado = await esperarFuentes({ fuentes: { load: () => new Promise(() => {}) }, tiempoMaximo: 10 });
  assert.equal(resultado, false);
});

test('sin la API de fuentes la interfaz puede usar fuentes del sistema', async () => {
  assert.equal(await esperarFuentes({ fuentes: null }), false);
});

function appDePrueba() {
  const atributos = new Set(['aria-busy', 'inert']);
  return {
    ownerDocument: { documentElement: { dataset: {} } },
    removeAttribute: (nombre) => atributos.delete(nombre),
    hasAttribute: (nombre) => atributos.has(nombre),
  };
}

test('una descarga tardía recupera las fuentes sin recargar ni bloquear la interfaz', async () => {
  const app = appDePrueba();
  let completar;
  let descargas = 0;
  const descarga = new Promise((resolver) => { completar = resolver; });
  const fuentes = { load: () => { descargas++; return descarga; }, ready: Promise.resolve() };
  await prepararFuentes(app, { fuentes, tiempoMaximo: 10 });
  assert.equal(app.hasAttribute('aria-busy'), false);
  assert.equal(app.hasAttribute('inert'), false);
  assert.equal(app.ownerDocument.documentElement.dataset.fuentes, 'cargando');
  completar([{}]);
  await new Promise((resolver) => setImmediate(resolver));
  assert.equal(app.ownerDocument.documentElement.dataset.fuentes, 'listas');
  assert.equal(descargas, 8, 'No se reinicia la descarga después del límite');
});

test('el primer render espera las fuentes cuando terminan dentro del límite', async () => {
  const app = appDePrueba();
  let completar;
  const descarga = new Promise((resolver) => { completar = resolver; });
  const pendiente = prepararFuentes(app, { fuentes: { load: () => descarga, ready: Promise.resolve() } });
  assert.equal(app.hasAttribute('inert'), true);
  completar([{}]);
  await pendiente;
  assert.equal(app.ownerDocument.documentElement.dataset.fuentes, 'listas');
  assert.equal(app.hasAttribute('aria-busy'), false);
});

test('un fallo de fuentes libera la interfaz', async () => {
  const app = appDePrueba();
  await prepararFuentes(app, { fuentes: { load: () => Promise.reject(new Error('Sin conexión')) } });
  assert.equal(app.ownerDocument.documentElement.dataset.fuentes, 'alternativas');
  assert.equal(app.hasAttribute('inert'), false);
});
