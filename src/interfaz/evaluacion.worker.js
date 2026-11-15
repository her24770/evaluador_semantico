import { evaluarEntrada } from './modelo.js';

self.onmessage = ({ data }) => {
  const { resultado, tablaCuantificadores, errores } = evaluarEntrada(data);
  self.postMessage({ resultado, tablaCuantificadores, errores: Object.fromEntries(Object.entries(errores).map(([seccion, lista]) =>
    [seccion, lista.map((e) => ({ categoria: e.categoria, message: e.message, pos: e.pos }))])) });
};
