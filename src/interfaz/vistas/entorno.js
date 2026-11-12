import { escapar, opciones, panel, erroresHTML } from '../componentes/comunes.js';

export function entorno(estado, revision) {
  const conjunto = (variables) => !revision.ast ? '…' : variables.length ? `{ ${escapar(variables.join(', '))} }` : '∅';
  let contenido;
  if (!revision.ast) contenido = '<p class="aviso">Escribe una fórmula bien formada en Fórmula para identificar sus variables libres.</p><button type="button" class="boton secundario" data-action="navegar" data-seccion="formula">Ir a la fórmula →</button>';
  else if (!revision.libres.length) contenido = '<p class="correcto">Fórmula cerrada</p><p>No hay variables libres. Los cuantificadores se encargan de las variables ligadas.</p><p class="expresion">l = [ ]</p>';
  else if (!revision.dominio.length) contenido = '<p class="aviso">Define un dominio válido en Interpretación para poder asignar los valores.</p>';
  else contenido = `<p class="ayuda">Asigna un elemento del dominio a cada variable libre.</p><div class="asignaciones">${revision.libres.map((v, i) => `<label for="entorno-${i}"><span class="mono">${escapar(v)} ↦</span><select id="entorno-${i}" data-variable="${escapar(v)}">${opciones(revision.dominio, estado.entorno[v])}</select></label>`).join('')}</div>`;
  return `<div class="rejilla-doble">${panel('Asignaciones', `${contenido}<div id="errores-entorno" aria-live="polite">${erroresHTML(revision.errores.entorno, 'entorno')}</div>`)}
    ${panel('Libres y ligadas', `<p class="etiqueta">VARIABLES LIBRES</p><p class="expresion">${conjunto(revision.libres)}</p><p class="ayuda">Su valor se toma del entorno que eliges aquí.</p><div class="nota"><p class="etiqueta">VARIABLES LIGADAS</p><p class="expresion">${conjunto(revision.ligadas)}</p><p class="ayuda">Su valor lo determina cada cuantificador ∀ o ∃ durante la evaluación.</p></div>`, 'panel-datos')}</div>`;
}
