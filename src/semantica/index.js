/**
 * MÓDULO DE SEMÁNTICA — punto de entrada (docs/CONTRATO.md §4).
 * La interfaz importa desde aquí:
 *   import { validarInterpretacion, validarEntorno, evaluar } from '../semantica/index.js';
 *
 * Orden de uso: validarInterpretacion → validarEntorno → evaluar.
 * Solo se llama evaluar si los dos primeros devuelven errores: [] (requerimiento 7).
 */
export { validarInterpretacion } from './interpretacion.js';
export { validarEntorno } from './entorno.js';
export { evaluar } from './evaluador.js';
