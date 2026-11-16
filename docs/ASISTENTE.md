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

## Bloque 2 — Endpoint y generación con OpenAI

La ruta `POST /api/chat` responde preguntas teóricas mediante OpenAI. Se ejecuta en Node 22.12 o superior, sin instalar un SDK ni dependencias de producción. `api/chat.js` es la misma entrada en local y en Vercel; el servicio carga la teoría una vez por instancia y reutiliza el buscador.

| Archivo | Responsabilidad |
| --- | --- |
| `src/asistente/servicio.js` | Validar la pregunta, elegir evidencia y preparar las instrucciones del tutor. |
| `src/asistente/openai.js` | Una petición de generación a OpenAI, con tiempo y salida limitados. |
| `src/asistente/http.js` | Leer JSON, limitar solicitudes y convertir errores en respuestas seguras. |
| `src/asistente/error.js` | Definir los errores que pueden mostrarse al cliente. |
| `api/chat.js` | Compartir el servicio entre peticiones del endpoint. |
| `scripts/servidor-asistente.js` | Servidor local en `127.0.0.1:3001`. |
| `scripts/consultar-asistente.js` | Consulta de prueba desde la terminal. |
| `vite.config.js` | Proxy local de `/api` al backend. |
| `vercel.json` | Configuración de la compilación y de los archivos de teoría que necesita la función. |

### Configuración local

1. Copiar `.env.example` como `.env`. Si ya existe `.env`, editarlo sin sobrescribir la clave.
2. Configurar `OPENAI_API_KEY` y, opcionalmente, `OPENAI_MODEL`. El modelo predeterminado es `gpt-6-luna`.
3. Ejecutar `npm run dev:asistente` en una terminal. El servidor lee `.env` al arrancar; reiniciarlo si cambia la configuración.
4. En otra terminal, ejecutar `npm run consultar:asistente -- "¿Qué es una variable libre?"`.

Para levantar el evaluador, usar `npm run dev` en otra terminal. Vite conserva el host de la petición al pasar `/api` al servidor local, para permitir las consultas del mismo sitio. `npm run preview` solo sirve el frontend compilado; no inicia el backend ni configura el proxy.

La clave no se importa desde la interfaz, no se devuelve en las respuestas y no debe tener prefijo `VITE_`. `.env`, sus variantes y `.vercel/` están excluidos de Git. `.env.example` solo contiene valores de ejemplo. No se leen claves de otros proyectos.

Para una instalación que antes usaba Groq, agregar `OPENAI_API_KEY` al `.env` existente y reiniciar el servidor. Las variables `GROQ_API_KEY` y `GROQ_MODEL` ya no se utilizan; pueden conservarse localmente si otro proyecto las necesita. La clave de Groq no sirve para autenticar solicitudes a OpenAI.

No es necesario instalar dependencias nuevas. Se conserva Chat Completions para mantener pequeño el cambio y no alterar el formato de las instrucciones y los fragmentos. No se envían parámetros exclusivos de Groq. Para los modelos GPT-6 se usa `reasoning_effort: "none"`, adecuado como punto de partida para explicar evidencia seleccionada sin tokens de razonamiento adicionales. No se fuerza `temperature`. Si se cambia `OPENAI_MODEL` por otra familia, revisar sus parámetros y tarifas antes de usarla; el cliente no añade automáticamente un esfuerzo de razonamiento para esa otra familia.

### Contrato HTTP

La entrada es exclusivamente un objeto JSON con `pregunta`, entre 1 y 1,200 caracteres. Campos adicionales como `historial` o `contexto` todavía se rechazan: su integración corresponde al bloque 3. Se requiere `Content-Type: application/json`.

```json
{ "pregunta": "¿Qué es una variable libre?" }
```

La respuesta correcta tiene estado HTTP 200:

```json
{
  "estado": "respondido",
  "respuesta": "Explicación del modelo basada en los fragmentos seleccionados.",
  "temas": [{ "id": "tema-08", "titulo": "Variables y sustituciones" }],
  "modelo": "gpt-6-luna",
  "consumo": {
    "entrada": 510,
    "salida": 83,
    "total": 593,
    "entradaCache": 0,
    "razonamiento": 0
  }
}
```

`temas` enumera los temas enviados al modelo; no certifica que cada afirmación generada haya sido verificada. No se muestran referencias de páginas. Si la búsqueda no encuentra evidencia suficientemente relacionada, se devuelve HTTP 200 con `estado: "sin_evidencia"`, una explicación fija y `temas: []`, sin llamar a OpenAI. El modelo también tiene instrucciones para reconocer cuando los fragmentos no permiten responder. La relevancia léxica y esas instrucciones reducen errores, pero no garantizan por sí solas la corrección de una respuesta.

`modelo` y `consumo` permiten medir el uso real de cada respuesta. `entradaCache` es una parte de `entrada` y `razonamiento` es una parte de `salida`: no se suman nuevamente al total. Si OpenAI no informa contadores válidos, `consumo` es `null`; un detalle no informado también es `null`, no un cero inventado. Para una respuesta sin evidencia, `modelo` es `null` y el consumo es cero porque no hubo petición. Estos datos son por consulta y no representan el saldo disponible ni un historial persistente de gastos. La terminal muestra los tokens después de la respuesta.

Los errores usan `{ "error": { "codigo": "...", "mensaje": "..." } }`. Los límites de uso pueden añadir `reintentarEn` en segundos y la cabecera `Retry-After`.

| Estado | Situación |
| --- | --- |
| 400 | JSON incorrecto, pregunta vacía o demasiado larga, campos no admitidos. |
| 403 | Se recibió una cabecera Origin de un host distinto o inválida. |
| 405 | Método distinto de POST. |
| 413 | El cuerpo supera 8,192 bytes. |
| 415 | Tipo de contenido distinto de JSON. |
| 429 | Límite local de consultas, petición en curso o límite temporal de OpenAI. |
| 502 | Error de conexión/proveedor, respuesta inválida o explicación incompleta. |
| 503 | Falta la clave; OpenAI rechaza la clave, el modelo o sus permisos; o no hay saldo/cuota de facturación. |
| 504 | La consulta a OpenAI superó 20 segundos. |
| 500 | Fallo interno no previsto, sin exponer sus detalles al cliente. |

Las respuestas usan `Cache-Control: no-store`. No se devuelve el cuerpo de los errores de OpenAI ni se registran preguntas, claves o respuestas en el servidor. El endpoint no habilita CORS para otros sitios. La validación de Origin evita el uso directo desde otra página, pero no es autenticación: un cliente de terminal puede omitir esa cabecera.

Los códigos conocidos `insufficient_quota` y `billing_hard_limit_reached` se convierten en `saldo_openai` y piden revisar la cuenta, sin sugerir que esperar unos segundos resolverá el saldo. Un límite temporal usa `limite_openai` y devuelve `Retry-After`. No se reintenta automáticamente en ninguno de los dos casos. El parámetro `store: false` desactiva el almacenamiento opcional de la completion para recuperación posterior; no sustituye las políticas de retención del proveedor.

### Presupuesto y selección de evidencia

Se revisan hasta diez resultados de búsqueda y se seleccionan hasta cuatro fragmentos completos, con un máximo conjunto de 10,000 bytes de evidencia JSON en UTF-8. Se omiten portadas, objetivos, cierres, coincidencias de baja cobertura y resultados con menos de la mitad de la puntuación del mejor candidato. Esta selección no cambia la transcripción del material. Si una diapositiva no cabe, se omite completa para no cortar una fórmula o una demostración.

El límite de bytes es un control de tamaño, no un cálculo exacto de tokens. La tokenización de símbolos matemáticos puede consumir más que la del texto común. No se envía el curso completo ni un historial. Cada pregunta admitida con evidencia genera una sola petición de Chat Completions y permite hasta 1,200 tokens de salida, incluidos los que use internamente el modelo. Las respuestas terminadas por límite de longitud no se presentan como explicaciones completas. No se reintenta automáticamente una consulta fallida.

Este es ahora un servicio de pago por uso de OpenAI. El presupuesto de tamaño y los límites de frecuencia reducen el consumo, pero no implementan un tope acumulado en dólares. Para estimar costo, aplicar la tarifa vigente del modelo a los tokens de entrada y salida, considerando descuentos de caché cuando correspondan. Las respuestas incompletas o canceladas también pueden consumir tokens; el registro mostrado por la terminal cubre las consultas que terminaron correctamente, no sustituye el panel de consumo de la cuenta. No se usan herramientas de búsqueda web, almacenamiento vectorial de pago ni carga de PDF a OpenAI.

Se permiten seis consultas por minuto y una petición en curso **por instancia del servidor**. En Vercel pueden existir varias instancias y los contadores se reinician al reiniciar una instancia. Esto contiene el consumo de una demostración local; no es un límite global persistente ni una garantía de cuota para una publicación concurrida. Si se necesita un control global, habrá que usar una protección del alojamiento o un almacenamiento compartido.

### Alojamiento elegido y publicación pendiente

Se prepara Vercel para servir Vite y la función Node en el mismo dominio. `vercel.json` incorpora los Markdown y `fuentes.json` al paquete del servidor y excluye los PDF. No se necesita PostgreSQL. El plan Hobby dispone de recursos gratuitos sujetos a sus condiciones y cuotas; OpenAI tiene sus propios límites independientes. No se ha creado ni publicado un proyecto en Vercel durante este bloque.

Para publicar desde la cuenta del usuario:

1. Importar el repositorio en Vercel con el directorio de este proyecto como raíz y seleccionar Node 24.x.
2. Usar el preset Vite, `npm run build` y `dist`; la configuración está en `vercel.json`.
3. Añadir `OPENAI_API_KEY` en las variables de entorno del servidor para los entornos donde se quiera habilitar el asistente. Añadir `OPENAI_MODEL` solo si se cambia el modelo.
4. Publicar y probar `POST https://<dominio>/api/chat`. No subir `.env` ni los PDF.

El dominio, la disponibilidad del plan y las respuestas reales de esa función se verifican después de desplegar; la compilación local no valida por sí sola el empaquetado de Vercel.

Documentación consultada: [Chat Completions de OpenAI](https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create), [errores de OpenAI](https://developers.openai.com/api/docs/guides/error-codes), [GPT-6 Luna y sus tarifas](https://developers.openai.com/api/docs/models/gpt-6-luna), [archivos en funciones de Vercel](https://vercel.com/kb/guide/how-can-i-use-files-in-serverless-functions) y [plan Hobby](https://vercel.com/docs/plans/hobby).

### Verificación del bloque

Se verificaron mediante pruebas automatizadas la selección y el presupuesto de evidencia, entradas inválidas, errores de configuración, cuotas, tiempo agotado, respuestas vacías o incompletas, sanitización de errores y límites de consultas. Las pruebas de OpenAI usan respuestas simuladas y no necesitan la clave ni consumen cuota.

Con OpenAI se probaron dos generaciones reales: variables libres y ligadas (510 tokens de entrada y 83 de salida) y captura de variables (877 de entrada y 137 de salida). El modelo `gpt-6-luna` informó 1,607 tokens en total entre ambas consultas. Se prueban también los contadores ausentes o inválidos y la diferencia entre saldo agotado y límites temporales. Las comprobaciones no sustituyen la evaluación más amplia de respuestas del último bloque ni validan todavía un despliegue en Vercel.

## Siguientes bloques acordados

1. Integrar el chat con la interfaz y con la fórmula, interpretación, entorno y resultado calculado. Asociar el historial al ejercicio y evitar explicaciones de resultados anteriores. El evaluador determina el resultado y el modelo lo explica.
2. Probar respuestas reales con el material y los ejercicios, corregir problemas, verificar la interfaz y completar la entrega y el despliegue.

## Forma de trabajo

Al terminar cada bloque, explicar qué cambió, qué se verificó y qué limitaciones permanecen. Entregar comandos de `git add` con rutas explícitas y un mensaje de `git commit` para ejecución manual del usuario. El asistente no debe ejecutar ninguno de esos dos comandos.
