/**
 * Análisis sintáctico (requerimientos 3 y 7). Temas 01 y 07.
 *
 * Convierte el texto de una fórmula en su árbol sintáctico (AST), o lanza un
 * ErrorLogico de categoría 'sintaxis', 'símbolo' o 'aridad'.
 *
 * Gramática, de menor a mayor precedencia:
 *   fórmula  ::= implica ( '↔' implica )*
 *   implica  ::= disyun ( '→' implica )?            → asocia a la derecha
 *   disyun   ::= conjun ( '∨' conjun )*
 *   conjun   ::= unaria ( '∧' unaria )*
 *   unaria   ::= '¬' unaria | ('∀' | '∃') variable unaria | atómica
 *   atómica  ::= '(' fórmula ')'
 *              | P '(' término, …, término ')'       P predicado n-ario
 *              | término '=' término  |  término '≠' término
 *   término  ::= variable | c | f '(' término, …, término ')'
 *
 * ¬, ∀x y ∃x afectan solo a la fórmula que tienen inmediatamente después,
 * por eso en clase se escribe ∀x(P(x) → Q(x)) con paréntesis.
 *
 * Forma de los nodos: ver docs/CONTRATO.md.
 */
import { ErrorLogico } from './errores.js';
import { tokenizar } from './lexer.js';

/**
 * @param {string} texto  fórmula escrita por el usuario
 * @param {{funciones: Map<string, number>, predicados: Map<string, number>}} firma
 * @returns {object} AST
 */
export function analizar(texto, firma) {
  if (String(texto).trim() === '') {
    throw new ErrorLogico('sintaxis', 'La fórmula está vacía.', 0);
  }

  const tokens = tokenizar(texto);
  let k = 0;
  const actual = () => tokens[k];
  const avanzar = () => tokens[k++];
  const describir = (t) => (t.tipo === 'FIN' ? 'el final de la fórmula' : `"${t.texto}"`);

  function esperar(tipo, queSeEsperaba) {
    const t = actual();
    if (t.tipo !== tipo) {
      throw new ErrorLogico('sintaxis', `Se esperaba ${queSeEsperaba} pero se encontró ${describir(t)}.`, t.pos);
    }
    return avanzar();
  }

  // --- Conectivos binarios ---------------------------------------------------

  function formula() {
    let izq = implica();
    while (actual().tipo === 'SII') {
      const op = avanzar();
      izq = { tipo: 'sii', izq, der: implica(), pos: op.pos };
    }
    return izq;
  }

  function implica() {
    const izq = disyuncion();
    if (actual().tipo === 'IMP') {
      const op = avanzar();
      return { tipo: 'imp', izq, der: implica(), pos: op.pos };
    }
    return izq;
  }

  function disyuncion() {
    let izq = conjuncion();
    while (actual().tipo === 'O') {
      const op = avanzar();
      izq = { tipo: 'o', izq, der: conjuncion(), pos: op.pos };
    }
    return izq;
  }

  function conjuncion() {
    let izq = unaria();
    while (actual().tipo === 'Y') {
      const op = avanzar();
      izq = { tipo: 'y', izq, der: unaria(), pos: op.pos };
    }
    return izq;
  }

  // --- Negación y cuantificadores ---------------------------------------------

  function unaria() {
    const t = actual();

    if (t.tipo === 'NO') {
      avanzar();
      return { tipo: 'no', sub: unaria(), pos: t.pos };
    }

    if (t.tipo === 'PARATODO' || t.tipo === 'EXISTE') {
      avanzar();
      const v = actual();
      if (v.tipo !== 'IDENT') {
        throw new ErrorLogico('sintaxis', `Después de ${t.texto} debe ir una variable, pero se encontró ${describir(v)}.`, v.pos);
      }
      // Tema 07: los cuantificadores solo se aplican a variables individuales.
      if (firma.funciones.has(v.texto) || firma.predicados.has(v.texto)) {
        throw new ErrorLogico('símbolo', `"${v.texto}" es un símbolo no lógico; solo se puede cuantificar sobre variables.`, v.pos);
      }
      revisarNombreVariable(v);
      avanzar();
      return {
        tipo: t.tipo === 'PARATODO' ? 'paratodo' : 'existe',
        variable: v.texto,
        cuerpo: unaria(),
        pos: t.pos,
      };
    }

    return atomica();
  }

  // --- Fórmulas atómicas ------------------------------------------------------

  function atomica() {
    const t = actual();

    if (t.tipo === 'ABRE') {
      avanzar();
      const f = formula();
      esperar('CIERRA', '")"');
      return f;
    }

    if (t.tipo === 'IDENT' && firma.predicados.has(t.texto)) {
      avanzar();
      const aridad = firma.predicados.get(t.texto);
      if (actual().tipo !== 'ABRE') {
        throw new ErrorLogico('aridad', `El predicado ${t.texto} es ${aridad}-ario y necesita ${aridad} argumento(s) entre paréntesis.`, t.pos);
      }
      const args = argumentos();
      if (args.length !== aridad) {
        throw new ErrorLogico('aridad', `El predicado ${t.texto} es ${aridad}-ario pero recibió ${args.length} argumento(s).`, t.pos);
      }
      return { tipo: 'pred', nombre: t.texto, args, pos: t.pos };
    }

    if (t.tipo !== 'IDENT') {
      throw new ErrorLogico('sintaxis', `Se esperaba una fórmula pero se encontró ${describir(t)}.`, t.pos);
    }

    // Lo único que queda es una igualdad: término = término
    const izq = termino();
    const op = actual();
    if (op.tipo !== 'IGUAL' && op.tipo !== 'DISTINTO') {
      const mensaje = izq.tipo === 'var'
        ? `"${izq.nombre}" no es un predicado declarado. Una variable sola no es una fórmula.`
        : `${izq.nombre}(…) es un término, no una fórmula: falta "=" o usar un predicado.`;
      throw new ErrorLogico('sintaxis', mensaje, t.pos);
    }
    avanzar();
    const igualdad = { tipo: 'igual', izq, der: termino(), pos: op.pos };
    // t₁ ≠ t₂ es una abreviatura de ¬(t₁ = t₂)
    return op.tipo === 'DISTINTO' ? { tipo: 'no', sub: igualdad, pos: op.pos } : igualdad;
  }

  // --- Términos ---------------------------------------------------------------

  function argumentos() {
    esperar('ABRE', '"("');
    const args = [termino()];
    while (actual().tipo === 'COMA') {
      avanzar();
      args.push(termino());
    }
    esperar('CIERRA', '")" o ","');
    return args;
  }

  function termino() {
    const t = actual();
    if (t.tipo !== 'IDENT') {
      throw new ErrorLogico('sintaxis', `Se esperaba un término (variable, constante o función) pero se encontró ${describir(t)}.`, t.pos);
    }
    avanzar();

    if (firma.predicados.has(t.texto)) {
      throw new ErrorLogico('símbolo', `${t.texto} es un predicado y no puede usarse dentro de un término.`, t.pos);
    }

    if (firma.funciones.has(t.texto)) {
      const aridad = firma.funciones.get(t.texto);
      if (aridad === 0) {
        if (actual().tipo === 'ABRE') {
          throw new ErrorLogico('aridad', `${t.texto} es una constante (aridad 0) y no lleva argumentos.`, t.pos);
        }
        return { tipo: 'fun', nombre: t.texto, args: [], pos: t.pos };
      }
      if (actual().tipo !== 'ABRE') {
        throw new ErrorLogico('aridad', `El símbolo funcional ${t.texto} es ${aridad}-ario y necesita ${aridad} argumento(s).`, t.pos);
      }
      const args = argumentos();
      if (args.length !== aridad) {
        throw new ErrorLogico('aridad', `El símbolo funcional ${t.texto} es ${aridad}-ario pero recibió ${args.length} argumento(s).`, t.pos);
      }
      return { tipo: 'fun', nombre: t.texto, args, pos: t.pos };
    }

    if (actual().tipo === 'ABRE') {
      throw new ErrorLogico('símbolo', `"${t.texto}" no está declarado como símbolo funcional ni como predicado.`, t.pos);
    }
    revisarNombreVariable(t);
    return { tipo: 'var', nombre: t.texto, pos: t.pos };
  }

  // Tema 11: un elemento del dominio (p. ej. 1) no es un término del lenguaje.
  // Para nombrarlo hay que declarar una constante.
  function revisarNombreVariable(t) {
    if (/^\p{N}/u.test(t.texto)) {
      throw new ErrorLogico('símbolo',
        `"${t.texto}" no está declarado. Los elementos de 𝒟 no son términos: declare una constante (función de aridad 0).`, t.pos);
    }
  }

  // --- Inicio -----------------------------------------------------------------

  const ast = formula();
  if (actual().tipo !== 'FIN') {
    const t = actual();
    throw new ErrorLogico('sintaxis', `Sobra ${describir(t)}: la fórmula ya estaba completa (¿falta un conectivo o un paréntesis?).`, t.pos);
  }
  return ast;
}
