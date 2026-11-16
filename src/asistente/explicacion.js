/**
 * Descripciones locales de las reglas y pasos del evaluador.
 * Añaden una definición sencilla a la razón ya calculada y dividen los hijos
 * en páginas. No analizan fórmulas, no calculan V/F y no consultan a la IA.
 */
const REGLAS = {
  'atómica': ['Pertenencia a la relación', 'El algoritmo evalúa los términos y comprueba si la tupla obtenida pertenece a la relación del predicado.'],
  igualdad: ['Igualdad de términos', 'La igualdad es verdadera cuando los dos términos representan el mismo elemento del dominio.'],
  '¬': ['Negación', 'La negación invierte el valor de verdad de su subfórmula.'],
  '∧': ['Conjunción', 'Una conjunción es verdadera cuando sus dos subfórmulas son verdaderas.'],
  '∨': ['Disyunción', 'Una disyunción es verdadera cuando al menos una de sus subfórmulas es verdadera.'],
  '→': ['Implicación', 'Una implicación solo es falsa cuando el antecedente es verdadero y el consecuente es falso.'],
  '↔': ['Bicondicional', 'Un bicondicional es verdadero cuando sus dos subfórmulas tienen el mismo valor de verdad.'],
  '∀': ['Cuantificador universal', 'La condición debe cumplirse para todos los elementos del dominio. Un solo contraejemplo basta para que sea falsa.'],
  '∃': ['Cuantificador existencial', 'La condición debe cumplirse para al menos un elemento del dominio. Un testigo basta para que sea verdadera.'],
};

/**
 * Combina la definición de la regla con los datos de un paso sin modificarlos.
 * @param {object} nodo  nodo de explicación devuelto por el evaluador
 * @returns {object} fórmula, valor, regla, definición, razón, entorno y evidencia si existe
 */
export function describirPaso(nodo) {
  const [regla, definicion] = REGLAS[nodo.regla] ?? ['Paso del evaluador', 'Este paso utiliza la regla indicada por el evaluador.'];
  const evidencia = nodo.testigo ?? nodo.contraejemplo;
  return {
    formula: nodo.formula, valor: nodo.valor, regla, definicion, razon: nodo.razon, entorno: nodo.entorno,
    evidencia: evidencia ? { tipo: nodo.testigo ? 'Testigo' : 'Contraejemplo', ...evidencia } : null,
    completa: Boolean(nodo.completa),
  };
}

export const PASOS_POR_PAGINA = 8;
/**
 * Devuelve hasta ocho hijos y ajusta la página al rango disponible.
 * @param {object} nodo  paso con un arreglo hijos
 * @param {number} [pagina]  índice entero desde 0
 * @returns {{total: number, paginas: number, actual: number, inicio: number, hijos: object[]}}
 *   incluso sin hijos hay una página vacía, para simplificar los controles
 */
export function paginarHijos(nodo, pagina = 0) {
  const total = nodo.hijos.length;
  const paginas = Math.max(1, Math.ceil(total / PASOS_POR_PAGINA));
  const actual = Math.max(0, Math.min(paginas - 1, pagina));
  const inicio = actual * PASOS_POR_PAGINA;
  return { total, paginas, actual, inicio, hijos: nodo.hijos.slice(inicio, inicio + PASOS_POR_PAGINA) };
}
