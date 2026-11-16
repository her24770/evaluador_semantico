/**
 * Datos del ejercicio y conexión de la interfaz con sintaxis y semántica.
 *
 * El estado guarda lo que se escribe; la revisión contiene lo que se pudo leer
 * y los errores de cada sección. Revisar no evalúa: el valor de verdad solo se
 * calcula al solicitarlo. Este módulo también se usa desde el worker y no toca el DOM.
 */
import { analizar, validarLenguaje, variablesLibres, variablesLigadas, ErrorLogico } from '../sintaxis/index.js';
import { validarInterpretacion, validarEntorno, evaluar, evaluarExhaustivo, contieneCuantificadores } from '../semantica/index.js';

/** Devuelve un ejercicio vacío, con objetos nuevos para cada llamada. */
export function crearEstado() {
  return {
    // constantes: { id, nombre, valor }. Para sintaxis y semántica son funciones de aridad 0.
    seccion: 'lenguaje', constantes: [], funciones: [], predicados: [], dominioTexto: '',
    formula: '', entorno: {}, sustitucion: { variable: '', termino: '' }, resultado: null, tablaCuantificadores: null, evaluacionSolicitada: false,
    foto: crearEstadoFoto(),
  };
}

/** Panel "Leer fórmula desde una foto". fase: vacio | leyendo | listo | error */
export function crearEstadoFoto() {
  return { imagen: '', texto: '', leida: '', dudas: [], fase: 'vacio', error: '', ampliada: false };
}

/**
 * Lee el dominio con las mismas reglas de semántica, sin exigir símbolos.
 *   leerDominioUI('a, b') → { errores: [], dominio: ['a', 'b'] }
 * @param {string} texto  elementos separados por comas
 * @returns {{errores: ErrorLogico[], dominio: string[]}}
 */
export function leerDominioUI(texto) {
  const { errores, interpretacion } = validarInterpretacion(
    { funciones: new Map(), predicados: new Map() }, { dominioTexto: texto },
  );
  return { errores, dominio: interpretacion?.dominio ?? [] };
}

/**
 * Obtiene una tupla de 𝒟ⁿ por su posición, sin construir todas las anteriores.
 * Funciona como contar en base |𝒟|: la última posición cambia más rápido.
 *   tuplaEn(['a', 'b'], 2, 2) → ['b', 'a']
 * @param {string[]} dominio  dominio no vacío, en el orden elegido
 * @param {number} aridad  número de posiciones de la tupla
 * @param {number} indice  posición desde 0, menor que |𝒟| elevado a la aridad
 * @returns {string[]}
 */
export function tuplaEn(dominio, aridad, indice) {
  const tupla = Array(aridad);
  for (let i = aridad - 1; i >= 0; i--) {
    tupla[i] = dominio[indice % dominio.length];
    indice = Math.floor(indice / dominio.length);
  }
  return tupla;
}

// Tope de entradas de cada tabla de función para poder editarla en el navegador.
export const MAX_CASILLAS = 4096;

/** Primera sección con errores, según las dependencias de la evaluación; null si no hay. */
export function seccionPendiente(revision) {
  return ['lenguaje', 'formula', 'interpretacion', 'entorno']
    .find((seccion) => revision.errores[seccion].length) ?? null;
}

/**
 * Valida lenguaje, fórmula, interpretación y entorno sin cambiar el estado.
 * Solo analiza la fórmula si la firma es válida; el entorno se revisa después
 * de conocer sus variables libres. Descarta entradas de tablas que ya no
 * corresponden al dominio o a la aridad actuales.
 *
 * @param {object} estado  entradas del ejercicio, como las crea crearEstado
 * @returns {{errores: object, ast: object|null, libres: string[], ligadas: string[],
 *   firma: object, dominio: string[], interpretacion: object|null, entorno: object, valido: boolean}}
 */
export function revisarEntrada(estado) {
  const errores = { lenguaje: [], interpretacion: [], formula: [], entorno: [] };
  const lengua = validarLenguaje(estado);
  errores.lenguaje = lengua.errores;
  const dominioLeido = leerDominioUI(estado.dominioTexto);
  let ast = null;
  let libres = [];
  let ligadas = [];
  let interpretacion = null;
  let entorno = {};

  if (!lengua.errores.length) {
    try {
      ast = analizar(estado.formula, lengua.firma);
      libres = variablesLibres(ast);
      ligadas = variablesLigadas(ast);
    } catch (error) {
      if (!(error instanceof ErrorLogico)) throw error;
      errores.formula.push(error);
    }

    const tablaGrande = estado.funciones.some(({ aridad }) =>
      Number(aridad) > 32 || dominioLeido.dominio.length ** Number(aridad) > MAX_CASILLAS);
    if (tablaGrande && !dominioLeido.errores.length) {
      errores.interpretacion.push(new ErrorLogico('función',
        `Una tabla supera las ${MAX_CASILLAS} entradas o los 32 argumentos admitidos por la interfaz. Reduce el dominio o la aridad.`));
    } else {
      const datos = {
        dominioTexto: estado.dominioTexto,
        funciones: Object.fromEntries([
          // Una constante es una tabla con una sola entrada: la clave vacía ''.
          ...(estado.constantes ?? []).map((c) => [c.nombre.trim(),
            c.valor && dominioLeido.dominio.includes(c.valor) ? { '': c.valor } : {}]),
          ...estado.funciones.map((s) => [s.nombre.trim(),
            Object.fromEntries(Object.entries(s.tabla ?? {}).filter(([clave]) => {
              const tupla = clave === '' ? [] : clave.split(',');
              return tupla.length === Number(s.aridad) && tupla.every((e) => dominioLeido.dominio.includes(e));
            })),
          ]),
        ]),
        relaciones: Object.fromEntries(estado.predicados.map((s) => [s.nombre.trim(), s.relacion ?? ''])),
      };
      const inter = validarInterpretacion(lengua.firma, datos);
      errores.interpretacion = inter.errores;
      interpretacion = inter.interpretacion;
    }
  } else {
    errores.interpretacion = dominioLeido.errores;
  }

  if (ast && !dominioLeido.errores.length) {
    const ent = validarEntorno(libres, estado.entorno, dominioLeido.dominio);
    errores.entorno = ent.errores;
    entorno = ent.entorno;
  }
  return {
    errores, ast, libres, ligadas, firma: lengua.firma,
    dominio: dominioLeido.dominio, interpretacion, entorno,
    valido: Object.values(errores).every((lista) => lista.length === 0),
  };
}

/**
 * Revisa las entradas y, si son válidas, calcula el resultado y sus pasos.
 * Si hay cuantificadores, pide además una evaluación exhaustiva para la tabla.
 * La tabla puede quedar no disponible por sus límites aunque el resultado principal sea válido.
 *
 * @param {object} estado
 * @param {{maxNodos?: number, maxProfundidad?: number}} [opcionesTabla]  límites de la tabla
 * @returns {object} revisión con resultado y tablaCuantificadores; ambos null si hay errores de entrada o evaluación
 */
export function evaluarEntrada(estado, opcionesTabla) {
  const revision = revisarEntrada(estado);
  if (!revision.valido) return { ...revision, resultado: null, tablaCuantificadores: null };
  try {
    const resultado = evaluar(revision.ast, revision.interpretacion, revision.entorno);
    const tablaCuantificadores = contieneCuantificadores(revision.ast)
      ? evaluarExhaustivo(revision.ast, revision.interpretacion, revision.entorno, opcionesTabla) : null;
    return { ...revision, resultado, tablaCuantificadores };
  } catch (error) {
    if (!(error instanceof ErrorLogico)) throw error;
    const seccion = error.categoria === 'entorno' ? 'entorno' : 'interpretacion';
    revision.errores[seccion].push(error);
    return { ...revision, valido: false, resultado: null, tablaCuantificadores: null };
  }
}

/** Borra los resultados al editar el ejercicio, para no mostrar una evaluación de datos anteriores. */
export function invalidarResultado(estado) {
  estado.resultado = null;
  estado.tablaCuantificadores = null;
  estado.evaluacionSolicitada = false;
}
