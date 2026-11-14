import { escapar, erroresHTML } from '../componentes/comunes.js';

export function dictamen(estado, revision, ocupado = false, fallo = '') {
  const resultado = estado.resultado;
  if (ocupado) return `<aside class="panel dictamen" aria-busy="true"><p class="etiqueta">Resultado</p><h2 class="titulo-tiza">Evaluando…</h2><button type="button" class="boton secundario" data-action="cancelar">Cancelar evaluación</button></aside>`;
  if (!resultado) {
    const hayErrores = estado.evaluacionSolicitada && !revision.valido;
    return `<aside class="panel dictamen"><p class="etiqueta">Resultado</p><h2 class="titulo-tiza">${fallo ? 'Evaluación interrumpida' : hayErrores ? 'Entradas inválidas' : 'Sin evaluar'}</h2>
      <p class="ayuda">${fallo ? escapar(fallo) : hayErrores ? 'Corrige los errores para evaluar la fórmula.' : 'Evalúa la fórmula para obtener un resultado.'}</p>
      ${hayErrores ? Object.entries(revision.errores).filter(([, e]) => e.length).map(([seccion, errores]) => `<div class="grupo-error"><button type="button" class="enlace" data-action="navegar" data-seccion="${seccion}">Revisar ${seccion === 'interpretacion' ? 'interpretación' : seccion === 'formula' ? 'fórmula' : seccion}</button>${erroresHTML(errores, seccion)}</div>`).join('') : ''}
      </aside>`;
  }
  const evidencia = resultado.contraejemplo ?? resultado.testigo;
  const titulo = resultado.contraejemplo ? 'Contraejemplo' : resultado.testigo ? 'Testigo' : resultado.completa ? 'Comprobación completa' : `Regla ${resultado.regla}`;
  return `<aside class="panel dictamen ${resultado.valor ? 'es-verdadero' : 'es-falso'}"><p class="etiqueta">Resultado</p>
    <h2 class="sello" data-valor-verdad>${resultado.valor ? 'VERDADERO' : 'FALSO'}</h2>
    <div class="evidencia"><h3 class="etiqueta">${titulo}</h3>
    ${evidencia ? `<p class="asignacion">${escapar(evidencia.variable)} ↦ ${escapar(evidencia.elemento)}</p>` : ''}
    <p>${escapar(resultado.razon)}</p><p class="ayuda">Entorno: ${escapar(resultado.entorno)}</p></div></aside>`;
}

export function casosHTML(resultado) {
  if (!resultado) return '';
  // Se muestran exclusivamente los hijos devueltos por el evaluador. En un
  // contraejemplo puede devolver solo el caso decisivo, no todos los intentos.
  const hijos = resultado.hijos;
  return `<p class="etiqueta">${resultado.completa ? 'Comprobación completa' : 'Casos evaluados'}</p>
    <div class="casos">${(hijos.length ? hijos : [resultado]).slice(0, 6).map((h) => `<div class="caso ${h.valor ? 'es-verdadero' : 'es-falso'}"><p class="mono">${escapar(h.entorno)}</p><p class="formula-caso">${escapar(h.formula)}</p><p class="estado-caso">${h.valor ? 'Verdadero' : 'Falso'}</p></div>`).join('')}</div>
    ${hijos.length > 6 ? `<p class="ayuda">Se muestran 6 de ${hijos.length} pasos. Abajo puedes consultar la explicación completa.</p>` : ''}`;
}

function nodoHTML(nodo, profundidad = 0) {
  const caso = nodo.testigo ?? nodo.contraejemplo;
  return `<li><details ${profundidad < 2 ? 'open' : ''}><summary><span class="valor-nodo ${nodo.valor ? 'es-verdadero' : 'es-falso'}">${nodo.valor ? 'V' : 'F'}</span><span>${escapar(nodo.formula)}</span><span class="regla">${escapar(nodo.regla)}</span></summary>
    <div class="detalle-nodo"><p>${escapar(nodo.razon)}</p><p class="ayuda mono">Entorno: ${escapar(nodo.entorno)}</p>
    ${caso ? `<p class="dato-evidencia">${nodo.testigo ? 'Testigo' : 'Contraejemplo'}: ${escapar(caso.variable)} ↦ ${escapar(caso.elemento)}</p>` : ''}
    ${nodo.completa ? '<p class="dato-evidencia">Comprobación completa sobre el dominio.</p>' : ''}
    ${nodo.hijos.length ? `<ol class="arbol-explicacion">${nodo.hijos.map((h) => nodoHTML(h, profundidad + 1)).join('')}</ol>` : ''}
    </div></details></li>`;
}

export function explicacionHTML(resultado) {
  if (!resultado) return '';
  return `<section class="explicacion"><div class="cabecera-explicacion"><h2 class="titulo-tiza">Evaluación paso a paso</h2><div><button type="button" class="enlace" data-action="expandir">Expandir todo</button><button type="button" class="enlace" data-action="contraer">Contraer todo</button></div></div><ol class="arbol-explicacion raiz">${nodoHTML(resultado)}</ol></section>`;
}
