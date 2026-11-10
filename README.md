# evaluador_semantico

Evaluador semántico de fórmulas de lógica de primer orden en interpretaciones finitas.
Proyecto de MM3032 Lógica Matemática (UVG).

## Cómo correrlo

Se necesita [Node.js](https://nodejs.org) 18 o superior.

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
