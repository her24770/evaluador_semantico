/**
 * Variables libres y ligadas (requerimiento 4). Tema 08.
 *
 * Una ocurrencia de x está LIGADA si, subiendo en el árbol, se encuentra un ∀x o ∃x.
 * En otro caso está LIBRE. El cuantificador más interno es el que manda.
 */

/**
 * Recorre cada ocurrencia de variable de la fórmula.
 * @param {object} ast
 * @param {(nombre: string, ligada: boolean, nodo: object) => void} visitar
 */
export function recorrerOcurrencias(ast, visitar, ligadas = new Set()) {
  const enTermino = (t) => {
    if (t.tipo === 'var') visitar(t.nombre, ligadas.has(t.nombre), t);
    else t.args.forEach(enTermino);
  };

  switch (ast.tipo) {
    case 'pred':
      ast.args.forEach(enTermino);
      break;
    case 'igual':
      enTermino(ast.izq);
      enTermino(ast.der);
      break;
    case 'no':
      recorrerOcurrencias(ast.sub, visitar, ligadas);
      break;
    case 'y': case 'o': case 'imp': case 'sii':
      recorrerOcurrencias(ast.izq, visitar, ligadas);
      recorrerOcurrencias(ast.der, visitar, ligadas);
      break;
    case 'paratodo': case 'existe': {
      const nuevas = new Set(ligadas);
      nuevas.add(ast.variable);
      recorrerOcurrencias(ast.cuerpo, visitar, nuevas);
      break;
    }
    default:
      throw new Error(`Tipo de nodo desconocido: ${ast.tipo}`);
  }
}

/** Variables con al menos una ocurrencia libre, en orden de aparición. */
export function variablesLibres(ast) {
  const libres = [];
  recorrerOcurrencias(ast, (nombre, ligada) => {
    if (!ligada && !libres.includes(nombre)) libres.push(nombre);
  });
  return libres;
}

/** Variables con al menos una ocurrencia ligada, en orden de aparición. */
export function variablesLigadas(ast) {
  const ligadas = [];
  recorrerOcurrencias(ast, (nombre, ligada) => {
    if (ligada && !ligadas.includes(nombre)) ligadas.push(nombre);
  });
  return ligadas;
}

/** Tema 10: una fórmula es cerrada (enunciado) si no tiene variables libres. */
export const esCerrada = (ast) => variablesLibres(ast).length === 0;
