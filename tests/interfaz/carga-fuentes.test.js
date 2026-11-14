import test from 'node:test';
import assert from 'node:assert/strict';
import { esperarFuentes } from '../../src/interfaz/carga-fuentes.js';

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
