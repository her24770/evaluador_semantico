import { escapar, propio } from './comunes.js';

export function resumenEntornoHTML(revision) {
  return revision.ast ? revision.libres.length
    ? `<p class="expresion">${revision.libres.map((v) => `${escapar(v)} ↦ ${escapar(propio(revision.entorno, v) ?? '?')}`).join('<br>')}</p><button type="button" class="enlace" data-action="navegar" data-seccion="entorno">${revision.errores.entorno.length ? 'Asignar variables libres' : 'Editar entorno'} →</button>`
    : '<p class="correcto">Fórmula cerrada</p><p class="ayuda">No requiere asignaciones.</p>'
    : '<p class="ayuda">El entorno depende de las variables libres de tu fórmula.</p>';
}

export function resumenInterpretacionHTML(estado, revision) {
  return `<aside class="panel panel-datos resumen-interpretacion"><h2 class="titulo-tiza">Interpretación</h2>
    <div class="dato"><p class="etiqueta">Dominio</p><p class="expresion">𝒟 = {${escapar(revision.dominio.join(', ') || '…')}}</p><button type="button" class="enlace" data-action="navegar" data-seccion="interpretacion">Editar interpretación</button></div>
    <div class="dato"><p class="etiqueta">Símbolos</p>${estado.predicados.map((s) => `<p class="expresion expresion-pequena">${escapar(s.nombre)}ᴵ = {${escapar(s.relacion || '…')}}</p>`).join('') || '<p class="ayuda">Sin predicados declarados.</p>'}
    ${estado.constantes?.length ? `<p class="ayuda">Constantes: ${estado.constantes.map((c) => `${escapar(c.nombre)} ↦ ${escapar(c.valor || '?')}`).join(', ')}</p>` : ''}
    ${estado.funciones.length ? `<p class="ayuda">Funciones: ${estado.funciones.map((s) => `${escapar(s.nombre)}/${escapar(s.aridad)}`).join(', ')}</p>` : ''}</div>
    <div class="dato"><p class="etiqueta">Entorno</p><div id="entorno-resumen">${resumenEntornoHTML(revision)}</div></div></aside>`;
}
