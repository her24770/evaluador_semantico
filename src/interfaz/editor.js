/**
 * Inserción de símbolos en los campos de fórmula y de lectura de fotos.
 * Reemplaza el texto seleccionado y deja el cursor después del símbolo.
 * Emite input para que se guarde y valide igual que al escribir con el teclado.
 *
 * @param {HTMLTextAreaElement} editor
 * @param {string} simbolo
 * @param {{inicio: number, fin: number}} [seleccion]  selección guardada; por defecto usa la actual
 */
export function insertarSimbolo(editor, simbolo, seleccion) {
  const inicio = seleccion?.inicio ?? editor.selectionStart;
  const fin = seleccion?.fin ?? editor.selectionEnd;
  const scroll = editor.scrollTop;
  editor.setRangeText(simbolo, inicio, fin, 'end');
  editor.focus({ preventScroll: true });
  editor.scrollTop = scroll;
  editor.dispatchEvent(new Event('input', { bubbles: true }));
}
