/**
 * Búsqueda local de fragmentos por palabras y símbolos de la pregunta.
 * Se quitan palabras comunes y se unifican variantes como «libres» y «libre».
 * Las coincidencias en títulos y palabras clave pesan más; también se da más
 * peso a términos poco frecuentes. La puntuación ordena fragmentos, no certifica una respuesta.
 */
const VACIAS = new Set(('a al algo ante aqui asi aun bajo cada como con cual cuales cuando de del desde '
  + 'diferencia dime donde el ella ellas ellos en entre era es esa esas ese esos esta estas este esto estos '
  + 'estoy explicar explicame favor fue ha hasta hay la las le les lo los me mi mis mismo mucha muy '
  + 'necesito nos o otra otro otros para pero poco por porque pregunta puedo puede puedes que quiero '
  + 'qué quien se segun ser si sin sobre solo son su sus tengo tiene tienen toda todas todo todos tu '
  + 'un una unas uno unos usa usar y ya').split(' '));

const SIMBOLOS = new Map([
  ['∀', 'universal'], ['∃', 'existencial'], ['¬', 'negacion'], ['∧', 'conjuncion'],
  ['∨', 'disyuncion'], ['→', 'implicacion'], ['↔', 'bicondicional'], ['=', 'igualdad'],
  ['≠', 'desigualdad'], ['⊨', 'consecuencia'], ['⊢', 'derivacion'], ['⊥', 'contradiccion'],
  ['↦', 'variante'], ['⟼', 'variante'], ['⇒', 'implicacion'], ['⇔', 'bicondicional'],
  ['⊭', 'noconsecuencia'], ['⊬', 'noderivacion'], ['∈', 'pertenencia'], ['∉', 'nopertenencia'],
]);
const ALIAS = new Map(Object.entries({
  forall: 'universal', paratodo: 'universal', universales: 'universal',
  exists: 'existencial', existe: 'existencial', existen: 'existencial', existenciales: 'existencial',
  variables: 'variable', libres: 'libre', ligada: 'ligado', ligadas: 'ligado', ligados: 'ligado',
  vinculada: 'ligado', vinculadas: 'ligado', constantes: 'constante', predicados: 'predicado',
  funciones: 'funcion', funcionales: 'funcional', terminos: 'termino', formulas: 'formula',
  interpretaciones: 'interpretacion', entornos: 'entorno', dominios: 'dominio',
  valuaciones: 'valuacion', demostraciones: 'demostracion', demostrar: 'demostracion',
  pruebas: 'demostracion', prueba: 'demostracion', teoremas: 'teorema', axiomas: 'axioma',
  capturar: 'captura', capturas: 'captura', capturada: 'captura', capturadas: 'captura',
  renombrar: 'renombrado', renombramiento: 'renombrado',
  sustituir: 'sustitucion', sustituciones: 'sustitucion', sustituye: 'sustitucion',
  ambito: 'alcance', aridades: 'aridad', argumentos: 'argumento',
  falso: 'falsa', verdaderos: 'verdadera', verdadero: 'verdadera', verdaderas: 'verdadera',
  testigos: 'testigo', contraejemplos: 'contraejemplo', ejemplos: 'ejemplo', ejercicios: 'ejercicio',
  completud: 'completitud', godel: 'goedel', satisfacible: 'satisfacibilidad',
  evaluar: 'evaluacion', evalua: 'evaluacion', evaluan: 'evaluacion',
}));

/**
 * Convierte texto o notación lógica en términos comparables.
 * Quitar tildes sirve solo para buscar: el contenido original conserva su escritura.
 *   terminosDeBusqueda('¿Variables libres en ∀x?') → ['variable', 'libre', 'universal']
 * @param {string} texto
 * @returns {string[]} términos normalizados; pueden repetirse
 */
export function terminosDeBusqueda(texto) {
  // Se protegen antes de NFD: ≠ se descompone como = más una barra combinante.
  const normalizado = texto.replace(/[∀∃¬∧∨→↔=≠⊨⊢⊥↦⟼⇒⇔⊭⊬∈∉]/gu, (simbolo) => ` ${SIMBOLOS.get(simbolo)} `)
    .normalize('NFKC').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
    .replace(/\bpara\s+todos?\b/g, ' universal ')
    .replace(/\bal\s+menos\s+un[oa]?\b/g, ' existencial ');
  return (normalizado.match(/[\p{L}\p{N}]+/gu) ?? [])
    .filter((termino) => termino.length > 1 && !/^\d+$/.test(termino) && !VACIAS.has(termino))
    .map((termino) => ALIAS.get(termino) ?? termino);
}

/**
 * Prepara una vez los términos de los documentos y devuelve una función de búsqueda.
 * @param {object[]} fragmentos  secciones obtenidas al cargar el corpus
 * @returns {Function} buscar(pregunta, {limite = 5, fuente, tipo}) devuelve fragmentos
 *   con puntuacion y coincidencias, ordenados de mayor a menor puntuación
 */
export function crearBuscador(fragmentos) {
  const documentos = fragmentos.map((fragmento) => ({
    fragmento,
    titulo: new Set(terminosDeBusqueda(fragmento.titulo)),
    claves: new Set(terminosDeBusqueda(fragmento.palabrasClave.join(' '))),
    // La transcripción conserva los pies; no deben hacer coincidir todas las diapositivas de un tema.
    cuerpo: terminosDeBusqueda(fragmento.contenido.replace(/^\s*MAC[^\n]*$/gm, '')),
  }));
  const frecuencias = new Map();
  for (const doc of documentos) {
    doc.terminos = new Set([...doc.titulo, ...doc.claves, ...doc.cuerpo]);
    for (const termino of doc.terminos) frecuencias.set(termino, (frecuencias.get(termino) ?? 0) + 1);
  }

  /** Filtra por fuente o tipo si se indican; admite de 1 a 10 resultados. */
  return function buscar(pregunta, { limite = 5, fuente, tipo } = {}) {
    if (typeof pregunta !== 'string') throw new TypeError('La pregunta debe ser texto.');
    if (!Number.isSafeInteger(limite) || limite < 1 || limite > 10) {
      throw new RangeError('El límite debe ser un entero entre 1 y 10.');
    }
    const consulta = [...new Set(terminosDeBusqueda(pregunta))];
    const resultados = [];
    for (const doc of documentos) {
      if (fuente && doc.fragmento.fuente.id !== fuente) continue;
      if (tipo && doc.fragmento.tipo !== tipo) continue;
      const coincidencias = consulta.filter((termino) => doc.terminos.has(termino));
      if (!coincidencias.length) continue;
      let puntuacion = 0;
      for (const termino of coincidencias) {
        // Un término presente en pocos documentos ayuda más a distinguir el fragmento adecuado.
        const peso = Math.log(1 + documentos.length / frecuencias.get(termino));
        const apariciones = doc.cuerpo.filter((palabra) => palabra === termino).length;
        puntuacion += peso * ((doc.titulo.has(termino) ? 5 / Math.sqrt(doc.titulo.size) : 0)
          + (doc.claves.has(termino) ? 3 : 0) + Math.log1p(apariciones));
      }
      // Favorece los fragmentos que cubren más términos distintos de la pregunta.
      puntuacion *= coincidencias.length / consulta.length;
      resultados.push({ ...doc.fragmento, puntuacion, coincidencias });
    }
    return resultados.sort((a, b) => b.puntuacion - a.puntuacion || a.id.localeCompare(b.id))
      .slice(0, limite);
  };
}
