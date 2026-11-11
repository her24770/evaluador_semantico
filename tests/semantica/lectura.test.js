import test from 'node:test';
import assert from 'node:assert/strict';
import {
  leerDominio, leerTuplas, claveDeTupla, normalizarClave, todasLasTuplas,
} from '../../src/semantica/lectura.js';

const categoriasDominio = (txt) => leerDominio(txt).errores.map((e) => e.categoria);
const errorDeTuplas = (txt, aridad) => {
  const { errores, tuplas } = leerTuplas(txt, aridad);
  assert.equal(errores.length, 1, `"${txt}" debió dar un error`);
  assert.deepEqual(tuplas, []);
  return errores[0];
};

test('dominio: los ejemplos del tema 10 (diap. 5 y 7)', () => {
  assert.deepEqual(leerDominio('1, 2, 3'), { errores: [], dominio: ['1', '2', '3'] });
  assert.deepEqual(leerDominio('{a, b, c}'), { errores: [], dominio: ['a', 'b', 'c'] });
  assert.deepEqual(leerDominio('  1 ,2,   3 ').dominio, ['1', '2', '3']); // los espacios sobrantes no importan
});

test('dominio: errores (vacío, repetido, mal separado)', () => {
  for (const mal of ['', '   ', '{}', '1, 1', '1 2', '(1', '1,,2', '1, 2,', 'a, (b)']) {
    const categorias = categoriasDominio(mal);
    assert.ok(categorias.length > 0, `"${mal}" debió dar error`);
    assert.ok(categorias.every((c) => c === 'dominio'), mal);
  }
  assert.match(leerDominio('1, 2, 1').errores[0].message, /"1" está repetido/);
});

test('tuplas: relación binaria escrita con paréntesis', () => {
  assert.deepEqual(leerTuplas('(1, 3), (2, 1)', 2), { errores: [], tuplas: [['1', '3'], ['2', '1']] });
  assert.deepEqual(leerTuplas('{(1,3),(2,1)}', 2).tuplas, [['1', '3'], ['2', '1']]);
  assert.deepEqual(leerTuplas('', 2), { errores: [], tuplas: [] }); // vacía: lo decide la Parte 2
});

test('tuplas: en aridad 1, "(1)" y "1" dan lo mismo', () => {
  const esperado = [['1'], ['2']];
  assert.deepEqual(leerTuplas('1, 2', 1).tuplas, esperado);
  assert.deepEqual(leerTuplas('(1), (2)', 1).tuplas, esperado);
  assert.deepEqual(leerTuplas('{1, 2}', 1).tuplas, esperado);
});

test('tuplas: errores de escritura', () => {
  const malas = [
    ['(1', 2],              // falta ")"
    ['(1, 3) (2, 1)', 2],   // falta la coma entre tuplas
    ['(1, 3),', 2],         // sobra la coma del final
    ['((1, 3))', 2],        // paréntesis dentro de una tupla
    ['1, 3', 2],            // en aridad 2 hacen falta paréntesis
    ['(1, , 3)', 2],        // elemento vacío
    ['(1 3)', 2],           // falta la coma dentro de la tupla
    ['1, 2)', 1],           // ")" sin "("
  ];
  for (const [txt, aridad] of malas) {
    assert.equal(errorDeTuplas(txt, aridad).categoria, 'relación', txt);
  }
  assert.equal(errorDeTuplas('(1, 3) (2, 1)', 2).pos, 7); // dice dónde está el problema
});

test('claves de tabla: se normalizan para que se puedan comparar', () => {
  assert.equal(normalizarClave('1, 2'), '1,2');
  assert.equal(normalizarClave('(1, 2)'), '1,2');
  assert.equal(normalizarClave(' 3 '), '3');
  assert.equal(normalizarClave(''), '');   // la clave de una constante
  assert.equal(normalizarClave('()'), '');
  assert.equal(claveDeTupla(['1', '2']), '1,2');
  assert.equal(claveDeTupla([]), '');
});

test('todas las tuplas de 𝒟ⁿ con 𝒟 = {1, 2, 3}', () => {
  const D = ['1', '2', '3'];
  assert.deepEqual(todasLasTuplas(D, 0).map(claveDeTupla), ['']);   // 𝒟⁰: solo la tupla vacía
  assert.deepEqual(todasLasTuplas(D, 1), [['1'], ['2'], ['3']]);
  const pares = todasLasTuplas(D, 2);
  assert.equal(pares.length, 9);                                    // 3² = 9
  assert.deepEqual(pares[0], ['1', '1']);
  assert.deepEqual(pares[8], ['3', '3']);
  assert.equal(new Set(pares.map(claveDeTupla)).size, 9);           // ninguna repetida
  assert.equal(todasLasTuplas(D, 3).length, 27);                    // 3³ = 27
});
