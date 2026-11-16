/**
 * Piezas compartidas para construir el HTML de las vistas.
 * Los textos de entrada se escapan antes de insertarlos en una plantilla;
 * así un nombre o una fórmula se muestran como texto y no como etiquetas.
 */

/** Convierte los caracteres especiales de HTML en entidades; null y undefined se muestran vacíos. */
export const escapar = (valor) => String(valor ?? '').replace(/[&<>"']/g,
  (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/**
 * Muestra errores con su categoría y posición; en la fórmula permite saltar al carácter.
 * @param {{categoria: string, message: string, pos?: number}[]} errores
 * @param {string} seccion  sección a la que pertenece la entrada
 * @returns {string} HTML; vacío cuando no hay errores
 */
export function erroresHTML(errores, seccion) {
  if (!errores.length) return '';
  return `<ul class="errores">${errores.map((e) => `<li>
    <strong>${escapar(e.categoria)}:</strong> ${escapar(e.message)}
    ${Number.isInteger(e.pos) ? seccion === 'formula' ? `<button type="button" class="enlace" data-action="error-pos" data-seccion="${seccion}" data-pos="${e.pos}">Ir al carácter ${e.pos + 1}</button>` : `<span class="ayuda">Posición ${e.pos + 1} en la entrada.</span>` : ''}
  </li>`).join('')}</ul>`;
}

// Lee solo propiedades propias: una clave "toString" o "constructor" no debe leer el prototipo.
export const propio = (objeto, clave) => (objeto && Object.hasOwn(objeto, clave) ? objeto[clave] : undefined);

// Guarda la clave como propiedad propia: con "objeto[clave] = valor", la clave "__proto__" se perdería.
export function guardarPropio(objeto, clave, valor) {
  Object.defineProperty(objeto, clave, { value: valor, writable: true, enumerable: true, configurable: true });
}

/** Genera las opciones de un selector y señala un valor anterior que haya quedado fuera del dominio. */
export function opciones(dominio, valor = '') {
  return `<option value="">Elegir elemento</option>
    ${valor && !dominio.includes(valor) ? `<option value="${escapar(valor)}" selected>${escapar(valor)} (fuera del dominio)</option>` : ''}
    ${dominio.map((e) => `<option value="${escapar(e)}" ${valor === e ? 'selected' : ''}>${escapar(e)}</option>`).join('')}`;
}

/** Envuelve HTML ya preparado en un panel. Quien llama debe escapar sus textos de entrada. */
export function panel(titulo, contenido, clase = '') {
  return `<section class="panel ${clase}"><h2 class="titulo-tiza">${titulo}</h2>${contenido}</section>`;
}

// Panel de símbolos del editor de fórmula (también lo usa el panel de la foto).
export const SIMBOLOS = [['¬', 'Negación'], ['∧', 'Conjunción'], ['∨', 'Disyunción'], ['→', 'Implicación'], ['∀', 'Para todo'], ['∃', 'Existe'], ['(', 'Abrir paréntesis'], [')', 'Cerrar paréntesis']];
