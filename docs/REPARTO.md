# Reparto del proyecto

Antes de empezar, cada uno lee `docs/CONTRATO.md`: ahí está la forma exacta de los datos
que se pasan entre los módulos.

## Persona 1 — Sintaxis + estructura del proyecto ✅ (listo)
**Carpeta:** `src/sintaxis/` · **Puntos que cubre:** análisis sintáctico (10)
**Temas para la defensa:** 01 Lenguajes formales, 07 Lenguajes de primer orden, 08 Variables y sustituciones

- [x] Proyecto con Vite (`npm run dev`, `npm test`)
- [x] Validar el lenguaje: nombres y aridades (requerimiento 1)
- [x] Parser con todos los conectivos y alternativas de teclado (requerimientos 3 y 5)
- [x] Errores de sintaxis, símbolos y aridades con su posición (requerimiento 7)
- [x] Variables libres y ligadas, y fórmulas abiertas o cerradas (requerimiento 4)
- [x] Pruebas en `tests/sintaxis/`
- [x] Contrato entre módulos (`docs/CONTRATO.md`)

## Persona 2 — Semántica
**Carpeta:** `src/semantica/` · **Puntos que cubre:** evaluación semántica y justificación (30)
**Temas para la defensa:** 03 Enfoque semántico, 10 Interpretaciones, 11 Entornos

- [ ] Leer y validar el dominio 𝒟: no vacío, sin elementos repetidos (requerimiento 2)
- [ ] Validar las funciones fᴵ: definidas en **todas** las tuplas de 𝒟ⁿ, con valores en 𝒟
- [ ] Leer y validar las relaciones Pᴵ: no vacías, tuplas del tamaño correcto y con elementos de 𝒟
- [ ] Validar el entorno: cada variable libre debe tener un valor en 𝒟 (requerimiento 4)
- [ ] Evaluar términos: variables con el entorno, funciones con su tabla
- [ ] Evaluar fórmulas con la definición de ℐ ⊨ₗ φ del tema 11
- [ ] Explicación (requerimiento 6):
  - ∃ verdadero → **testigo**
  - ∀ falso → **contraejemplo**
  - ∀ verdadero o ∃ falso → **comprobación completa** sobre todo 𝒟
  - ∧, ∨, →, ↔ → qué parte decidió el resultado
- [ ] Pruebas con los ejemplos resueltos de los temas 10 y 11 (`tests/semantica/`)

**Puede empezar ya:** recibe el árbol de `analizar()` (ver CONTRATO.md) y no depende de la interfaz.

## Persona 3 — Interfaz gráfica
**Carpeta:** `src/interfaz/` · **Puntos que cubre:** interfaz gráfica (10)
**Temas para la defensa:** todos los anteriores a nivel general (la interfaz los conecta)

- [ ] Pantalla para declarar el lenguaje: agregar o quitar funciones y predicados con su aridad
- [ ] Pantalla de interpretación: dominio, tabla para cada función y selector de tuplas para cada relación
- [ ] Campo de fórmula con botones ¬ ∧ ∨ → ∀ ∃ ( ) que insertan en la posición del cursor, más edición con teclado (requerimiento 5)
- [ ] Mostrar en vivo los errores de la fórmula (con la posición) y sus variables libres
- [ ] Pedir el entorno solo para las variables libres
- [ ] Mostrar **Verdadero / Falso** y la explicación paso a paso; si hay errores, mostrar la lista y **ningún** valor de verdad
- [ ] Reemplazar la página temporal `src/main.js`

**Puede empezar ya:** puede usar `analizar()` y `variablesLibres()`, que ya funcionan. Mientras
Semántica no esté lista, puede dibujar el resultado con un nodo de explicación de ejemplo (ver CONTRATO.md).

## Después de la base: aportes creativos (20 pts)
Se reparten cuando lo obligatorio funcione. Cada aporte tiene un dueño que lo defiende.
Ideas: buscador de contraejemplos, árbol sintáctico visual, relaciones como grafo,
evaluación animada, modo reto para la clase.

## Para la defensa individual (30 pts)
El docente puede preguntar sobre **cualquier** parte. Cada uno debe poder explicar,
al menos de forma general, los tres módulos.
