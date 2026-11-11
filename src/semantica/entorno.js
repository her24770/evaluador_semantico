/**
 * Entornos (requerimientos 4 y 7, tema 11).
 *
 * Un entorno l le da a cada variable un elemento de 𝒟. Se guarda como un
 * objeto { x: 'a', y: 'b' }. Solo hace falta para las variables libres:
 * las ligadas reciben su valor de ∀ y ∃ con la variante l[x ↦ a].
 */
import { ErrorLogico } from '../sintaxis/index.js';

/**
 * Revisa que cada variable libre tenga un valor en 𝒟. Las variables de más se ignoran.
 *   validarEntorno(['x'], { x: '2', z: '9' }, ['1', '2', '3']) → { errores: [], entorno: { x: '2' } }
 *
 * @param {string[]} libres        variables libres de la fórmula (de variablesLibres)
 * @param {Object<string, string>} entorno   lo que escribió el usuario
 * @param {string[]} dominio
 * @returns {{errores: ErrorLogico[], entorno: Object<string, string>}}
 */
export function validarEntorno(libres, entorno, dominio) {
  const errores = [];
  const limpio = {};
  const enDominio = new Set(dominio);

  for (const variable of libres) {
    const valor = String(entorno?.[variable] ?? '').trim();
    if (valor === '') {
      errores.push(new ErrorLogico('entorno', `La variable libre ${variable} no tiene valor en el entorno.`));
    } else if (!enDominio.has(valor)) {
      errores.push(new ErrorLogico('entorno', `El valor de ${variable} es "${valor}", que no está en 𝒟.`));
    } else {
      limpio[variable] = valor;
    }
  }
  return { errores, entorno: limpio };
}

/**
 * La variante l[x ↦ a]: igual que l, pero x vale a. Devuelve un entorno NUEVO
 * y no cambia l. Si x ya estaba, conserva su lugar; si no, va al final.
 *   variante({ x: 'c', y: 'a' }, 'x', 'b') → { x: 'b', y: 'a' }
 *
 * @param {Object<string, string>} l
 * @param {string} x
 * @param {string} a
 * @returns {Object<string, string>}
 */
export function variante(l, x, a) {
  return { ...l, [x]: a };
}

/**
 * Escribe el entorno como en los apuntes, en el orden en que las variables recibieron valor.
 *   entornoACadena({ x: '1', y: '3' }) → '[x ↦ 1, y ↦ 3]'      entornoACadena({}) → '[]'
 *
 * @param {Object<string, string>} l
 * @returns {string}
 */
export function entornoACadena(l) {
  return `[${Object.entries(l).map(([x, a]) => `${x} ↦ ${a}`).join(', ')}]`;
}
