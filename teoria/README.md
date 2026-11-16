# Material del curso para el asistente

Este corpus usa únicamente los PDF de los temas 01 a 14 de MM3032. Incluye las 293 diapositivas: portadas, objetivos, definiciones, ejemplos, ejercicios, demostraciones y cierres. No incluye los Word ni la actividad independiente.

La prioridad es conservar el material. Los Markdown contienen la transcripción de todas las diapositivas, sin resumirlas, resolver sus ejercicios ni corregir silenciosamente las afirmaciones del curso. Los PDF originales se conservan en la carpeta local `Logica`, fuera del repositorio. Las copias opcionales en `pdf/`, verificadas con SHA-256, están excluidas de Git y no se necesitan para ejecutar el buscador o sus pruebas.

## Contenido

| Tema | Texto para búsqueda |
| --- | --- |
| 01 | [Lenguajes formales](01-lenguajes-formales.md) |
| 02 | [Lógica proposicional desde la sintaxis](02-logica-proposicional-sintaxis.md) |
| 03 | [Lógica proposicional desde la semántica](03-logica-proposicional-semantica.md) |
| 04 | [Validez proposicional](04-validez-proposicional.md) |
| 05 | [Completitud proposicional](05-completitud-proposicional.md) |
| 06 | [Consistencia y decidibilidad](06-consistencia-decidibilidad.md) |
| 07 | [Lenguajes de primer orden](07-lenguajes-primer-orden.md) |
| 08 | [Variables y sustituciones](08-variables-sustituciones.md) |
| 09 | [Sintaxis de predicados](09-predicados-sintaxis.md) |
| 10 | [Interpretaciones](10-interpretaciones.md) |
| 11 | [Entornos](11-entornos-evaluacion.md) |
| 12 | [Epílogo de predicados](12-epilogo-predicados.md) |
| 13 | [Aritmética de Peano](13-aritmetica-peano.md) |
| 14 | [Incompletitud](14-incompletitud.md) |

## Cómo se preparó

Se extrajo la capa de texto de todas las diapositivas y se reconstruyeron sus líneas a partir de la posición de los caracteres. Se eliminaron únicamente las sobreimpresiones de la misma letra usadas para simular negrita. Se recuperaron 1,124 paréntesis, llaves y corchetes dibujados como trazados vectoriales que una extracción normal omitía. Se conservaron los subíndices y superíndices reconocibles como `_{...}` y `^{...}`. Las equivalencias de caracteres de fuentes matemáticas se verificaron contra las páginas renderizadas.

La extracción conserva el texto y aproxima sus columnas; **no es una reproducción visual exacta**. Las flechas de un esquema, las conexiones de un árbol y los límites de recuadros de una demostración siguen estando en el PDF original. Los PDF conservan también las imágenes que no forman parte de la capa textual. Para una pregunta que dependa de esos elementos, debe consultarse el original: el buscador de este bloque no hace interpretación visual.

Se revisaron visualmente páginas representativas de los 14 temas, especialmente definiciones, fórmulas, cuantificadores y sustituciones. La cobertura de las 293 diapositivas se comprueba automáticamente. Si están disponibles las copias locales en `pdf/`, también se verifica su identidad; si no están, únicamente se omite esa comprobación opcional. Estas pruebas no equivalen a una certificación manual de cada fórmula o diagrama de la transcripción.

Las observaciones sobre inconsistencias de las fuentes están en [REVISION.md](REVISION.md), fuera del corpus consultado. No se mezclan con las afirmaciones originales.

## Formato y mantenimiento

`fuentes.json` enumera explícitamente los 14 documentos, su archivo de texto, su original, su cantidad de diapositivas y la huella SHA-256 del PDF. El cargador no incorpora otros archivos por encontrarse en esta carpeta.

Cada sección `##` contiene una diapositiva. `Páginas` es un identificador interno para verificar la cobertura y localizar el original; no obliga a citar páginas en las respuestas. `Palabras clave` contiene etiquetas editoriales de búsqueda, separadas por punto y coma: ayudan a encontrar un concepto sin modificar el cuerpo de la transcripción. `Tipo` distingue teoría, ejemplos y ejercicios según el título de la diapositiva.

Al revisar un texto, conservar el original, sus condiciones y sus ejemplos. Si se agrega una explicación o solución propia, debe quedar separada e identificada; no atribuirla a las diapositivas. Al sustituir un PDF, actualizar la huella y comprobar nuevamente la cobertura.

## Probar la búsqueda

Desde la raíz del proyecto:

```powershell
npm run buscar:teoria -- "¿Qué es la captura de variables?"
npm run buscar:teoria -- "¿Por qué una implicación con antecedente falso es verdadera?"
npm test
```

El comando muestra hasta cinco fragmentos originales relacionados y el tema correspondiente. No redacta una respuesta nueva ni llama a Groq. Una coincidencia léxica no garantiza que el fragmento responda por completo a la pregunta.

Los casos de validación de búsqueda están en `tests/asistente/consultas.json`: cubren los 14 temas y comprueban que el fragmento esperado aparezca entre los tres primeros. También se prueban consultas ajenas al curso, tildes, símbolos y filtros por tema o tipo de contenido.
