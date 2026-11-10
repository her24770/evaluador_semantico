/**
 * Error que el programa muestra al usuario (no es un fallo del programa).
 * Lo usan los tres módulos para el requerimiento 7: una entrada con errores
 * nunca recibe valor de verdad.
 *
 * categoria: 'lenguaje' | 'sintaxis' | 'símbolo' | 'aridad'      (Sintaxis)
 *            'dominio' | 'función' | 'relación' | 'entorno'       (Semántica)
 * pos: posición del carácter en la fórmula donde está el error (si aplica).
 */
export class ErrorLogico extends Error {
  constructor(categoria, mensaje, pos) {
    super(mensaje);
    this.name = 'ErrorLogico';
    this.categoria = categoria;
    this.pos = pos;
  }
}
