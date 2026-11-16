/** Solo estos mensajes controlados pueden salir del servidor. */
export class ErrorAsistente extends Error {
  constructor(codigo, mensaje, estado = 500, reintentarEn) {
    super(mensaje);
    this.codigo = codigo;
    this.estado = estado;
    this.reintentarEn = reintentarEn;
  }
}
