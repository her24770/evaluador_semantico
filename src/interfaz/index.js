import './estilos/index.css';
import { crearEstado, revisarEntrada, invalidarResultado } from './modelo.js';
import { insertarSimbolo } from './editor.js';
import { estructura, SECCIONES } from './componentes/estructura.js';
import { erroresHTML } from './componentes/comunes.js';
import { lenguaje, firmaHTML } from './vistas/lenguaje.js';
import { interpretacion } from './vistas/interpretacion.js';
import { formula, feedbackFormula } from './vistas/formula.js';
import { entorno } from './vistas/entorno.js';
import { dictamen, casosHTML } from './vistas/resultados.js';

export function iniciarInterfaz(raiz) {
  const estado = crearEstado();
  const paginas = {};
  let revision = revisarEntrada(estado);
  let contador = 0;
  let seleccion = { inicio: 0, fin: 0 };
  let ocupado = false;
  let worker = null;
  let temporizador;
  let fallo = '';
  const $ = (selector) => raiz.querySelector(selector);
  raiz.innerHTML = estructura();

  function anunciar(mensaje) { $('#anuncio').textContent = mensaje; }

  function detenerEvaluacion() {
    if (worker) {
      worker.onmessage = null;
      worker.onerror = null;
      worker.terminate();
    }
    worker = null;
    clearTimeout(temporizador);
    ocupado = false;
  }

  function renderizar(enfocar = false) {
    const indice = SECCIONES.findIndex((s) => s.id === estado.seccion);
    const actual = SECCIONES[indice];
    raiz.dataset.vista = actual.id;
    raiz.querySelectorAll('.navegacion button').forEach((b) => {
      if (b.dataset.seccion === actual.id) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });
    $('#titulo-vista').textContent = actual.nombre;
    const vistas = {
      lenguaje: () => lenguaje(estado, revision),
      interpretacion: () => interpretacion(estado, revision, paginas),
      formula: () => formula(estado, revision, ocupado, fallo),
      entorno: () => entorno(estado, revision),
      resultados: () => formula(estado, revision, ocupado, fallo),
    };
    $('#vista').innerHTML = vistas[actual.id]() + `<div class="acciones-pagina">
      ${indice ? `<button type="button" class="enlace" data-action="navegar" data-seccion="${SECCIONES[indice - 1].id}">← ${SECCIONES[indice - 1].nombre}</button>` : '<span></span>'}
      ${indice < 3 ? `<button type="button" class="boton ${indice === 2 ? 'secundario' : 'primario'}" data-action="navegar" data-seccion="${SECCIONES[indice + 1].id}">Continuar a ${SECCIONES[indice + 1].nombre.toLowerCase()} →</button>` : indice === 3 ? '<button type="button" class="boton primario" data-action="evaluar">Evaluar fórmula →</button>' : ''}</div>`;
    const barra = $('.navegacion');
    const activo = $(`.navegacion button[aria-current]`).getBoundingClientRect();
    const limites = barra.getBoundingClientRect();
    if (activo.right > limites.right) barra.scrollLeft += activo.right - limites.right;
    else if (activo.left < limites.left) barra.scrollLeft -= limites.left - activo.left;
    if (enfocar) $('#titulo-vista').focus({ preventScroll: true });
  }

  function navegar(seccion) {
    if (!SECCIONES.some((s) => s.id === seccion)) return;
    estado.seccion = seccion;
    revision = revisarEntrada(estado);
    renderizar(true);
    const editor = $('#formula');
    if (editor) editor.setSelectionRange(seleccion.inicio, seleccion.fin);
  }

  function actualizarValidaciones() {
    revision = revisarEntrada(estado);
    const cambios = [
      ['#errores-lenguaje', erroresHTML(revision.errores.lenguaje, 'lenguaje')],
      ['#firma-resumen', firmaHTML(revision)],
      ['#errores-interpretacion', erroresHTML(revision.errores.interpretacion, 'interpretacion')],
      ['#errores-entorno', erroresHTML(revision.errores.entorno, 'entorno')],
      ['#formula-feedback', feedbackFormula(estado, revision)],
      ['#dictamen-contenedor', dictamen(estado, revision, ocupado, fallo)],
      ['#casos-preview', casosHTML(null)],
      ['#explicacion-contenedor', ''],
    ];
    cambios.forEach(([selector, html]) => { const destino = $(selector); if (destino) destino.innerHTML = html; });
    const botonEvaluar = $('[data-action="evaluar"]');
    if (botonEvaluar) botonEvaluar.disabled = false;
    const resumen = $('#entorno-resumen');
    if (resumen) resumen.textContent = !revision.ast ? 'Escribe una fórmula bien formada.' : revision.libres.length
      ? `Variables libres: ${revision.libres.join(', ')}. Asígnalas en Entorno.` : 'Fórmula cerrada. No requiere asignaciones.';
  }

  function guardarEntrada(elemento) {
    const d = elemento.dataset;
    if (d.entrada) {
      estado[d.entrada] = elemento.value;
      if (d.entrada === 'formula') seleccion = { inicio: elemento.selectionStart, fin: elemento.selectionEnd };
    }
    else if (d.campo) estado[d.tipo].find((s) => s.id === d.id)[d.campo] = elemento.value;
    else if (d.tabla) estado.funciones.find((s) => s.id === d.tabla).tabla[d.clave] = elemento.value;
    else if (d.relacion) estado.predicados.find((s) => s.id === d.relacion).relacion = elemento.value;
    else if (d.variable) Object.defineProperty(estado.entorno, d.variable, { value: elemento.value, writable: true, enumerable: true, configurable: true });
    else return;
    detenerEvaluacion();
    invalidarResultado(estado);
    fallo = '';
    actualizarValidaciones();
  }

  function evaluar() {
    detenerEvaluacion();
    estado.resultado = null;
    estado.evaluacionSolicitada = true;
    fallo = '';
    revision = revisarEntrada(estado);
    estado.seccion = 'resultados';
    if (!revision.valido) {
      renderizar(true);
      anunciar('Hay entradas inválidas. Revisa los errores.');
      return;
    }
    ocupado = true;
    renderizar(true);
    // Los cuantificadores pueden ser costosos. El evaluador real corre fuera
    // del hilo de la interfaz y puede cancelarse sin perder las entradas.
    worker = new Worker(new URL('./evaluacion.worker.js', import.meta.url), { type: 'module' });
    worker.onmessage = ({ data }) => {
      detenerEvaluacion();
      estado.resultado = data.resultado;
      revision.errores = data.errores;
      revision.valido = Object.values(data.errores).every((lista) => !lista.length);
      renderizar();
      anunciar(data.resultado ? `Resultado: ${data.resultado.valor ? 'verdadero' : 'falso'}.` : 'La evaluación encontró errores.');
    };
    worker.onerror = () => {
      detenerEvaluacion();
      fallo = 'No se pudo completar la evaluación. Revisa las entradas e inténtalo de nuevo.';
      renderizar();
      anunciar(fallo);
    };
    worker.postMessage(estado);
    temporizador = setTimeout(() => {
      detenerEvaluacion();
      fallo = 'La evaluación superó los 10 segundos. Reduce el dominio o la complejidad de la fórmula y vuelve a intentarlo.';
      renderizar();
      anunciar(fallo);
    }, 10000);
  }

  raiz.addEventListener('input', (e) => guardarEntrada(e.target));
  raiz.addEventListener('change', (e) => {
    // Regenera las tablas al terminar de editar el dominio, sin interrumpir
    // la escritura. Los selectores ya emiten el evento input.
    if (e.target.dataset.entrada === 'dominioTexto') {
      const plantilla = document.createElement('template');
      plantilla.innerHTML = interpretacion(estado, revision, paginas);
      const tablas = $('#vista .rejilla-doble');
      const nuevas = plantilla.content.querySelector('.rejilla-doble');
      if (tablas && nuevas) tablas.replaceWith(nuevas);
    }
  });
  ['select', 'keyup', 'pointerup', 'focusout'].forEach((tipo) => raiz.addEventListener(tipo, (e) => {
    if (e.target.id === 'formula') seleccion = { inicio: e.target.selectionStart, fin: e.target.selectionEnd };
  }, true));
  raiz.addEventListener('pointerdown', (e) => {
    if (e.target.closest('[data-action="insertar"]')) e.preventDefault();
  });
  raiz.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); evaluar(); }
  });
  raiz.addEventListener('click', (e) => {
    const boton = e.target.closest('[data-action]');
    if (!boton || boton.disabled) return;
    const d = boton.dataset;
    switch (d.action) {
      case 'navegar': navegar(d.seccion); break;
      case 'agregar-simbolo': {
        detenerEvaluacion();
        const id = `s${++contador}`;
        estado[d.tipo].push({ id, nombre: '', aridad: '1', tabla: {}, relacion: '' });
        invalidarResultado(estado);
        revision = revisarEntrada(estado);
        renderizar();
        $(`#nombre-${id}`).focus();
        break;
      }
      case 'quitar-simbolo': {
        const posicion = estado[d.tipo].findIndex((s) => s.id === d.id);
        estado[d.tipo].splice(posicion, 1);
        detenerEvaluacion();
        invalidarResultado(estado);
        revision = revisarEntrada(estado);
        renderizar();
        $(`[data-action="agregar-simbolo"][data-tipo="${d.tipo}"]`).focus();
        break;
      }
      case 'insertar': insertarSimbolo($('#formula'), d.simbolo, seleccion); break;
      case 'evaluar': evaluar(); break;
      case 'cancelar': detenerEvaluacion(); fallo = 'Cancelaste la evaluación. Tus entradas se conservan.'; renderizar(); anunciar(fallo); break;
      case 'error-pos': {
        navegar(d.seccion === 'formula' ? 'formula' : 'interpretacion');
        const campo = d.seccion === 'formula' ? $('#formula') : $('#dominio');
        if (campo) { campo.focus(); campo.setSelectionRange(Number(d.pos), Number(d.pos) + 1); }
        break;
      }
      case 'pagina-tabla': paginas[d.id] = Number(d.pagina); renderizar(); break;
      case 'agregar-tupla': {
        const constructor = $(`[data-constructor="${d.id}"]`);
        const valores = [...constructor.querySelectorAll('select')].map((s) => s.value);
        if (valores.some((v) => !v)) { constructor.nextElementSibling.textContent = 'Elige un elemento para cada posición.'; break; }
        const simbolo = estado.predicados.find((s) => s.id === d.id);
        detenerEvaluacion();
        const tupla = valores.length === 1 && !/[()]/.test(simbolo.relacion ?? '')
          ? valores[0] : `(${valores.join(', ')})`;
        simbolo.relacion = `${simbolo.relacion?.trim() ? `${simbolo.relacion.trim()}, ` : ''}${tupla}`;
        invalidarResultado(estado);
        revision = revisarEntrada(estado);
        renderizar();
        $(`#relacion-${d.id}`).focus();
        break;
      }
      case 'expandir': case 'contraer':
        raiz.querySelectorAll('.arbol-explicacion details').forEach((detalle) => { detalle.open = d.action === 'expandir'; }); break;
    }
  });
  renderizar();
}
