/**
 * Dibujo y exploración del árbol sintáctico en SVG.
 * modelo.js prepara nodos y posiciones; aquí se manejan selección, zoom,
 * teclado y detalle. Seleccionar un cuantificador resalta las apariciones que liga.
 */
import { escapar, erroresHTML } from '../componentes/comunes.js';
import { crearArbol, detalleNodo, distribuirArbol } from './modelo.js';

/** Panel inicial; montarArbol completa su contenido según la revisión de la fórmula. */
export function panelArbolHTML() {
  return `<section id="arbol-sintactico" class="panel arbol-panel" aria-labelledby="arbol-titulo">
    <h2 id="arbol-titulo" class="titulo-tiza">Árbol sintáctico</h2>
    <div data-arbol-contenido></div>
  </section>`;
}

const lista = (variables) => escapar(variables.join(', ') || 'ninguna');

/** Muestra el tipo, la expresión y sus variables; id debe identificar un nodo existente. */
export function detalleHTML(arbol, id) {
  const nodo = detalleNodo(arbol, id);
  const contextoDistinto = nodo.libres.join(',') !== nodo.libresContexto.join(',')
    || nodo.ligadas.join(',') !== nodo.ligadasContexto.join(',');
  const cuantificador = arbol.porId.get(nodo.cuantificadorId);
  return `<h3>${escapar(nodo.tipo)}</h3>
    <p class="arbol-expresion mono">${escapar(nodo.texto)}</p>
    <dl class="arbol-propiedades"><dt>Tipo de expresión</dt><dd>${nodo.esTermino ? 'Término' : 'Fórmula'}</dd>
      <dt>Variables libres</dt><dd class="mono">${lista(nodo.libres)}</dd>
      <dt>Variables ligadas</dt><dd class="mono">${lista(nodo.ligadas)}</dd></dl>
    <p class="ayuda">${nodo.esTermino ? 'Variables del término considerado aisladamente.' : 'Variables de esta subfórmula considerada aisladamente.'}</p>
    ${contextoDistinto ? `<div class="arbol-contexto"><p>En la fórmula completa</p><p class="ayuda">Libres: <span class="mono">${lista(nodo.libresContexto)}</span><br>Ligadas: <span class="mono">${lista(nodo.ligadasContexto)}</span></p></div>` : ''}
    ${nodo.ast.tipo === 'var' ? cuantificador
      ? `<p class="arbol-nota">Esta aparición está ligada por <button type="button" class="enlace mono" data-arbol-elegir="${cuantificador.id}">${escapar(cuantificador.etiqueta)}</button>.</p>`
      : '<p class="arbol-nota">Esta aparición es libre en la fórmula completa.</p>' : ''}
    ${nodo.grupo === 'cuantificador' ? `<p class="arbol-nota">${nodo.aparicionesLigadas.length
      ? `Se ${nodo.aparicionesLigadas.length === 1 ? 'resalta 1 aparición ligada' : `resaltan ${nodo.aparicionesLigadas.length} apariciones ligadas`} por este cuantificador.`
      : 'Este cuantificador no liga ninguna aparición.'} Un cuantificador interior con la misma variable inicia su propio alcance.</p>` : ''}`;
}

/** Dibuja conexiones y nodos; solo el nodo elegido entra en la secuencia de Tab. */
export function svgArbolHTML(arbol, distribucion, elegido = arbol.raizId) {
  const { cajas, ancho, alto } = distribucion;
  const conexiones = arbol.nodos.flatMap((nodo) => nodo.hijos.map((id) => {
    const padre = cajas.get(nodo.id), hijo = cajas.get(id);
    const y = padre.y + padre.alto, medio = (y + hijo.y) / 2;
    return `<path d="M ${padre.x} ${y} C ${padre.x} ${medio}, ${hijo.x} ${medio}, ${hijo.x} ${hijo.y}"/>`;
  })).join('');
  return `<svg class="arbol-svg" xmlns="http://www.w3.org/2000/svg" width="${ancho}" height="${alto}" viewBox="0 0 ${ancho} ${alto}" role="group" aria-label="Nodos del árbol sintáctico">
    <g class="arbol-conexiones" aria-hidden="true">${conexiones}</g>
    ${arbol.nodos.map((nodo) => {
      const caja = cajas.get(nodo.id);
      return `<g class="arbol-nodo arbol-${nodo.grupo}" transform="translate(${caja.x - caja.ancho / 2} ${caja.y})" data-arbol-nodo="${nodo.id}" role="button" tabindex="${nodo.id === elegido ? 0 : -1}" aria-pressed="${nodo.id === elegido}" aria-label="${escapar(`${nodo.tipo}: ${nodo.etiqueta}, nivel ${nodo.profundidad + 1}`)}">
        <title>${escapar(`${nodo.tipo}: ${nodo.etiqueta}`)}</title>
        <rect width="${caja.ancho}" height="${caja.alto}" rx="6"/>
        <text x="${caja.ancho / 2}" y="${caja.alto / 2}" dy=".35em" text-anchor="middle" aria-hidden="true">${escapar(nodo.etiqueta)}</text>
      </g>`;
    }).join('')}</svg>`;
}

/**
 * Monta el visor sin modificar la fórmula, la revisión ni el resultado.
 * @param {HTMLElement|null} contenedor  panel creado por panelArbolHTML
 * @param {object} revision  revisión actual del ejercicio
 * @returns {{actualizar: Function, destruir: Function}|null} destruir desconecta el observador de tamaño
 */
export function montarArbol(contenedor, revision) {
  if (!contenedor) return null;
  const contenido = contenedor.querySelector('[data-arbol-contenido]');
  let arbol, distribucion, seleccionado, zoom = 1, claveAnterior;
  let observador;
  const $ = (s) => contenido.querySelector(s);
  const elementoNodo = (id) => $(`[data-arbol-nodo="${id}"]`);

  /** Sincroniza nodo activo, detalle y resaltado; al navegar, desplaza solo el lienzo. */
  function seleccionar(id, enfocar = false) {
    const nodo = arbol.porId.get(id);
    if (!nodo) return;
    seleccionado = id;
    contenido.querySelectorAll('[data-arbol-nodo]').forEach((elemento) => {
      const actual = arbol.porId.get(elemento.dataset.arbolNodo);
      const activo = actual.id === id;
      elemento.setAttribute('aria-pressed', String(activo));
      elemento.setAttribute('tabindex', activo ? '0' : '-1');
      elemento.classList.toggle('arbol-ligada', actual.cuantificadorId === id);
    });
    $('[data-arbol-detalle]').innerHTML = detalleHTML(arbol, id);
    if (enfocar) {
      const elemento = elementoNodo(id);
      elemento.focus({ preventScroll: true });
      // Solo desplaza el lienzo: navegar con flechas no mueve toda la página.
      const ventana = $('[data-arbol-ventana]');
      const limites = ventana.getBoundingClientRect(), caja = elemento.getBoundingClientRect();
      if (caja.left < limites.left) ventana.scrollLeft -= limites.left - caja.left + 12;
      else if (caja.right > limites.right) ventana.scrollLeft += caja.right - limites.right + 12;
      if (caja.top < limites.top) ventana.scrollTop -= limites.top - caja.top + 12;
      else if (caja.bottom > limites.bottom) ventana.scrollTop += caja.bottom - limites.bottom + 12;
    }
  }

  /** Centra horizontalmente el árbol y vuelve al nivel de la raíz. */
  function centrar() {
    const ventana = $('[data-arbol-ventana]');
    ventana.scrollLeft = (ventana.scrollWidth - ventana.clientWidth) / 2;
    ventana.scrollTop = 0;
  }

  /** Limita el zoom entre 40 % y 200 %, conservando el centro visible cuando se solicita. */
  function cambiarZoom(nuevo, mantenerCentro = true) {
    const ventana = $('[data-arbol-ventana]');
    const centroX = (ventana.scrollLeft + ventana.clientWidth / 2) / ventana.scrollWidth;
    const centroY = (ventana.scrollTop + ventana.clientHeight / 2) / ventana.scrollHeight;
    zoom = Math.max(.4, Math.min(2, Math.round(nuevo * 100) / 100));
    const svg = $('.arbol-svg');
    svg.setAttribute('width', distribucion.ancho * zoom);
    svg.setAttribute('height', distribucion.alto * zoom);
    $('[data-arbol-zoom]').textContent = `${Math.round(zoom * 100)} %`;
    $('[data-arbol-control="alejar"]').disabled = zoom <= .4;
    $('[data-arbol-control="acercar"]').disabled = zoom >= 2;
    if (mantenerCentro) {
      ventana.scrollLeft = centroX * ventana.scrollWidth - ventana.clientWidth / 2;
      ventana.scrollTop = centroY * ventana.scrollHeight - ventana.clientHeight / 2;
    } else centrar();
  }

  /** Reconstruye el árbol solo si cambió su sintaxis o sus errores; en otro caso conserva la vista. */
  function actualizar(actual) {
    // Conservar la selección y el zoom al editar solo interpretación o entorno.
    const clave = JSON.stringify([actual.ast, actual.errores.lenguaje, actual.errores.formula.map((e) => [e.categoria, e.message, e.pos])]);
    if (clave === claveAnterior) return;
    claveAnterior = clave;
    observador?.disconnect();
    if (!actual.ast) {
      arbol = null;
      contenido.innerHTML = `<div class="arbol-vacio"><p class="ayuda">El árbol aparecerá cuando la fórmula esté bien formada.</p>${actual.errores.lenguaje.length
        ? '<p class="aviso">Revisa los símbolos declarados en Lenguaje.</p>' : erroresHTML(actual.errores.formula, 'formula')}</div>`;
      return;
    }
    arbol = crearArbol(actual.ast);
    distribucion = distribuirArbol(arbol);
    contenido.innerHTML = `<div class="arbol-barra"><p class="ayuda">Selecciona un nodo para explorar su estructura.</p>
      <div class="arbol-controles" role="group" aria-label="Controles del árbol">
        <button type="button" data-arbol-control="alejar" aria-label="Alejar árbol">−</button>
        <output data-arbol-zoom aria-label="Zoom del árbol">100 %</output>
        <button type="button" data-arbol-control="acercar" aria-label="Acercar árbol">+</button>
        <button type="button" data-arbol-control="restablecer">Restablecer</button>
        <button type="button" data-arbol-control="centrar">Centrar</button>
      </div></div>
      <div class="arbol-cuerpo"><div class="arbol-grafico">
        <div class="arbol-ventana" data-arbol-ventana tabindex="0" role="region" aria-label="Vista desplazable del árbol" aria-describedby="arbol-ayuda">${svgArbolHTML(arbol, distribucion)}</div>
        <div class="arbol-leyenda" aria-label="Tipos de nodo"><span class="arbol-color-cuantificador">Cuantificadores</span><span class="arbol-color-conectivo">Conectivos</span><span>Átomos</span><span class="arbol-color-termino">Términos</span></div>
        <p class="ayuda" id="arbol-ayuda">Desplaza la vista para recorrer el árbol. En un nodo: ↑ padre, ↓ primer hijo, ← / → nodo anterior o siguiente.</p>
      </div><aside class="arbol-detalle" data-arbol-detalle aria-label="Información del nodo seleccionado" aria-live="polite" aria-atomic="true"></aside></div>`;
    seleccionar(arbol.raizId);
    cambiarZoom(1, false);
    if (typeof ResizeObserver !== 'undefined') {
      let anchoAnterior = $('[data-arbol-ventana]').clientWidth;
      observador = new ResizeObserver(() => {
        const ventana = $('[data-arbol-ventana]');
        if (ventana && ventana.clientWidth !== anchoAnterior) {
          anchoAnterior = ventana.clientWidth;
          ventana.scrollLeft = (ventana.scrollWidth - ventana.clientWidth) / 2;
        }
      });
      observador.observe($('[data-arbol-ventana]'));
    }
  }

  contenedor.addEventListener('click', (evento) => {
    if (!arbol) return;
    const nodo = evento.target.closest('[data-arbol-nodo], [data-arbol-elegir]');
    if (nodo) { seleccionar(nodo.dataset.arbolNodo || nodo.dataset.arbolElegir, true); return; }
    const control = evento.target.closest('[data-arbol-control]')?.dataset.arbolControl;
    if (control === 'acercar') cambiarZoom(zoom + .2);
    if (control === 'alejar') cambiarZoom(zoom - .2);
    if (control === 'restablecer') cambiarZoom(1, false);
    if (control === 'centrar') centrar();
  });
  contenedor.addEventListener('keydown', (evento) => {
    const elemento = evento.target.closest('[data-arbol-nodo]');
    if (!arbol || !elemento) return;
    const nodo = arbol.porId.get(elemento.dataset.arbolNodo);
    const indice = arbol.nodos.indexOf(nodo);
    const destino = {
      ArrowUp: nodo.padreId, ArrowDown: nodo.hijos[0],
      ArrowLeft: arbol.nodos[indice - 1]?.id, ArrowRight: arbol.nodos[indice + 1]?.id,
      Home: arbol.raizId, End: arbol.nodos.at(-1).id,
      Enter: nodo.id, ' ': nodo.id,
    };
    if (Object.hasOwn(destino, evento.key)) {
      evento.preventDefault();
      seleccionar(destino[evento.key] || seleccionado, true);
    }
  });
  actualizar(revision);
  return { actualizar, destruir: () => observador?.disconnect() };
}
