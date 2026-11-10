/**
 * Análisis léxico: parte el texto de la fórmula en piezas (tokens).
 * Ejemplo: "∀x P(x)" → PARATODO, IDENT(x), IDENT(P), ABRE, IDENT(x), CIERRA, FIN
 *
 * Cada símbolo lógico acepta su forma Unicode y una alternativa de teclado
 * (requerimiento 5: edición con teclado).
 */
import { ErrorLogico } from './errores.js';

// El orden importa: primero los símbolos largos ("<->" antes que "->", "!=" antes que "!").
const SIMBOLOS = [
  ['<->', 'SII'], ['<=>', 'SII'], ['↔', 'SII'],
  ['->', 'IMP'], ['=>', 'IMP'], ['→', 'IMP'],
  ['/\\', 'Y'], ['&', 'Y'], ['∧', 'Y'],
  ['\\/', 'O'], ['|', 'O'], ['∨', 'O'],
  ['!=', 'DISTINTO'], ['≠', 'DISTINTO'],
  ['¬', 'NO'], ['~', 'NO'], ['!', 'NO'],
  ['∀', 'PARATODO'], ['∃', 'EXISTE'],
  ['=', 'IGUAL'], ['(', 'ABRE'], [')', 'CIERRA'], [',', 'COMA'],
];

const PALABRAS = {
  forall: 'PARATODO', paratodo: 'PARATODO',
  exists: 'EXISTE', existe: 'EXISTE',
};

const RE_IDENT = /[\p{L}\p{N}_][\p{L}\p{N}_']*/uy;

/**
 * @param {string} texto
 * @returns {{tipo: string, texto: string, pos: number}[]}  termina siempre con FIN
 */
export function tokenizar(texto) {
  const tokens = [];
  let i = 0;

  siguiente:
  while (i < texto.length) {
    if (/\s/u.test(texto[i])) { i++; continue; }

    for (const [simbolo, tipo] of SIMBOLOS) {
      if (texto.startsWith(simbolo, i)) {
        tokens.push({ tipo, texto: simbolo, pos: i });
        i += simbolo.length;
        continue siguiente;
      }
    }

    RE_IDENT.lastIndex = i;
    const m = RE_IDENT.exec(texto);
    if (m) {
      const palabra = m[0];
      tokens.push({ tipo: PALABRAS[palabra.toLowerCase()] ?? 'IDENT', texto: palabra, pos: i });
      i += palabra.length;
      continue;
    }

    throw new ErrorLogico('sintaxis', `Carácter no reconocido "${texto[i]}".`, i);
  }

  tokens.push({ tipo: 'FIN', texto: '', pos: texto.length });
  return tokens;
}
