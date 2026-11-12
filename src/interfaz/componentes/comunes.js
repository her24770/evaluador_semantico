export const escapar = (valor) => String(valor ?? '').replace(/[&<>"']/g,
  (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function erroresHTML(errores, seccion) {
  if (!errores.length) return '';
  return `<ul class="errores">${errores.map((e) => `<li>
    <strong>${escapar(e.categoria)}:</strong> ${escapar(e.message)}
    ${Number.isInteger(e.pos) ? seccion === 'formula' ? `<button type="button" class="enlace" data-action="error-pos" data-seccion="${seccion}" data-pos="${e.pos}">Ir al carácter ${e.pos + 1}</button>` : `<span class="ayuda">Posición ${e.pos + 1} en la entrada.</span>` : ''}
  </li>`).join('')}</ul>`;
}

export function opciones(dominio, valor = '') {
  return `<option value="">Elegir elemento</option>
    ${valor && !dominio.includes(valor) ? `<option value="${escapar(valor)}" selected>${escapar(valor)} (fuera del dominio)</option>` : ''}
    ${dominio.map((e) => `<option value="${escapar(e)}" ${valor === e ? 'selected' : ''}>${escapar(e)}</option>`).join('')}`;
}

export function panel(titulo, contenido, clase = '') {
  return `<section class="panel ${clase}"><h2 class="titulo-tiza">${titulo}</h2>${contenido}</section>`;
}
