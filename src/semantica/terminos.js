/**
 * Valor de un término (tema 11, diap. 6).
 *
 * Para saber a qué elemento de 𝒟 se refiere un término:
 *   - una variable x vale l(x), su valor en el entorno;
 *   - f(t₁, …, tₙ) vale fᴵ(a₁, …, aₙ), donde aᵢ es el valor de tᵢ.
 *     Una constante c es una función sin argumentos: vale cᴵ.
 */
import { ErrorLogico } from '../sintaxis/index.js';
import { claveDeTupla } from './lectura.js';

/**
 * Calcula el elemento de 𝒟 al que se refiere el término t.
 *   valorDeTermino(s(s(x)), ℐ, { x: '0' }) → '2'     (si s(x) = x + 1 mod 3)
 *
 * @param {{tipo: 'var', nombre: string} | {tipo: 'fun', nombre: string, args: object[]}} t  término del AST
 * @param {{funciones: Map<string, Map<string, string>>}} interpretacion  ya validada
 * @param {Object<string, string>} entorno  ya validado
 * @returns {string}
 */
export function valorDeTermino(t, interpretacion, entorno) {
  if (t.tipo === 'var') {
    // Caso variable: se busca en el entorno l.
    if (!Object.hasOwn(entorno, t.nombre)) {
      throw new ErrorLogico('entorno', `La variable ${t.nombre} no tiene valor en el entorno.`, t.pos);
    }
    return entorno[t.nombre];
  }

  // Caso función o constante: primero los argumentos (de adentro hacia afuera), luego la tabla de fᴵ.
  const argumentos = t.args.map((arg) => valorDeTermino(arg, interpretacion, entorno));
  const clave = claveDeTupla(argumentos);
  const tabla = interpretacion.funciones.get(t.nombre);
  if (!tabla || !tabla.has(clave)) {
    throw new ErrorLogico('función', `${t.nombre} no tiene valor para (${argumentos.join(', ')}).`, t.pos);
  }
  return tabla.get(clave);
}
