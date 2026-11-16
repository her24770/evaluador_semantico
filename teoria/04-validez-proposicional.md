# Validez de la lógica proposicional

Fuente: tema-04

## Validez de la lógica
Páginas: 1
Palabras clave: Validez de la lógica
Tipo: teoría

```text
Validez de la lógica
   proposicional
     MM3032 Lógica Matemática
     MAC Validez de la lógica proposicional
```

## Objetivos
Páginas: 2
Palabras clave: Objetivos
Tipo: teoría

```text
Objetivos
      Definir el concepto de implicación
      semántica.
      Estudiar el teorema de validez para la
      lógica proposicional
      Determinar si existe un demostración
      de un secuente.
     MAC Validez de la lógica proposicional
```

## Las reglas de deducción natural nos permitieron desarrollar cadenas de
Páginas: 3
Palabras clave: Las reglas de deducción natural nos permitieron desarrollar cadenas de
Tipo: teoría

```text
Las reglas de deducción natural nos permitieron desarrollar cadenas de
     razonamiento rigurosas: a partir de unas fórmulas 𝜙_{1}, 𝜙_{2}, … , 𝜙_{𝑛} llegamos a una
     conclusión 𝜓.
        Entonces, dijimos que hay una demostración del secuente 𝜙_{1}, 𝜙_{2}, … , 𝜙_{𝑛} ⊢ 𝜓.
               ¿Tenemos alguna prueba de que todas estas reglas sean “correctas”, en
               el sentido de que la demostración preserva la verdad?
        Es decir, dada una demostración de 𝜙_{1}, 𝜙_{2}, … , 𝜙_{𝑛} ⊢ 𝜓, ¿puede haber una
        valuación en la que 𝜓 sea falsa, aunque todas las proposiciones 𝜙_{1}, 𝜙_{2}, … , 𝜙_{𝑛}
        sean verdaderas?
     MAC Validez de la lógica proposicional
```

## Validez
Páginas: 4
Palabras clave: Validez
Tipo: teoría

```text
Validez
       Un argumento es válido si la conclusión se deriva lógicamente de las
       premisas.
     MAC Validez de la lógica proposicional
```

## Implicación semántica
Páginas: 5
Palabras clave: Implicación semántica; consecuencia semántica; implicación semántica; argumento válido
Tipo: teoría

```text
Implicación semántica
      Sean 𝜙_{1}, 𝜙_{2}, … , 𝜙_{𝑛} y 𝜓 fórmulas del lenguaje formal de la lógica proposicional.
      Si, para todas las valuaciones en las que todas las 𝜙_{1}, 𝜙_{2}, … , 𝜙_{𝑛} son verdaderas,
      𝜓   también  es  verdadera,  decimos  que  𝜓   es  implicación  (o  consecuencia)
      semántica de 𝜙_{1}, 𝜙_{2}, … , 𝜙_{𝑛} y escribimos 𝜙_{1}, 𝜙_{2}, … , 𝜙_{𝑛}⊨ 𝜓.
     MAC Validez de la lógica proposicional
```

## Ejercicio 1
Páginas: 6
Palabras clave: Ejercicio 1
Tipo: ejercicio

```text
Ejercicio 1
      Determinar si los siguientes argumentos son o no válidos.
      a.   𝜙 ∧ 𝜓 ⊨ 𝜙
      b.  𝜙 ∨ 𝜓 ⊨ 𝜙
      c.   ¬𝜓, 𝜙 ∨ 𝜓 ⊨ 𝜙
      d.   ⊨ 𝜓 ∨ ¬𝜓
     MAC Validez de la lógica proposicional
```

## Metateorema (de validez o de corrección)
Páginas: 7
Palabras clave: Metateorema (de validez o de corrección); corrección; validez; demostrabilidad
Tipo: teoría

```text
Metateorema (de validez o de corrección)
      Sean 𝜙_{1}, 𝜙_{2}, … , 𝜙_{𝑛} y 𝜓 fórmulas del lenguaje formal de la lógica proposicional.
      Si 𝜙_{1}, 𝜙_{2}, … , 𝜙_{𝑛} ⊢ 𝜓, entonces 𝜙_{1}, 𝜙_{2}, … , 𝜙_{𝑛}⊨ 𝜓.
      Nota:  En  palabras,  si  𝜓  es  demostrable  a  partir  de  𝜙_{1}, 𝜙_{2}, …, 𝜙_{𝑛} ,  entonces  𝜓  es
      consecuencia semántica de 𝜙_{1}, 𝜙_{2}, …, 𝜙_{𝑛}.
     MAC Validez de la lógica proposicional
```

## Teorema de validez
Páginas: 8
Palabras clave: Teorema de validez
Tipo: teoría

```text
Teorema de validez
      Prueba: Por inducción matemática sobre la longitud de la demostración del
      secuente 𝜙_{1}, 𝜙_{2}, … , 𝜙_{𝑛} ⊢ 𝜓.
      Paso base: Si la prueba tiene longitud 1, entonces es de la forma:
                                     1. 𝜙   Premisa
      Así,  𝜙_{1} = 𝜓 = 𝜙,  es  decir,  se  trata  del  secuente  𝜙 ⊢ 𝜙.  Claramente,  si  𝜙  es
      verdadera, entonces 𝜙 es verdadera. Por lo tanto, 𝜙 ⊨ 𝜙.
      Paso inductivo: Supongamos que el resultado vale para todos los secuentes que
      tienen demostración de longitud menor a 𝑘, en donde 𝑘 es un entero positivo.
      Si la demostración de 𝜙_{1}, 𝜙_{2}, … , 𝜙_{𝑛} ⊢ 𝜓 tiene longitud 𝑘, entonces tiene la forma:
     MAC Validez de la lógica proposicional
```

## Teorema de validez
Páginas: 9
Palabras clave: Teorema de validez
Tipo: teoría

```text
Teorema de validez
                                   1. 𝜙_{1}  Premisa
                                   2. 𝜙_{2}  Premisa
                                       ⋮
                                   𝑛. 𝜙_{𝑛}  Premisa
                                       ⋮
                                   𝑘. 𝜓   Regla
      En este punto hay dos cosas que no sabemos: qué hay en los ⋮ y cuál es la regla
      del paso 𝑘.
      Lo que ocurre en los ⋮ es irrelevante (usaremos allí el poder de la inducción).
     MAC Validez de la lógica proposicional
```

## Teorema de validez
Páginas: 10
Palabras clave: Teorema de validez
Tipo: teoría

```text
Teorema de validez
      Lo que ocurre en el paso 𝑘 es donde está nuestro trabajo.
      Caso 1. Supongamos que la regla del paso 𝑘 es ∧i. Entonces, 𝜓 tiene forma 𝜓_{1} ∧
      𝜓_{2} y esta regla se refiere a dos líneas más arriba en la prueba, digamos 𝑘_{1} y 𝑘_{2}
      que tienen como conclusión 𝜓_{1} y 𝜓_{2}, respectivamente.
      Como 𝑘_{1} y 𝑘_{2} son menores que 𝑘, entonces sabemos que existen demostraciones
      para los secuentes 𝜙_{1}, 𝜙_{2}, … , 𝜙_{𝑛} ⊢ 𝜓_{1} y 𝜙_{1}, 𝜙_{2}, … , 𝜙_{𝑛} ⊢ 𝜓_{2} cuyas longitudes son
      menores  que  𝑘  (basta  tomar  los  primeras  𝑘_{1},  respectivamente  𝑘_{2}  pasos  de  la
      demostración original).
      Por  la  hipótesis  inductiva,  podemos  asegurar  que  𝜙_{1}, 𝜙_{2}, … , 𝜙_{𝑛}⊨ 𝜓_{1}   y
      𝜙_{1}, 𝜙_{2}, … , 𝜙_{𝑛}⊨ 𝜓_{2}, lo que implica que 𝜙_{1}, 𝜙_{2}, … , 𝜙_{𝑛}⊨ 𝜓_{1} ∧ 𝜓_{2}.
     MAC Validez de la lógica proposicional
```

## Teorema de validez
Páginas: 11
Palabras clave: Teorema de validez
Tipo: teoría

```text
Teorema de validez
      Caso  2.  Supongamos  que  la  regla  del  paso  𝑘  es  ∨e.  Entonces,  debimos  haber
      demostrado, asumido o escrito como premisa una fórmula 𝜏_{1} ∨ 𝜏_{2} en alguna línea
      𝑘^{′} que es menor que 𝑘 y ∨e se refiere en su primer parámetro a esta línea en la
      justificación del paso 𝑘.
      Como  𝑘^{′}  es  menor  que  𝑘,  entonces  sabemos  que  existe  una  demostración  de
      longitud menor que 𝑘 para el secuente 𝜙_{1}, 𝜙_{2}, … , 𝜙_{𝑛} ⊢ 𝜏_{1} ∨ 𝜏_{2}.
      De manera similar, podemos obtener demostraciones de los secuentes:
                        𝜙_{1}, 𝜙_{2}, … , 𝜙_{𝑛}, 𝜏_{1} ⊢ 𝜓 y 𝜙_{1}, 𝜙_{2}, … , 𝜙_{𝑛}, 𝜏_{2} ⊢ 𝜓
      cuyas longitudes son menores que 𝑘.
     MAC Validez de la lógica proposicional
```

## Teorema de validez
Páginas: 12
Palabras clave: Teorema de validez
Tipo: teoría

```text
Teorema de validez
      Por la hipótesis inductiva, podemos asegurar que:
              𝜙_{1}, 𝜙_{2}, … , 𝜙_{𝑛}⊨ 𝜏_{1} ∨ 𝜏_{2}, 𝜙_{1}, 𝜙_{2}, … , 𝜙_{𝑛},𝜏_{1} ⊨ 𝜓 y 𝜙_{1}, 𝜙_{2}, … , 𝜙_{𝑛},𝜏_{2} ⊨ 𝜓
      lo que implica que 𝜙_{1}, 𝜙_{2}, … , 𝜙_{𝑛}⊨ 𝜓.
      El resto del argumento muestra una a una todas las reglas de inferencia posibles
      y, en última instancia, concluye que las reglas de la deducción natural se
      comportan  semánticamente  de  la  misma  manera  que  se  evalúan  sus
      correspondientes tablas de verdad.
                                                            ∎
     MAC Validez de la lógica proposicional
```

## Ejemplo (Caso 1)
Páginas: 13
Palabras clave: Ejemplo (Caso 1)
Tipo: ejemplo

```text
Ejemplo (Caso 1)
      Consideremos la demostración del secuente 𝑝 → 𝑞, 𝑝 → 𝑟, 𝑝 ⊢ 𝑞 ∧ 𝑟 es:
      1. 𝑝 → 𝑞      Premisa                   1. 𝑝 → 𝑞   Premisa
                                                            2. 𝑝 → 𝑟    Premisa
      2. 𝑝 → 𝑟      Premisa                   34..  𝑝𝑞      PMrPe m1,i3sa
      3. 𝑝          Premisa                   Esto demuestra 𝑝 → 𝑞, 𝑝 → 𝑟, 𝑝 ⊢ 𝑞.
                                                            1. 𝑝 → 𝑞    Premisa
      4. 𝑞          MP 1,3                    2. 𝑝 → 𝑟   Premisa
                                                            3. 𝑝         Premisa
      5. 𝑟           MP 2,3                    4E.s t𝑟o  demuesMtrPa  2𝑝,3→ 𝑞, 𝑝 → 𝑟, 𝑝 ⊢ 𝑟.
      6. 𝑞 ∧ 𝑟       ∧i 4,5
     MAC Validez de la lógica proposicional
```

## Ejemplo (Caso 2) 𝑝 ∨ 𝑞, 𝑝 → (𝑟 ∧ 𝑠), 𝑞 → (𝑟 ∧ 𝑠), (𝑟 ∧ 𝑠) → (𝑝 ∧ 𝑞) ⊢ 𝑝 ∧ 𝑞
Páginas: 14
Palabras clave: Ejemplo (Caso 2) 𝑝 ∨ 𝑞, 𝑝 → (𝑟 ∧ 𝑠), 𝑞 → (𝑟 ∧ 𝑠), (𝑟 ∧ 𝑠) → (𝑝 ∧ 𝑞) ⊢ 𝑝 ∧ 𝑞
Tipo: ejemplo

```text
Ejemplo (Caso 2) 𝑝 ∨ 𝑞, 𝑝 → (𝑟 ∧ 𝑠), 𝑞 → (𝑟 ∧ 𝑠), (𝑟 ∧ 𝑠) → (𝑝 ∧ 𝑞) ⊢ 𝑝 ∧ 𝑞
      1. 𝑝 ∨ 𝑞                Premisa              1. 𝑝 ∨ 𝑞                   Premisa
            (    )                             2. 𝑝 → (𝑟 ∧ 𝑠)               Premisa
      2. 𝑝 → 𝑟 ∧ 𝑠          Premisa             3. 𝑞 → (𝑟 ∧ 𝑠)               Premisa
      3. 𝑞 → (𝑟 ∧ 𝑠)         Premisa             4. (𝑟 ∧ 𝑠) → (𝑝 ∧ 𝑞)           Premisa
                                                            5. 𝑝                                Premisa
      4. (𝑟 ∧ 𝑠) → (𝑝 ∧ 𝑞)    Premisa             6. 𝑟 ∧ 𝑠                   MP 2,5
                                                            7.  𝑝 ∧ 𝑞                            MP 4,6
      5.      𝑝              Suposición           Esto demuestra:
      6.      𝑟 ∧ 𝑠          MP 2,5               𝑝 ∨ 𝑞, 𝑝 → (𝑟 ∧ 𝑠), 𝑞 → (𝑟 ∧ 𝑠), (𝑟 ∧ 𝑠) → (𝑝 ∧ 𝑞), 𝑝 ⊢ 𝑝 ∧ 𝑞
                                                            1. 𝑝 ∨ 𝑞                             Premisa
      7.      𝑝 ∧ 𝑞          MP 4,6              2. 𝑝 → (𝑟 ∧ 𝑠)               Premisa
      8.      𝑞             Suposición           3. 𝑞 → (𝑟 ∧ 𝑠)               Premisa
                                               4. (𝑟 ∧ 𝑠) → (𝑝 ∧ 𝑞)           Premisa
      9.      𝑟 ∧ 𝑠           MP 3,8              5. 𝑞                      Premisa
      10.     𝑝 ∧ 𝑞           MP 4,9              67..  𝑟𝑝∧∧𝑠𝑞                      MMPP  24,,56
                                                            Esto demuestra:
      11. 𝑝 ∧ 𝑞             ∨e 1, 5 – 7, 8 – 10    𝑝 ∨ 𝑞, 𝑝 → (𝑟 ∧ 𝑠), 𝑞 → (𝑟 ∧ 𝑠), (𝑟 ∧ 𝑠) → (𝑝 ∧ 𝑞), 𝑞 ⊢ 𝑝 ∧ 𝑞
     MAC Validez de la lógica proposicional
```

## La validez de la lógica proposicional resulta útil para garantizar la inexistencia de una
Páginas: 15
Palabras clave: La validez de la lógica proposicional resulta útil para garantizar la inexistencia de una; contraejemplo; argumento inválido
Tipo: teoría

```text
La validez de la lógica proposicional resulta útil para garantizar la inexistencia de una
                                                            demostración para un secuente dado.
      Supongamos que intentamos escribir una demostración del secuente 𝜙_{1}, 𝜙_{2}, …, 𝜙_{𝑛} ⊢ 𝜓, pero
      que, por mucho que lo intentamos, no lo conseguimos.
                    ¿Cómo podríamos estar seguros de que no existe tal demostración?
            Basta con encontrar una valuación en la que todas las 𝜙_{𝑖} sean verdaderas y 𝜓 sea falsa.
                         Entonces, por definición de ⊨, no tenemos 𝜙_{1}, 𝜙_{2}, …, 𝜙_{𝑛} ⊨ 𝜓 y por el teorema de
                          validez, esto significa que el secuente 𝜙_{1}, 𝜙_{2}, …, 𝜙_{𝑛} ⊢ 𝜓 no tiene demostración.
     MAC Validez de la lógica proposicional
```

## ¿Preguntas?
Páginas: 16
Palabras clave: ¿Preguntas?
Tipo: teoría

```text
¿Preguntas?
     MAC Validez de la lógica proposicional
```
