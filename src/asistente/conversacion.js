/**
 * Estado del chat en el navegador: mensajes, consulta pendiente, errores y consumo.
 * Cada envío usa un número de revisión. Cancelar o borrar cambia ese número
 * para impedir que una respuesta tardía reaparezca en la conversación.
 */
import { acotarHistorial, validarConsulta } from './contrato.js';

/**
 * Crea una conversación de teoría independiente del ejercicio abierto.
 * @param {{fetchImpl?: Function, alCambiar?: Function, esperaMs?: number}} [opciones]
 *   alCambiar recibe el estado al actualizarse; esperaMs es el plazo de cada envío
 * @returns {{estado: object, limpiar: Function, cancelar: Function, enviar: Function}}
 *   enviar devuelve Promise<boolean>: true solo si agregó un intercambio completo
 */
export function crearConversacion({ fetchImpl = fetch, alCambiar = () => {}, esperaMs = 25000 } = {}) {
  let revision = 0;
  let control;
  const estado = { mensajes: [], pendiente: '', error: '', aviso: '', consumo: null };
  const notificar = () => alCambiar(estado);

  /** Invalida la petición actual y la aborta, conservando los mensajes ya recibidos. */
  function cancelar() {
    revision++;
    control?.abort();
    control = null;
    estado.pendiente = '';
  }

  return {
    estado,
    /** Cancela lo pendiente y borra mensajes, error y consumo. */
    limpiar() {
      cancelar();
      estado.mensajes = [];
      estado.error = '';
      estado.consumo = null;
      estado.aviso = 'Conversación borrada.';
      notificar();
    },
    cancelar() {
      cancelar();
      estado.aviso = 'Consulta cancelada. Puedes editar la pregunta y volver a enviarla.';
      notificar();
    },
    /** Valida, envía solo el historial reciente y guarda el par pregunta/respuesta si llega a tiempo. */
    async enviar(pregunta) {
      if (estado.pendiente) return false;
      const datos = { pregunta, historial: acotarHistorial(estado.mensajes) };
      try { validarConsulta(datos); }
      catch (error) { estado.error = error.message; notificar(); return false; }
      const actual = ++revision;
      const abortador = new AbortController();
      control = abortador;
      let tiempoAgotado = false;
      const tiempo = setTimeout(() => { tiempoAgotado = true; abortador.abort(); }, esperaMs);
      estado.pendiente = pregunta.trim();
      estado.error = '';
      estado.aviso = '';
      notificar();
      try {
        const respuesta = await fetchImpl('/api/chat', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos), signal: abortador.signal,
        });
        if (actual !== revision) return false;
        let resultado;
        try { resultado = await respuesta.json(); }
        catch { throw new Error('El asistente no está disponible. Comprueba que el servidor esté iniciado e inténtalo de nuevo.'); }
        if (!respuesta.ok) {
          const espera = resultado.error?.reintentarEn;
          throw new Error((resultado.error?.mensaje || 'No se pudo responder. Inténtalo de nuevo.')
            + (Number.isFinite(espera) && espera > 0 ? ` Espera ${Math.ceil(espera)} segundos.` : ''));
        }
        if (!['respondido', 'sin_evidencia', 'solo_teoria'].includes(resultado.estado)
          || typeof resultado.respuesta !== 'string' || !resultado.respuesta.trim() || resultado.respuesta.length > 12000) {
          throw new Error('La respuesta recibida no es válida. Vuelve a intentarlo.');
        }
        if (actual !== revision) return false;
        estado.mensajes.push({ role: 'user', content: pregunta.trim() }, { role: 'assistant', content: resultado.respuesta });
        estado.mensajes = estado.mensajes.slice(-20);
        estado.consumo = resultado.consumo;
        return true;
      } catch (error) {
        if (actual === revision) estado.error = tiempoAgotado
          ? 'La consulta tardó demasiado. Puedes volver a enviarla.'
          : error.name === 'AbortError' ? 'La consulta se canceló.'
            : error instanceof TypeError ? 'No se pudo conectar al asistente. Revisa la conexión y el servidor.' : error.message;
        return false;
      } finally {
        clearTimeout(tiempo);
        if (actual === revision) { control = null; estado.pendiente = ''; notificar(); }
      }
    },
  };
}
