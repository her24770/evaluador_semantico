/**
 * Modelo visual del árbol sintáctico (AST): las partes que forman la fórmula.
 * Añade identificadores, relaciones padre-hijo y coordenadas para dibujarlo.
 * También enlaza cada aparición ligada con su cuantificador más cercano;
 * no calcula valores de verdad ni cambia la fórmula original.
 */
import { aCadena, terminoACadena, recorrerOcurrencias, variablesLibres, variablesLigadas } from '../../sintaxis/index.js';

const TIPOS = {
  paratodo: ['∀', 'Cuantificador universal', 'cuantificador'],
  existe: ['∃', 'Cuantificador existencial', 'cuantificador'],
  no: ['¬', 'Negación', 'conectivo'], y: ['∧', 'Conjunción', 'conectivo'],
  o: ['∨', 'Disyunción', 'conectivo'], imp: ['→', 'Implicación', 'conectivo'],
  sii: ['↔', 'Bicondicional', 'conectivo'], igual: ['=', 'Igualdad', 'atomo'],
  pred: ['', 'Predicado', 'atomo'], fun: ['', 'Función', 'termino'],
  var: ['', 'Variable', 'termino'],
};

/** Traduce cada forma del AST a una lista de hijos, conservando su orden de lectura. */
function hijosDe(ast) {
  switch (ast.tipo) {
    case 'paratodo': case 'existe': return [ast.cuerpo];
    case 'no': return [ast.sub];
    case 'y': case 'o': case 'imp': case 'sii': case 'igual': return [ast.izq, ast.der];
    case 'pred': case 'fun': return ast.args;
    case 'var': return [];
    default: throw new Error(`Tipo de nodo desconocido: ${ast.tipo}`);
  }
}

/**
 * Adaptación visual del AST, sin modificarlo ni volver a analizar el texto.
 * Los ID representan rutas, no nombres ni posiciones del texto: dos ∀x son distintos.
 * Se conserva la referencia ast para reconocer cada aparición del árbol original.
 * @param {object} ast  fórmula analizada por sintaxis
 * @returns {{raizId: string, nodos: object[], porId: Map, porAST: Map}}
 */
export function crearArbol(ast) {
  const nodos = [];
  const porId = new Map();
  const porAST = new Map();
  function visitar(actual, id, padreId, profundidad) {
    const [simbolo, tipo, grupo] = TIPOS[actual.tipo] ?? [];
    if (!tipo) throw new Error(`Tipo de nodo desconocido: ${actual.tipo}`);
    const etiqueta = grupo === 'cuantificador' ? `${simbolo}${actual.variable}` : simbolo || actual.nombre;
    const nodo = {
      id, padreId, profundidad, ast: actual, etiqueta, grupo,
      tipo: actual.tipo === 'fun' && !actual.args.length ? 'Constante' : tipo,
      hijos: [],
    };
    nodos.push(nodo);
    porId.set(id, nodo);
    porAST.set(actual, nodo);
    nodo.hijos = hijosDe(actual).map((hijo, i) => visitar(hijo, `${id}.${i}`, id, profundidad + 1).id);
    return nodo;
  }
  const raiz = visitar(ast, 'n', null, 0);
  // Sintaxis decide si cada aparición es libre o ligada. Aquí solo asociamos
  // una aparición ya clasificada con el cuantificador ancestral más cercano.
  recorrerOcurrencias(ast, (nombre, ligada, aparicion) => {
    const nodo = porAST.get(aparicion);
    nodo.cuantificadorId = null;
    if (!ligada) return;
    let padre = porId.get(nodo.padreId);
    while (padre) {
      if (padre.grupo === 'cuantificador' && padre.ast.variable === nombre) {
        nodo.cuantificadorId = padre.id;
        break;
      }
      padre = porId.get(padre.padreId);
    }
  });
  return { raizId: raiz.id, nodos, porId, porAST };
}

/**
 * Calcula los detalles solo al consultar un nodo, en lugar de hacerlo para todo el árbol.
 * Distingue las variables de la expresión aislada de las de la fórmula completa:
 * en ∀x P(x), x es libre al mirar solo P(x), pero está ligada en la fórmula completa.
 * @param {object} arbol  resultado de crearArbol
 * @param {string} id  ruta del nodo
 * @returns {object|null} texto, variables y enlaces de alcance; null si no existe el nodo
 */
export function detalleNodo(arbol, id) {
  const nodo = arbol.porId.get(id);
  if (!nodo) return null;
  const esTermino = nodo.grupo === 'termino';
  // Las utilidades públicas recorren fórmulas; un predicado contenedor permite
  // consultar un término con exactamente la misma lógica de variables.
  const formula = esTermino ? { tipo: 'pred', args: [nodo.ast] } : nodo.ast;
  const libresContexto = new Set();
  const ligadasContexto = new Set();
  recorrerOcurrencias(formula, (nombre, _ligada, aparicion) => {
    (arbol.porAST.get(aparicion).cuantificadorId ? ligadasContexto : libresContexto).add(nombre);
  });
  return {
    ...nodo, esTermino,
    texto: esTermino ? terminoACadena(nodo.ast) : aCadena(nodo.ast),
    libres: variablesLibres(formula), ligadas: variablesLigadas(formula),
    libresContexto: [...libresContexto], ligadasContexto: [...ligadasContexto],
    aparicionesLigadas: nodo.grupo === 'cuantificador'
      ? arbol.nodos.filter((n) => n.cuantificadorId === id).map((n) => n.id) : [],
  };
}

/**
 * Cada subárbol recibe su propia franja horizontal: no hay solapamientos.
 * Las anchuras dependen de la etiqueta completa, incluso con nombres largos.
 * Primero mide desde las hojas y después coloca desde la raíz hacia abajo.
 * @param {object} arbol  resultado de crearArbol
 * @returns {{cajas: Map, ancho: number, alto: number}} medidas y coordenadas en píxeles
 */
export function distribuirArbol(arbol) {
  const cajas = new Map();
  const margen = 28, separacion = 24, salto = 94, alto = 44;
  for (const nodo of [...arbol.nodos].reverse()) {
    const ancho = Math.max(64, Array.from(nodo.etiqueta).length * 14 + 28);
    const hijos = nodo.hijos.map((id) => cajas.get(id));
    const franja = Math.max(ancho, hijos.reduce((suma, h) => suma + h.franja, 0) + Math.max(0, hijos.length - 1) * separacion);
    cajas.set(nodo.id, { id: nodo.id, ancho, alto, franja });
  }
  const pendientes = [{ id: arbol.raizId, izquierda: margen }];
  for (let i = 0; i < pendientes.length; i++) {
    const { id, izquierda } = pendientes[i];
    const nodo = arbol.porId.get(id), caja = cajas.get(id);
    caja.x = izquierda + caja.franja / 2;
    caja.y = margen + nodo.profundidad * salto;
    const anchoHijos = nodo.hijos.reduce((suma, h) => suma + cajas.get(h).franja, 0) + Math.max(0, nodo.hijos.length - 1) * separacion;
    let cursor = izquierda + (caja.franja - anchoHijos) / 2;
    for (const hijo of nodo.hijos) {
      pendientes.push({ id: hijo, izquierda: cursor });
      cursor += cajas.get(hijo).franja + separacion;
    }
  }
  return {
    cajas, ancho: cajas.get(arbol.raizId).franja + margen * 2,
    alto: Math.max(...arbol.nodos.map((n) => n.profundidad)) * salto + alto + margen * 2,
  };
}
