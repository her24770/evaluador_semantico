import { aCadena, aCadenaCompleta } from '../../sintaxis/index.js';
import { escapar, erroresHTML, SIMBOLOS } from '../componentes/comunes.js';
import { panelArbolHTML } from '../arbol/visor.js';
import { panelSustitucionHTML } from '../sustitucion/vista.js';
import { panelFotoHTML } from '../foto/vista.js';
import { resumenInterpretacionHTML } from '../componentes/resumen.js';
import { seccionPendiente } from '../modelo.js';

export function feedbackFormula(estado, revision) {
  if (revision.errores.lenguaje.length) return '<p class="ayuda">Revisa el lenguaje para analizar la fórmula.</p>';
  if (!estado.formula.trim()) return '<p class="ayuda">Escribe una fórmula para analizar su sintaxis.</p>';
  if (revision.errores.formula.length) return erroresHTML(revision.errores.formula, 'formula');
  return `<p class="correcto">Fórmula bien formada · ${revision.libres.length ? 'Abierta' : 'Cerrada'}</p>
    <p class="ayuda">Variables libres: <span class="mono">${escapar(revision.libres.join(', ') || 'ninguna')}</span> · Ligadas: <span class="mono">${escapar(revision.ligadas.join(', ') || 'ninguna')}</span></p>
    <details class="lectura"><summary>Cómo se leyó la fórmula</summary><p class="mono">${escapar(aCadena(revision.ast))}</p><p class="ayuda">Con todos los paréntesis:</p><p class="mono">${escapar(aCadenaCompleta(revision.ast))}</p></details>`;
}

export function accionesFormulaHTML(revision, ocupado = false) {
  if (ocupado) return '<button type="button" class="boton secundario" data-action="navegar" data-seccion="resultados">Ver evaluación en curso →</button>';
  const pendiente = seccionPendiente(revision);
  const texto = pendiente === 'entorno' ? 'Asignar variables libres'
    : pendiente === 'interpretacion' ? 'Revisar interpretación' : 'Evaluar fórmula';
  return `<button type="button" class="boton primario" data-action="evaluar" ${!revision.ast ? 'disabled' : ''}>${texto} <span aria-hidden="true">→</span></button><span class="atajo">Ctrl / ⌘ + Enter</span>`;
}

export function formula(estado, revision, ocupado = false) {
  return `<div class="rejilla-formula">
    <section class="panel panel-formula"><label for="formula" class="etiqueta">Fórmula</label>
      <textarea id="formula" class="editor-formula" data-entrada="formula" rows="2" placeholder="Escribe tu fórmula…" spellcheck="false" autocomplete="off" aria-describedby="formula-feedback">${escapar(estado.formula)}</textarea>
      <div id="formula-feedback" aria-live="polite">${feedbackFormula(estado, revision)}</div>
      <p class="ayuda leyenda-simbolos">Panel de símbolos</p><div class="simbolos" role="group" aria-label="Insertar símbolo matemático">${SIMBOLOS.map(([s, n]) => `<button type="button" data-action="insertar" data-simbolo="${s}" aria-label="Insertar ${n.toLowerCase()}" title="${n}">${s}</button>`).join('')}</div>
      <div id="acciones-formula" class="acciones-editor">${accionesFormulaHTML(revision, ocupado)}</div>
    </section>${resumenInterpretacionHTML(estado, revision)}
    ${panelFotoHTML(estado)}
    ${panelArbolHTML()}
    ${panelSustitucionHTML(estado, revision)}</div>`;
}
