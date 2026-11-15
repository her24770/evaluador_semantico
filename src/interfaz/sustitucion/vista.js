/**
 * Panel "Sustitución φ[t/x]" (tema 08) de la vista Fórmula.
 * La lógica está en src/sintaxis/sustitucion.js; aquí solo se muestra.
 */
import { aCadena, terminoACadena, prepararSustitucion, ErrorLogico } from '../../sintaxis/index.js';
import { escapar, erroresHTML } from '../componentes/comunes.js';

export function panelSustitucionHTML(estado, revision) {
  const { variable, termino } = estado.sustitucion;
  return `<section class="panel sustitucion-panel" aria-labelledby="sustitucion-titulo">
    <h2 id="sustitucion-titulo" class="titulo-tiza">Sustitución φ[t/x]</h2>
    <p class="ayuda">Cambia cada aparición <strong>libre</strong> de la variable x por el término t. Si alguna variable de t quedaría atrapada por un cuantificador, primero se renombra la variable ligada (tema 08).</p>
    <div class="sustitucion-campos">
      <label for="sustitucion-variable">Variable x<input id="sustitucion-variable" class="mono" data-sustitucion="variable" value="${escapar(variable)}" placeholder="x" spellcheck="false" autocomplete="off"></label>
      <label for="sustitucion-termino">Término t<input id="sustitucion-termino" class="mono" data-sustitucion="termino" value="${escapar(termino)}" placeholder="f(y)" spellcheck="false" autocomplete="off"></label>
    </div>
    <div id="sustitucion-resultado" aria-live="polite">${resultadoSustitucionHTML(estado, revision)}</div>
  </section>`;
}

/** Calcula la sustitución con lo que hay en pantalla; null si no se puede. */
export function calcularSustitucion(estado, revision) {
  const { variable, termino } = estado.sustitucion;
  if (!revision.ast || !variable.trim() || !termino.trim()) return null;
  try {
    return prepararSustitucion(revision.ast, variable, termino, revision.firma);
  } catch (error) {
    if (!(error instanceof ErrorLogico)) throw error;
    return { error };
  }
}

export function resultadoSustitucionHTML(estado, revision) {
  if (!revision.ast) return '<p class="ayuda">Escribe una fórmula bien formada para hacer una sustitución.</p>';
  const { variable, termino } = estado.sustitucion;
  if (!variable.trim() || !termino.trim()) {
    const ejemplo = revision.libres[0] ?? 'x';
    return `<p class="ayuda">Escribe la variable y el término. Por ejemplo, x = <span class="mono">${escapar(ejemplo)}</span>.</p>`;
  }
  const r = calcularSustitucion(estado, revision);
  if (r.error) return erroresHTML([r.error], 'sustitucion');

  const x = escapar(r.x);
  const t = escapar(terminoACadena(r.t));
  const notacion = `φ[${t}/${x}]`;
  const resultado = aCadena(r.resultado);
  const ocurrencias = r.reemplazos === 0
    ? `${x} no aparece libre en φ, así que ${notacion} = φ.`
    : `Se cambi${r.reemplazos === 1 ? 'ó 1 aparición libre' : `aron ${r.reemplazos} apariciones libres`} de ${x}.`;

  const veredicto = r.libre
    ? `<p class="correcto">${t} es libre para ${x} en φ</p><p class="ayuda">Ninguna variable de ${t} queda ligada al sustituir.</p>`
    : `<p class="sustitucion-captura">${t} no es libre para ${x} en φ</p>
      <p class="ayuda">${r.capturas.map((c) => `La variable ${escapar(c.variable)} de ${t} quedaría atrapada por ${escapar(c.cuantificador)}.`).join(' ')}</p>
      <p class="etiqueta">Sustitución directa (incorrecta)</p><p class="mono sustitucion-formula tachada">${escapar(aCadena(r.directa))}</p>
      <p class="etiqueta">Renombre de variables ligadas</p><p class="mono">${r.renombres.map((n) => `${escapar(n.cuantificador + n.de)} → ${escapar(n.cuantificador + n.a)}`).join(', ')}</p>
      <p class="ayuda">${r.renombres.map((n) => escapar(n.a)).join(', ')} ${r.renombres.length === 1 ? 'es una variable nueva' : 'son variables nuevas'}: no aparece${r.renombres.length === 1 ? '' : 'n'} en φ ni en t, así que el significado no cambia.</p>`;

  return `<div class="sustitucion-salida">
      <p class="etiqueta">${notacion}</p>
      <p class="mono sustitucion-formula">${escapar(resultado)}</p>
      <p class="ayuda">${ocurrencias}</p>
      ${veredicto}
      <button type="button" class="boton secundario" data-action="usar-sustitucion">Usar ${notacion} como fórmula</button>
    </div>`;
}
