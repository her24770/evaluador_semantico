/**
 * Lectura del texto que escribe el usuario (requerimientos 2 y 7).
 *
 * Aquí solo se convierte texto en datos y se revisa su forma:
 *   '1, 2, 3'          → ['1', '2', '3']            (dominio 𝒟)
 *   '(1, 3), (2, 1)'   → [['1', '3'], ['2', '1']]   (tuplas de una relación)
 *   '1, 2'             → '1,2'                      (clave de una tabla de función)
 * Revisar que las tuplas tengan el tamaño correcto y elementos de 𝒟
 * le toca a interpretacion.js (Parte 2).
 */
import { ErrorLogico } from '../sintaxis/index.js';

/** Un elemento de 𝒟 no puede tener espacios, comas, paréntesis ni llaves. */
const RE_ELEMENTO_MALO = /[\s,(){}]/u;

/** Quita las llaves de afuera si el usuario escribió {1, 2, 3}. */
function quitarLlaves(texto) {
  const t = texto.trim();
  return t.startsWith('{') && t.endsWith('}') ? t.slice(1, -1) : t;
}

/** Revisa un elemento ya recortado; devuelve el motivo del error o null si está bien. */
function problemaDeElemento(elemento) {
  if (elemento === '') return 'hay un elemento vacío (¿sobra una coma?)';
  if (RE_ELEMENTO_MALO.test(elemento)) {
    return `"${elemento}" no puede tener espacios, comas, paréntesis ni llaves (¿falta una coma?)`;
  }
  return null;
}

/**
 * Lee el dominio 𝒟. Debe tener al menos un elemento y ninguno repetido.
 *   leerDominio('1, 2, 3') → { errores: [], dominio: ['1', '2', '3'] }
 *
 * @param {string} texto
 * @returns {{errores: ErrorLogico[], dominio: string[]}}
 */
export function leerDominio(texto) {
  const errores = [];
  const dominio = [];
  const contenido = quitarLlaves(String(texto ?? ''));

  if (contenido.trim() === '') {
    return { errores: [new ErrorLogico('dominio', 'El dominio 𝒟 no puede estar vacío.')], dominio };
  }

  for (const crudo of contenido.split(',')) {
    const elemento = crudo.trim();
    const problema = problemaDeElemento(elemento);
    if (problema) {
      errores.push(new ErrorLogico('dominio', `Dominio: ${problema}.`));
    } else if (dominio.includes(elemento)) {
      errores.push(new ErrorLogico('dominio', `Dominio: el elemento "${elemento}" está repetido.`));
    } else {
      dominio.push(elemento);
    }
  }
  return { errores, dominio };
}

/**
 * Lee las tuplas de una relación, separadas por comas: '(1, 3), (2, 1)'.
 * Si la aridad es 1 también acepta elementos sueltos: '1, 2' es lo mismo que '(1), (2)'.
 * Un texto vacío da cero tuplas (Parte 2 decide si eso es un error).
 * La etiqueta va al inicio de cada mensaje de error, p. ej. 'Relación R'.
 *   leerTuplas('(1, 3), (2, 1)', 2) → { errores: [], tuplas: [['1', '3'], ['2', '1']] }
 *
 * @param {string} texto
 * @param {number} aridad
 * @param {string} [etiqueta]
 * @returns {{errores: ErrorLogico[], tuplas: string[][]}}
 */
export function leerTuplas(texto, aridad, etiqueta = 'Relación') {
  const fallo = (mensaje, pos) => ({ errores: [new ErrorLogico('relación', `${etiqueta}: ${mensaje}`, pos)], tuplas: [] });
  const contenido = quitarLlaves(String(texto ?? ''));
  if (contenido.trim() === '') return { errores: [], tuplas: [] };

  // Forma corta para relaciones unarias: elementos sin paréntesis.
  if (aridad === 1 && !/[()]/.test(contenido)) {
    const tuplas = [];
    for (const crudo of contenido.split(',')) {
      const problema = problemaDeElemento(crudo.trim());
      if (problema) return fallo(`${problema}.`);
      tuplas.push([crudo.trim()]);
    }
    return { errores: [], tuplas };
  }

  // Forma general: (a, b), (c, d), ... recorriendo el texto carácter por carácter.
  const tuplas = [];
  let i = 0;
  const saltarEspacios = () => { while (i < contenido.length && /\s/.test(contenido[i])) i++; };

  while (true) {
    saltarEspacios();
    if (contenido[i] !== '(') {
      return fallo(`se esperaba "(" para empezar una tupla en la posición ${i + 1}.`, i);
    }
    const inicio = i;
    const cierre = contenido.indexOf(')', i + 1);
    const otraApertura = contenido.indexOf('(', i + 1);
    if (cierre === -1 || (otraApertura !== -1 && otraApertura < cierre)) {
      return fallo(`la tupla que empieza en la posición ${inicio + 1} no se cierra con ")".`, inicio);
    }

    const tupla = contenido.slice(inicio + 1, cierre).split(',').map((e) => e.trim());
    for (const elemento of tupla) {
      const problema = problemaDeElemento(elemento);
      if (problema) return fallo(`en la tupla de la posición ${inicio + 1}, ${problema}.`, inicio);
    }
    tuplas.push(tupla);

    i = cierre + 1;
    saltarEspacios();
    if (i >= contenido.length) return { errores: [], tuplas };
    if (contenido[i] !== ',') {
      return fallo(`falta una coma entre tuplas en la posición ${i + 1}.`, i);
    }
    i++;
    saltarEspacios();
    if (i >= contenido.length) return fallo('sobra la coma del final.', i - 1);
  }
}

/**
 * Convierte una tupla en su clave de texto, sin espacios.
 *   claveDeTupla(['1', '2']) → '1,2'      claveDeTupla([]) → ''
 *
 * @param {string[]} tupla
 * @returns {string}
 */
export function claveDeTupla(tupla) {
  return tupla.join(',');
}

/**
 * Normaliza la clave que escribió el usuario en una tabla de función,
 * para que '1, 2', '1,2' y '(1, 2)' sean la misma clave.
 *   normalizarClave('(1, 2)') → '1,2'      normalizarClave('') → ''  (constante)
 *
 * @param {string} texto
 * @returns {string}
 */
export function normalizarClave(texto) {
  let t = String(texto ?? '').trim();
  if (t.startsWith('(') && t.endsWith(')')) t = t.slice(1, -1).trim();
  if (t === '') return '';
  return claveDeTupla(t.split(',').map((e) => e.trim()));
}

/**
 * Genera todas las tuplas de 𝒟ⁿ, en orden (como contar con los elementos de 𝒟).
 * Sirve para revisar que una función esté definida en todas las tuplas.
 *   todasLasTuplas(['1', '2'], 2) → [['1','1'], ['1','2'], ['2','1'], ['2','2']]
 *   todasLasTuplas(['1', '2'], 0) → [[]]   (una sola tupla vacía: la de una constante)
 *
 * @param {string[]} dominio
 * @param {number} n
 * @returns {string[][]}
 */
export function todasLasTuplas(dominio, n) {
  let tuplas = [[]];
  for (let k = 0; k < n; k++) {
    tuplas = tuplas.flatMap((tupla) => dominio.map((a) => [...tupla, a]));
  }
  return tuplas;
}
