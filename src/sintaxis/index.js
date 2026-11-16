/**
 * MÓDULO DE SINTAXIS — punto de entrada.
 * Los otros módulos importan desde aquí:
 *   import { analizar, validarLenguaje, variablesLibres } from '../sintaxis/index.js';
 */
export { ErrorLogico } from './errores.js';
export { validarLenguaje, RE_NOMBRE, RESERVADAS } from './lenguaje.js';
export { tokenizar } from './lexer.js';
export { analizar, analizarTermino } from './parser.js';
export { sustituir, prepararSustitucion } from './sustitucion.js';
export { recorrerOcurrencias, variablesLibres, variablesLigadas, esCerrada } from './variables.js';
export { aCadena, aCadenaCompleta, terminoACadena } from './imprimir.js';
export { normalizarFormula, simbolosNoDeclarados } from './normalizar.js';
