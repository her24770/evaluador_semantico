# Lenguajes formales

Fuente: tema-01

## Lenguajes formales
Páginas: 1
Palabras clave: Lenguajes formales
Tipo: teoría

```text
Lenguajes formales
     MM3032 Lógica Matemática
     MAC Lenguajes formales
```

## Objetivos
Páginas: 2
Palabras clave: Objetivos
Tipo: teoría

```text
Objetivos
      Definir los conceptos de expresión bien
      formada – ebf y lenguaje formal.
      Determinar si una cadena pertenece o
      no a un lenguaje formal dado.
     MAC Lenguajes formales
```

## Alfabeto
Páginas: 3
Palabras clave: Alfabeto; alfabeto; símbolos
Tipo: teoría

```text
Alfabeto
      Un alfabeto es un conjunto finito y no vacío de símbolos, denotado como Σ.
     MAC Lenguajes formales
```

## Ejemplos
Páginas: 4
Palabras clave: Ejemplos
Tipo: ejemplo

```text
Ejemplos
      Los siguientes son ejemplos de alfabetos:
      ▪  Σ = {0, 1}
      ▪  Σ = {𝑎, 𝑏, 𝑐}
      ▪  Σ = {+, &, %, $}
      ▪  Σ = {∫ , 𝑎, 𝑓, 𝑑, 𝑥, ), (,∘}
      ▪  Σ = {∧, ¬, ), (, 𝑝, 𝑞}
     MAC Lenguajes formales
```

## Cadenas
Páginas: 5
Palabras clave: Cadenas; cadena; palabra; expresión; cadena vacía; sigma estrella
Tipo: teoría

```text
Cadenas
      Sea Σ un alfabeto.
      Una cadena 𝑤 sobre Σ es una secuencia finita de símbolos tomados de Σ, esto es
      𝑤 = 𝑤_{1}𝑤_{2} … 𝑤_{𝑛}, con 𝑤_{𝑖} ∈ Σ y 𝑛 ∈ ℤ^{+}.
      La cadena vacía 𝜆 también se considera una cadena sobre Σ.
      El conjunto de todas las cadenas sobre Σ se denota como Σ^{∗} (se lee sigma estrella).
      Nota: Las cadenas se llaman también palabras o expresiones.
     MAC Lenguajes formales
```

## Ejemplos
Páginas: 6
Palabras clave: Ejemplos
Tipo: ejemplo

```text
Ejemplos
      ▪  Supongamos que Σ = {𝑎, 𝑏, 𝑐}. Entonces las siguientes son cadenas sobre Σ:
                                    𝑎𝑏𝑎𝑏𝑏 y 𝑎𝑐𝑐𝑏𝑎𝑎𝑎
      Se suele abreviar la notación y se escribe 𝑎^{2} por 𝑎𝑎, 𝑎^{3} por 𝑎𝑎𝑎, etc., de modo
      que las cadenas anteriores quedan como 𝑎𝑏𝑎𝑏^{2} y 𝑎𝑐^{2}𝑏𝑎^{3}, respectivamente.
      ▪  Si Σ = {0,1, … , 9, +, =, ), (}, entonces las siguientes son cadenas sobre Σ:
                                  7 + 5 = 12 y +(1 =) +
     MAC Lenguajes formales
```

## Lenguaje
Páginas: 7
Palabras clave: Lenguaje
Tipo: teoría

```text
Lenguaje
      Sea Σ un alfabeto.
      Un lenguaje 𝐿 sobre Σ es cualquier subconjunto de Σ^{∗}.
      Esto incluye a ∅ ⊂ Σ^{∗}, al que llamamos lenguaje vacío.
     MAC Lenguajes formales
```

## Ejemplos
Páginas: 8
Palabras clave: Ejemplos
Tipo: ejemplo

```text
Ejemplos
      ▪  Supongamos que Σ = {𝑎, 𝑏}. Entonces:
           𝐿 = {𝑤 ∈ Σ^{∗}: 𝑤 contiene exactamente una 𝑏} = {𝑏, 𝑎𝑏, 𝑏𝑎, 𝑎𝑎𝑏, 𝑏𝑎𝑎, … }
      es un lenguaje sobre Σ.
      ▪  Si Σ = {0,1}, entonces 𝐿 = {0^{𝑛}1^{𝑛}: 𝑛 > 0}  es un lenguaje sobre Σ, el cual
        consiste de todas las cadenas que empiezan con uno o más ceros seguidos por
        el mismo número de unos.
     MAC Lenguajes formales
```

## ¡Importante!
Páginas: 9
Palabras clave: ¡Importante!
Tipo: teoría

```text
¡Importante!
              La matemática siempre ha utilizado símbolos para expresar sus
             resultados. Estos símbolos tienen "reglas gramaticales" precisas.
               Así, en el intento de formalizar la lógica surgió el concepto de
                                     lenguaje formal.
     MAC Lenguajes formales
```

## Expresiones bien formadas
Páginas: 10
Palabras clave: Expresiones bien formadas; ebf; expresión bien formada; sintaxis; reglas de formación
Tipo: teoría

```text
Expresiones bien formadas
      Sea Σ un alfabeto.
      Una expresión bien formada (ebf) es una cadena que cumple con un conjunto de
      reglas de formación llamadas reglas sintácticas.
      Notas:
      ▪  Denotamos como ℰ al conjunto de todas las ebf’s sobre Σ, para un conjunto de reglas
         sintácticas dado.
      ▪  Claramente, ℰ es un lenguaje sobre Σ.
     MAC Lenguajes formales
```

## Ejemplos
Páginas: 11
Palabras clave: Ejemplos
Tipo: ejemplo

```text
Ejemplos
      ▪  Sea Σ = {𝑎, 𝑏, 𝑐} un alfabeto. Si definimos una regla de formación:
                            𝑅: Toda cadena sobre 𝛴 es una ebf,
      entonces tenemos que ℰ = Σ^{∗}.
      ▪  Si Σ = {−, 𝑥, 𝑦} es un alfabeto, 𝛼, 𝛽 y 𝛾 son cadenas que constan solo de
        guiones y ℰ es el conjunto de cadenas generadas por la regla de formación:
                       𝑅: Toda cadena de la forma 𝛼𝑥𝛽𝑦𝛾 es una ebf,
      entonces − −𝑥 − 𝑦 − − − & −𝑥 − 𝑦 − − son ebf’s.
     MAC Lenguajes formales
```

## Lenguaje formal
Páginas: 12
Palabras clave: Lenguaje formal; lenguaje formal
Tipo: teoría

```text
Lenguaje formal
      Un lenguaje formal es un par ordenado ℒ = (Σ, ℰ), en donde Σ es un alfabeto y ℰ
      es el conjunto de ebf’s sobre Σ.
     MAC Lenguajes formales
```

## ¡Importante!
Páginas: 13
Palabras clave: ¡Importante!
Tipo: teoría

```text
¡Importante!
            Hay muchos lenguajes formales, cada uno con símbolos y reglas de
                                   formación distintos.
             Cada teoría matemática requiere de un lenguaje formal propio, con
                símbolos adecuados para expresar los teoremas de la teoría.
     MAC Lenguajes formales
```

## Ejemplo: Un lenguaje para la lógica proposicional
Páginas: 14
Palabras clave: Ejemplo: Un lenguaje para la lógica proposicional
Tipo: ejemplo

```text
Ejemplo: Un lenguaje para la lógica proposicional
      Consideremos el alfabeto:                  Entonces son ebf’s:
               Σ = {∧, ¬, ), (, 𝑝, 𝑞}                       ¬𝑞, ¬(𝑝 ∧ 𝑞), (¬𝑝 ∧ ¬𝑞)
      y las siguientes reglas sintácticas:           pero no son ebf’s:
      R1: 𝑝, 𝑞 ∈ ℰ                                          𝑞¬, (𝑝 ∧ 𝑞, ∧ 𝑝𝑞
      R2: Si 𝛼 ∈ ℰ, entonces ¬𝛼 ∈ ℰ
      R3: Si 𝛼, 𝛽 ∈ ℰ, entonces (𝛼 ∧ 𝛽) ∈ ℰ
      R4: Solo son ebf’s aquellas construidas
      con base en R1 – R3.
     MAC Lenguajes formales
```

## Ejemplo: Un lenguaje para la lógica proposicional
Páginas: 15
Palabras clave: Ejemplo: Un lenguaje para la lógica proposicional
Tipo: ejemplo

```text
Ejemplo: Un lenguaje para la lógica proposicional
      ▪  ¬𝑞
      1.  𝑞 ∈ ℰ           Por R1
      2.  ¬𝑞 ∈ ℰ          Por R2 al sustituir 𝛼 por 𝑞
      ▪  ¬(𝑝 ∧ 𝑞)
      1.  𝑝, 𝑞 ∈ ℰ         Por R1
      2.  (𝑝 ∧ 𝑞) ∈ ℰ      Por R3 al sustituir 𝛼 por 𝑝 y 𝛽 por 𝑞
      3.  ¬(𝑝 ∧ 𝑞) ∈ ℰ    Por R2 al sustituir 𝛼 por 𝑝 ∧ 𝑞
     MAC Lenguajes formales
```

## Ejemplo: Un lenguaje para la lógica proposicional
Páginas: 16
Palabras clave: Ejemplo: Un lenguaje para la lógica proposicional
Tipo: ejemplo

```text
Ejemplo: Un lenguaje para la lógica proposicional
      ▪  (¬𝑝 ∧ ¬𝑞)
      1.  𝑝, 𝑞 ∈ ℰ         Por R1
      2.  ¬𝑝, ¬𝑞 ∈ ℰ      Por R2 al sustituir 𝛼 por 𝑝 y 𝑞, respectivamente
      3.  (¬𝑝 ∧ ¬𝑞) ∈ ℰ  Por R3 al sustituir 𝛼 por ¬𝑝 ∧ ¬𝑞
     MAC Lenguajes formales
```

## ¡Importante!
Páginas: 17
Palabras clave: ¡Importante!
Tipo: teoría

```text
¡Importante!
            Es importante notar que los símbolos de un lenguaje formal carecen
            de significado. Se les puede asignar un significado, si se quiere, pero
                       no tienen ningún significado fijo de antemano.
     MAC Lenguajes formales
```

## Ejercicio 1
Páginas: 18
Palabras clave: Ejercicio 1
Tipo: ejercicio

```text
Ejercicio 1
      Considere el lenguaje formal ℒ con:             a)   𝜆
      ▪  Σ = {★, ☆, ∆, ∇,|}                          b)  ★∇
      ▪  Reglas sintácticas:                          c)  ∇★
         R1: Toda aparición de | está                d)  ∆|☆
         inmediatamente precedida por ∆ y
         seguida por ☆.                            e)  ★∆|☆∇
         R2: El número de símbolos ★ es             f)   ∆|★
         igual al número de símbolos ∇.              g)   ∆|☆|∆|☆
         R3: Solo son ebf’s aquellas
         construidas con base en R1 y R2.           h)  ★∆|☆∇∇
      Determinar cuáles de las siguientes             i)   ∇∇★★
      cadenas pertenecen a ℒ.                      j)   |
     MAC Lenguajes formales
```

## Ejercicio 2
Páginas: 19
Palabras clave: Ejercicio 2
Tipo: ejercicio

```text
Ejercicio 2
      Considere el lenguaje formal ℒ con:         a)  𝑝 ∧ 𝑞
      ▪  Σ = {𝑝, 𝑞, 𝑟, ¬,∧,∨, →, ), (}                 b)  ¬(𝑝 ∨ 𝑞)
      ▪  Reglas sintácticas:                       c)  𝑝 → (𝑞 ∧ 𝑟)
         R1: 𝑝, 𝑞, 𝑟 ∈ ℰ
         R2: Si 𝛼, 𝛽 ∈ ℰ, entonces ¬𝛼,            d)  ¬𝑝 ∨ 𝑟
         (𝛼 ∧ 𝛽), (𝛼 ∨ 𝛽), (𝛼 → 𝛽) ∈ ℰ.           e)  (𝑝 ∧ 𝑞 → 𝑟)
         Rco4n: sStoruloid saosn c eobnf ’bsa asqeu eenll aRs1  y R2.          f)   ((𝑝 ∨ 𝑟) → 𝑞)
                                                g)  𝑝¬𝑞
      Determinar cuáles de las siguientes
      cadenas pertenecen a ℒ.
     MAC Lenguajes formales
```

## ¿Preguntas?
Páginas: 20
Palabras clave: ¿Preguntas?
Tipo: teoría

```text
¿Preguntas?
     MAC Lenguajes formales
```
