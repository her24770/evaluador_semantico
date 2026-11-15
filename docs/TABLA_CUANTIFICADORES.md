# Tabla interactiva de cuantificadores

La sección aparece en los resultados cuando una fórmula válida contiene `∀` o `∃`, incluso si la variable cuantificada no aparece en su cuerpo. Utiliza el dominio, las relaciones, las funciones y el entorno ingresados por el usuario.

## Evaluación

`evaluar(ast, interpretacion, entorno)` conserva su contrato y sus cortes anticipados: devuelve el primer testigo o contraejemplo que decide un cuantificador.

`evaluarExhaustivo(ast, interpretacion, entorno, opciones)` es una función adicional exportada por `src/semantica/index.js`. Ambas funciones utilizan el mismo recorrido interno y las mismas reglas para términos, igualdad, negación y conectivos. La variante exhaustiva recorre cada elemento del dominio para cada cuantificador y calcula su resultado con todos los casos.

Al completarse devuelve:

```js
{
  completa: true,
  resultado: nodoDeExplicacion,
  nodosEvaluados: 13,
}
```

Cada nodo de cuantificador de esta traza añade `variable`, `cuerpo`, `elementos` y `decisivos`. `hijos[i]` es la evaluación del cuerpo con la asignación `variable ↦ elementos[i]`. `decisivos` contiene todos los testigos de un existencial o todos los contraejemplos de un universal. `completa: true` indica aquí que se recorrió todo el dominio, independientemente del valor de verdad. Estos campos adicionales no se añaden a la evaluación normal.

Las funciones requieren un AST, una interpretación y un entorno ya validados. Los errores semánticos se propagan; no se convierten en avisos de tamaño. `evaluarEntrada` valida las entradas antes de ejecutar ambas evaluaciones y descarta ambos resultados si encuentra un error.

## Alcances y anidamiento

Cada caso utiliza `variante(entorno, variable, elemento)`, que crea un entorno nuevo. Las variables libres conservan su asignación fuera de los cuantificadores. La reutilización de un nombre en un alcance interno no modifica el entorno exterior.

El visor recorre la traza hasta encontrar un cuantificador y muestra su tabla. Al abrir una fila consulta los cuantificadores del cuerpo bajo el entorno de esa fila, incluso cuando están dentro de conectivos. Por ejemplo, en `∀x (P(x) → ∃y R(x,y))`, cada fila de `x` permite consultar su tabla de `y`.

Las ramas independientes tienen tablas separadas y una posición estructural: `raíz.1` y `raíz.2` representan los hijos de un conectivo. La posición de una tabla interna incorpora las asignaciones de los cuantificadores exteriores, para distinguir incluso alcances que reutilizan nombres.

## Interacciones

- **Ver caso** abre el entorno utilizado, la subfórmula y la razón de su resultado. Las tablas internas se construyen al abrir el caso y se eliminan del DOM al cerrarlo.
- **Vista resumida** muestra testigos o contraejemplos. Si no existen, conserva todos los casos porque todos son necesarios para justificar un universal verdadero o un existencial falso.
- **Vista completa** muestra todos los casos, distribuidos en páginas.
- Los valores V/F tienen etiquetas accesibles y los casos decisivos se identifican mediante texto y color.
- Los controles nativos permiten usar teclado. Cambiar de página lleva el foco al encabezado de la tabla.

El resultado global corresponde a toda la fórmula. El valor de cada tabla corresponde exclusivamente a su cuantificador; puede diferir del resultado global por negaciones o conectivos exteriores.

## Límites operativos

La evaluación normal y la exhaustiva se ejecutan en el Web Worker existente. El botón de cancelación termina el Worker y conserva las entradas. Se mantiene el tiempo máximo de diez segundos para toda la operación.

La traza exhaustiva admite por defecto **10 000 nodos de fórmula evaluados** y **128 niveles de fórmulas**. El presupuesto cuenta también predicados, igualdades y conectivos; no equivale solamente al número de filas. La API admite `maxNodos` y `maxProfundidad` como enteros positivos para otros consumidores; la interfaz utiliza los límites predeterminados.

Si alcanza un límite devuelve `{ completa: false, resultado: null, nodosEvaluados, motivo }`. No se conserva ni se presenta una tabla parcial. La interfaz puede mantener el resultado obtenido previamente por el evaluador normal, acompañado de un aviso explícito de que no hay una comprobación exhaustiva disponible. Si se cancela o vence el plazo de toda la operación, no se publica ningún resultado.

El visor monta como máximo **12 filas por página** y **6 tablas hermanas por página**. La paginación también se aplica dentro de los cuantificadores anidados. Las tablas tienen desplazamiento horizontal cuando su contenido excede el espacio disponible. La traza se mantiene en memoria hasta invalidar el resultado; cambiar cualquier entrada la elimina.

## Archivos y verificación

- `src/semantica/evaluador.js`: recorrido semántico compartido, detección de cuantificadores y traza exhaustiva con límites.
- `src/interfaz/modelo.js` y `evaluacion.worker.js`: validación, evaluación y transporte de la tabla.
- `src/interfaz/cuantificadores/visor.js`: tablas, vistas, expansión progresiva y paginación.
- `src/interfaz/vistas/formula.js`, `index.js` y `estilos/cuantificadores.css`: integración y apariencia.
- `tests/semantica/exhaustivo.test.js`: verdad, coincidencia con evaluación normal, funciones, alcances, ejemplos de temas 10/11 y límites.
- `tests/interfaz/cuantificadores.test.js`: integración, entradas inválidas, paginación, escape de contenido, montaje progresivo y mensajes del Worker.

Ejecutar `npm test` y `npm run build` para comprobar las pruebas y la compilación.
