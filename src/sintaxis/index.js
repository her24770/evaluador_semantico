/**
 * MÓDULO DE SINTAXIS — punto de entrada.
 * Los otros módulos importan desde aquí:
 *   import { analizar, validarLenguaje, variablesLibres } from '../sintaxis/index.js';
 */
export { ErrorLogico } from './errores.js';
export { validarLenguaje, RE_NOMBRE, RESERVADAS } from './lenguaje.js';
export { tokenizar } from './lexer.js';
export { analizar } from './parser.js';
export { recorrerOcurrencias, variablesLibres, variablesLigadas, esCerrada } from './variables.js';
export { aCadena, aCadenaCompleta, terminoACadena } from './imprimir.js';
