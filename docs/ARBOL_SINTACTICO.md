# Árbol sintáctico interactivo

El panel está disponible en Fórmula y Resultados. Representa el AST que entrega
`revisarEntrada`, independientemente de que ya exista una interpretación o un
entorno válidos. Una fórmula o firma inválida elimina la visualización anterior y
muestra la corrección necesaria.

## Uso

- Seleccionar un nodo muestra su expresión, tipo y variables libres y ligadas.
- Seleccionar un cuantificador resalta con un borde discontinuo las apariciones
  ligadas específicamente por él. No incluye las de un cuantificador interior
  que use el mismo nombre.
- Una variable ligada permite volver a su cuantificador mediante un enlace.
- Las variables de una subfórmula se calculan considerándola aisladamente. Si su
  situación cambia dentro de la fórmula completa, el detalle también lo indica.
  Por ejemplo, el término `x` no contiene cuantificadores, pero su aparición en
  `∀x P(x)` está ligada por el universal exterior.
- El zoom admite de 40 % a 200 %. Restablecer vuelve a 100 % y centra la raíz;
  Centrar conserva el zoom y vuelve al eje de la raíz, en la parte superior.
- El lienzo admite desplazamiento horizontal y vertical. Al cambiar su ancho,
  se vuelve a centrar horizontalmente.
- Con un nodo enfocado: ↑ va al padre, ↓ al primer hijo, ← y → recorren los
  nodos en preorden. Inicio y Fin van a los extremos; Enter o Espacio seleccionan.

En pantallas pequeñas, el panel aparece inmediatamente después del editor y la
información del nodo pasa debajo del lienzo. Los colores reutilizan la pizarra:
amarillo para cuantificadores, verde para conectivos, tiza para fórmulas atómicas
y coral para términos. El tipo también se comunica mediante texto.

## Organización y decisiones

| Archivo | Responsabilidad |
| --- | --- |
| `src/interfaz/arbol/modelo.js` | Adapta el AST, identifica nodos, asocia apariciones con cuantificadores, consulta detalles y distribuye subárboles. |
| `src/interfaz/arbol/visor.js` | Dibuja el SVG, representa detalles y errores y controla selección, teclado, zoom y centrado. |
| `src/interfaz/estilos/arbol.css` | Estilos del panel, nodos y selección. Las reglas adaptables están en `responsive.css`. |
| `tests/interfaz/arbol.test.js` | Pruebas de estructura, alcance, distribución, representación y compatibilidad semántica. |

No se incorporan dependencias. Se reutilizan `recorrerOcurrencias`,
`variablesLibres`, `variablesLigadas`, `aCadena` y `terminoACadena` del módulo de
sintaxis. Para consultar un término con las funciones de variables existentes,
se lo envuelve en un predicado temporal, sin añadir ningún cuantificador.

Sintaxis determina si una aparición está ligada. El adaptador visual únicamente
la asocia con el cuantificador ancestral más cercano de ese nombre. Cada nodo
conserva la referencia al AST original y un identificador por ruta (`n.0.1`, por
ejemplo). Así, dos cuantificadores llamados `∀x` conservan identidades distintas.
Las rutas sirven para futuras anotaciones de evaluación dentro del mismo árbol;
no son identificadores persistentes entre ediciones de la fórmula.

La distribución reserva una franja horizontal para cada subárbol y calcula el
ancho según la etiqueta completa. No se recortan nombres de símbolos. Los
árboles grandes se recorren mediante zoom y desplazamiento; no se virtualizan.
Los detalles se calculan al seleccionar, en lugar de imprimir todas las
subexpresiones al construir el árbol.

El controlador no modifica el AST ni el estado semántico. Editar una fórmula
actualiza únicamente el panel, conservando el editor y su cursor. Al abandonar
una vista se desconecta su observador de tamaño. No se implementan valores de
verdad por nodo ni evaluación animada.

## Verificación

```sh
npm test
npm run build
```

Se añaden 19 pruebas: todos los tipos de nodos, precedencia, funciones y términos
anidados, variables libres y ligadas, sombreado y restauración de alcances,
cuantificación vacía, etiquetas largas, árboles anchos y profundos sin
solapamientos, escape de texto, entradas inválidas e invariancia de la evaluación.

La revisión local en Chrome comprueba además selección, resaltado por
cuantificador, navegación con teclado, límites de zoom, recuperación después de
un error, cursor y botones de símbolos, evaluación con Web Worker y conservación
del resultado. Se revisan capturas a 1440, 768, 390 y 320 píxeles, sin
desbordamiento horizontal de la página. Los artefactos locales de esta revisión
se guardan en `.taste-skill/arbol-browser/`, excluida de Git.
