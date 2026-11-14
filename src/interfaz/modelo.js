import { analizar, validarLenguaje, variablesLibres, variablesLigadas, ErrorLogico } from '../sintaxis/index.js';
import { validarInterpretacion, validarEntorno, evaluar } from '../semantica/index.js';

// Solo se conserva entrada del usuario. El AST y los resultados se derivan de ella.
export function crearEstado() {
  return {
    seccion: 'lenguaje', funciones: [], predicados: [], dominioTexto: '',
    formula: '', entorno: {}, resultado: null, evaluacionSolicitada: false,
  };
}

export function leerDominioUI(texto) {
  const { errores, interpretacion } = validarInterpretacion(
    { funciones: new Map(), predicados: new Map() }, { dominioTexto: texto },
  );
  return { errores, dominio: interpretacion?.dominio ?? [] };
}

// Enumeración para los controles de la tabla, sin interpretar fórmulas ni relaciones.
export function tuplaEn(dominio, aridad, indice) {
  const tupla = Array(aridad);
  for (let i = aridad - 1; i >= 0; i--) {
    tupla[i] = dominio[indice % dominio.length];
    indice = Math.floor(indice / dominio.length);
  }
  return tupla;
}

export const MAX_CASILLAS = 4096;

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

    // El validador semántico genera Dⁿ completo. Evitamos bloquear el navegador
    // antes de llamarlo y explicamos este límite operativo de la interfaz.
    const tablaGrande = estado.funciones.some(({ aridad }) =>
      Number(aridad) > 32 || dominioLeido.dominio.length ** Number(aridad) > MAX_CASILLAS);
    if (tablaGrande && !dominioLeido.errores.length) {
      errores.interpretacion.push(new ErrorLogico('función',
        `Una tabla supera las ${MAX_CASILLAS} entradas o los 32 argumentos admitidos por la interfaz. Reduce el dominio o la aridad.`));
    } else {
      const datos = {
        dominioTexto: estado.dominioTexto,
        funciones: Object.fromEntries(estado.funciones.map((s) => [s.nombre.trim(),
          Object.fromEntries(Object.entries(s.tabla ?? {}).filter(([clave]) => {
            const tupla = clave === '' ? [] : clave.split(',');
            return tupla.length === Number(s.aridad) && tupla.every((e) => dominioLeido.dominio.includes(e));
          })),
        ])),
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

export function evaluarEntrada(estado) {
  const revision = revisarEntrada(estado);
  if (!revision.valido) return { ...revision, resultado: null };
  try {
    return { ...revision, resultado: evaluar(revision.ast, revision.interpretacion, revision.entorno) };
  } catch (error) {
    if (!(error instanceof ErrorLogico)) throw error;
    const seccion = error.categoria === 'entorno' ? 'entorno' : 'interpretacion';
    revision.errores[seccion].push(error);
    return { ...revision, valido: false, resultado: null };
  }
}

export function invalidarResultado(estado) {
  estado.resultado = null;
  estado.evaluacionSolicitada = false;
}
