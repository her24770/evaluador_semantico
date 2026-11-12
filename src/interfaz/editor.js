/** setRangeText conserva la selección, incluso al activar la barra con teclado. */
export function insertarSimbolo(editor, simbolo, seleccion) {
  const inicio = seleccion?.inicio ?? editor.selectionStart;
  const fin = seleccion?.fin ?? editor.selectionEnd;
  const scroll = editor.scrollTop;
  editor.setRangeText(simbolo, inicio, fin, 'end');
  editor.focus({ preventScroll: true });
  editor.scrollTop = scroll;
  editor.dispatchEvent(new Event('input', { bubbles: true }));
}
