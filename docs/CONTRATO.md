# Contrato entre módulos

Este documento dice **qué entrega cada módulo y en qué forma**. Si alguien necesita
cambiar algo de aquí, lo avisa al equipo antes.

```
src/
├── sintaxis/    Persona 1  → lenguaje, parser, variables libres   (LISTO)
├── semantica/   Persona 2  → interpretación, entorno, evaluador
└── interfaz/    Persona 3  → pantallas, botones, resultados
```

## 1. Lo que entrega Sintaxis (`src/sintaxis/index.js`)

```js
import {
  validarLenguaje, analizar, variablesLibres, esCerrada,
  aCadena, aCadenaCompleta, terminoACadena, recorrerOcurrencias, ErrorLogico,
} from '../sintaxis/index.js';
```

| Función | Recibe | Devuelve |
|---|---|---|
| `validarLenguaje(decl)` | `{ funciones: [{nombre, aridad}], predicados: [{nombre, aridad}] }` | `{ errores: ErrorLogico[], firma }` |
| `analizar(texto, firma)` | texto de la fórmula y la firma | el **árbol (AST)**, o lanza `ErrorLogico` |
| `variablesLibres(ast)` | árbol | `['x', 'y']` en orden de aparición |
| `esCerrada(ast)` | árbol | `true` si no tiene variables libres |
| `aCadena(ast)` | árbol | texto con símbolos del curso: `∀x(P(x) → Q(x))` |
| `aCadenaCompleta(ast)` | árbol | texto con todos los paréntesis |
| `terminoACadena(t)` | término | texto: `f(x, c)` |
| `recorrerOcurrencias(ast, fn)` | árbol y `fn(nombre, ligada, nodo)` | nada; llama `fn` por cada variable |

La **firma** es `{ funciones: Map(nombre → aridad), predicados: Map(nombre → aridad) }`.
Una función con aridad 0 es una **constante**.

## 2. Forma del árbol (AST)

Cada nodo es un objeto con un campo `tipo`. Además todos tienen `pos` (posición en el texto).

### Términos
| `tipo` | Campos | Ejemplo |
|---|---|---|
| `'var'` | `nombre` | `x` |
| `'fun'` | `nombre`, `args: Termino[]` | `f(x, c)`; una constante tiene `args: []` |

### Fórmulas
| `tipo` | Campos | Significado |
|---|---|---|
| `'pred'` | `nombre`, `args: Termino[]` | P(t₁, …, tₙ) |
| `'igual'` | `izq`, `der` (términos) | t₁ = t₂ |
| `'no'` | `sub` | ¬φ |
| `'y'` | `izq`, `der` | φ ∧ ψ |
| `'o'` | `izq`, `der` | φ ∨ ψ |
| `'imp'` | `izq`, `der` | φ → ψ |
| `'sii'` | `izq`, `der` | φ ↔ ψ |
| `'paratodo'` | `variable` (texto), `cuerpo` | ∀x φ |
| `'existe'` | `variable` (texto), `cuerpo` | ∃x φ |

`t₁ ≠ t₂` llega como `{ tipo: 'no', sub: { tipo: 'igual', … } }`.

Ejemplo: `∀x (P(x) → R(x, c))`
```js
{ tipo: 'paratodo', variable: 'x', cuerpo:
  { tipo: 'imp',
    izq: { tipo: 'pred', nombre: 'P', args: [ { tipo: 'var', nombre: 'x' } ] },
    der: { tipo: 'pred', nombre: 'R', args: [ { tipo: 'var', nombre: 'x' },
                                              { tipo: 'fun', nombre: 'c', args: [] } ] } } }
```

## 3. Errores (`ErrorLogico`)

Todos los módulos reportan errores del usuario con la misma clase:

```js
new ErrorLogico(categoria, mensaje, pos)
```

| Categoría | Quién la usa | Ejemplo |
|---|---|---|
| `lenguaje` | Sintaxis | nombre repetido o vacío |
| `sintaxis` | Sintaxis | falta un paréntesis |
| `símbolo` | Sintaxis | predicado no declarado |
| `aridad` | Sintaxis | R es binario y recibió 1 argumento |
| `dominio` | Semántica | dominio vacío o repetido |
| `función` | Semántica | f no está definida en alguna tupla |
| `relación` | Semántica | relación vacía o tupla con elementos fuera de 𝒟 |
| `entorno` | Semántica | variable libre sin valor |

**Regla del requerimiento 7:** si hay cualquier error, no se muestra Verdadero ni Falso.

## 4. Lo que debe entregar Semántica (`src/semantica/index.js`) — propuesta

```js
validarInterpretacion(firma, { dominioTexto, funciones, relaciones })
  // → { errores, interpretacion: { dominio: string[], funciones: Map, relaciones: Map } }
validarEntorno(libres, entorno, dominio)
  // → { errores, entorno: { x: 'a', ... } }
evaluar(ast, interpretacion, entorno)
  // → nodo de explicación (abajo)
```

Datos que la interfaz le pasa:
```js
dominioTexto: '1, 2, 3'
funciones:  { f: { '1': '2', '2': '3', '3': '1' }, c: { '': '1' }, g: { '1,2': '3', ... } }
relaciones: { P: '1, 2', R: '(1, 3), (2, 1)' }
entorno:    { y: '2' }
```

Nodo de explicación (lo que la interfaz dibuja):
```js
{
  formula: '∀x P(x)',        // aCadena del nodo
  valor: false,
  regla: '∀',                // '∀' '∃' '¬' '∧' '∨' '→' '↔' 'atómica' 'igualdad'
  razon: 'Contraejemplo: con x ↦ 3, P(x) es F',
  entorno: '[x ↦ 3]',
  hijos: [ /* nodos que justifican el resultado */ ],
  testigo:       { variable: 'x', elemento: '1' },  // solo en ∃ verdadero
  contraejemplo: { variable: 'x', elemento: '3' },  // solo en ∀ falso
  completa: true,                                    // ∀ verdadero o ∃ falso
}
```
