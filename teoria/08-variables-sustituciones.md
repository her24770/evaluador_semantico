# Variables y sustituciones

Fuente: tema-08

## Lenguajes de
Páginas: 1
Palabras clave: Lenguajes de
Tipo: teoría

```text
Lenguajes de
   primer orden
     MM3032 Lógica Matemática
     MAC Variables y sustituciones
```

## Objetivos
Páginas: 2
Palabras clave: Objetivos
Tipo: teoría

```text
Objetivos
      Definir los conceptos de alcance de un
      cuantificador, variables libres y ligadas,
      sustitución  y  términos  libres  en  una
      fórmula.
      Determinar    el    alcance    de    un
      cuantificador.
      Indicar si una variable es libre o ligada.
      Realizar correctamente sustituciones de
      términos.
     MAC Variables y sustituciones
```

## Consideremos el árbol sintáctico de la fórmula ∀𝑥 ((𝑃(𝑥) → 𝑄(𝑥)) ∧ 𝑆(𝑥, 𝑦)).
Páginas: 3
Palabras clave: Consideremos el árbol sintáctico de la fórmula ∀𝑥 ((𝑃(𝑥) → 𝑄(𝑥)) ∧ 𝑆(𝑥, 𝑦)).; árbol sintáctico; hojas; cuantificador
Tipo: teoría

```text
Consideremos el árbol sintáctico de la fórmula ∀𝑥 ((𝑃(𝑥) → 𝑄(𝑥)) ∧ 𝑆(𝑥, 𝑦)).
                                           ∀𝑥
                                            ∧
                                    →             𝑆
                                𝑃       𝑄    𝑥        𝑦
     Si subimos partiendo de           𝑥       𝑥                  Si subimos partiendo de la hoja
       cualquiera de las hojas 𝑥, nos                                             𝑦, nos encontramos con ∀𝑥, pero
       encontramos con ∀𝑥                                                     esa 𝑥 no tiene nada que ver con 𝑦
     MAC Variables y sustituciones
```

## Alcance de un cuantificador
Páginas: 4
Palabras clave: Alcance de un cuantificador; alcance; ámbito; cuantificadores anidados
Tipo: teoría

```text
Alcance de un cuantificador
      Sean ℒ un lenguaje de primer orden y 𝜙 una fórmula.
      Para  las  fórmulas  ∀𝑥𝜙 o  ∃𝑥𝜙, el  alcance  de  ∀𝑥  o,  respectivamente,  ∃𝑥  es  la
      fórmula 𝜙 menos cualquier subfórmula de 𝜙 del tipo ∃𝑥𝜓 o ∀𝑥𝜓.
      Notas:
      1.  El  ámbito  de  un  cuantificador  es  simplemente  su  subárbol,  menos  aquellos
         subárboles que reintroduzcan un cuantificador para 𝑥.
      2.  Cuando hay cuantificadores anidados, el más interno “manda” sobre las variables que
         están dentro de su alcance.
     MAC Variables y sustituciones
```

## Variables libres y ligadas
Páginas: 5
Palabras clave: Variables libres y ligadas; variable libre; variable ligada; ocurrencia; aparición
Tipo: teoría

```text
Variables libres y ligadas
      Sean ℒ un lenguaje de primer orden y 𝜙 una fórmula.
      Si la variable 𝑥 aparece en 𝜙, entonces decimos que está ligada si y solo si se
      encuentra en el alcance de algún ∀𝑥 o algún ∃𝑥; en caso contrario, decimos que
      está libre.
      Nota: Una aparición de 𝑥 en 𝜙 se dice libre en 𝜙 si es un nodo hoja en el árbol sintáctico
      de 𝜙, de tal manera que no existe ninguna ruta ascendente desde ese nodo 𝑥 hasta un
      nodo ∀𝑥 o ∃𝑥. En caso contrario, esa aparición de 𝑥 se denomina ligada en 𝜙.
     MAC Variables y sustituciones
```

## Ejemplos
Páginas: 6
Palabras clave: Ejemplos
Tipo: ejemplo

```text
Ejemplos
      Sea ℒ un lenguaje de primer orden. Para cada fórmula 𝜙 dada:
      ▪  Dibujar el árbol sintáctico de 𝜙.
      ▪  Determinar el alcance de cada cuantificador.
      ▪  Indicar si las variables en 𝜙 son libres y/o ligadas.
      a.  ∀𝑥(𝑃(𝑥) → ∃𝑥𝑄(𝑥))
      b.  (∀𝑥(𝑃(𝑥) ∧ 𝑄(𝑥))) → (¬𝑃(𝑥) ∨ 𝑄(𝑦))
     MAC Variables y sustituciones
```

## Ejercicio 1
Páginas: 7
Palabras clave: Ejercicio 1
Tipo: ejercicio

```text
Ejercicio 1
      Sea 𝜙 la fórmula ∃𝑥 (𝑃(𝑦, 𝑧) ∧ (∀𝑦(¬𝑄(𝑦, 𝑥) ∨ 𝑃(𝑦, 𝑧)))), en donde 𝑃 y 𝑄 son
      predicados binarios.
      a.  Dibujar el árbol sintáctico de 𝜙.
      b.  Determinar el alcance de cada cuantificador.
      c.  Indicar si las variables en 𝜙 son libres y/o ligadas.
     MAC Variables y sustituciones
```

## ¡Importante!
Páginas: 8
Palabras clave: ¡Importante!
Tipo: teoría

```text
¡Importante!
              Las variables son marcadores de posición, por lo que debemos
               disponer de algún medio para sustituirlas por información más
                                        concreta.
     MAC Variables y sustituciones
```

## Sustitución
Páginas: 9
Palabras clave: Sustitución; sustitución; sustituir; ocurrencias libres
Tipo: teoría

```text
Sustitución
      Sean ℒ un lenguaje de primer orden, 𝜙 una fórmula y 𝑡 un término de ℒ.
      Definimos como 𝜙[𝑡/𝑥] a la fórmula obtenida por sustitución de cada ocurrencia
      libre de 𝑥 en 𝜙 por el término 𝑡.
      Nota: Al sustituir 𝑥 por 𝑡, debemos dejar sin modificar las ocurrencias ligadas de 𝑥,
      ya que se encuentran dentro del alcance de algún cuantificador.
     MAC Variables y sustituciones
```

## Ejemplos
Páginas: 10
Palabras clave: Ejemplos
Tipo: ejemplo

```text
Ejemplos
      Escribir la fórmula 𝜙[𝑡/𝑥] para cada fórmula 𝜙 y término 𝑡 dados.
      a.  𝜙 es ∀𝑥 ((𝑃(𝑥) → 𝑄(𝑥)) ∧ 𝑆(𝑥, 𝑦)) y 𝑡 es 𝑓(𝑥, 𝑦)
      b.  𝜙 es (∀𝑥(𝑃(𝑥) ∧ 𝑄(𝑥))) → (¬𝑃(𝑥) ∨ 𝑄(𝑦)) y 𝑡 es 𝑓(𝑥, 𝑦)
     MAC Variables y sustituciones
```

## Observación
Páginas: 11
Palabras clave: Observación; captura de variables; variable atrapada; sustitución
Tipo: teoría

```text
Observación
      Las sustituciones pueden dar lugar a efectos secundarios no deseados.
      Supongamos  que  𝜙  es  una  fórmula,  que  𝑥  tiene  apariciones  libres  en  𝜙  y  que
      éstas se encuentran dentro del alcance de ∀𝑦 o ∃𝑦, siendo 𝑦 otra variable.
                                 𝑆(𝑥) ∧ ∀𝑦(𝑃(𝑥) → 𝑄(𝑦))
      Si al realizar una sustitución 𝜙[𝑡/𝑥] el término 𝑡 contiene una variable 𝑦, entonces
      ésta queda “atrapada” en el alcance de ∀𝑦 o ∃𝑦.
             Si 𝑡 = 𝑓(𝑦, 𝑦), obtendríamos 𝑆(𝑓(𝑦, 𝑦)) ∧ ∀𝑦 (𝑃(𝑓(𝑦, 𝑦)) → 𝑄(𝑦))
      Estas capturas de variables no deseadas deben evitarse a toda costa.
     MAC Variables y sustituciones
```

## Términos libres en una fórmula
Páginas: 12
Palabras clave: Términos libres en una fórmula; término libre para x; sustitución segura
Tipo: teoría

```text
Términos libres en una fórmula
      Sean ℒ un lenguaje de primer orden, 𝜙 una fórmula y 𝑡 un término de ℒ.
      Se dice que 𝑡 es libre para 𝑥 en 𝜙, si ninguna variable libre de 𝑡 queda ligada al
      hacer la sustitución 𝜙[𝑡/𝑥].
      Nota: Si no es así, primero se renombran las variables ligadas conflictivas.
     MAC Variables y sustituciones
```

## Ejemplos
Páginas: 13
Palabras clave: Ejemplos; renombrado; variable nueva; captura
Tipo: ejemplo

```text
Ejemplos
      Consideremos la fórmula 𝜙 = 𝑆(𝑥) ∧ ∀𝑦(𝑃(𝑥) → 𝑄(𝑦)) y el término 𝑡 = 𝑓(𝑦, 𝑦).
      Si queremos hacer la sustitución 𝜙[𝑡/𝑥], entonces podemos renombar 𝑦 como 𝑧
      en 𝜙 y escribir la fórmula:
                     𝜙[𝑡/𝑥] como 𝑆(𝑓(𝑦, 𝑦)) ∧ ∀𝑧 (𝑃(𝑓(𝑦, 𝑦)) → 𝑄(𝑧))
      ¡Importante!  Solo  hay  que  asegurarse  de  elegir  una  variable nueva que  no
      aparezca libre en el contexto para no alterar el significado de la fórmula.
     MAC Variables y sustituciones
```

## Ejercicio 2
Páginas: 14
Palabras clave: Ejercicio 2
Tipo: ejercicio

```text
Ejercicio 2
      Sea 𝜙 la fórmula del Ejercicio 1. Consideremos los términos 𝑤, 𝑓(𝑥) y 𝑔(𝑦, 𝑧), en
      donde los símbolos funcionales 𝑓 y 𝑔 son unario y binario, respectivamente.
      a.  Escribir las fórmulas 𝜙[𝑤/𝑥], 𝜙[𝑤/𝑦], 𝜙[𝑓(𝑥)/𝑦] y 𝜙[𝑔(𝑦, 𝑧)/𝑧].
      b.  ¿Cuál de los tres términos es libre para 𝑥 en 𝜙?
      c.  ¿Cuál de los tres términos es libre para 𝑦 en 𝜙?
     MAC Variables y sustituciones
```

## ¿Preguntas?
Páginas: 15
Palabras clave: ¿Preguntas?
Tipo: teoría

```text
¿Preguntas?
     MAC Variables y sustituciones
```
