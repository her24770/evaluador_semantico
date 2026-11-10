// Página temporal para probar el módulo de sintaxis.
// La Persona 3 la reemplaza por la interfaz final (src/interfaz/).
import {
  validarLenguaje, analizar, variablesLibres, variablesLigadas, aCadena, aCadenaCompleta,
  recorrerOcurrencias, ErrorLogico,
} from './sintaxis/index.js';

const $ = (id) => document.getElementById(id);

// "f/1, c/0" → [{nombre: 'f', aridad: '1'}, {nombre: 'c', aridad: '0'}]
const leerDeclaracion = (texto) => texto.split(',').map((s) => s.trim()).filter(Boolean)
  .map((s) => { const [nombre, aridad] = s.split('/'); return { nombre, aridad }; });

const escapar = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

function actualizar() {
  const salida = $('salida');
  const { errores, firma } = validarLenguaje({
    funciones: leerDeclaracion($('funciones').value),
    predicados: leerDeclaracion($('predicados').value),
  });
  if (errores.length) {
    salida.innerHTML = errores.map((e) => `<p class="error">Error de ${e.categoria}: ${escapar(e.message)}</p>`).join('');
    return;
  }

  const texto = $('formula').value;
  try {
    const ast = analizar(texto, firma);
    const libres = variablesLibres(ast);
    const ocurrencias = [];
    recorrerOcurrencias(ast, (nombre, ligada) => ocurrencias.push(`<span class="${ligada ? 'ligada' : 'libre'}">${escapar(nombre)}</span>`));

    salida.innerHTML = `
      <p class="ok">✓ Fórmula bien formada</p>
      <p>Notación del curso: <code>${escapar(aCadena(ast))}</code></p>
      <p>Cómo se leyó: <code>${escapar(aCadenaCompleta(ast))}</code></p>
      <p>${libres.length ? `Abierta. Variables libres: <span class="libre">{${libres.join(', ')}}</span>` : 'Cerrada (enunciado).'}
         Ligadas: <span class="ligada">{${variablesLigadas(ast).join(', ')}}</span></p>
      <p>Ocurrencias (libre / <span class="ligada">ligada</span>): ${ocurrencias.join(' ')}</p>
      <details><summary>Árbol (AST)</summary><pre>${escapar(JSON.stringify(ast, (k, v) => (k === 'pos' ? undefined : v), 2))}</pre></details>`;
  } catch (e) {
    if (!(e instanceof ErrorLogico)) throw e;
    const marca = e.pos === undefined ? '' : `<pre>${escapar(texto)}\n${' '.repeat(e.pos)}^</pre>`;
    salida.innerHTML = `<p class="error">Error de ${e.categoria}: ${escapar(e.message)}</p>${marca}`;
  }
}

['funciones', 'predicados', 'formula'].forEach((id) => $(id).addEventListener('input', actualizar));
actualizar();
