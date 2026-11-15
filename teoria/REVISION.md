# Observaciones de revisión de las fuentes

Estas observaciones están separadas del corpus. El cargador solo consulta los documentos enumerados en `fuentes.json`; no utiliza este archivo como si fuera texto de las diapositivas.

## Afirmaciones originales conservadas

Se conservaron las erratas y las inconsistencias detectadas en las fuentes para respetar la petición de mantener la información tal como aparece. No se añadieron soluciones a los ejercicios.

| Fuente | Observación |
| --- | --- |
| Tema 11, ejemplo de variante de un entorno | El texto dice que `l[x ↦ b]` cambia x «a 1», mientras la notación y las igualdades de la misma diapositiva asignan b. |
| Tema 12, fórmula de cierre de la reducción de PCP | La fórmula cuantifica v y w, pero muestra u en el antecedente `P(u,w)`. La explicación en prosa usa v y w. |
| Tema 12, conclusión de la prueba de indecidibilidad | Una oración final dice «decidible», mientras el argumento, el encabezado y la conclusión siguiente establecen indecidibilidad. |
| Tema 13, clasificación de símbolos | Los cuantificadores aparecen bajo «símbolos no lógicos», en contraste con la clasificación del tema 07. |
| Tema 14, ejemplo de autorreferencia | El ejemplo cambia de 423 a 243 entre diapositivas. Los números se conservaron como aparecen, sin unificarlos. |

Estas observaciones no sustituyen una fe de erratas del curso. Al integrar la generación de respuestas se deberá distinguir entre reproducir una afirmación de la fuente y justificar que sea matemáticamente correcta.

## Texto y contenido visual

La versión Markdown contiene una sección por diapositiva y se utiliza como texto de búsqueda. Los diagramas y la disposición bidimensional de fórmulas, tablas y demostraciones tienen como referencia definitiva el PDF íntegro. No se debe asumir que una búsqueda de texto interprete relaciones expresadas únicamente mediante flechas, líneas o recuadros.

En la conversión se normalizaron representaciones de caracteres de fuentes del PDF cuando su forma visible correspondía a un paréntesis, un corchete, una conjunción grande, una viñeta o la barra de sustitución `φ[t/x]`. Esto recupera la notación; no cambia las afirmaciones del material.
