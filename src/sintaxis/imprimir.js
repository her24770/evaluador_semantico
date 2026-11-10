/**
 * Convierte el árbol de vuelta a texto con la notación del curso.
 *   aCadena:         con los paréntesis mínimos  → ∀x(P(x) → Q(x)) ∧ R(c)
 *   aCadenaCompleta: con todos los paréntesis    → (∀x (P(x) → Q(x)) ∧ R(c))
 * La versión completa le muestra al usuario cómo se leyó su fórmula.
 */

const SIMBOLO = { y: '∧', o: '∨', imp: '→', sii: '↔' };
const PRECEDENCIA = { sii: 1, imp: 2, o: 3, y: 4, no: 5, paratodo: 5, existe: 5, pred: 6, igual: 6 };

export function terminoACadena(t) {
  if (t.tipo === 'var' || t.args.length === 0) return t.nombre;
  return `${t.nombre}(${t.args.map(terminoACadena).join(', ')})`;
}

export function aCadena(ast) {
  const envolver = (hijo, minimo) => {
    const s = aCadena(hijo);
    return PRECEDENCIA[hijo.tipo] < minimo ? `(${s})` : s;
  };

  switch (ast.tipo) {
    case 'pred':
      return `${ast.nombre}(${ast.args.map(terminoACadena).join(', ')})`;
    case 'igual':
      return `${terminoACadena(ast.izq)} = ${terminoACadena(ast.der)}`;
    case 'no':
      return `¬${envolver(ast.sub, 5)}`;
    case 'paratodo': case 'existe': {
      const q = ast.tipo === 'paratodo' ? '∀' : '∃';
      const cuerpo = PRECEDENCIA[ast.cuerpo.tipo] >= 5 ? ` ${aCadena(ast.cuerpo)}` : `(${aCadena(ast.cuerpo)})`;
      return `${q}${ast.variable}${cuerpo}`;
    }
    case 'imp': // asocia a la derecha: p → q → r  es  p → (q → r)
      return `${envolver(ast.izq, 3)} → ${envolver(ast.der, 2)}`;
    default: { // ∧, ∨, ↔ asocian a la izquierda
      const p = PRECEDENCIA[ast.tipo];
      return `${envolver(ast.izq, p)} ${SIMBOLO[ast.tipo]} ${envolver(ast.der, p + 1)}`;
    }
  }
}

export function aCadenaCompleta(ast) {
  switch (ast.tipo) {
    case 'pred': case 'igual': return aCadena(ast);
    case 'no': return `¬${aCadenaCompleta(ast.sub)}`;
    case 'paratodo': return `∀${ast.variable} ${aCadenaCompleta(ast.cuerpo)}`;
    case 'existe': return `∃${ast.variable} ${aCadenaCompleta(ast.cuerpo)}`;
    default: return `(${aCadenaCompleta(ast.izq)} ${SIMBOLO[ast.tipo]} ${aCadenaCompleta(ast.der)})`;
  }
}
