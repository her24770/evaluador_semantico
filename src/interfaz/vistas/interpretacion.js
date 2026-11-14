import { escapar, opciones, panel, erroresHTML } from '../componentes/comunes.js';
import { tuplaEn, MAX_CASILLAS } from '../modelo.js';

const TAM_PAGINA = 24;

function tablaFuncion(simbolo, dominio, paginas) {
  const aridad = Number(simbolo.aridad);
  const total = dominio.length ** aridad;
  if (aridad > 32 || total > MAX_CASILLAS) return '<p class="ayuda">Esta tabla supera las 4096 entradas o los 32 argumentos. Reduce el dominio o la aridad.</p>';
  const pagina = Math.min(paginas[simbolo.id] ?? 0, Math.max(0, Math.ceil(total / TAM_PAGINA) - 1));
  const inicio = pagina * TAM_PAGINA;
  const filas = Array.from({ length: Math.min(TAM_PAGINA, total - inicio) }, (_, i) => {
    const tupla = tuplaEn(dominio, aridad, inicio + i);
    const clave = tupla.join(',');
    const llamada = aridad ? `${simbolo.nombre}(${tupla.join(', ')})` : simbolo.nombre;
    return `<tr><th scope="row"><label for="tabla-${simbolo.id}-${inicio + i}">${escapar(llamada)}</label></th><td><select id="tabla-${simbolo.id}-${inicio + i}" data-tabla="${simbolo.id}" data-clave="${escapar(clave)}">${opciones(dominio, simbolo.tabla?.[clave])}</select></td></tr>`;
  }).join('');
  return `<table class="tabla-funcion"><caption class="solo-lectores">Valores de ${escapar(simbolo.nombre)}</caption><thead><tr><th scope="col">Entrada</th><th scope="col">Valor en 𝒟</th></tr></thead><tbody>${filas}</tbody></table>
    ${total > TAM_PAGINA ? `<div class="paginacion"><button type="button" class="boton secundario" data-action="pagina-tabla" data-id="${simbolo.id}" data-pagina="${pagina - 1}" ${pagina === 0 ? 'disabled' : ''}>Anterior</button><span>${inicio + 1}–${Math.min(inicio + TAM_PAGINA, total)} de ${total}</span><button type="button" class="boton secundario" data-action="pagina-tabla" data-id="${simbolo.id}" data-pagina="${pagina + 1}" ${inicio + TAM_PAGINA >= total ? 'disabled' : ''}>Siguiente</button></div>` : ''}`;
}

function relacion(simbolo, dominio) {
  const aridad = Number(simbolo.aridad);
  return `<label for="relacion-${simbolo.id}">Elementos o tuplas de ${escapar(simbolo.nombre)}ᴵ</label>
    <textarea id="relacion-${simbolo.id}" data-relacion="${simbolo.id}" rows="3" spellcheck="false" placeholder="${aridad === 1 ? 'a, b' : '(a, b), (b, a)'}">${escapar(simbolo.relacion)}</textarea>
    <p class="ayuda">${aridad === 1 ? 'Separa los elementos con comas.' : `Cada tupla debe tener ${aridad} elementos. Escribe las tuplas entre paréntesis.`} La relación debe contener al menos una tupla.</p>
    ${dominio.length && aridad <= 8 ? `<details class="constructor"><summary>Construir una tupla con el dominio</summary><div class="constructor-tupla" data-constructor="${simbolo.id}">${Array.from({ length: aridad }, (_, i) => `<label>Elemento ${i + 1}<select data-tupla-elemento>${opciones(dominio)}</select></label>`).join('')}<button type="button" class="boton secundario" data-action="agregar-tupla" data-id="${simbolo.id}">Añadir tupla</button></div><p class="ayuda" data-aviso-tupla role="status"></p></details>` : ''}`;
}

export function interpretacion(estado, revision, paginas) {
  const valido = !revision.errores.lenguaje.length;
  return `${panel('Dominio 𝒟', `<label for="dominio">Elementos</label><input id="dominio" data-entrada="dominioTexto" value="${escapar(estado.dominioTexto)}" placeholder="a, b, c" spellcheck="false" aria-describedby="ayuda-dominio"><p id="ayuda-dominio" class="ayuda">Separa los elementos con comas. El dominio debe ser no vacío y sin repeticiones. Las tablas se actualizan al salir del campo.</p>`)}
    <div id="errores-interpretacion" aria-live="polite">${estado.dominioTexto || estado.evaluacionSolicitada ? erroresHTML(revision.errores.interpretacion, 'interpretacion') : ''}</div>
    ${!valido ? '<p class="aviso">Corrige primero los símbolos y las aridades en Lenguaje.</p>' : `<div class="rejilla-doble">
      <div>${estado.funciones.length ? estado.funciones.map((s) => panel(`${escapar(s.nombre)} <span class="subtitulo-panel">/ ${Number(s.aridad) === 0 ? 'constante' : `aridad ${escapar(s.aridad)}`}</span>`, revision.dominio.length ? tablaFuncion(s, revision.dominio, paginas) : '<p class="vacio">Define un dominio válido para completar esta tabla.</p>')).join('') : panel('Funciones', '<p class="vacio">Tu lenguaje no tiene funciones ni constantes.</p>')}</div>
      <div>${estado.predicados.length ? estado.predicados.map((s) => panel(`${escapar(s.nombre)}ᴵ <span class="subtitulo-panel">/ aridad ${escapar(s.aridad)}</span>`, relacion(s, revision.dominio))).join('') : panel('Relaciones', '<p class="vacio">Tu lenguaje no tiene predicados.</p>')}</div>
    </div>`}`;
}
