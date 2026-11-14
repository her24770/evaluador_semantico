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
        <div class="identidad"><span class="marca" aria-hidden="true">∀</span><p class="nombre-app">Evaluador semántico</p></div>
      </header>
      <nav class="navegacion" aria-label="Secciones del evaluador">${SECCIONES.map((s, i) => `<button type="button" id="nav-${s.id}" data-action="navegar" data-seccion="${s.id}"><span class="numero-seccion">0${i + 1}</span> ${s.nombre}</button>`).join('')}</nav>
      <main id="contenido" tabindex="-1">
        <div class="introduccion"><h1 id="titulo-vista" tabindex="-1"></h1></div>
        <div id="vista"></div>
      </main>
      <div id="anuncio" class="solo-lectores" role="status" aria-live="polite"></div>
    </div>`;
}
