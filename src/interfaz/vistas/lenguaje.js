/**
 * Vista para declarar los símbolos del lenguaje y su aridad.
 * La firma indica qué nombres son constantes, funciones o predicados y cuántos
 * argumentos reciben. Aquí se construyen los campos; sintaxis valida las declaraciones.
 */
import { escapar, panel, erroresHTML } from '../componentes/comunes.js';

// Las constantes se declaran solo con nombre; para sintaxis y semántica son funciones de aridad 0.
const TIPOS = {
  constantes: {
    singular: 'constante', plural: 'constantes', placeholder: 'c, a, 0',
    ayuda: 'Una constante nombra un elemento fijo del dominio. Solo necesita un nombre.',
  },
  funciones: {
    singular: 'función', plural: 'funciones', placeholder: 'f, g, suma', aridadMinima: 1,
    ayuda: 'La aridad indica cuántos argumentos recibe (1 o más).',
  },
  predicados: {
    singular: 'predicado', plural: 'predicados', placeholder: 'P, R, Menor', aridadMinima: 1,
    ayuda: 'Declara cada relación y el número de elementos de sus tuplas.',
  },
};

/** Dibuja una lista editable de símbolos; las constantes solo piden nombre. */
function declaraciones(lista, tipo) {
  const t = TIPOS[tipo];
  const conAridad = t.aridadMinima !== undefined;
  return `<p class="ayuda">${t.ayuda}</p>
    <div class="declaraciones">${lista.length ? lista.map((s, i) => `<div class="fila-simbolo${conAridad ? '' : ' sin-aridad'}">
      <label for="nombre-${s.id}">Nombre ${i + 1}<input id="nombre-${s.id}" data-tipo="${tipo}" data-id="${s.id}" data-campo="nombre" value="${escapar(s.nombre)}" placeholder="${t.placeholder}" spellcheck="false" autocomplete="off"></label>
      ${conAridad ? `<label for="aridad-${s.id}">Aridad<input id="aridad-${s.id}" type="number" min="${t.aridadMinima}" step="1" data-tipo="${tipo}" data-id="${s.id}" data-campo="aridad" value="${escapar(s.aridad)}"></label>` : ''}
      <button type="button" class="quitar" data-action="quitar-simbolo" data-tipo="${tipo}" data-id="${s.id}" aria-label="Quitar ${t.singular} ${escapar(s.nombre || i + 1)}">×</button>
    </div>`).join('') : `<p class="vacio">Aún no has declarado ${t.plural}.</p>`}</div>
    <button type="button" class="boton secundario" data-action="agregar-simbolo" data-tipo="${tipo}">+ Añadir ${t.singular}</button>`;
}

/** Resume la firma validada: constantes por nombre y funciones o predicados como nombre/aridad. */
export function firmaHTML(revision) {
  if (revision.errores.lenguaje.length) return '<p class="ayuda">Corrige la declaración para construir la firma.</p>';
  const simbolos = [...revision.firma.funciones];
  const constantes = simbolos.filter(([, a]) => a === 0).map(([n]) => escapar(n));
  const lista = (pares) => pares.length ? `{ ${pares.map(([n, a]) => `${escapar(n)}/${a}`).join(', ')} }` : '∅';
  return `<p class="etiqueta">CONSTANTES</p><p class="expresion">${constantes.length ? `{ ${constantes.join(', ')} }` : '∅'}</p>
    <p class="etiqueta">FUNCIONES</p><p class="expresion">${lista(simbolos.filter(([, a]) => a > 0))}</p>
    <p class="etiqueta">PREDICADOS</p><p class="expresion">${lista([...revision.firma.predicados])}</p>`;
}

/** Devuelve la vista completa con declaraciones, errores y resumen de la firma. */
export function lenguaje(estado, revision) {
  return `<div class="rejilla-configuracion"><div class="columna-configuracion">
    ${panel('Constantes', declaraciones(estado.constantes, 'constantes'))}
    ${panel('Funciones', declaraciones(estado.funciones, 'funciones'))}
    ${panel('Predicados', declaraciones(estado.predicados, 'predicados'))}
    <div id="errores-lenguaje" aria-live="polite">${erroresHTML(revision.errores.lenguaje, 'lenguaje')}</div>
    </div>${panel('Símbolos del lenguaje', `<div id="firma-resumen">${firmaHTML(revision)}</div><div class="nota"><h3>Símbolos lógicos</h3><p class="expresion">¬ ∧ ∨ → ↔ ∀ ∃ =</p></div>`, 'panel-datos')}</div>`;
}
