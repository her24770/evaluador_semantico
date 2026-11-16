import { asistenteHTML } from '../asistente.js';

export const SECCIONES = [
  { id: 'lenguaje', nombre: 'Lenguaje' },
  { id: 'interpretacion', nombre: 'Interpretación' },
  { id: 'formula', nombre: 'Fórmula' },
  { id: 'entorno', nombre: 'Entorno' },
  { id: 'resultados', nombre: 'Resultados' },
];

export function estructura() {
  return `<a class="saltar" href="#contenido">Saltar al contenido</a>
    <div class="pizarra">
      <header class="cabecera">
        <div class="identidad">
          <svg class="marca-tiza" viewBox="0 0 48 64" aria-hidden="true" focusable="false">
            <defs>
              <pattern id="marca-tiza-grano" width="11" height="13" patternUnits="userSpaceOnUse">
                <rect width="11" height="13" fill="white" />
                <path d="M2 3h1.1 M7 9h1.4 M4 12h.7" stroke="black" stroke-width=".65" opacity=".45" />
                <circle cx="9" cy="4" r=".65" fill="black" opacity=".35" />
              </pattern>
              <mask id="marca-tiza-textura"><rect width="48" height="64" fill="url(#marca-tiza-grano)" /></mask>
              <path id="marca-cable" d="M12 24 H9 C5.5 24 4 27 4 33 L4 38 C4 48 11 54 20 51 C28 48 34 49 40 55" />
            </defs>
            <g mask="url(#marca-tiza-textura)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
              <use href="#marca-cable" stroke-width="4.8" stroke-linecap="butt" opacity=".85" />
              <use href="#marca-cable" stroke="var(--pizarra)" stroke-width="2.2" stroke-linecap="butt" />
              <path d="M13 9 Q12 24 13 39 M13 18 Q26 19 40 17.5 M13 30 Q26 29 40 30" stroke-width="3.4" opacity=".9" />
              <path d="M11.8 10 Q12.5 24 11.9 38 M14 19 Q27 20 39 18.5 M14 31 Q26 30 39 31" stroke-width="1.1" opacity=".4" />
            </g>
          </svg>
          <div class="identidad-texto">
            <p class="nombre-app">Evaluador semántico</p>
            <p class="lema-app">El enchufe funciona. Revisemos tu fórmula.</p>
          </div>
        </div>
        <button type="button" id="abrir-asistente" class="boton secundario" aria-controls="asistente" aria-expanded="false">Tutor del curso</button>
      </header>
      <nav class="navegacion" aria-label="Secciones del evaluador">${SECCIONES.map((s, i) => `<button type="button" id="nav-${s.id}" data-action="navegar" data-seccion="${s.id}"><span class="numero-seccion">0${i + 1}</span> ${s.nombre}</button>`).join('')}</nav>
      <div class="espacio-trabajo"><main id="contenido" tabindex="-1">
        <div class="introduccion"><h1 id="titulo-vista" tabindex="-1"></h1></div>
        <div id="vista"></div>
      </main>${asistenteHTML()}</div>
      <div id="anuncio" class="solo-lectores" role="status" aria-live="polite"></div>
    </div>`;
}
