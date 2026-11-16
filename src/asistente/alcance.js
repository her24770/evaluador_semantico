export const SOLO_TEORIA = 'Para evaluar tu fórmula, pulsa «Evaluar fórmula». El resultado lo calcula el algoritmo. Después, abre «Entender mi resultado» para revisar sus pasos. Aquí puedo ayudarte con la teoría del curso.';
export const EXPLICAR_RESULTADO = 'Para entender por qué tu fórmula resultó verdadera o falsa, abre «Entender mi resultado». Allí verás el resultado y los pasos calculados por el algoritmo. Si aún no la has evaluado, pulsa «Evaluar fórmula» primero.';

const normalizar = (pregunta) => pregunta.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
const pideExplicacion = (texto) => /\b(?:por que|(?:explica|justifica)(?:r)?(?:me)?|motivo|razon)\b/u.test(texto);

function preguntaPorResultado(texto) {
  const referencia = /\b(?:la formula|el resultado|la evaluacion)\b/u.test(texto);
  const valorDeVerdad = /\b(?:verdadero|verdadera|falso|falsa)\b/u.test(texto);
  const explicaResultado = /\b(?:explica|justifica)(?:r)?(?:me)?\b[\s\S]*\b(?:el resultado|la evaluacion)\b/u.test(texto);
  const solicitaValor = /\b(?:cual|que)\s+(?:es|seria)\s+el\s+(?:resultado|valor de verdad)\b/u.test(texto);
  return (referencia && valorDeVerdad) || explicaResultado || solicitaValor;
}

export function respuestaParaEvaluacion(pregunta) {
  const texto = normalizar(pregunta);
  return pideExplicacion(texto) || preguntaPorResultado(texto) ? EXPLICAR_RESULTADO : SOLO_TEORIA;
}

/** Intercepta solicitudes explícitas y fórmulas concretas antes de consumir la API. */
export function solicitaEvaluacion(pregunta) {
  const texto = normalizar(pregunta);
  return preguntaPorResultado(texto)
    || /\b(?:resuelve|resolver|resolucion|evalua|evaluar|calcula|calcular|determina|dime|dame)\b[\s\S]*\b(?:ejercicio|formula|resultado|valor|verdadero|falso|testigo|contraejemplo)\b/u.test(texto)
    || /\b(?:mi|este|esta|el siguiente|la siguiente)\s+(?:ejercicio|formula|resultado)\b/u.test(texto)
    || /\b(?:dio|salio|sale)\s+(?:verdadero|verdadera|falso|falsa)\b/u.test(texto)
    || /[∀∃]\s*[a-z]\b/iu.test(pregunta)
    || /\b[A-Z][A-Za-z0-9_]*\s*\(/u.test(pregunta)
    || /\b(?:dominio|interpretacion)\s*[:=]/u.test(texto);
}
