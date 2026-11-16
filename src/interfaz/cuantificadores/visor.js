/**
 * Exploración de la evaluación exhaustiva de los cuantificadores.
 * En ∃ se destacan los casos verdaderos (testigos); en ∀, los falsos
 * (contraejemplos). La vista resumida filtra los casos ya calculados.
 * Las tablas anidadas se dibujan al abrir una fila para no llenar la página de golpe.
 */
import { escapar } from '../componentes/comunes.js';

export const FILAS_POR_PAGINA = 12;
export const TABLAS_POR_PAGINA = 6;

/**
 * Busca los primeros cuantificadores de cada rama, sin entrar aún en sus casos.
 * Los cuantificadores interiores se consultan al abrir la fila correspondiente.
 * @param {object} resultado  nodo de una evaluación exhaustiva completa
 * @param {string} [ruta]  descripción de su posición
 * @returns {{nodo: object, ruta: string}[]}
 */
export function cuantificadoresEn(resultado, ruta = 'raíz') {
  const encontrados = [];
  const pendientes = [{ nodo: resultado, ruta }];
  while (pendientes.length) {
    const actual = pendientes.pop();
    if (actual.nodo.variable !== undefined) encontrados.push(actual);
    else {
      for (let i = actual.nodo.hijos.length - 1; i >= 0; i--) {
        pendientes.push({ nodo: actual.nodo.hijos[i], ruta: `${actual.ruta}.${i + 1}` });
      }
    }
  }
  return encontrados;
}

/**
 * Selecciona hasta 12 índices de casos. Si se pide el resumen y hay casos
 * decisivos, muestra solo esos; si no los hay, conserva todos para justificar el resultado.
 * @param {object} nodo  cuantificador con elementos, hijos y decisivos
 * @param {boolean} [resumida]
 * @param {number} [pagina]  índice desde 0, ajustado al rango disponible
 * @returns {{indices: number[], total: number, pagina: number, paginas: number}}
 */
export function paginaCasos(nodo, resumida = false, pagina = 0) {
  const indices = nodo.elementos.map((_, i) => i).filter((i) =>
    !resumida || !nodo.decisivos.length || nodo.hijos[i].valor === (nodo.regla === '∃'));
  const paginas = Math.max(1, Math.ceil(indices.length / FILAS_POR_PAGINA));
  const actual = Math.max(0, Math.min(paginas - 1, Math.trunc(pagina) || 0));
  return { indices: indices.slice(actual * FILAS_POR_PAGINA, (actual + 1) * FILAS_POR_PAGINA),
    total: indices.length, pagina: actual, paginas };
}

/** Crea el panel o el aviso de límite; una tabla incompleta no se presenta como comprobación total. */
export function panelCuantificadoresHTML(tabla) {
  if (!tabla) return '';
  return `<section class="tabla-cuantificadores" aria-labelledby="titulo-cuantificadores">
    <div class="cabecera-explicacion"><h2 id="titulo-cuantificadores" class="titulo-tiza">Tabla de cuantificadores</h2>
    ${tabla.completa ? '<button type="button" class="boton secundario" data-cuant-vista aria-pressed="false">Vista resumida</button>' : ''}</div>
    ${tabla.completa ? `<p>Resultado global de la fórmula: <strong class="${tabla.resultado.valor ? 'es-verdadero' : 'es-falso'}">${tabla.resultado.valor ? 'Verdadero' : 'Falso'}</strong>.</p>
    <p class="ayuda" data-cuant-leyenda>Vista completa: todos los elementos del dominio. Abre una fila para consultar su entorno y sus evaluaciones anidadas.</p><div data-cuant-tablas></div>`
    : `<p role="status">Tabla exhaustiva no disponible. ${escapar(tabla.motivo)}</p><p class="ayuda">El resultado principal procede de la evaluación normal. La tabla no certifica una comprobación exhaustiva.</p>`}
    </section>`;
}

const vf = (valor) => `<strong class="${valor ? 'es-verdadero' : 'es-falso'}" aria-label="${valor ? 'Verdadero' : 'Falso'}">${valor ? 'V' : 'F'}</strong>`;

/** Controles comunes para cambiar de página de casos o de grupos de cuantificadores. */
function paginacion(atributo, id, pagina, paginas, total, unidad) {
  return `<div class="cuant-paginacion"><span class="ayuda" role="status">${total} ${unidad} · Página ${pagina + 1} de ${paginas}</span>
    ${paginas > 1 ? `<button type="button" class="enlace" ${atributo}="${id}" data-pagina="${pagina - 1}" ${pagina === 0 ? 'disabled' : ''}>Anterior</button>
    <button type="button" class="enlace" ${atributo}="${id}" data-pagina="${pagina + 1}" ${pagina === paginas - 1 ? 'disabled' : ''}>Siguiente</button>` : ''}</div>`;
}

/**
 * Activa la navegación de una tabla exhaustiva completa.
 * @param {HTMLElement|null} contenedor  contiene el panel generado por panelCuantificadoresHTML
 * @param {object|null} tabla  resultado de evaluarExhaustivo
 * @returns {{destruir: Function}|null} permite retirar los eventos al reemplazar la vista
 */
export function montarTablaCuantificadores(contenedor, tabla) {
  if (!contenedor || !tabla?.completa) return null;
  let resumida = false;
  let secuencia = 0;
  const tablas = new Map();
  const grupos = new Map();

  /** Página de hasta seis cuantificadores encontrados al mismo nivel de exploración. */
  function grupoHTML(resultado, ruta, id = `g${++secuencia}`, pagina = 0) {
    const lista = cuantificadoresEn(resultado, ruta);
    grupos.set(id, { resultado, ruta });
    const paginas = Math.max(1, Math.ceil(lista.length / TABLAS_POR_PAGINA));
    pagina = Math.max(0, Math.min(paginas - 1, pagina));
    return `<div data-cuant-grupo="${id}">${lista.slice(pagina * TABLAS_POR_PAGINA, (pagina + 1) * TABLAS_POR_PAGINA)
      .map(({ nodo, ruta: posicion }) => tablaHTML(nodo, posicion)).join('')}
      ${lista.length > TABLAS_POR_PAGINA ? paginacion('data-cuant-paginar-grupo', id, pagina, paginas, lista.length, 'cuantificadores') : ''}</div>`;
  }

  /** Tabla de un cuantificador, con sus casos y espacios para explorar los pasos interiores. */
  function tablaHTML(nodo, ruta, id = `t${++secuencia}`, pagina = 0) {
    tablas.set(id, { nodo, ruta });
    const casos = paginaCasos(nodo, resumida, pagina);
    const tipo = nodo.regla === '∀' ? 'Contraejemplo' : 'Testigo';
    return `<section class="cuant-tabla" data-cuant-tabla="${id}">
      <h3 class="mono" tabindex="-1">${escapar(nodo.formula)} <span class="cuant-resultado">= ${vf(nodo.valor)}</span></h3>
      <p class="ayuda">Posición: ${escapar(ruta)} · Entorno de entrada: <span class="mono">${escapar(nodo.entorno)}</span></p>
      <p>${escapar(nodo.razon)}</p>
      ${resumida ? `<p class="ayuda">${nodo.decisivos.length ? `Se muestran ${tipo.toLowerCase()}s; la evaluación de fondo fue exhaustiva.` : 'Todos los casos son necesarios para justificar este resultado.'}</p>` : ''}
      <div class="cuant-desplazamiento" role="region" aria-label="Casos de ${escapar(nodo.formula)}" tabindex="0"><table>
        <caption>Evaluación de ${escapar(nodo.cuerpo)} para cada ${escapar(nodo.variable)} ∈ 𝒟</caption>
        <thead><tr><th scope="col">${escapar(nodo.variable)}</th><th scope="col">V/F</th><th scope="col">Evidencia</th><th scope="col">Entorno y explicación</th></tr></thead>
        <tbody>${casos.indices.map((i) => {
          const hijo = nodo.hijos[i];
          const decisivo = hijo.valor === (nodo.regla === '∃');
          return `<tr${decisivo ? ' class="cuant-decisivo"' : ''}><th scope="row" class="mono">${escapar(nodo.elementos[i])}</th><td>${vf(hijo.valor)}</td>
          <td>${decisivo ? tipo : '—'}</td><td><details data-cuant-caso="${id}" data-indice="${i}"><summary>Ver caso ${escapar(nodo.variable)} ↦ ${escapar(nodo.elementos[i])}</summary>
          <p class="mono">${escapar(hijo.entorno)}</p><p class="mono">${escapar(hijo.formula)} = ${hijo.valor ? 'V' : 'F'}</p><p>${escapar(hijo.razon)}</p><div data-cuant-anidados></div></details></td></tr>`;
        }).join('')}</tbody></table></div>
      ${paginacion('data-cuant-paginar', id, casos.pagina, casos.paginas, casos.total, 'casos en esta vista')}</section>`;
  }

  /** Reinicia los registros y dibuja desde la raíz, por ejemplo al cambiar entre completa y resumida. */
  function mostrar() {
    tablas.clear();
    grupos.clear();
    contenedor.querySelector('[data-cuant-tablas]').innerHTML = grupoHTML(tabla.resultado, 'raíz');
  }

  /** Quita del registro las tablas y grupos cuyo HTML se va a descartar. */
  function liberar(destino) {
    destino.querySelectorAll('[data-cuant-tabla]').forEach((e) => tablas.delete(e.dataset.cuantTabla));
    destino.querySelectorAll('[data-cuant-grupo]').forEach((e) => grupos.delete(e.dataset.cuantGrupo));
  }

  /** Atiende el cambio de vista y las dos paginaciones, recuperando el foco después de dibujar. */
  function click(evento) {
    const boton = evento.target.closest('button');
    if (!boton || boton.disabled) return;
    if (boton.hasAttribute('data-cuant-vista')) {
      resumida = !resumida;
      boton.setAttribute('aria-pressed', String(resumida));
      boton.textContent = resumida ? 'Vista completa' : 'Vista resumida';
      contenedor.querySelector('[data-cuant-leyenda]').textContent = resumida
        ? 'Vista resumida: testigos del existencial y contraejemplos del universal. Cuando no los hay, se requieren todos los casos.'
        : 'Vista completa: todos los elementos del dominio. Abre una fila para consultar su entorno y sus evaluaciones anidadas.';
      mostrar();
    } else if (boton.hasAttribute('data-cuant-paginar')) {
      const id = boton.dataset.cuantPaginar;
      const { nodo, ruta } = tablas.get(id);
      const destino = boton.closest('[data-cuant-tabla]');
      liberar(destino);
      destino.outerHTML = tablaHTML(nodo, ruta, id, Number(boton.dataset.pagina));
      contenedor.querySelector(`[data-cuant-tabla="${id}"] h3`).focus();
    } else if (boton.hasAttribute('data-cuant-paginar-grupo')) {
      const id = boton.dataset.cuantPaginarGrupo;
      const { resultado, ruta } = grupos.get(id);
      const destino = boton.closest('[data-cuant-grupo]');
      liberar(destino);
      destino.outerHTML = grupoHTML(resultado, ruta, id, Number(boton.dataset.pagina));
      contenedor.querySelector(`[data-cuant-grupo="${id}"] h3`)?.focus();
    }
  }

  /** Crea las tablas interiores al abrir un caso y las libera al cerrarlo. */
  function toggle(evento) {
    const detalle = evento.target;
    if (!detalle.matches('details[data-cuant-caso]') || !contenedor.contains(detalle)) return;
    if (!detalle.open) {
      const anidados = detalle.querySelector('[data-cuant-anidados]');
      liberar(anidados);
      anidados.innerHTML = '';
      delete detalle.dataset.cargado;
      return;
    }
    if (detalle.dataset.cargado) return;
    const { nodo, ruta } = tablas.get(detalle.dataset.cuantCaso);
    const indice = Number(detalle.dataset.indice);
    detalle.querySelector('[data-cuant-anidados]').innerHTML = grupoHTML(nodo.hijos[indice], `${ruta} · ${nodo.variable} ↦ ${nodo.elementos[indice]}`);
    detalle.dataset.cargado = 'true';
  }

  contenedor.addEventListener('click', click);
  contenedor.addEventListener('toggle', toggle, true);
  mostrar();
  return { destruir() {
    contenedor.removeEventListener('click', click);
    contenedor.removeEventListener('toggle', toggle, true);
  } };
}
