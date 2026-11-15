/**
 * Sustitución φ[t/x]. Tema 08, diapositivas 9 a 13.
 *
 * φ[t/x] es la fórmula que resulta de cambiar cada ocurrencia LIBRE de x en φ
 * por el término t. Las ocurrencias ligadas de x no se tocan.
 *
 * Captura: si una x libre está dentro de ∀y o ∃y, y t contiene la variable y,
 * esa y quedaría "atrapada" por el cuantificador:
 *   φ = S(x) ∧ ∀y(P(x) → Q(y)),  t = f(y, y)
 *   sustitución directa:  S(f(y, y)) ∧ ∀y(P(f(y, y)) → Q(y))   ← y capturada
 * Entonces t NO es libre para x en φ. Como en el curso, primero se renombra
 * la variable ligada conflictiva con una variable nueva:
 *   φ[t/x] = S(f(y, y)) ∧ ∀z(P(f(y, y)) → Q(z))
 */
import { ErrorLogico } from './errores.js';
import { RESERVADAS } from './lenguaje.js';
import { analizarTermino } from './parser.js';
import { variablesLibres } from './variables.js';

// Variables nuevas que se prueban primero; después z1, z2, …
const CANDIDATAS = ['z', 'w', 'u', 'v', 's', 'r'];

/**
 * Lee la variable y el término que escribió el usuario y hace la sustitución.
 *   prepararSustitucion(φ, 'x', 'f(y, y)', firma) → { x: 'x', t: {…}, resultado, directa, libre, … }
 *
 * @param {object} ast  la fórmula φ (AST de analizar)
 * @param {string} textoVariable  la variable x
 * @param {string} textoTermino  el término t
 * @param {{funciones: Map<string, number>, predicados: Map<string, number>}} firma
 * @throws {ErrorLogico} si x no es una variable o t no es un término del lenguaje
 */
export function prepararSustitucion(ast, textoVariable, textoTermino, firma) {
  if (String(textoVariable ?? '').trim() === '') {
    throw new ErrorLogico('sustitución', 'Escribe la variable x que quieres sustituir.');
  }
  const variable = analizarTermino(textoVariable, firma);
  if (variable.tipo !== 'var') {
    throw new ErrorLogico('sustitución',
      `"${variable.nombre}" es un símbolo del lenguaje, no una variable. Solo se sustituyen variables.`, variable.pos);
  }
  const t = analizarTermino(textoTermino, firma);
  const simbolos = [...firma.funciones.keys(), ...firma.predicados.keys()];
  return { x: variable.nombre, t, ...sustituir(ast, variable.nombre, t, { reservados: simbolos }) };
}

/**
 * Calcula φ[t/x], renombrando variables ligadas si hace falta.
 *
 * @param {object} ast  φ
 * @param {string} x
 * @param {object} t  término (nodo 'var' o 'fun')
 * @param {{reservados?: string[]}} [opciones]  nombres que no pueden ser variables nuevas (símbolos de la firma)
 * @returns {{
 *   resultado: object,     φ[t/x] correcta (con renombres si hubo captura)
 *   directa: object,       sustitución directa, sin renombrar (puede tener capturas)
 *   libre: boolean,        ¿t es libre para x en φ?
 *   reemplazos: number,    cuántas ocurrencias libres de x se cambiaron
 *   capturas: {cuantificador: string, variable: string}[],
 *   renombres: {cuantificador: string, de: string, a: string}[],
 * }}
 */
export function sustituir(ast, x, t, { reservados = [] } = {}) {
  const enT = variablesDeTermino(t);
  const contexto = {
    x, t, enT,
    usadas: new Set([...todasLasVariables(ast), ...enT, x, ...reservados]),
    reemplazos: 0, capturas: [], renombres: [],
  };
  const resultado = sinCaptura(ast, contexto);
  const directa = directo(ast, x, t);
  return {
    resultado, directa,
    libre: contexto.capturas.length === 0,
    reemplazos: contexto.reemplazos,
    capturas: contexto.capturas,
    renombres: contexto.renombres,
  };
}

// --- Sustitución con renombre (la correcta) -----------------------------------

function sinCaptura(ast, c) {
  switch (ast.tipo) {
    case 'pred':
      return { ...ast, args: ast.args.map((a) => enTermino(a, c.x, c.t, c)) };
    case 'igual':
      return { ...ast, izq: enTermino(ast.izq, c.x, c.t, c), der: enTermino(ast.der, c.x, c.t, c) };
    case 'no':
      return { ...ast, sub: sinCaptura(ast.sub, c) };
    case 'y': case 'o': case 'imp': case 'sii':
      return { ...ast, izq: sinCaptura(ast.izq, c), der: sinCaptura(ast.der, c) };
    case 'paratodo': case 'existe': {
      const y = ast.variable;
      // Dentro de ∀x o ∃x, x está ligada: no hay nada que sustituir.
      // Si x no aparece libre en el cuerpo, tampoco.
      if (y === c.x || !variablesLibres(ast.cuerpo).includes(c.x)) return ast;
      if (!c.enT.has(y)) return { ...ast, cuerpo: sinCaptura(ast.cuerpo, c) };

      // Captura: t tiene la variable y, y hay una x libre dentro de ∀y / ∃y.
      const simbolo = ast.tipo === 'paratodo' ? '∀' : '∃';
      const z = variableNueva(c.usadas);
      c.usadas.add(z);
      c.capturas.push({ cuantificador: `${simbolo}${y}`, variable: y });
      c.renombres.push({ cuantificador: simbolo, de: y, a: z });
      // z es nueva, así que cambiar y por z en el cuerpo no puede capturar nada.
      const renombrado = directo(ast.cuerpo, y, { tipo: 'var', nombre: z });
      return { ...ast, variable: z, cuerpo: sinCaptura(renombrado, c) };
    }
    default:
      throw new Error(`Tipo de nodo desconocido: ${ast.tipo}`);
  }
}

// --- Sustitución directa (sin revisar capturas) -------------------------------

function directo(ast, x, t) {
  switch (ast.tipo) {
    case 'pred':
      return { ...ast, args: ast.args.map((a) => enTermino(a, x, t)) };
    case 'igual':
      return { ...ast, izq: enTermino(ast.izq, x, t), der: enTermino(ast.der, x, t) };
    case 'no':
      return { ...ast, sub: directo(ast.sub, x, t) };
    case 'y': case 'o': case 'imp': case 'sii':
      return { ...ast, izq: directo(ast.izq, x, t), der: directo(ast.der, x, t) };
    case 'paratodo': case 'existe':
      return ast.variable === x ? ast : { ...ast, cuerpo: directo(ast.cuerpo, x, t) };
    default:
      throw new Error(`Tipo de nodo desconocido: ${ast.tipo}`);
  }
}

function enTermino(termino, x, t, contador) {
  if (termino.tipo === 'var') {
    if (termino.nombre !== x) return termino;
    if (contador) contador.reemplazos++;
    return structuredClone(t);
  }
  return { ...termino, args: termino.args.map((a) => enTermino(a, x, t, contador)) };
}

// --- Auxiliares ---------------------------------------------------------------

function variablesDeTermino(t, nombres = new Set()) {
  if (t.tipo === 'var') nombres.add(t.nombre);
  else t.args.forEach((a) => variablesDeTermino(a, nombres));
  return nombres;
}

/** Todas las variables de φ: libres, ligadas y las que aparecen después de ∀ o ∃. */
function todasLasVariables(ast, nombres = new Set()) {
  switch (ast.tipo) {
    case 'pred': ast.args.forEach((a) => variablesDeTermino(a, nombres)); break;
    case 'igual': variablesDeTermino(ast.izq, nombres); variablesDeTermino(ast.der, nombres); break;
    case 'no': todasLasVariables(ast.sub, nombres); break;
    case 'paratodo': case 'existe': nombres.add(ast.variable); todasLasVariables(ast.cuerpo, nombres); break;
    default: todasLasVariables(ast.izq, nombres); todasLasVariables(ast.der, nombres);
  }
  return nombres;
}

/**
 * Tema 08, diap. 13: la variable nueva no debe aparecer en el contexto,
 * para no cambiar el significado de la fórmula.
 */
function variableNueva(usadas) {
  const libre = (v) => !usadas.has(v) && !RESERVADAS.has(v.toLowerCase());
  const directa = CANDIDATAS.find(libre);
  if (directa) return directa;
  for (let i = 1; ; i++) if (libre(`z${i}`)) return `z${i}`;
}
