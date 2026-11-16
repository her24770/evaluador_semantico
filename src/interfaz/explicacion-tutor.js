/**
 * Explorador local de los pasos calculados por el evaluador.
 * Una pila guarda el camino hasta el paso abierto: entrar añade un hijo
 * y volver lo retira. La explicación combina la regla general con la razón
 * del cálculo, sin hacer otra evaluación ni enviar el ejercicio a la IA.
 */
import { describirPaso, paginarHijos } from '../asistente/explicacion.js';
import { escapar } from './componentes/comunes.js';

/**
 * Activa la navegación por los pasos y su paginación.
 * @param {HTMLElement} destino  contenedor de la pestaña de resultado del tutor
 * @returns {{actualizar: Function}} recibe un resultado o null; reinicia el camino si cambia el resultado
 */
export function montarExplicacionTutor(destino) {
  let resultado;
  let pila = [];
  let pagina = 0;
  /** Dibuja el paso actual y sus hijos, o indica que primero se necesita una evaluación. */
  function pintar(enfocar = false) {
    if (!resultado) {
      destino.innerHTML = `<div class="tutor-sin-resultado"><h3>Primero, evalúa tu fórmula</h3>
        <p>Esta pestaña explica el resultado y los pasos calculados por el algoritmo. No utiliza IA.</p>
        <button type="button" class="boton secundario" data-chat="ir-evaluar">Ir a la fórmula</button></div>`;
      return;
    }
    const actual = pila.at(-1) ?? resultado;
    const paso = describirPaso(actual);
    const hijos = paginarHijos(actual, pagina);
    destino.innerHTML = `<div class="tutor-resultado-resumen"><p class="asistente-formula">${escapar(resultado.formula)}</p>
      <p>Resultado del algoritmo: <strong>${resultado.valor ? 'Verdadero' : 'Falso'}</strong></p></div>
      <div class="tutor-paso-cabecera"><h3 id="tutor-paso-titulo" tabindex="-1">${escapar(paso.regla)}</h3>
        ${pila.length ? '<button type="button" class="enlace" data-paso="volver">Volver al paso anterior</button>' : ''}</div>
      <p class="tutor-regla">${escapar(paso.definicion)}</p>
      <div class="tutor-paso"><p class="asistente-formula">${escapar(paso.formula)} · ${paso.valor ? 'Verdadero' : 'Falso'}</p>
        <p>${escapar(paso.razon)}</p>
        ${paso.evidencia ? `<p><strong>${paso.evidencia.tipo}:</strong> <span class="mono">${escapar(paso.evidencia.variable)} ↦ ${escapar(paso.evidencia.elemento)}</span></p>` : ''}
        ${paso.completa ? '<p>El algoritmo comprobó todos los elementos del dominio para este cuantificador.</p>' : ''}
        <p class="asistente-nota">Entorno de este paso: <span class="mono">${escapar(paso.entorno)}</span></p></div>
      ${hijos.total ? `<h4 class="tutor-subpasos-titulo">Explorar sus pasos</h4>
        <p class="asistente-nota">Se muestran los pasos devueltos por el algoritmo. Un testigo o contraejemplo puede decidir el resultado sin mostrar todos los casos.</p>
        <ul class="tutor-subpasos">${hijos.hijos.map((hijo, i) => `<li><button type="button" data-paso="abrir" data-indice="${hijos.inicio + i}">
          <span class="mono">${escapar(hijo.formula)}</span><span>${hijo.valor ? 'Verdadero' : 'Falso'}</span><span class="asistente-nota mono">${escapar(hijo.entorno)}</span><span class="tutor-ver-paso">Ver paso →</span></button></li>`).join('')}</ul>
        ${hijos.paginas > 1 ? `<div class="tutor-paginacion"><button type="button" class="boton secundario" data-paso="pagina" data-pagina="${hijos.actual - 1}" ${hijos.actual ? '' : 'disabled'}>Anteriores</button>
          <span>${hijos.inicio + 1}–${hijos.inicio + hijos.hijos.length} de ${hijos.total}</span>
          <button type="button" class="boton secundario" data-paso="pagina" data-pagina="${hijos.actual + 1}" ${hijos.actual + 1 === hijos.paginas ? 'disabled' : ''}>Siguientes</button></div>` : ''}` : ''}
      <p class="asistente-nota tutor-origen">Explicación local construida con reglas y pasos del evaluador. No envía el ejercicio a OpenAI ni consume créditos.</p>`;
    if (enfocar) destino.querySelector('#tutor-paso-titulo').focus({ preventScroll: true });
  }
  destino.addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-paso]');
    if (!boton || boton.disabled) return;
    if (boton.dataset.paso === 'volver') { pila.pop(); pagina = 0; }
    if (boton.dataset.paso === 'abrir') {
      const actual = pila.at(-1) ?? resultado;
      const hijo = actual?.hijos[Number(boton.dataset.indice)];
      if (!hijo) return;
      pila.push(hijo); pagina = 0;
    }
    if (boton.dataset.paso === 'pagina') pagina = Number(boton.dataset.pagina);
    pintar(true);
  });
  return {
    actualizar(nuevo) {
      if (nuevo === resultado) return;
      resultado = nuevo;
      pila = []; pagina = 0;
      pintar();
    },
  };
}
