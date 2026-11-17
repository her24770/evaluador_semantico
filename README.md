# Parcial 3 - Evaluador semántico

Aplicación web para analizar fórmulas de lógica de primer orden y determinar su valor de verdad en una interpretación finita definida por el usuario.

El resultado incluye las reglas utilizadas, los entornos y las razones decisivas: testigos, contraejemplos o comprobación completa del dominio. La evaluación semántica se ejecuta en el navegador mediante un algoritmo propio de JavaScript.

**Prueba el proyecto desplegado: [https://tautologia.jhgo.online/](https://tautologia.jhgo.online/)**

## Requisitos de la guía

| N.º | Requisito | Implementación y forma de comprobarlo |
| --- | --- | --- |
| 1 | Lenguaje configurable | En **Lenguaje** se declaran constantes, funciones y predicados con nombres y aridades. Las constantes se representan internamente como funciones de aridad 0. |
| 2 | Interpretación finita | En **Interpretación** se ingresa un dominio finito no vacío, el valor de cada constante, la tabla completa de cada función y las tuplas de cada relación. Se rechazan funciones incompletas y relaciones vacías, según la guía. |
| 3 | Conectivos lógicos | Se admiten `¬`, `∧`, `∨`, `→` y `↔`, además de igualdad, desigualdad y los cuantificadores `∀` y `∃`. Se permiten términos con funciones anidadas. |
| 4 | Variables y cuantificadores | Se aceptan fórmulas abiertas y cerradas, se identifican variables libres y ligadas y se solicita en **Entorno** un elemento del dominio para cada variable libre. |
| 5 | Interfaz gráfica y teclado | Las pantallas permiten ingresar lenguaje, interpretación, fórmula y entorno. El editor incluye botones de símbolos y paréntesis, escritura con teclado y el atajo `Ctrl+Enter` o `⌘+Enter` para evaluar. |
| 6 | Resultado justificado | **Resultados** muestra Verdadero o Falso y un árbol de explicación. Un existencial verdadero incluye un testigo; un universal falso, un contraejemplo; un universal verdadero o un existencial falso, la comprobación de todos los elementos. |
| 7 | Validación de entradas | Se detectan errores de sintaxis, símbolos no declarados, aridades, dominio, tuplas, funciones y asignaciones. Las entradas incorrectas no reciben un valor de verdad. Editar el ejercicio invalida el resultado anterior. |

## Cómo utilizarlo

1. **Lenguaje:** declara los símbolos que utilizarás y sus aridades.
2. **Interpretación:** escribe los elementos del dominio separados por comas, asigna las constantes, completa las tablas de funciones e ingresa las relaciones.
3. **Fórmula:** escribe la expresión con el teclado o los botones. Revisa si es abierta o cerrada y cómo se agruparon sus partes.
4. **Entorno:** asigna valores a las variables libres. Si la fórmula es cerrada, se utiliza el entorno vacío.
5. **Resultados:** evalúa y explora la explicación y, cuando haya cuantificadores, sus tablas interactivas.

Las relaciones unarias se escriben como `1, 2`; las binarias, como `(1, 3), (2, 1)`. Los valores de funciones y constantes se eligen entre los elementos del dominio.

### Ejemplo para probar la evaluación

En **Lenguaje**, declara el predicado unario `P` y el predicado binario `R`. Para este ejemplo no hacen falta constantes ni funciones.

En **Interpretación**, ingresa:

```text
Dominio: 1, 2, 3
P: 1, 2
R: (1, 3), (2, 1), (3, 2)
```

Prueba estas fórmulas con la misma interpretación:

| Fórmula | Entorno | Resultado esperado y justificación |
| --- | --- | --- |
| `∃x P(x)` | Vacío | **Verdadero**. `x ↦ 1` es un testigo. |
| `∀x P(x)` | Vacío | **Falso**. `x ↦ 3` es un contraejemplo. |
| `∀x ∃y R(x, y)` | Vacío | **Verdadero**. Para cada elemento existe una pareja en `R`; se comprueba todo el dominio del universal. |
| `∃x ¬(x = x)` | Vacío | **Falso**. Ningún elemento es distinto de sí mismo; se comprueba todo el dominio. |
| `P(x)` | `x ↦ 2` | **Verdadero**. La variable es libre y su valor pertenece a `P`. Con `x ↦ 3`, es **Falso**. |

Para comprobar la validación, prueba `R(x)` con esa firma, deja sin asignar una variable libre o ingresa una tupla con un elemento fuera del dominio. La aplicación muestra el error y no emite un valor de verdad.

### Notación admitida

| Operación | Símbolo | Alternativas con teclado |
| --- | --- | --- |
| Negación | `¬` | `~`, `!` |
| Conjunción | `∧` | `&`, `/\` |
| Disyunción | `∨` | `\|`, `\/` |
| Implicación | `→` | `->`, `=>` |
| Bicondicional | `↔` | `<->`, `<=>` |
| Universal | `∀` | `forall`, `paratodo` |
| Existencial | `∃` | `exists`, `existe` |
| Igualdad y desigualdad | `=`, `≠` | `=`, `!=` |

Por ejemplo, `forall x (P(x) -> exists y R(x, y))` y `∀x (P(x) → ∃y R(x, y))` representan la misma fórmula.

La precedencia, de mayor a menor, es: negación y cuantificadores, conjunción, disyunción, implicación y bicondicional. La implicación se asocia a la derecha. Usa paréntesis para extender el alcance de un cuantificador: `∀x (P(x) → P(x))`.

Los elementos del dominio son valores de la interpretación. Para nombrar uno directamente dentro de una fórmula, declara una constante y asígnale ese valor; por ejemplo, `c ↦ 1` permite escribir `P(c)`.

## Extras y aportes creativos

### Árbol sintáctico interactivo

Permite inspeccionar la estructura de la fórmula, seleccionar nodos y consultar sus expresiones y variables libres y ligadas. Al seleccionar un cuantificador, resalta las apariciones que liga y distingue los alcances que reutilizan el mismo nombre. Incluye zoom, centrado y navegación con teclado.

### Sustitución con prevención de captura

El panel **Sustitución φ[t/x]** reemplaza únicamente apariciones libres, detecta si el término es libre para la variable y explica los renombres necesarios para evitar capturas. Permite usar el resultado como nueva fórmula.

### Tablas interactivas de cuantificadores

Además de la justificación decisiva, se calcula una traza exhaustiva para consultar los casos del dominio, sus valores y los testigos o contraejemplos. Las filas pueden expandirse para explorar cuantificadores anidados. Incluye vistas resumida y completa, con paginación.

### Lectura de fórmulas desde una foto

En **Fórmula**, el panel **Leer fórmula desde una foto** obtiene una transcripción editable de una imagen. Informa dudas y símbolos pendientes de declarar antes de utilizarla. Requiere el backend y una clave de OpenAI.

### Tutor del curso y explicación local

El **Tutor del curso** ofrece dos pestañas:

- **Consultar teoría:** recupera fragmentos de los temas 01-14 del material versionado y utiliza OpenAI para responder preguntas conceptuales con referencias al material. Requiere backend y clave de API.
- **Entender mi resultado:** explica los pasos ya calculados por el evaluador mediante plantillas locales. Permite recorrer subpasos, entornos y evidencia.

## Ejecutar localmente

### Requisitos

- **Node.js 22.12 o superior** y **npm**.
- Un navegador moderno con soporte de módulos y Web Workers.
- Para el tutor de teoría y la lectura de fotos: una clave de OpenAI con saldo disponible y conexión a Internet.

El evaluador, el árbol sintáctico, la sustitución, las tablas de cuantificadores y la explicación local funcionan sin configurar una API. No se necesita una base de datos.

### 1. Instalar y levantar el evaluador

```bash
git clone https://github.com/her24770/evaluador_semantico.git
cd evaluador_semantico
npm ci
npm run dev
```

Abre **[http://localhost:5173](http://localhost:5173)**. Si el puerto está ocupado, utiliza la dirección que muestre Vite en la terminal. Si ya tienes el repositorio, comienza con `npm ci` desde su carpeta.

### 2. Habilitar el tutor de teoría y la lectura de fotos

Copia `.env.example` como `.env` en la raíz del proyecto. Si ya tienes `.env`, edítalo conservando su configuración.

En PowerShell:

```powershell
Copy-Item .env.example .env
```

En macOS o Linux:

```bash
cp .env.example .env
```

Configura el archivo:

```dotenv
OPENAI_API_KEY=tu_clave
OPENAI_MODEL=gpt-6-luna
```

El modelo predeterminado se define en `.env.example` y puede cambiarse mediante `OPENAI_MODEL`. La lectura de fotos necesita un modelo que admita imágenes. La clave se utiliza únicamente en el servidor; `.env` está excluido de Git y la clave no debe llevar el prefijo `VITE_`.

Mantén abiertas dos terminales en la raíz del proyecto:

```bash
# Terminal 1: backend en http://127.0.0.1:3001
npm run dev:asistente
```

```bash
# Terminal 2: interfaz en http://localhost:5173
npm run dev
```

El proxy de Vite conecta `/api/chat` y `/api/leer-foto` con el backend. Reinicia el backend después de cambiar `.env`. Las consultas de teoría y las lecturas de fotos consumen saldo de la API; la evaluación matemática y **Entender mi resultado** se ejecutan localmente.

### Comandos disponibles

| Comando | Uso |
| --- | --- |
| `npm run dev` | Iniciar la interfaz con Vite. |
| `npm run dev:asistente` | Iniciar el backend con recarga al cambiar archivos. |
| `npm test` | Ejecutar las pruebas automatizadas con el runner de Node.js. |
| `npm run build` | Generar la versión de producción en `dist/`. |
| `npm run preview` | Servir una vista previa del frontend compilado. |
| `npm run buscar:teoria -- "¿Qué es una variable libre?"` | Buscar material del curso localmente, sin API. |
| `npm run consultar:asistente -- "¿Qué es la captura de variables?"` | Consultar al tutor desde la terminal, con el backend activo. |

`npm run preview` requiere ejecutar primero `npm run build`. Solo sirve el frontend: no inicia el backend ni configura el proxy de `/api`. Para probar todas las funciones localmente, usa las dos terminales del apartado anterior.

## Implementación y organización

El proyecto utiliza **JavaScript con módulos ES**, **Vite**, **HTML/CSS**, **SVG** para el árbol sintáctico y **Node.js** para los endpoints opcionales. El backend utiliza las API nativas de Node, sin dependencias de producción adicionales.

El flujo principal es:

```text
Declaración del lenguaje → análisis sintáctico → identificación de variables
→ validación de interpretación y entorno → evaluación → explicación
```

El analizador construye un árbol de sintaxis abstracta (AST). El evaluador lo recorre recursivamente, calcula términos y pertenencia a relaciones, aplica las reglas de los conectivos y evalúa cuantificadores con variantes del entorno. Cada paso devuelve su valor, regla, razón e hijos para construir la explicación.

La evaluación principal detiene un cuantificador al encontrar un testigo o contraejemplo decisivo. La tabla exhaustiva utiliza el mismo recorrido semántico en un modo que visita todos los casos.

| Ruta | Contenido |
| --- | --- |
| `src/sintaxis/` | Lenguaje, lexer, parser, variables, impresión y sustitución. |
| `src/semantica/` | Interpretaciones, entornos, términos y evaluaciones normal y exhaustiva. |
| `src/interfaz/` | Pantallas, editor, estilos, árbol, tablas, fotos y Web Worker. |
| `src/asistente/` | Recuperación de teoría, tutor, lectura de imágenes y explicaciones locales. |
| `api/` | Endpoints `/api/chat` y `/api/leer-foto`. |
| `scripts/` | Servidor local y herramientas de consulta desde la terminal. |
| `tests/` | Pruebas de sintaxis, semántica, interfaz y asistente. |
| `teoria/` | Transcripciones e inventario de fuentes de los temas 01–14. |
| `docs/` | Contratos y documentación de las funcionalidades. |
| `deploy/` | Configuración de Nginx para servir el frontend y dirigir las peticiones al backend. |

El repositorio incluye `Dockerfile.frontend`, `Dockerfile.backend` y `docker-compose.yml` para el despliegue con contenedores, además de `vercel.json` para Vercel. La configuración de Nginx del dominio está en [`deploy/tautologia.nginx`](deploy/tautologia.nginx).

## Pruebas y límites

Para comprobar el proyecto:

```bash
npm test
npm run build
```

Las pruebas cubren análisis y aridades, variables y alcances, sustituciones con captura, interpretación, entornos, conectivos y cuantificadores, coincidencia entre evaluación normal y exhaustiva, integración de los visores y contratos del asistente. Las pruebas de los servicios externos utilizan respuestas simuladas, por lo que no requieren una clave ni consumen saldo.

La aplicación determina verdad en la interpretación y el entorno ingresados. Una evaluación verdadera no demuestra validez en todas las interpretaciones.

Para controlar el uso de recursos, la interfaz admite hasta **4096 entradas por tabla de función** y **32 argumentos**, la evaluación principal tiene un presupuesto de **100 000 nodos de fórmula**, y la exhaustiva de **10 000 nodos** y **128 niveles**. La operación completa tiene un plazo de **10 segundos** y puede cancelarse. Si la tabla exhaustiva supera su presupuesto, se avisa y no se muestra una tabla parcial; puede conservarse el resultado principal ya calculado. Si se cancela o vence el plazo de toda la operación, no se publica un resultado.

## Créditos

El contenido teórico utilizado en este proyecto fue proporcionado por **Mario Castillo**, maestro del curso de **Lógica Matemática** de la **Universidad del Valle de Guatemala**, como material para la clase.

## Referencias de inteligencia artificial

Anthropic. (2026). *Claude* [Herramienta de inteligencia artificial]. https://claude.ai/

OpenAI. (2026). *ChatGPT* [Herramienta de inteligencia artificial]. https://chatgpt.com/
