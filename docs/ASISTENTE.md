# Desarrollo del asistente del curso

## Bloque 1 — Material y recuperación

El material versionado está en `teoria/`: una transcripción por tema, con una sección por diapositiva, y el inventario de los PDF originales de los temas 01–14. Los PDF se conservan localmente como respaldo opcional, fuera de Git; el buscador funciona sin ellos.

La aplicación sigue usando JavaScript y Vite. Este bloque agrega únicamente módulos de JavaScript y un comando de Node para probar la recuperación; no agrega dependencias de producción ni requiere Python, Docker, PostgreSQL o una clave de API para funcionar.

| Archivo | Responsabilidad |
| --- | --- |
| `src/asistente/corpus.js` | Interpretar el formato de los Markdown y validar sus referencias internas. |
| `src/asistente/cargar-corpus.js` | Leer en Node el inventario y los documentos enumerados. |
| `src/asistente/busqueda.js` | Ordenar los fragmentos por términos, símbolos y etiquetas relacionadas. |
| `scripts/buscar-teoria.js` | Consultar la teoría desde la terminal. |

El buscador se crea una vez con `crearBuscador(await cargarCorpus())`. Devuelve una función `buscar(pregunta, { limite, fuente, tipo })`. El límite predeterminado es cinco resultados y el máximo es diez. Cada resultado incluye título, contenido, tipo, fuente, ubicación interna, coincidencias y puntuación. La puntuación sirve para ordenar; no mide la certeza ni certifica que haya información suficiente para responder.

Las tildes se normalizan únicamente al buscar. El texto recuperado conserva los caracteres de la transcripción. Los símbolos de negación de igualdad y de consecuencia se protegen antes de normalizar Unicode para no confundirlos con sus versiones sin negación.

La búsqueda es léxica, con equivalencias explícitas y pesos para títulos, etiquetas y cuerpo. No usa embeddings ni un modelo. Los pies de diapositiva se conservan en los archivos, pero no se usan para puntuar, porque provocarían que todas las diapositivas de un tema coincidieran por el nombre del tema.

La conservación íntegra del contenido visual se apoya en los PDF originales. Las limitaciones de la transcripción y las observaciones de revisión están documentadas en `teoria/README.md` y `teoria/REVISION.md`.

## Siguientes bloques acordados

1. Conectar un endpoint de Node a Groq, usando una sola petición de generación por pregunta. Mantener la clave en el servidor, acotar el contexto y manejar falta de evidencia, errores y cuotas. Resolver el alojamiento del backend.
2. Integrar el chat con la interfaz y con la fórmula, interpretación, entorno y resultado calculado. Asociar el historial al ejercicio y evitar explicaciones de resultados anteriores. El evaluador determina el resultado y el modelo lo explica.
3. Probar respuestas reales con el material y los ejercicios, corregir problemas, verificar la interfaz y completar la documentación de entrega y despliegue.

## Forma de trabajo

Al terminar cada bloque, explicar qué cambió, qué se verificó y qué limitaciones permanecen. Entregar comandos de `git add` con rutas explícitas y un mensaje de `git commit` para ejecución manual del usuario. El asistente no debe ejecutar ninguno de esos dos comandos.
