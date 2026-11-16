/**
 * Evaluación en un hilo separado del que dibuja la página.
 * Recibe el estado del ejercicio y devuelve resultado, tabla y errores.
 * Los errores se convierten en objetos simples para conservar categoría,
 * mensaje y posición al enviarlos a la interfaz.
 */
import { evaluarEntrada } from './modelo.js';

self.onmessage = ({ data }) => {
  const { resultado, tablaCuantificadores, errores } = evaluarEntrada(data);
  self.postMessage({ resultado, tablaCuantificadores, errores: Object.fromEntries(Object.entries(errores).map(([seccion, lista]) =>
    [seccion, lista.map((e) => ({ categoria: e.categoria, message: e.message, pos: e.pos }))])) });
};
