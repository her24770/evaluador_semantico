/**
 * Limpia una fórmula leída de una foto (o pegada de otro lado) para que use
 * la notación de la app. No cambia el significado: solo cambia símbolos
 * equivalentes por los que muestra el panel de símbolos.
 *   normalizarFormula('forall x (P(x) -> Q(x))')  →  '∀x (P(x) → Q(x))'
 */
import { tokenizar } from './lexer.js';

// El orden importa: primero los símbolos largos ("<->" antes que "->", "!=" antes que "!").
const REEMPLAZOS = [
  [/[‐‑–—−]/g, '-'], // guiones largos: "—>" también es una flecha
  [/<->|<=>|⇔|⟺|≡/g, '↔'],
  [/->|=>|⇒|⟶|⟹|⊃/g, '→'],
  [/!=|=\/=/g, '≠'],
  [/\/\\|&&?|⋀|·|⋅/g, '∧'],
  [/\\\/|\|\|?|⋁/g, '∨'],
  [/[~∼￢!]/g, '¬'],
  [/[\[{]/g, '('],
  [/[\]}]/g, ')'],
];

export function normalizarFormula(texto) {
  let resultado = String(texto ?? '').normalize('NFC');
  for (const [patron, simbolo] of REEMPLAZOS) resultado = resultado.replace(patron, simbolo);
  return resultado
    .replace(/\b(?:forall|paratodo)\b\s*/giu, '∀')
    .replace(/\b(?:exists|existe)\b\s*/giu, '∃')
    // "∀ x" → "∀x", como lo escribe el curso.
    .replace(/([∀∃])\s+/gu, '$1')
    .replace(/\s+/gu, ' ')
    .replace(/[\s.;]+$/u, '')
    .trim();
}

/**
 * Busca nombres usados como símbolo (seguidos de "(") que no están en la firma.
 * Un nombre fuera de los paréntesis de otro símbolo es un predicado; dentro, una función.
 *   simbolosNoDeclarados('∀x R(x, f(x))', firmaVacia)
 *     → [{ nombre: 'R', aridad: 2, tipo: 'predicados' }, { nombre: 'f', aridad: 1, tipo: 'funciones' }]
 *
 * @returns {{nombre: string, aridad: number, tipo: 'predicados' | 'funciones'}[]}
 */
export function simbolosNoDeclarados(texto, firma) {
  let tokens;
  try { tokens = tokenizar(texto); } catch { return []; }
  const encontrados = new Map();
  const llamadas = []; // paréntesis abiertos: { simbolo, comas } si son de un símbolo, null si solo agrupan
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    // En "∀x (…)" la x es la variable del cuantificador, no un símbolo.
    const esVariableCuantificada = ['PARATODO', 'EXISTE'].includes(tokens[i - 1]?.tipo);
    if (t.tipo === 'IDENT' && tokens[i + 1]?.tipo === 'ABRE' && !esVariableCuantificada) {
      const dentro = llamadas.some(Boolean);
      const simbolo = { nombre: t.texto, tipo: dentro ? 'funciones' : 'predicados', comas: 0, vacio: tokens[i + 2]?.tipo === 'CIERRA' };
      llamadas.push(simbolo);
      i++;
    } else if (t.tipo === 'ABRE') llamadas.push(null);
    else if (t.tipo === 'COMA' && llamadas.at(-1)) llamadas.at(-1).comas++;
    else if (t.tipo === 'CIERRA') {
      const s = llamadas.pop();
      if (!s) continue;
      const declarado = firma.funciones.has(s.nombre) || firma.predicados.has(s.nombre);
      if (!declarado && !encontrados.has(s.nombre)) {
        encontrados.set(s.nombre, { nombre: s.nombre, aridad: s.vacio ? 0 : s.comas + 1, tipo: s.tipo });
      }
    }
  }
  // Orden de aparición en el texto.
  return [...encontrados.values()].sort((a, b) => texto.indexOf(`${a.nombre}(`) - texto.indexOf(`${b.nombre}(`));
}
