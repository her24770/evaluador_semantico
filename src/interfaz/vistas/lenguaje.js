import { escapar, panel, erroresHTML } from '../componentes/comunes.js';

function declaraciones(lista, tipo) {
  const funcional = tipo === 'funciones';
  const singular = funcional ? 'función' : 'predicado';
  return `<p class="ayuda">${funcional ? 'La aridad indica cuántos argumentos recibe. Una constante tiene aridad 0.' : 'Declara cada relación y el número de elementos de sus tuplas.'}</p>
    <div class="declaraciones">${lista.length ? lista.map((s, i) => `<div class="fila-simbolo">
      <label for="nombre-${s.id}">Nombre ${i + 1}<input id="nombre-${s.id}" data-tipo="${tipo}" data-id="${s.id}" data-campo="nombre" value="${escapar(s.nombre)}" placeholder="${funcional ? 'f, c, suma' : 'P, R, Menor'}" spellcheck="false" autocomplete="off"></label>
      <label for="aridad-${s.id}">Aridad<input id="aridad-${s.id}" type="number" min="${funcional ? 0 : 1}" step="1" data-tipo="${tipo}" data-id="${s.id}" data-campo="aridad" value="${escapar(s.aridad)}"></label>
      <button type="button" class="quitar" data-action="quitar-simbolo" data-tipo="${tipo}" data-id="${s.id}" aria-label="Quitar ${singular} ${escapar(s.nombre || i + 1)}">×</button>
    </div>`).join('') : `<p class="vacio">Aún no has declarado ${funcional ? 'funciones ni constantes' : 'predicados'}.</p>`}</div>
    <button type="button" class="boton secundario" data-action="agregar-simbolo" data-tipo="${tipo}">+ Añadir ${singular}</button>`;
}

export function firmaHTML(revision) {
  if (revision.errores.lenguaje.length) return '<p class="ayuda">Corrige la declaración para construir la firma.</p>';
  const lista = (mapa) => mapa.size ? `{ ${[...mapa].map(([n, a]) => `${escapar(n)}/${a}`).join(', ')} }` : '∅';
  return `<p class="etiqueta">FUNCIONES Y CONSTANTES</p><p class="expresion">${lista(revision.firma.funciones)}</p>
    <p class="etiqueta">PREDICADOS</p><p class="expresion">${lista(revision.firma.predicados)}</p>`;
}

export function lenguaje(estado, revision) {
  return `<div class="rejilla-configuracion"><div class="columna-configuracion">
    ${panel('Funciones y constantes', declaraciones(estado.funciones, 'funciones'))}
    ${panel('Predicados', declaraciones(estado.predicados, 'predicados'))}
    <div id="errores-lenguaje" aria-live="polite">${erroresHTML(revision.errores.lenguaje, 'lenguaje')}</div>
    </div>${panel('Firma del lenguaje', `<div id="firma-resumen">${firmaHTML(revision)}</div><div class="nota"><h3>Símbolos lógicos</h3><p class="expresion">¬ ∧ ∨ → ↔ ∀ ∃ =</p></div>`, 'panel-datos')}</div>`;
}
