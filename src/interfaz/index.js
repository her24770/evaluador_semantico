import './estilos/index.css';
import { crearEstado, crearEstadoFoto, revisarEntrada, invalidarResultado, seccionPendiente } from './modelo.js';
import { insertarSimbolo } from './editor.js';
import { estructura, SECCIONES } from './componentes/estructura.js';
import { erroresHTML, guardarPropio } from './componentes/comunes.js';
import { resumenEntornoHTML } from './componentes/resumen.js';
import { lenguaje, firmaHTML } from './vistas/lenguaje.js';
import { interpretacion } from './vistas/interpretacion.js';
import { formula, feedbackFormula, accionesFormulaHTML } from './vistas/formula.js';
import { entorno } from './vistas/entorno.js';
import { dictamen, resultados } from './vistas/resultados.js';
import { montarArbol } from './arbol/visor.js';
import { resultadoSustitucionHTML, calcularSustitucion } from './sustitucion/vista.js';
import { aCadena, simbolosNoDeclarados } from '../sintaxis/index.js';
import { panelFotoHTML, revisionFotoHTML } from './foto/vista.js';
import { leerFormulaDeFoto, cargarConfiguracion, guardarConfiguracion } from './foto/lector.js';
import { prepararImagen } from './foto/imagen.js';
import { montarTablaCuantificadores } from './cuantificadores/visor.js';

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
  let visorArbol = null;
  let visorCuantificadores = null;
  // La API key vive fuera de `estado` para que nunca se envíe al worker.
  const configFoto = cargarConfiguracion();
  let lecturaFoto = null;
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
    visorArbol?.destruir();
    visorCuantificadores?.destruir();
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
      formula: () => formula(estado, revision, ocupado, configFoto),
      entorno: () => entorno(estado, revision),
      resultados: () => resultados(estado, revision, ocupado, fallo),
    };
    $('#vista').innerHTML = vistas[actual.id]() + `<div class="acciones-pagina">
      ${indice ? `<button type="button" class="enlace" data-action="navegar" data-seccion="${SECCIONES[indice - 1].id}">← ${SECCIONES[indice - 1].nombre}</button>` : '<span></span>'}
      ${indice < 2 ? `<button type="button" class="boton primario" data-action="navegar" data-seccion="${SECCIONES[indice + 1].id}">Continuar a ${SECCIONES[indice + 1].nombre.toLowerCase()} →</button>` : indice === 3 ? '<button type="button" class="boton primario" data-action="evaluar">Evaluar fórmula →</button>' : ''}</div>`;
    visorArbol = montarArbol($('#arbol-sintactico'), revision);
    visorCuantificadores = montarTablaCuantificadores($('#cuantificadores-contenedor'), estado.tablaCuantificadores);
    const barra = $('.navegacion');
    const activo = $(`.navegacion button[aria-current]`).getBoundingClientRect();
    const limites = barra.getBoundingClientRect();
    if (activo.right > limites.right) barra.scrollLeft += activo.right - limites.right;
    else if (activo.left < limites.left) barra.scrollLeft -= limites.left - activo.left;
    if (enfocar) $('#titulo-vista').focus();
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
      ['#explicacion-contenedor', ''],
      ['#cuantificadores-contenedor', ''],
      ['#acciones-formula', accionesFormulaHTML(revision, ocupado)],
      ['#entorno-resumen', resumenEntornoHTML(revision)],
      ['#sustitucion-resultado', resultadoSustitucionHTML(estado, revision)],
    ];
    if ($('#foto-revision')) cambios.push(['#foto-revision', revisionFotoHTML(estado)]);
    visorCuantificadores?.destruir();
    visorCuantificadores = null;
    cambios.forEach(([selector, html]) => { const destino = $(selector); if (destino) destino.innerHTML = html; });
    visorArbol?.actualizar(revision);
  }

  function prepararEvaluacion() {
    if (ocupado) { navegar('resultados'); return; }
    revision = revisarEntrada(estado);
    const pendiente = seccionPendiente(revision);
    if (pendiente) {
      navegar(pendiente);
      anunciar('Revisa las entradas de esta sección antes de evaluar.');
      if (pendiente === 'formula') $('#formula')?.focus();
      if (pendiente === 'entorno') $('[data-variable]')?.focus();
      return;
    }
    evaluar();
  }

  // --- Leer fórmula desde una foto ---------------------------------------------

  function refrescarFoto(enfocar) {
    const panelFoto = $('#foto-panel');
    if (panelFoto) panelFoto.outerHTML = panelFotoHTML(estado, configFoto);
    if (enfocar) $(enfocar)?.focus();
  }

  async function cargarFoto(archivo) {
    if (!archivo) return;
    lecturaFoto?.abort();
    const { configurando } = estado.foto;
    try {
      const imagen = await prepararImagen(archivo);
      estado.foto = { ...crearEstadoFoto(), imagen, configurando };
    } catch (error) {
      estado.foto = { ...crearEstadoFoto(), configurando, fase: 'error', error: error.message };
      refrescarFoto();
      anunciar(error.message);
      return;
    }
    if (configFoto.clave) leerFoto();
    else { estado.foto.configurando = true; refrescarFoto('#foto-clave'); anunciar('Foto cargada. Pega tu API key de OpenAI para leerla.'); }
  }

  async function leerFoto() {
    if (!estado.foto.imagen) return;
    lecturaFoto?.abort();
    const control = new AbortController();
    lecturaFoto = control;
    const anterior = estado.foto.texto;
    Object.assign(estado.foto, { fase: 'leyendo', error: '' });
    refrescarFoto();
    anunciar('Leyendo la fórmula de la foto…');
    try {
      const r = await leerFormulaDeFoto({
        imagen: estado.foto.imagen, clave: configFoto.clave, modelo: configFoto.modelo, senal: control.signal,
        simbolos: [...estado.funciones, ...estado.predicados].map((s) => s.nombre.trim()).filter(Boolean),
      });
      if (lecturaFoto !== control) return;
      if (r.legible) Object.assign(estado.foto, { fase: 'listo', texto: r.formula, leida: r.leida, dudas: r.dudas });
      else Object.assign(estado.foto, { fase: 'error', error: 'No encontré una fórmula en la foto. Prueba con una imagen más clara o más cerca.' });
    } catch (error) {
      if (lecturaFoto !== control) return;
      if (error?.name === 'AbortError') Object.assign(estado.foto, { fase: anterior ? 'listo' : 'vacio', texto: anterior });
      else Object.assign(estado.foto, { fase: 'error', error: error?.message || 'No se pudo leer la foto.' });
    }
    lecturaFoto = null;
    refrescarFoto(estado.foto.fase === 'listo' ? '#foto-texto' : null);
    anunciar(estado.foto.fase === 'listo' ? `Leí: ${estado.foto.texto}. Revísalo antes de usarlo.` : estado.foto.error);
  }

  function guardarEntrada(elemento) {
    const d = elemento.dataset;
    if (d.foto === 'archivo') return; // se procesa en el evento change
    if (d.foto === 'texto') {
      estado.foto.texto = elemento.value;
      const destino = $('#foto-revision');
      if (destino) destino.innerHTML = revisionFotoHTML(estado);
      const usar = $('[data-action="usar-foto"]');
      if (usar) usar.disabled = !elemento.value.trim();
      return;
    }
    if (d.fotoConfig) {
      configFoto[d.fotoConfig] = elemento.value.trim();
      guardarConfiguracion(configFoto);
      return;
    }
    // La sustitución no cambia la fórmula ni el resultado: solo se recalcula su panel.
    if (d.sustitucion) {
      estado.sustitucion[d.sustitucion] = elemento.value;
      const destino = $('#sustitucion-resultado');
      if (destino) destino.innerHTML = resultadoSustitucionHTML(estado, revision);
      return;
    }
    if (d.entrada) {
      estado[d.entrada] = elemento.value;
      if (d.entrada === 'formula') seleccion = { inicio: elemento.selectionStart, fin: elemento.selectionEnd };
    }
    else if (d.campo) estado[d.tipo].find((s) => s.id === d.id)[d.campo] = elemento.value;
    else if (d.tabla) guardarPropio(estado.funciones.find((s) => s.id === d.tabla).tabla, d.clave, elemento.value);
    else if (d.relacion) estado.predicados.find((s) => s.id === d.relacion).relacion = elemento.value;
    else if (d.variable) guardarPropio(estado.entorno, d.variable, elemento.value);
    else return;
    detenerEvaluacion();
    invalidarResultado(estado);
    fallo = '';
    actualizarValidaciones();
  }

  function evaluar() {
    detenerEvaluacion();
    invalidarResultado(estado);
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
      estado.tablaCuantificadores = data.tablaCuantificadores;
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
    worker.postMessage({ ...estado, foto: null });
    temporizador = setTimeout(() => {
      detenerEvaluacion();
      fallo = 'La evaluación superó los 10 segundos. Reduce el dominio o la complejidad de la fórmula y vuelve a intentarlo.';
      renderizar();
      anunciar(fallo);
    }, 10000);
  }

  raiz.addEventListener('input', (e) => guardarEntrada(e.target));
  raiz.addEventListener('change', (e) => {
    if (e.target.dataset.foto === 'archivo') { cargarFoto(e.target.files?.[0]); e.target.value = ''; return; }
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
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); prepararEvaluacion(); }
  });
  raiz.addEventListener('click', (e) => {
    const boton = e.target.closest('[data-action]');
    if (!boton || boton.disabled) return;
    const d = boton.dataset;
    switch (d.action) {
      case 'navegar': navegar(d.seccion); break;
      case 'editar-formula': navegar('formula'); $('#formula')?.focus(); break;
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
      case 'insertar':
        if (d.destino) {
          // Si el campo no tiene el foco, el símbolo va al final y no al inicio.
          const destino = $(`#${d.destino}`);
          const fin = destino.value.length;
          insertarSimbolo(destino, d.simbolo, document.activeElement === destino ? undefined : { inicio: fin, fin });
        } else insertarSimbolo($('#formula'), d.simbolo, seleccion);
        break;
      case 'config-foto': estado.foto.configurando = !estado.foto.configurando; refrescarFoto(estado.foto.configurando ? '#foto-clave' : '[data-action="config-foto"]'); break;
      case 'borrar-clave-foto': configFoto.clave = ''; guardarConfiguracion(configFoto); refrescarFoto('#foto-clave'); anunciar('Se borró la API key de este navegador.'); break;
      case 'leer-foto': leerFoto(); break;
      case 'cancelar-foto': lecturaFoto?.abort(); break;
      case 'ampliar-foto': estado.foto.ampliada = !estado.foto.ampliada; refrescarFoto('[data-action="ampliar-foto"]'); break;
      case 'descartar-foto': {
        lecturaFoto?.abort();
        lecturaFoto = null;
        estado.foto = { ...crearEstadoFoto(), configurando: estado.foto.configurando };
        refrescarFoto('.foto-archivo');
        break;
      }
      case 'agregar-simbolos-foto': {
        const faltantes = simbolosNoDeclarados(estado.foto.texto, revision.firma);
        if (!faltantes.length) break;
        detenerEvaluacion();
        for (const s of faltantes) estado[s.tipo].push({ id: `s${++contador}`, nombre: s.nombre, aridad: String(s.aridad), tabla: {}, relacion: '' });
        invalidarResultado(estado);
        revision = revisarEntrada(estado);
        renderizar();
        $('[data-action="usar-foto"]')?.focus();
        anunciar(`Se agregó ${faltantes.map((s) => s.nombre).join(', ')} al lenguaje. Completa su interpretación en la sección Interpretación.`);
        break;
      }
      case 'usar-foto': {
        const texto = estado.foto.texto.trim();
        if (!texto) break;
        detenerEvaluacion();
        estado.formula = texto;
        seleccion = { inicio: texto.length, fin: texto.length };
        invalidarResultado(estado);
        fallo = '';
        revision = revisarEntrada(estado);
        renderizar();
        $('#formula').focus();
        $('#formula').setSelectionRange(seleccion.inicio, seleccion.fin);
        anunciar(`La fórmula ahora es ${texto}.`);
        break;
      }
      case 'evaluar': prepararEvaluacion(); break;
      case 'usar-sustitucion': {
        const r = calcularSustitucion(estado, revision);
        if (!r || r.error) break;
        detenerEvaluacion();
        estado.formula = aCadena(r.resultado);
        seleccion = { inicio: estado.formula.length, fin: estado.formula.length };
        invalidarResultado(estado);
        fallo = '';
        revision = revisarEntrada(estado);
        renderizar();
        $('#formula').focus();
        $('#formula').setSelectionRange(seleccion.inicio, seleccion.fin);
        anunciar(`La fórmula ahora es ${estado.formula}.`);
        break;
      }
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
