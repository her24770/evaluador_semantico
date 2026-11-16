/**
 * Panel del tutor con dos formas de ayuda.
 * «Consultar teoría» usa la conversación con el servidor. «Entender mi resultado»
 * recorre localmente los pasos del evaluador. El panel permanece montado al
 * navegar entre secciones para conservar la conversación hasta recargar la página.
 */
import { crearConversacion } from '../asistente/conversacion.js';
import { MAX_PREGUNTA } from '../asistente/contrato.js';
import { montarExplicacionTutor } from './explicacion-tutor.js';

/** Devuelve la estructura del tutor, inicialmente oculta, con pestañas y formulario accesibles. */
export function asistenteHTML() {
  return `<aside id="asistente" class="asistente" aria-labelledby="asistente-titulo" hidden>
    <header class="asistente-cabecera"><h2 id="asistente-titulo" tabindex="-1">Tutor del curso</h2>
      <button type="button" class="boton secundario" data-chat="cerrar" aria-label="Cerrar tutor del curso">Cerrar</button></header>
    <div class="tutor-pestanas" role="tablist" aria-label="Tipo de ayuda">
      <button type="button" role="tab" id="tutor-tab-teoria" aria-controls="tutor-teoria" aria-selected="true" tabindex="0" data-tutor-vista="teoria"><span>Consultar teoría</span><small>Con IA</small></button>
      <button type="button" role="tab" id="tutor-tab-resultado" aria-controls="tutor-resultado" aria-selected="false" tabindex="-1" data-tutor-vista="resultado"><span>Entender mi resultado</span><small>Con el algoritmo</small></button>
    </div>
    <section id="tutor-teoria" role="tabpanel" aria-labelledby="tutor-tab-teoria">
      <p class="tutor-descripcion">Pregunta por los conceptos del curso. Para entender una fórmula evaluada, abre «Entender mi resultado».</p>
      <form id="chat-formulario" class="asistente-formulario">
        <label for="chat-pregunta">¿Qué quieres entender?</label>
        <textarea id="chat-pregunta" rows="2" maxlength="${MAX_PREGUNTA}" placeholder="Por ejemplo: ¿qué diferencia hay entre una variable libre y una ligada?" aria-describedby="chat-caracteres chat-privacidad"></textarea>
        <div class="asistente-envio"><span id="chat-caracteres">0 / ${MAX_PREGUNTA}</span>
          <button type="button" class="boton secundario" data-chat="cancelar" hidden>Cancelar consulta</button>
          <button type="submit" class="boton primario" id="chat-enviar" disabled>Consultar teoría</button></div>
        <p id="chat-estado" class="asistente-nota" role="status" aria-live="polite"></p>
        <p id="chat-error" class="asistente-error" role="alert" hidden></p>
        <p id="chat-privacidad" class="asistente-nota">La pregunta y el historial reciente se envían a OpenAI. Los datos del evaluador no se adjuntan. Las respuestas de IA pueden contener errores.</p>
      </form>
      <div id="chat-mensajes" class="asistente-mensajes" role="log" aria-label="Respuesta más reciente" aria-live="polite" aria-relevant="additions text"></div>
      <details id="chat-historial" class="tutor-historial" hidden><summary>Consultas anteriores</summary><div id="chat-anteriores"></div></details>
      <div class="tutor-pie"><p class="asistente-nota">Tu conversación se conserva al cambiar de pestaña o de ejercicio, hasta recargar.</p>
        <button type="button" class="enlace" data-chat="limpiar" hidden>Borrar conversación</button></div>
    </section>
    <section id="tutor-resultado" role="tabpanel" aria-labelledby="tutor-tab-resultado" hidden>
      <p class="tutor-descripcion">Lee lo que calculó el evaluador y explora la regla de cada paso. Esta explicación funciona sin IA.</p>
      <div id="tutor-explicacion"></div>
    </section>
  </aside>`;
}

/**
 * Conecta el panel, el chat y el explorador del resultado con sus eventos.
 * @param {HTMLElement} raiz  aplicación que ya contiene asistenteHTML y el botón para abrirlo
 * @returns {{actualizar: Function}} actualizar recibe el estado y entrega solo el resultado al explorador local
 */
export function montarAsistente(raiz) {
  const $ = (selector) => raiz.querySelector(selector);
  const panel = $('#asistente');
  const abrir = $('#abrir-asistente');
  const pregunta = $('#chat-pregunta');
  const log = $('#chat-mensajes');
  const explicacion = montarExplicacionTutor($('#tutor-explicacion'));
  let mensajesPintados = '';
  let vista = 'teoria';
  // Una cancelación o borrado cambia el turno para que un envío anterior no vacíe el nuevo borrador.
  let turno = 0;
  const conversacion = crearConversacion({ alCambiar: pintar });

  function texto(selector, valor) { $(selector).textContent = valor; }
  /** Crea una consulta y su respuesta usando textContent; el texto recibido no se interpreta como HTML. */
  function intercambio(usuario, respuesta) {
    const articulo = document.createElement('article');
    articulo.className = 'tutor-intercambio';
    const consulta = document.createElement('p');
    consulta.className = 'tutor-consulta';
    consulta.textContent = usuario;
    const titulo = document.createElement('h3');
    titulo.textContent = 'Respuesta de teoría';
    articulo.append(consulta, titulo);
    for (const parrafo of respuesta.split(/\n\s*\n/).filter(Boolean)) {
      const cuerpo = document.createElement('p');
      cuerpo.className = 'tutor-respuesta';
      cuerpo.textContent = parrafo;
      articulo.append(cuerpo);
    }
    return articulo;
  }
  /** Muestra la respuesta reciente, guarda las anteriores en el historial y actualiza los controles. */
  function pintar(estado = conversacion.estado) {
    const contenido = JSON.stringify(estado.mensajes);
    if (contenido !== mensajesPintados) {
      log.replaceChildren();
      $('#chat-anteriores').replaceChildren();
      if (estado.mensajes.length) {
        log.append(intercambio(estado.mensajes.at(-2).content, estado.mensajes.at(-1).content));
        for (let i = estado.mensajes.length - 4; i >= 0; i -= 2) {
          $('#chat-anteriores').append(intercambio(estado.mensajes[i].content, estado.mensajes[i + 1].content));
        }
      } else {
        const vacio = document.createElement('p');
        vacio.className = 'asistente-vacio';
        vacio.textContent = 'Aquí aparecerá tu respuesta. Puedes preguntar por variables, cuantificadores, interpretaciones o cualquier concepto del curso.';
        log.append(vacio);
      }
      const anteriores = estado.mensajes.length / 2 - 1;
      $('#chat-historial').hidden = anteriores <= 0;
      $('#chat-historial summary').textContent = `Consultas anteriores (${Math.max(0, anteriores)})`;
      mensajesPintados = contenido;
    }
    const ocupado = Boolean(estado.pendiente);
    pregunta.disabled = ocupado;
    $('#chat-enviar').disabled = ocupado || !pregunta.value.trim();
    $('[data-chat="cancelar"]').hidden = !ocupado;
    $('#chat-enviar').hidden = ocupado;
    $('[data-chat="limpiar"]').hidden = !estado.mensajes.length && !ocupado;
    texto('#chat-caracteres', `${pregunta.value.length} / ${MAX_PREGUNTA}`);
    texto('#chat-estado', ocupado ? 'Consultando la teoría… Puedes cambiar de pestaña mientras llega la respuesta.' : estado.aviso);
    texto('#chat-error', estado.error);
    $('#chat-error').hidden = !estado.error;
  }
  /** Sincroniza pestañas, panel visible y foco sin borrar consultas ni detener el chat. */
  function cambiarVista(nueva, enfocar = false) {
    if (!['teoria', 'resultado'].includes(nueva)) return;
    vista = nueva;
    for (const tab of panel.querySelectorAll('[role="tab"]')) {
      const activo = tab.dataset.tutorVista === nueva;
      tab.setAttribute('aria-selected', String(activo));
      tab.tabIndex = activo ? 0 : -1;
      $(`#${tab.getAttribute('aria-controls')}`).hidden = !activo;
      if (activo && enfocar) tab.focus();
    }
  }
  /** Oculta el tutor y devuelve el foco al botón que lo abre. */
  function cerrar() {
    panel.hidden = true;
    $('.pizarra').classList.remove('con-asistente');
    abrir.setAttribute('aria-expanded', 'false');
    abrir.focus({ preventScroll: true });
  }
  abrir.addEventListener('click', () => {
    if (!panel.hidden) { cerrar(); return; }
    panel.hidden = false;
    $('.pizarra').classList.add('con-asistente');
    abrir.setAttribute('aria-expanded', 'true');
    $('#asistente-titulo').focus({ preventScroll: true });
    panel.scrollIntoView({ block: 'start' });
  });
  panel.addEventListener('click', (evento) => {
    const tab = evento.target.closest('[data-tutor-vista]');
    if (tab) cambiarVista(tab.dataset.tutorVista);
    const accion = evento.target.closest('[data-chat]')?.dataset.chat;
    if (accion === 'cerrar') cerrar();
    if (accion === 'limpiar') { turno++; conversacion.limpiar(); pregunta.focus(); }
    if (accion === 'cancelar') { turno++; conversacion.cancelar(); pregunta.focus(); }
    if (accion === 'ir-evaluar') { cerrar(); $('#nav-formula').click(); }
  });
  panel.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') { evento.preventDefault(); cerrar(); }
    if (evento.target.matches('[role="tab"]') && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(evento.key)) {
      evento.preventDefault();
      cambiarVista(evento.key === 'Home' ? 'teoria' : evento.key === 'End' ? 'resultado' : vista === 'teoria' ? 'resultado' : 'teoria', true);
    }
    if (vista === 'teoria' && (evento.ctrlKey || evento.metaKey) && evento.key === 'Enter') {
      evento.preventDefault(); $('#chat-formulario').requestSubmit();
    }
  });
  pregunta.addEventListener('input', () => pintar());
  $('#chat-formulario').addEventListener('submit', async (evento) => {
    evento.preventDefault();
    if (conversacion.estado.pendiente) return;
    const actual = ++turno;
    const enviado = await conversacion.enviar(pregunta.value);
    if (actual !== turno) return;
    if (enviado) pregunta.value = '';
    pintar();
    const focoEnTeoria = $('#tutor-teoria').contains(document.activeElement) || document.activeElement === document.body;
    if (vista === 'teoria' && focoEnTeoria && !panel.hidden) pregunta.focus({ preventScroll: true });
  });

  pintar();
  return { actualizar(estado) { explicacion.actualizar(estado.resultado); } };
}
