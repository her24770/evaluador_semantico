/**
 * Error previsto del asistente, con un mensaje que se puede mostrar al usuario.
 * http.js reconoce esta clase y publica sus datos; para cualquier otro error
 * responde con un mensaje genérico en lugar de exponer detalles internos.
 */
export class ErrorAsistente extends Error {
  /**
   * @param {string} codigo  identificador del tipo de fallo
   * @param {string} mensaje  explicación para el usuario
   * @param {number} [estado]  código de estado HTTP; por defecto 500
   * @param {number} [reintentarEn]  segundos de espera antes de volver a consultar
   */
  constructor(codigo, mensaje, estado = 500, reintentarEn) {
    super(mensaje);
    this.codigo = codigo;
    this.estado = estado;
    this.reintentarEn = reintentarEn;
  }
}
