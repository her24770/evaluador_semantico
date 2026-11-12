import { aCadena, aCadenaCompleta } from '../../sintaxis/index.js';
import { escapar, erroresHTML } from '../componentes/comunes.js';
import { dictamen, casosHTML, explicacionHTML } from './resultados.js';

const SIMBOLOS = [['¬', 'Negación'], ['∧', 'Conjunción'], ['∨', 'Disyunción'], ['→', 'Implicación'], ['∀', 'Para todo'], ['∃', 'Existe'], ['(', 'Abrir paréntesis'], [')', 'Cerrar paréntesis']];

export function feedbackFormula(estado, revision) {
  if (revision.errores.lenguaje.length) return '<p class="ayuda">Revisa el lenguaje para analizar la fórmula.</p>';
  if (!estado.formula.trim()) return '<p class="ayuda">Escribe una fórmula para analizar su sintaxis.</p>';
  if (revision.errores.formula.length) return erroresHTML(revision.errores.formula, 'formula');
  return `<p class="correcto">Fórmula bien formada · ${revision.libres.length ? 'Abierta' : 'Cerrada'}</p>
    <p class="ayuda">Variables libres: <span class="mono">${escapar(revision.libres.join(', ') || 'ninguna')}</span> · Ligadas: <span class="mono">${escapar(revision.ligadas.join(', ') || 'ninguna')}</span></p>
    <details class="lectura"><summary>Cómo se leyó la fórmula</summary><p class="mono">${escapar(aCadena(revision.ast))}</p><p class="ayuda">Con todos los paréntesis:</p><p class="mono">${escapar(aCadenaCompleta(revision.ast))}</p></details>`;
}

function datosHTML(estado, revision) {
  const entorno = revision.ast ? revision.libres.length ? `<p class="expresion">${revision.libres.map((v) => `${escapar(v)} ↦ ${escapar(estado.entorno[v] || '?')}`).join('<br>')}</p><button type="button" class="enlace" data-action="navegar" data-seccion="entorno">Asignar variables libres →</button>` : '<p class="correcto">Fórmula cerrada</p><p class="ayuda">Sin variables libres.<br>No requiere asignaciones.</p>' : '<p class="ayuda">El entorno depende de las variables libres de tu fórmula.</p>';
  return `<aside class="panel panel-datos"><h2 class="titulo-tiza">Interpretación</h2><div class="dato"><p class="etiqueta">Dominio</p><p class="expresion">𝒟 = {${escapar(revision.dominio.join(', ') || '…')}}</p><button type="button" class="enlace" data-action="navegar" data-seccion="interpretacion">Editar interpretación</button></div>
    <div class="dato"><p class="etiqueta">Símbolos</p>${estado.predicados.map((s) => `<p class="expresion expresion-pequena">${escapar(s.nombre)}ᴵ = {${escapar(s.relacion || '…')}}</p>`).join('') || '<p class="ayuda">Sin predicados declarados.</p>'}
    ${estado.funciones.length ? `<p class="ayuda">Funciones: ${estado.funciones.map((s) => `${escapar(s.nombre)}/${escapar(s.aridad)}`).join(', ')}</p>` : ''}</div>
    <div class="dato"><p class="etiqueta">Entorno</p><div id="entorno-resumen">${entorno}</div></div></aside>`;
}

export function formula(estado, revision, ocupado, fallo) {
  return `<div class="rejilla-evaluacion">${datosHTML(estado, revision)}
    <section class="panel panel-formula"><label for="formula" class="etiqueta">Fórmula</label>
      <textarea id="formula" class="editor-formula" data-entrada="formula" rows="2" placeholder="Escribe tu fórmula…" spellcheck="false" autocomplete="off" aria-describedby="formula-feedback">${escapar(estado.formula)}</textarea>
      <div id="formula-feedback" aria-live="polite">${feedbackFormula(estado, revision)}</div>
      <p class="ayuda leyenda-simbolos">Panel de símbolos</p><div class="simbolos" role="group" aria-label="Insertar símbolo matemático">${SIMBOLOS.map(([s, n]) => `<button type="button" data-action="insertar" data-simbolo="${s}" aria-label="Insertar ${n.toLowerCase()}" title="${n}">${s}</button>`).join('')}</div>
      <div class="acciones-editor"><button type="button" class="boton primario" data-action="evaluar" ${ocupado ? 'disabled' : ''}>${ocupado ? 'Evaluando…' : 'Evaluar fórmula'} <span aria-hidden="true">→</span></button><span class="atajo">Ctrl / ⌘ + Enter</span></div>
      <div id="casos-preview">${casosHTML(estado.resultado)}</div>
    </section><div id="dictamen-contenedor">${dictamen(estado, revision, ocupado, fallo)}</div></div>
    <div id="explicacion-contenedor">${explicacionHTML(estado.resultado)}</div>`;
}
