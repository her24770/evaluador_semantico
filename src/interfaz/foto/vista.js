/**
 * Panel "Leer fórmula desde una foto" de la vista Fórmula.
 * Muestra la foto junto a lo que se leyó, deja corregirlo y dice si se puede usar.
 * La lectura está en lector.js; la limpieza del texto, en src/sintaxis/normalizar.js.
 */
import { simbolosNoDeclarados } from '../../sintaxis/index.js';
import { escapar, erroresHTML, SIMBOLOS } from '../componentes/comunes.js';
import { revisarEntrada } from '../modelo.js';

export function panelFotoHTML(estado) {
  const foto = estado.foto;
  return `<section class="panel foto-panel" id="foto-panel" aria-labelledby="foto-titulo">
    <h2 id="foto-titulo" class="titulo-tiza">Leer fórmula desde una foto</h2>
    <p class="ayuda">Sube una foto o captura de una fórmula. La app la lee, te deja corregirla y te dice si se puede evaluar.</p>
    <label class="boton secundario foto-subir">${foto.imagen ? 'Cambiar foto' : 'Subir o tomar foto'}
      <input type="file" accept="image/*" data-foto="archivo" class="foto-archivo">
    </label>
    <p class="ayuda">La foto se envía a OpenAI para leerla. Revisa siempre lo que se leyó antes de usarlo.</p>
    ${!foto.imagen && foto.error ? `<ul class="errores"><li><strong>foto:</strong> ${escapar(foto.error)}</li></ul>` : ''}
    ${foto.imagen ? `<div class="foto-contenido ${foto.ampliada ? 'ampliada' : ''}">
      <button type="button" class="foto-miniatura" data-action="ampliar-foto" aria-label="${foto.ampliada ? 'Achicar' : 'Agrandar'} la foto" title="${foto.ampliada ? 'Achicar' : 'Agrandar'}">
        <img src="${escapar(foto.imagen)}" alt="Foto subida con la fórmula">
      </button>
      <div class="foto-lectura">${lecturaHTML(estado)}</div>
    </div>` : ''}
  </section>`;
}

function lecturaHTML(estado) {
  const foto = estado.foto;
  if (foto.fase === 'leyendo') {
    return `<p class="aviso" role="status">Leyendo la fórmula…</p>
      <button type="button" class="boton secundario" data-action="cancelar-foto">Cancelar</button>`;
  }
  if (foto.fase === 'error') {
    return `<ul class="errores"><li><strong>foto:</strong> ${escapar(foto.error)}</li></ul>
      <button type="button" class="boton secundario" data-action="leer-foto">Intentar de nuevo</button>`;
  }
  if (foto.fase === 'vacio') {
    return '<button type="button" class="boton primario" data-action="leer-foto">Leer fórmula</button>';
  }
  return `<label for="foto-texto" class="etiqueta">Leí esto (puedes corregirlo)</label>
    <textarea id="foto-texto" class="mono foto-texto" data-foto="texto" rows="2" spellcheck="false" autocomplete="off">${escapar(foto.texto)}</textarea>
    <div class="simbolos simbolos-foto" role="group" aria-label="Insertar símbolo en lo leído">${SIMBOLOS.map(([s, n]) => `<button type="button" data-action="insertar" data-destino="foto-texto" data-simbolo="${s}" aria-label="Insertar ${n.toLowerCase()}" title="${n}">${s}</button>`).join('')}</div>
    ${dudasHTML(foto)}
    <div id="foto-revision" aria-live="polite">${revisionFotoHTML(estado)}</div>
    <div class="foto-acciones">
      <button type="button" class="boton primario" data-action="usar-foto" ${foto.texto.trim() ? '' : 'disabled'}>Usar como fórmula</button>
      <button type="button" class="boton secundario" data-action="leer-foto">Volver a leer</button>
      <button type="button" class="enlace" data-action="descartar-foto">Descartar</button>
    </div>`;
}

function dudasHTML(foto) {
  const cambio = foto.leida && foto.leida.trim() !== foto.texto.trim()
    ? `<p class="ayuda">Texto original de la lectura: <span class="mono">${escapar(foto.leida)}</span></p>` : '';
  if (!foto.dudas.length) return cambio;
  return `<div class="foto-dudas"><p class="aviso">⚠ Revisa estas partes:</p><ul>${foto.dudas.map((d) =>
    `<li><span class="mono">${escapar(d.fragmento)}</span>${d.alternativas?.length ? ` podría ser <span class="mono">${d.alternativas.map(escapar).join('</span> o <span class="mono">')}</span>` : ''}${d.motivo ? ` — ${escapar(d.motivo)}` : ''}</li>`).join('')}</ul>${cambio}</div>`;
}

/**
 * ¿Se puede operar lo leído? Usa las mismas revisiones que el editor principal.
 * @returns {string} HTML
 */
export function revisionFotoHTML(estado) {
  const texto = estado.foto.texto;
  if (!texto.trim()) return '<p class="ayuda">Escribe o corrige la fórmula leída.</p>';
  const revision = revisarEntrada({ ...estado, formula: texto });
  if (revision.errores.lenguaje.length) {
    return '<p class="aviso">⚠ El lenguaje tiene errores. Corrígelo en la sección Lenguaje para revisar esta fórmula.</p>';
  }
  const faltantes = simbolosNoDeclarados(texto, revision.firma);
  if (faltantes.length) {
    const tipo = (s) => (s.tipo === 'predicados' ? `predicado, aridad ${s.aridad}` : s.aridad === 0 ? 'constante' : `función, aridad ${s.aridad}`);
    const lista = faltantes.map((s) => `<span class="mono">${escapar(s.nombre)}</span> (${tipo(s)})`).join(', ');
    return `<p class="aviso">⚠ Usa símbolos que no están en el lenguaje: ${lista}.</p>
      <button type="button" class="boton secundario" data-action="agregar-simbolos-foto">Agregarlos al lenguaje</button>`;
  }
  if (revision.errores.formula.length) {
    return `<p class="foto-no-operable">✗ Todavía no es una fórmula válida</p>${erroresHTML(revision.errores.formula, 'foto')}`;
  }
  const tipo = revision.libres.length ? 'Abierta' : 'Cerrada';
  const pendientes = [];
  if (revision.errores.interpretacion.length) pendientes.push('completar la interpretación (dominio, constantes, funciones y relaciones)');
  if (revision.errores.entorno.length) pendientes.push(`dar valor a ${revision.libres.length === 1 ? 'la variable libre' : 'las variables libres'} ${revision.libres.map(escapar).join(', ')}`);
  return `<p class="correcto">✓ Fórmula bien formada · ${tipo}</p>
    <p class="ayuda">${pendientes.length ? `Se puede usar. Para evaluarla falta ${pendientes.join(' y ')}.` : 'Se puede usar y evaluar con la interpretación actual.'}</p>`;
}
