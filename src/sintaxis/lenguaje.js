/**
 * Requerimiento 1: lenguaje configurable (tema 07).
 *
 * Símbolos no lógicos que declara el usuario:
 *   - símbolos funcionales con aridad n ≥ 0 (aridad 0 = constante individual)
 *   - predicados con aridad n ≥ 1
 * Los símbolos lógicos (variables, ¬ ∧ ∨ → ↔, ∀ ∃, =, paréntesis) son fijos.
 */
import { ErrorLogico } from './errores.js';

/** Nombres válidos: letras, dígitos, _ y ' (p. ej. f, P, suma, x1, x'). */
export const RE_NOMBRE = /^[\p{L}\p{N}_][\p{L}\p{N}_']*$/u;

/** Palabras que el teclado usa como ∀ y ∃, así que no pueden ser símbolos. */
export const RESERVADAS = new Set(['forall', 'paratodo', 'exists', 'existe']);

/**
 * Revisa la declaración del lenguaje y construye la firma.
 *
 * @param {{funciones: {nombre: string, aridad: number|string}[],
 *          predicados: {nombre: string, aridad: number|string}[]}} declaracion
 * @returns {{errores: ErrorLogico[],
 *            firma: {funciones: Map<string, number>, predicados: Map<string, number>}}}
 */
export function validarLenguaje(declaracion) {
  const errores = [];
  const funciones = new Map();
  const predicados = new Map();
  const usados = new Set();

  function revisar(lista, tipo, aridadMinima, destino) {
    lista.forEach((simbolo, i) => {
      const nombre = String(simbolo.nombre ?? '').trim();
      const etiqueta = `${tipo} #${i + 1}`;

      if (nombre === '') {
        errores.push(new ErrorLogico('lenguaje', `${etiqueta}: falta el nombre.`));
        return;
      }
      if (!RE_NOMBRE.test(nombre)) {
        errores.push(new ErrorLogico('lenguaje', `${etiqueta}: "${nombre}" solo puede tener letras, dígitos, _ y '.`));
        return;
      }
      if (/^\p{N}/u.test(nombre) && aridadMinima > 0) {
        errores.push(new ErrorLogico('lenguaje', `${etiqueta}: "${nombre}" no puede empezar con un dígito.`));
        return;
      }
      if (RESERVADAS.has(nombre.toLowerCase())) {
        errores.push(new ErrorLogico('lenguaje', `${etiqueta}: "${nombre}" es una palabra reservada.`));
        return;
      }
      if (usados.has(nombre)) {
        errores.push(new ErrorLogico('lenguaje', `El símbolo "${nombre}" está declarado más de una vez.`));
        return;
      }

      const textoAridad = String(simbolo.aridad ?? '').trim();
      const aridad = Number(textoAridad);
      if (textoAridad === '' || !Number.isInteger(aridad) || aridad < aridadMinima) {
        errores.push(new ErrorLogico('aridad', `${etiqueta} "${nombre}": la aridad debe ser un entero ≥ ${aridadMinima}.`));
        return;
      }

      usados.add(nombre);
      destino.set(nombre, aridad);
    });
  }

  revisar(declaracion.funciones ?? [], 'Símbolo funcional', 0, funciones);
  revisar(declaracion.predicados ?? [], 'Predicado', 1, predicados);
  return { errores, firma: { funciones, predicados } };
}
