/**
 * Validación de la interpretación ℐ = (𝒟, fᴵ, Pᴵ) (requerimientos 2 y 7, tema 10).
 *
 * Revisa que:
 *   - 𝒟 no esté vacío ni tenga elementos repetidos,
 *   - cada fᴵ esté definida en TODAS las tuplas de 𝒟ⁿ y devuelva elementos de 𝒟,
 *   - cada Pᴵ no esté vacía y tenga tuplas de tamaño n con elementos de 𝒟.
 * Si hay cualquier error, no se devuelve interpretación (así nadie la evalúa).
 */
import { ErrorLogico } from '../sintaxis/index.js';
import { leerDominio, leerTuplas, claveDeTupla, normalizarClave, todasLasTuplas } from './lectura.js';

/** Cuántas tuplas faltantes se nombran en un mensaje antes de decir "y N más". */
const MAX_FALTANTES = 5;

/** Escribe una tupla como la ve el usuario: (1, 2). Una tupla de un elemento se escribe sin paréntesis. */
function tuplaATexto(tupla) {
  return tupla.length === 1 ? tupla[0] : `(${tupla.join(', ')})`;
}

/** Nombre del símbolo para los mensajes: "la constante c" o "la función f". */
function nombreFuncion(nombre, aridad) {
  return aridad === 0 ? `la constante ${nombre}` : `la función ${nombre}`;
}

/**
 * Revisa la tabla de una función y la convierte en Map(clave → valor).
 *   tabla { '1': '2', '2': '3', '3': '1' } con 𝒟 = {1,2,3} → Map { '1' → '2', '2' → '3', '3' → '1' }
 * Una casilla con valor vacío cuenta como no definida.
 */
function validarFuncion(nombre, aridad, tabla, dominio, errores) {
  const quien = nombreFuncion(nombre, aridad);
  if (tabla === undefined || tabla === null) {
    errores.push(new ErrorLogico('función', aridad === 0
      ? `Falta el valor de la constante ${nombre}.`
      : `Falta la tabla de la función ${nombre}.`));
    return null;
  }

  const enDominio = new Set(dominio);
  const valores = new Map();
  const conValor = new Set(); // claves que el usuario llenó (aunque sea mal), para no repetir el error

  for (const [claveCruda, valorCrudo] of Object.entries(tabla)) {
    const valor = String(valorCrudo ?? '').trim();
    if (valor === '') continue; // casilla sin llenar

    // La clave debe ser una tupla de 𝒟ⁿ (para una constante, la clave vacía '').
    const clave = normalizarClave(claveCruda);
    const tupla = clave === '' ? [] : clave.split(',');
    if (tupla.length !== aridad || !tupla.every((a) => enDominio.has(a))) {
      errores.push(new ErrorLogico('función',
        `En ${quien}, la entrada "${claveCruda}" no es una tupla de 𝒟${aridad === 1 ? '' : superindice(aridad)}.`));
      continue;
    }
    conValor.add(clave);
    if (!enDominio.has(valor)) {
      errores.push(new ErrorLogico('función', aridad === 0
        ? `El valor de la constante ${nombre} es "${valor}", que no está en 𝒟.`
        : `${nombre}(${tupla.join(', ')}) = "${valor}", que no está en 𝒟.`));
      continue;
    }
    if (valores.has(clave) && valores.get(clave) !== valor) {
      errores.push(new ErrorLogico('función',
        `En ${quien}, la entrada ${tuplaATexto(tupla)} tiene dos valores distintos.`));
      continue;
    }
    valores.set(clave, valor);
  }

  // fᴵ debe estar definida en todas las tuplas de 𝒟ⁿ (función total).
  const faltantes = todasLasTuplas(dominio, aridad).filter((t) => !conValor.has(claveDeTupla(t)));
  if (faltantes.length > 0) {
    if (aridad === 0) {
      errores.push(new ErrorLogico('función', `Falta el valor de la constante ${nombre}.`));
    } else {
      const lista = faltantes.slice(0, MAX_FALTANTES).map(tuplaATexto).join(', ');
      const resto = faltantes.length > MAX_FALTANTES ? ` y ${faltantes.length - MAX_FALTANTES} más` : '';
      errores.push(new ErrorLogico('función',
        `La función ${nombre} no está definida en: ${lista}${resto}.`));
    }
  }
  return valores;
}

/**
 * Revisa el texto de una relación y la convierte en un Set de claves.
 *   '(1, 3), (2, 1)' con aridad 2 → Set { '1,3', '2,1' }
 * Las tuplas repetidas se juntan en una sola.
 */
function validarRelacion(nombre, aridad, texto, dominio, errores) {
  if (texto === undefined || texto === null) {
    errores.push(new ErrorLogico('relación', `Falta la relación ${nombre}.`));
    return null;
  }

  const leido = leerTuplas(texto, aridad, `Relación ${nombre}`);
  if (leido.errores.length > 0) {
    errores.push(...leido.errores);
    return null;
  }
  if (leido.tuplas.length === 0) {
    errores.push(new ErrorLogico('relación', `La relación ${nombre} está vacía: debe tener al menos una tupla.`));
    return null;
  }

  const enDominio = new Set(dominio);
  const claves = new Set();
  for (const tupla of leido.tuplas) {
    if (tupla.length !== aridad) {
      errores.push(new ErrorLogico('relación',
        `En la relación ${nombre}, la tupla ${tuplaATexto(tupla)} tiene ${tupla.length} elemento(s), pero ${nombre} tiene aridad ${aridad}.`));
      continue;
    }
    const fuera = tupla.filter((a) => !enDominio.has(a));
    if (fuera.length > 0) {
      errores.push(new ErrorLogico('relación',
        `En la relación ${nombre}, la tupla ${tuplaATexto(tupla)} usa "${fuera[0]}", que no está en 𝒟.`));
      continue;
    }
    claves.add(claveDeTupla(tupla));
  }
  return claves;
}

/** Superíndice para escribir 𝒟², 𝒟³, ... en los mensajes. */
function superindice(n) {
  const digitos = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  return String(n).split('').map((d) => digitos[Number(d)]).join('');
}

/**
 * Valida toda la interpretación a partir de lo que escribió el usuario.
 *
 * @param {{funciones: Map<string, number>, predicados: Map<string, number>}} firma  (de validarLenguaje)
 * @param {{dominioTexto: string,
 *          funciones: Object<string, Object<string, string>>,
 *          relaciones: Object<string, string>}} datos
 * @returns {{errores: ErrorLogico[],
 *            interpretacion: null | {dominio: string[],
 *                                    funciones: Map<string, Map<string, string>>,
 *                                    relaciones: Map<string, Set<string>>}}}
 */
export function validarInterpretacion(firma, { dominioTexto, funciones = {}, relaciones = {} } = {}) {
  // 1. El dominio. Sin un 𝒟 correcto no se puede revisar nada más.
  const { errores, dominio } = leerDominio(dominioTexto);
  if (errores.length > 0) return { errores, interpretacion: null };

  // 2. Cada símbolo de función de la firma necesita su tabla completa.
  const tablas = new Map();
  for (const [nombre, aridad] of firma.funciones) {
    const valores = validarFuncion(nombre, aridad, funciones[nombre], dominio, errores);
    if (valores) tablas.set(nombre, valores);
  }

  // 3. Cada predicado de la firma necesita su relación.
  const conjuntos = new Map();
  for (const [nombre, aridad] of firma.predicados) {
    const claves = validarRelacion(nombre, aridad, relaciones[nombre], dominio, errores);
    if (claves) conjuntos.set(nombre, claves);
  }

  // 4. Requerimiento 7: con cualquier error no hay interpretación que evaluar.
  if (errores.length > 0) return { errores, interpretacion: null };
  return { errores, interpretacion: { dominio, funciones: tablas, relaciones: conjuntos } };
}
