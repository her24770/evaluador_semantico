# evaluador_semantico

Evaluador semántico de fórmulas de lógica de primer orden en interpretaciones finitas.
Proyecto de MM3032 Lógica Matemática (UVG).

## Cómo correrlo

Se necesita [Node.js](https://nodejs.org) 22.12 o superior.

```bash
npm install      # solo la primera vez
npm run dev      # abre la app en http://localhost:5173
npm test         # corre las pruebas
```

## Organización

| Carpeta | Contenido | Responsable |
|---|---|---|
| `src/sintaxis/` | Lenguaje, parser, variables libres | Persona 1 |
| `src/semantica/` | Interpretación, entorno, evaluador | Persona 2 |
| `src/interfaz/` | Pantallas y resultados | Persona 3 |
| `tests/` | Pruebas de cada módulo | Cada quien las suyas |
| `docs/` | Contrato entre módulos y reparto | Todos |

- `docs/CONTRATO.md`: qué datos se pasan entre los módulos
- `docs/REPARTO.md`: tareas de cada persona

## Teoría del curso y búsqueda local

Las transcripciones de los temas 01–14 están en [`teoria/`](teoria/README.md).
Los PDF originales se conservan localmente y no se incluyen en Git.
Para buscar fragmentos sin consumir una API:

```bash
npm run buscar:teoria -- "¿Qué es una variable libre?"
```

## Asistente con OpenAI

El tutor tiene dos pestañas: **Consultar teoría**, con OpenAI, y **Entender mi resultado**,
con explicaciones locales de los pasos del algoritmo. Para las consultas de teoría, copia `.env.example`
como `.env` y configura `OPENAI_API_KEY`. La clave queda en el servidor y el archivo
está excluido de Git. No uses el prefijo `VITE_` para la clave.

El modelo predeterminado es `gpt-6-luna`; puedes cambiarlo mediante `OPENAI_MODEL`
en el servidor. Las consultas consumen saldo de la API de OpenAI. La terminal
muestra los tokens de entrada y salida de cada respuesta para medir el consumo.
Si ya tenías el `.env` de Groq, agrega la clave de OpenAI sin sobrescribir las
otras variables y reinicia el backend.

En una terminal inicia el backend:

```bash
npm run dev:asistente
```

En otra terminal haz una consulta:

```bash
npm run consultar:asistente -- "¿Qué es la captura de variables?"
```

Para usar el chat visual, ejecuta también `npm run dev` y abre **Tutor del curso**.
La pregunta aparece arriba y la respuesta reciente debajo, a todo el ancho de lectura.
El historial y el borrador se conservan al cambiar de pestaña o editar el ejercicio.
**Entender mi resultado** requiere haber evaluado la fórmula y funciona sin clave ni
consumo de API: usa plantillas que leen los pasos del algoritmo. Los mensajes de teoría
se mantienen en esta pestaña del navegador hasta borrar la conversación o recargar.

Vite permite acceder a `/api/chat` mediante su proxy mientras el backend esté activo.
La configuración para publicar en Vercel
y el contrato del endpoint están en [`docs/ASISTENTE.md`](docs/ASISTENTE.md).
