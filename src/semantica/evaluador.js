/**
 * Verdad de una fórmula: ℐ ⊨ₗ φ (tema 11, diap. 6 y 7).
 *
 * evaluar no solo dice V o F: devuelve un "nodo de explicación" (CONTRATO.md §4)
 * que la interfaz dibuja como un árbol. Cada nodo dice qué regla se usó, por qué
 * dio ese valor y trae en "hijos" los nodos de sus partes.
 *
 * Casos: atómica, igualdad, conectivos (¬ ∧ ∨ → ↔) y cuantificadores (∀ ∃).
 */
import { ErrorLogico, aCadena, terminoACadena } from '../sintaxis/index.js';
import { claveDeTupla } from './lectura.js';
import { valorDeTermino } from './terminos.js';
import { entornoACadena, variante } from './entorno.js';

const VF = (valor) => (valor ? 'V' : 'F');
const VERDADERA_O_FALSA = (valor) => (valor ? 'Es verdadera' : 'Es falsa');

/**
 * Evalúa φ en la interpretación ℐ con el entorno l.
 *   evaluar(analizar('¬R(i)', firma), ℐ, {}) → { formula: '¬R(i)', valor: true, regla: '¬', ... }
 *
 * @param {object} ast  fórmula (AST de analizar)
 * @param {{dominio: string[], funciones: Map, relaciones: Map<string, Set<string>>}} interpretacion  ya validada
 * @param {Object<string, string>} entorno  ya validado (un valor para cada variable libre)
 * @returns {{formula: string, valor: boolean, regla: string, razon: string, entorno: string, hijos: object[],
 *            testigo?: {variable: string, elemento: string}, contraejemplo?: {variable: string, elemento: string},
 *            completa?: true}}
 */
export function evaluar(ast, interpretacion, entorno) {
  // "extra" lleva testigo, contraejemplo o completa, solo en los nodos de ∀ y ∃ que les toca.
  const nodo = (valor, regla, razon, hijos = [], extra = {}) => ({
    formula: aCadena(ast),
    valor,
    regla,
    razon,
    entorno: entornoACadena(entorno),
    hijos,
    ...extra,
  });
  const sub = (f) => evaluar(f, interpretacion, entorno);

  switch (ast.tipo) {
    case 'pred': {
      // ℐ ⊨ₗ P(t₁, …, tₙ) si y solo si (a₁, …, aₙ) ∈ Pᴵ, donde aᵢ es el valor de tᵢ.
      const valores = ast.args.map((t) => valorDeTermino(t, interpretacion, entorno));
      const relacion = interpretacion.relaciones.get(ast.nombre);
      if (!relacion) {
        throw new ErrorLogico('relación', `El predicado ${ast.nombre} no tiene relación en la interpretación.`, ast.pos);
      }
      const valor = relacion.has(claveDeTupla(valores));
      // Un predicado unario se compara con elementos (a ∈ Rᴵ); los demás con tuplas ((a, b) ∈ Pᴵ).
      const tupla = valores.length === 1 ? valores[0] : `(${valores.join(', ')})`;
      const razon = `${encabezado(ast, ast.args, entorno, valores)}${tupla} ${valor ? '∈' : '∉'} ${ast.nombre}ᴵ`;
      return nodo(valor, 'atómica', razon);
    }

    case 'igual': {
      // t₁ = t₂ es verdadera si los dos términos dan el mismo elemento de 𝒟.
      const a = valorDeTermino(ast.izq, interpretacion, entorno);
      const b = valorDeTermino(ast.der, interpretacion, entorno);
      const valor = a === b;
      const razon = `${encabezado(ast, [ast.izq, ast.der], entorno, [a, b])}${a} ${valor ? '=' : '≠'} ${b}`;
      return nodo(valor, 'igualdad', razon);
    }

    case 'no': {
      // ℐ ⊨ₗ ¬φ si y solo si no es el caso que ℐ ⊨ₗ φ.
      const h = sub(ast.sub);
      return nodo(!h.valor, '¬', `${VERDADERA_O_FALSA(!h.valor)} porque ${h.formula} es ${VF(h.valor)}`, [h]);
    }

    case 'y': case 'o': case 'imp': case 'sii': {
      // Siempre se evalúan los dos lados, para que el árbol muestre los dos.
      const izq = sub(ast.izq);
      const der = sub(ast.der);
      const { valor, regla, porque } = CONECTIVOS[ast.tipo](izq.valor, der.valor);
      return nodo(valor, regla, `${VERDADERA_O_FALSA(valor)} porque ${porque}`, [izq, der]);
    }

    case 'paratodo': case 'existe': {
      // ℐ ⊨ₗ ∀x φ  si ℐ ⊨_{l[x ↦ a]} φ para TODA a ∈ 𝒟.
      // ℐ ⊨ₗ ∃x φ  si ℐ ⊨_{l[x ↦ a]} φ para ALGUNA a ∈ 𝒟.
      // Se prueba cada a de 𝒟 en el orden en que la escribió el usuario.
      const x = ast.variable;
      const esParaTodo = ast.tipo === 'paratodo';
      const regla = esParaTodo ? '∀' : '∃';
      const cuerpo = aCadena(ast.cuerpo);
      // ∀ busca un caso F (contraejemplo); ∃ busca un caso V (testigo).
      const buscado = !esParaTodo;

      const hijos = [];
      for (const a of interpretacion.dominio) {
        const h = evaluar(ast.cuerpo, interpretacion, variante(entorno, x, a));
        if (h.valor === buscado) {
          // Basta un caso para decidir: el nodo solo muestra ese caso.
          const caso = { variable: x, elemento: a };
          return esParaTodo
            ? nodo(false, regla, `Contraejemplo: con ${x} ↦ ${a}, ${cuerpo} es F`, [h], { contraejemplo: caso })
            : nodo(true, regla, `Testigo: con ${x} ↦ ${a}, ${cuerpo} es V`, [h], { testigo: caso });
        }
        hijos.push(h);
      }

      // No apareció ningún caso que decida: se revisaron todos los elementos de 𝒟.
      const valor = esParaTodo;
      const razon = `Comprobación completa: ${cuerpo} es ${VF(valor)} para ${x} ↦ ${enumerar(interpretacion.dominio)}`;
      return nodo(valor, regla, razon, hijos, { completa: true });
    }

    default:
      throw new Error(`Tipo de nodo desconocido: ${ast.tipo}`);
  }
}

/**
 * Para cada conectivo: su valor (tablas del tema 03, diap. 4 y 8) y qué lado decidió el resultado.
 * p y q son los valores del lado izquierdo y del derecho.
 */
const CONECTIVOS = {
  y: (p, q) => ({
    regla: '∧',
    valor: p && q,
    porque: p && q ? 'los dos lados son V'
      : !p && !q ? 'los dos lados son F'
        : `el lado ${p ? 'derecho' : 'izquierdo'} es F`,
  }),
  o: (p, q) => ({
    regla: '∨',
    valor: p || q,
    porque: p && q ? 'los dos lados son V'
      : !p && !q ? 'los dos lados son F'
        : `el lado ${p ? 'izquierdo' : 'derecho'} es V`,
  }),
  imp: (p, q) => ({
    regla: '→',
    valor: !p || q,
    // Solo es falsa con V → F. Si el izquierdo es F, ya es verdadera sin mirar el derecho.
    porque: p && !q ? 'el lado izquierdo es V y el derecho es F'
      : !p ? 'el lado izquierdo es F'
        : 'el lado derecho es V',
  }),
  sii: (p, q) => ({
    regla: '↔',
    valor: p === q,
    porque: p === q ? `los dos lados son ${VF(p)}`
      : `el lado izquierdo es ${VF(p)} y el derecho es ${VF(q)}`,
  }),
};

/**
 * Escribe una lista como en español: '1', '1 y 2', '1, 2 y 3'.
 */
function enumerar(elementos) {
  if (elementos.length <= 1) return elementos.join('');
  return `${elementos.slice(0, -1).join(', ')} y ${elementos.at(-1)}`;
}

/**
 * Comienzo de la razón de un caso atómico: la fórmula, los valores de sus variables
 * y, si hay funciones o constantes, cuánto vale cada una. Termina en ': '.
 *   'P(x, y) con x ↦ 0, y ↦ 2: '
 *   'R(i) con i = a: '
 */
function encabezado(ast, terminos, entorno, valores) {
  const variables = [];
  const recoger = (t) => {
    if (t.tipo === 'var') {
      if (!variables.includes(t.nombre)) variables.push(t.nombre);
    } else {
      t.args.forEach(recoger);
    }
  };
  terminos.forEach(recoger);

  const partes = variables.map((x) => `${x} ↦ ${entorno[x]}`);
  terminos.forEach((t, i) => {
    if (t.tipo === 'fun') partes.push(`${terminoACadena(t)} = ${valores[i]}`);
  });
  return partes.length > 0 ? `${aCadena(ast)} con ${partes.join(', ')}: ` : `${aCadena(ast)}: `;
}
