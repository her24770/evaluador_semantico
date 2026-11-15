import test from 'node:test';
import assert from 'node:assert/strict';
import { analizar, validarLenguaje, variablesLibres, variablesLigadas, aCadenaCompleta } from '../../src/sintaxis/index.js';
import { crearArbol, detalleNodo, distribuirArbol } from '../../src/interfaz/arbol/modelo.js';
import { detalleHTML, svgArbolHTML, montarArbol } from '../../src/interfaz/arbol/visor.js';
import { crearEstado, revisarEntrada, evaluarEntrada } from '../../src/interfaz/modelo.js';

const { firma } = validarLenguaje({
  funciones: [{ nombre: 'f', aridad: 1 }, { nombre: 'g', aridad: 2 }, { nombre: 'c', aridad: 0 }],
  predicados: [{ nombre: 'P', aridad: 1 }, { nombre: 'Q', aridad: 1 }, { nombre: 'R', aridad: 2 }],
});
const arbolDe = (texto) => crearArbol(analizar(texto, firma));
const etiquetas = (arbol) => arbol.nodos.map((n) => n.etiqueta);

for (const [texto, esperado] of [
  ['¬P(x)', ['¬', 'P', 'x']], ['P(x) ∧ Q(y)', ['∧', 'P', 'x', 'Q', 'y']],
  ['P(x) ∨ Q(y)', ['∨', 'P', 'x', 'Q', 'y']], ['P(x) → Q(y)', ['→', 'P', 'x', 'Q', 'y']],
  ['P(x) ↔ Q(y)', ['↔', 'P', 'x', 'Q', 'y']],
  ['∀x ∃y R(x, y)', ['∀x', '∃y', 'R', 'x', 'y']],
  ['f(c) = x', ['=', 'f', 'c', 'x']], ['x ≠ c', ['¬', '=', 'x', 'c']],
  ['R(g(f(x), c), f(g(y, c)))', ['R', 'g', 'f', 'x', 'c', 'f', 'g', 'y', 'c']],
]) {
  test(`árbol: estructura completa de ${texto}`, () => {
    const arbol = arbolDe(texto);
    assert.deepEqual(etiquetas(arbol), esperado);
    assert.equal(new Set(arbol.nodos.map((n) => n.id)).size, esperado.length);
    assert.equal(arbol.porId.get(arbol.raizId).padreId, null);
    for (const nodo of arbol.nodos) {
      for (const id of nodo.hijos) {
        assert.equal(arbol.porId.get(id).padreId, nodo.id);
        assert.equal(arbol.porId.get(id).profundidad, nodo.profundidad + 1);
      }
    }
  });
}

test('árbol: conserva precedencia, asociatividad y referencias al AST original', () => {
  const ast = analizar('¬P(x) ∧ Q(y) ∨ P(c) → Q(c) → R(x, y) ↔ P(x)', firma);
  const copia = structuredClone(ast);
  const arbol = crearArbol(ast);
  assert.equal(arbol.nodos[0].ast, ast);
  assert.equal(arbol.nodos[0].etiqueta, '↔');
  const implicaciones = arbol.nodos.filter((n) => n.ast.tipo === 'imp');
  assert.equal(arbol.porId.get(implicaciones[0].hijos[1]), implicaciones[1]);
  for (const nodo of arbol.nodos) detalleNodo(arbol, nodo.id);
  distribuirArbol(arbol);
  assert.deepEqual(ast, copia);
});

test('árbol: el cuantificador exterior no liga las apariciones sombreadas por el interior', () => {
  const arbol = arbolDe('∀x(P(x) ∧ ∃x Q(x))');
  const [exterior, interior] = arbol.nodos.filter((n) => n.grupo === 'cuantificador');
  const [primera, segunda] = arbol.nodos.filter((n) => n.ast.tipo === 'var');
  assert.deepEqual(detalleNodo(arbol, exterior.id).aparicionesLigadas, [primera.id]);
  assert.deepEqual(detalleNodo(arbol, interior.id).aparicionesLigadas, [segunda.id]);
  assert.equal(primera.cuantificadorId, exterior.id);
  assert.equal(segunda.cuantificadorId, interior.id);
});

test('árbol: restaura el alcance al salir de un cuantificador y entre ramas hermanas', () => {
  const arbol = arbolDe('P(x) ∧ ∀x(∃x P(f(x)) ∧ R(x, y)) ∧ ∃x Q(x) ∧ Q(x)');
  const variables = arbol.nodos.filter((n) => n.ast.tipo === 'var');
  const [exterior, interior, hermano] = arbol.nodos.filter((n) => n.grupo === 'cuantificador');
  assert.deepEqual(variables.map((n) => n.cuantificadorId), [null, interior.id, exterior.id, null, hermano.id, null]);
  const raiz = detalleNodo(arbol, arbol.raizId);
  assert.deepEqual(raiz.libres, ['x', 'y']);
  assert.deepEqual(raiz.ligadas, ['x']);
});

test('árbol: cuantificadores distintos y cuantificación vacía', () => {
  const arbol = arbolDe('∀z ∀x ∃y R(g(x, c), f(y))');
  const [vacio, universal, existencial] = arbol.nodos.filter((n) => n.grupo === 'cuantificador');
  assert.deepEqual(detalleNodo(arbol, vacio.id).aparicionesLigadas, []);
  assert.equal(detalleNodo(arbol, universal.id).aparicionesLigadas.length, 1);
  assert.equal(detalleNodo(arbol, existencial.id).aparicionesLigadas.length, 1);
  assert.match(detalleHTML(arbol, vacio.id), /no liga ninguna aparición/);
});

test('árbol: reutiliza las variables de sintaxis en cada subfórmula y término', () => {
  const arbol = arbolDe('∀x(R(g(x, y), c) ∧ ∃y Q(f(y)))');
  for (const nodo of arbol.nodos) {
    const formula = nodo.grupo === 'termino' ? { tipo: 'pred', args: [nodo.ast] } : nodo.ast;
    const detalle = detalleNodo(arbol, nodo.id);
    assert.deepEqual(detalle.libres, variablesLibres(formula));
    assert.deepEqual(detalle.ligadas, variablesLigadas(formula));
  }
  const funcion = arbol.nodos.find((n) => n.etiqueta === 'g');
  const detalle = detalleNodo(arbol, funcion.id);
  assert.equal(detalle.texto, 'g(x, y)');
  assert.deepEqual(detalle.libres, ['x', 'y']);
  assert.deepEqual(detalle.libresContexto, ['y']);
  assert.deepEqual(detalle.ligadasContexto, ['x']);
  assert.match(detalleHTML(arbol, funcion.id), /En la fórmula completa/);
  const constante = arbol.nodos.find((n) => n.etiqueta === 'c');
  assert.equal(detalleNodo(arbol, constante.id).tipo, 'Constante');
  assert.deepEqual(detalleNodo(arbol, constante.id).libres, []);
  assert.equal(detalleNodo(arbol, 'inexistente'), null);
});

test('árbol: distribución sin solapamientos en árboles anchos, profundos y etiquetas largas', () => {
  const textos = ['P(x)', '¬'.repeat(80) + 'P(x)', Array(80).fill('R(g(x, y), c)').join(' ∧ ')];
  const nombreLargo = 'variableConNombreMuyLargo';
  textos.push(`∀${nombreLargo} R(${nombreLargo}, y)`);
  for (const texto of textos) {
    const arbol = arbolDe(texto), { cajas, ancho, alto } = distribuirArbol(arbol);
    for (const nodo of arbol.nodos) {
      const caja = cajas.get(nodo.id);
      assert.ok(caja.x - caja.ancho / 2 >= 0 && caja.x + caja.ancho / 2 <= ancho);
      assert.ok(caja.y >= 0 && caja.y + caja.alto <= alto);
      for (const otro of arbol.nodos) {
        if (otro.id === nodo.id || otro.profundidad !== nodo.profundidad) continue;
        const vecina = cajas.get(otro.id);
        assert.ok(Math.abs(caja.x - vecina.x) >= (caja.ancho + vecina.ancho) / 2 + 24);
      }
      for (const hijoId of nodo.hijos) assert.ok(cajas.get(hijoId).y > caja.y + caja.alto);
    }
  }
});

test('árbol: SVG con todas las conexiones y nodos seleccionables por teclado', () => {
  const arbol = arbolDe('∀x R(f(x), c)');
  const svg = svgArbolHTML(arbol, distribuirArbol(arbol));
  assert.equal((svg.match(/<path /g) || []).length, arbol.nodos.length - 1);
  assert.equal((svg.match(/role="button"/g) || []).length, arbol.nodos.length);
  assert.equal((svg.match(/tabindex="0"/g) || []).length, 1);
  assert.match(svg, /aria-pressed="true"/);
  assert.match(detalleHTML(arbol, 'n.0.0.0'), /data-arbol-elegir="n"/);
});

test('árbol: escapa nombres y expresiones al representarlos', () => {
  // Defensa de la capa de representación incluso si recibe un AST externo.
  const arbol = crearArbol({ tipo: 'pred', nombre: '<script>', args: [{ tipo: 'var', nombre: '"<x>' }] });
  const html = svgArbolHTML(arbol, distribuirArbol(arbol)) + detalleHTML(arbol, arbol.raizId);
  assert.doesNotMatch(html, /<script>|"<x>/);
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /&quot;&lt;x&gt;/);
});

test('árbol: una fórmula inválida o una firma inválida muestra errores sin dibujar SVG', () => {
  const estado = { ...crearEstado(), predicados: [{ nombre: 'P', aridad: 1 }] };
  const contenido = { innerHTML: '' };
  const contenedor = { querySelector: () => contenido, addEventListener() {} };
  for (const texto of ['', 'P(x', 'P(x, y)', 'Q(x)', '∀x', 'P(x) ∧']) {
    estado.formula = texto;
    const revision = revisarEntrada(estado);
    assert.equal(revision.ast, null);
    montarArbol(contenedor, revision);
    assert.match(contenido.innerHTML, /<ul class="errores">/);
    assert.doesNotMatch(contenido.innerHTML, /<svg/);
  }
  estado.predicados.push({ nombre: 'P', aridad: 2 });
  montarArbol(contenedor, revisarEntrada(estado));
  assert.match(contenido.innerHTML, /Revisa los símbolos declarados/);
  assert.doesNotMatch(contenido.innerHTML, /<svg/);
});

test('árbol: las consultas visuales no alteran la evaluación ni el AST', () => {
  const estado = {
    ...crearEstado(), dominioTexto: '1, 2', entorno: { x: '1' },
    predicados: [{ nombre: 'P', aridad: 1, relacion: '1' }, { nombre: 'Q', aridad: 1, relacion: '2' }],
    funciones: [{ nombre: 'f', aridad: 1, tabla: { 1: '2', 2: '1' } }, { nombre: 'c', aridad: 0, tabla: { '': '1' } }],
  };
  for (const formula of ['∀x(P(x) ∧ ∃x Q(x))', 'P(x) ∧ ∃x Q(x)', '∀x(P(x) ∨ Q(x))', 'P(f(c))', 'f(c) ≠ c']) {
    estado.formula = formula;
    const antes = evaluarEntrada(estado);
    assert.ok(antes.valido);
    const textoAST = aCadenaCompleta(antes.ast);
    const arbol = crearArbol(antes.ast);
    for (const nodo of arbol.nodos) detalleHTML(arbol, nodo.id);
    svgArbolHTML(arbol, distribuirArbol(arbol));
    assert.equal(aCadenaCompleta(antes.ast), textoAST);
    assert.deepEqual(evaluarEntrada(estado).resultado, antes.resultado);
  }
});
