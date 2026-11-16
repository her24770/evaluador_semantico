# El teorema de incompletitud

Fuente: tema-14

## El teorema de
Páginas: 1
Palabras clave: El teorema de
Tipo: teoría

```text
El teorema de
   incompletitud de Gödel
     MM3032 Lógica Matemática
     MAC El teorema de incompletitud de Gödel
```

## Objetivos
Páginas: 2
Palabras clave: Objetivos
Tipo: teoría

```text
Objetivos
     MAC El teorema de incompletitud de Gödel
```

## Aritmética (Peano) Axiomas verdaderos
Páginas: 3
Palabras clave: Aritmética (Peano) Axiomas verdaderos
Tipo: teoría

```text
Aritmética (Peano)                                       Axiomas verdaderos
             Lenguaje      Axiomas                                  Enunciados verdaderos
                                                Esto nos asegura que ningún enunciado
                                                       demostrable será falso…
              Reglas de inferencia
                                               … sin embargo, no nos garantiza que todas
                                                   las verdades serán demostrables.
     MAC El teorema de incompletitud de Gödel
```

## ¡Importante!
Páginas: 4
Palabras clave: ¡Importante!
Tipo: teoría

```text
¡Importante!
                Nuestro objetivo es probar que existe necesariamente algún
              enunciado aritmético verdadero que no puede ser demostrado a
                                  partir de esos axiomas
     MAC El teorema de incompletitud de Gödel
```

## La idea general de la prueba de Gödel consiste en obtener un
Páginas: 5
Palabras clave: La idea general de la prueba de Gödel consiste en obtener un
Tipo: teoría

```text
La idea general de la prueba de Gödel consiste en obtener un
        enunciado 𝐺 que diga: “𝐺 no es demostrable”.
                                      En otras palabras, 𝐺 puede escribirse como:
                                          “Esta afirmación no es demostrable”
     MAC El teorema de incompletitud de Gödel
```

## Observemos que 𝐺 es verdadero o falso.
Páginas: 6
Palabras clave: Observemos que 𝐺 es verdadero o falso.
Tipo: teoría

```text
Observemos que 𝐺 es verdadero o falso.
                                   Si 𝐺 fuera falso, debido a lo que 𝐺 dice de sí mismo,
                                                concluiríamos que 𝐺 es demostrable.
           Luego, 𝐺 sería a la vez falso y demostrable, pero esto es imposible pues
             dijimos que partiendo de axiomas verdaderos solamente podemos
                            demostrar enunciados verdaderos.
      Por lo tanto, 𝐺 no puede ser falso.
      En consecuencia, 𝐺 es verdadero y, por lo que dice de sí mismo, no es demostrable.
     MAC El teorema de incompletitud de Gödel
```

## La idea anterior, aunque correcta, tiene un problema:
Páginas: 7
Palabras clave: La idea anterior, aunque correcta, tiene un problema:
Tipo: teoría

```text
La idea anterior, aunque correcta, tiene un problema:
                         𝐺 debería ser una afirmación aritmética.
       Los enunciados aritméticos se refieren a propiedades de los números naturales;
       no hablan de otros enunciados y mucho menos de sí mismos.
                     La idea de Gödel fue asociar a cada enunciado aritmético un
                 número natural, de tal modo que hablar de ese número equivalga
                                        a hablar del enunciado correspondiente.
    Así, por ejemplo, si a una afirmación 𝑃 le correspondiera el número 457, entonces
    cualquier enunciado que hable del 457 está  hablando al mismo tiempo de 𝑃.
     MAC El teorema de incompletitud de Gödel
```

## Los números de Gödel
Páginas: 8
Palabras clave: Los números de Gödel; número de Gödel; codificación; enunciado
Tipo: teoría

```text
Los números de Gödel
       Gödel asignó a cada símbolo del lenguaje un número y luego combinó dichos
       números de modo que a cada enunciado le corresponde un único número.
     MAC El teorema de incompletitud de Gödel
```

## Codificación de Gödel ¿Qué código le corresponde, por ejemplo, al
Páginas: 9
Palabras clave: Codificación de Gödel ¿Qué código le corresponde, por ejemplo, al
Tipo: teoría

```text
Codificación de Gödel            ¿Qué  código le corresponde, por ejemplo, al
     ∀      1                                       enunciado 0 = 0?
      ⇒      3
      ¬       5
     =      7                       Los códigos de los símbolos que forman el
      0       9
     𝑆       11                      enunciado son 9, 7, 9, respectivamente.
     +      13                         Como hay tres símbolos, tomamos en orden los
      ⋅      15                                  tres primeros números primos: 2, 3, 5.
      (       17
     )       19                            El número de Gödel es entonces:
     𝑥_{1}      21                            2^{9} ⋅ 3^{7} ⋅ 5^{9} = 2,187,000,000,000
      𝑥_{2}      23
      𝑥_{3}      25
     MAC El teorema de incompletitud de Gödel
```

## Codificación de Gödel
Páginas: 10
Palabras clave: Codificación de Gödel
Tipo: teoría

```text
Codificación de Gödel
     ∀      1                       Para calcular el número de Gödel de una sucesión
     ⇒      3                       finita de enunciados se procede de manera similar:
      ¬       5
     =      7                       ▪ En el paso 1 se toman, en orden, los códigos de los
     0       9                         enunciados que forman la sucesión.
     𝑆       11                      ▪ En el paso 3 se transforman en los exponentes de
     +      13                        los primos.
      ⋅      15
     (       17                      ¡Importante! Esto último permite afirmar que cada
     )       19                      demostración tiene también un número de Gödel.
      𝑥_{1}      21
      𝑥_{2}      23
      𝑥_{3}      25
     MAC El teorema de incompletitud de Gödel
```

## ¡Importante!
Páginas: 11
Palabras clave: ¡Importante!
Tipo: teoría

```text
¡Importante!
                  Para entender la idea de la demostración del teorema de
            incompletitud no es necesario detenerse en los detalles técnicos de
                            la asignación de números de Gödel.
     MAC El teorema de incompletitud de Gödel
```

## ¡Importante!
Páginas: 12
Palabras clave: ¡Importante!
Tipo: teoría

```text
¡Importante!
              Por lo tanto, los ejemplos que mostraremos a continuación son
              puramente hipotéticos y sirven para ilustrar el concepto general.
     MAC El teorema de incompletitud de Gödel
```

## Ejemplo
Páginas: 13
Palabras clave: Ejemplo
Tipo: ejemplo

```text
Ejemplo
                  Se le asignan números de Gödel a todos los enunciados
      Supongamos que:
                                 «4=2+2» tiene código 67
                                «2 es par» tiene código 223
                         «162 es divisible por 18» tiene código 103
                               «4 es impar» tiene código 149
                               «171 es par» tiene código 61
     MAC El teorema de incompletitud de Gödel
```

## Ejemplo
Páginas: 14
Palabras clave: Ejemplo
Tipo: ejemplo

```text
Ejemplo
              Se le asignan números de Gödel también a las fórmulas abiertas
      Supongamos que:
                          «𝑥 es divisible por 18» tiene código 162
                                «𝑥 es par» tiene código 171
     MAC El teorema de incompletitud de Gödel
```

## Ejemplo
Páginas: 15
Palabras clave: Ejemplo
Tipo: ejemplo

```text
Ejemplo
               Se le asignan números de Gödel también a las demostraciones
      𝑆(𝑥 + 𝑦) = 𝑥 + 𝑆(𝑦)                     173
      𝑆(𝑆𝑆0 + 𝑆0) = 𝑆𝑆0 + 𝑆(𝑆0)              199
                                                            El número de Gödel de esta
      𝑆(𝑆𝑆0 + 𝑆0) = 𝑆𝑆0 + 𝑆𝑆0                13        demostración es:
      𝑥 + 𝑆0 = 𝑆(𝑥)                           37            2,414,871,965,597
      𝑆𝑆0 + 𝑆0 = 𝑆(𝑆𝑆0)                      83
                                                            (obtenido al multiplicar los números
      𝑆𝑆0 + 𝑆0 = 𝑆𝑆𝑆0                        7            de Gödel de cada paso de la
                                                            demostración)
      𝑆(𝑆𝑆𝑆0) = 𝑆𝑆0 + 𝑆𝑆0                    251
      𝑆𝑆𝑆𝑆0 = 𝑆𝑆0 + 𝑆𝑆0                      67
     MAC El teorema de incompletitud de Gödel
```

## Ser demostrable es expresable
Páginas: 16
Palabras clave: Ser demostrable es expresable
Tipo: teoría

```text
Ser demostrable es expresable
       Los números de Gödel no solamente logran que un enunciado aritmético
       hable de otro enunciado, sino que además podemos hacer que se refiera a la
       demostrabilidad de ese enunciado.
     MAC El teorema de incompletitud de Gödel
```

## Ser demostrable es expresable
Páginas: 17
Palabras clave: Ser demostrable es expresable
Tipo: teoría

```text
Ser demostrable es expresable
                                                   Enunciados demostrables
         Axiomas
                                        1 + 1 = 2
         A1-A10                                                            2 + 2 = 4            Gödel probó
         AP1-AP6                                                            que dicho
                                  ∀𝑥∀𝑦(𝑥 + 𝑦 = 𝑦 + 𝑥)                            conjunto está
                                                            caracterizado
                                                            por una
     El conjunto de axiomas                                                             propiedad
     determina los enunciados                                                             aritmética bien
     demostrables                            El conjunto 𝒞 formado por los códigos
                                                            definida
                                                 de los enunciados demostrables
     MAC El teorema de incompletitud de Gödel
```

## Ser demostrable es expresable
Páginas: 18
Palabras clave: Ser demostrable es expresable
Tipo: teoría

```text
Ser demostrable es expresable
      Gödel demostró que cualquier propiedad numérica verificable algorítmicamente
      es siempre expresable en términos de sumas, productos y operaciones lógicas.
                                 “Ser un número primo”,
                                       “Ser par” o
                                   “Ser divisible por 9”
                            ¿“Ser demostrable” es expresable?
     MAC El teorema de incompletitud de Gödel
```

## ¡Importante!
Páginas: 19
Palabras clave: ¡Importante!
Tipo: teoría

```text
¡Importante!
             El hecho que un enunciado 𝑃 sea demostrable significa que existe
                    una demostración de la cual 𝑃 es el enunciado final.
     MAC El teorema de incompletitud de Gödel
```

## Ser demostrable es expresable
Páginas: 20
Palabras clave: Ser demostrable es expresable
Tipo: teoría

```text
Ser demostrable es expresable
                                                            173
                                                            199
                                                            13
                  2,414,871,965,597          Algoritmo           37             Algoritmo
                                                            83
                                        Recuperar la secuencia      7         Determinar si es o no una
                                        de enunciados             251       demostración del
                                              correspondiente a ese                   enunciado con código 67
                                              código
                       ¡Cada paso es verificable algorítmicamente!
     MAC El teorema de incompletitud de Gödel
```

## Ser demostrable es expresable
Páginas: 21
Palabras clave: Ser demostrable es expresable
Tipo: teoría

```text
Ser demostrable es expresable
      Por lo tanto, dados 𝑥 e 𝑦, el predicado binario:
       “𝑦 es el código de una demostración que termina en el enunciado de código 𝑥”,
      es también una propiedad verificable algorítmicamente.
      Y como esta propiedad es verificable algorítmicamente, entonces es expresable
      en términos de sumas, productos y operaciones lógicas.
      Finalmente, la expresión:
           “Existe algún 𝑦 que es el código de una demostración que termina en el
                      enunciado de código 𝑥”, es también expresable.
     MAC El teorema de incompletitud de Gödel
```

## ¡Importante!
Páginas: 22
Palabras clave: ¡Importante!
Tipo: teoría

```text
¡Importante!
                La última expresión dice que existe alguna demostración del
                                  enunciado de código 𝑥.
                 “El enunciado de código 𝑥 es demostrable” es expresable.
     MAC El teorema de incompletitud de Gödel
```

## La propiedad aritmética de los
Páginas: 23
Palabras clave: La propiedad aritmética de los
Tipo: teoría

```text
La propiedad aritmética de los
   enunciados demostrables
     MAC El teorema de incompletitud de Gödel
```

## La propiedad aritmética de los enunciados demostrables
Páginas: 24
Palabras clave: La propiedad aritmética de los enunciados demostrables; recursivamente enumerable; códigos demostrables; ejemplo hipotético
Tipo: teoría

```text
La propiedad aritmética de los enunciados demostrables
      El conjunto formado por los códigos de los enunciados demostrables (es decir, los
      números de Gödel de los enunciados que pueden probarse dentro del sistema
      formal) es recursivamente enumerable.
      Esto significa que existe un algoritmo o procedimiento efectivo que puede listar
      todos los elementos de este conjunto.
      ¡Importante! Suponemos, a modo de ejemplo hipotético, que la propiedad que
      caracteriza a los códigos de los enunciados demostrables es la de:
           “Ser un primo que puede escribirse como suma o resta de tres primos
                                      consecutivos”
     MAC El teorema de incompletitud de Gödel
```

## ¡Importante!
Páginas: 25
Palabras clave: ¡Importante!
Tipo: teoría

```text
¡Importante!
                       “𝑥 es el código de un enunciado demostrable”
                                        equivale a
              “𝑥 es un primo que puede escribirse como suma o resta de tres
                                  primos consecutivos”.
     MAC El teorema de incompletitud de Gödel
```

## La propiedad aritmética de los enunciados demostrables
Páginas: 26
Palabras clave: La propiedad aritmética de los enunciados demostrables
Tipo: teoría

```text
La propiedad aritmética de los enunciados demostrables
      El número 23, por ejemplo, es primo,       Por otro lado, 149  es un número
      y  además  puede  escribirse  como       primo que no puede escribirse como
      suma  o  resta  de  tres  primos       suma  o  resta  de  tres  primos
      consecutivos, ya que                       consecutivos.
              23 = 17 + 19 − 13                Pero 149 es, en nuestro ejemplo, el
                                                código del enunciado “4 es impar”.
      En   nuestro   ejemplo,   podemos       Entonces, “149 no es un primo que
      asegurar que 23 es el código de un       se pueda escribir como suma o resta
      enunciado demostrable.                    de   tres   primos   consecutivos”
                                                equivale a “El enunciado «4 es impar»
                                                no es demostrable”.
     MAC El teorema de incompletitud de Gödel
```

## La propiedad aritmética de los enunciados demostrables
Páginas: 27
Palabras clave: La propiedad aritmética de los enunciados demostrables
Tipo: teoría

```text
La propiedad aritmética de los enunciados demostrables
      Notemos que el enunciado:
        “149 no es un primo que se pueda escribir como suma o resta de tres primos
                                      consecutivos”
      es una afirmación de una propiedad aritmética relativa al número 149.
      Pero, vía la numeración de Gödel, a ese mismo enunciado podemos atribuirle
      también el significado:
                      “El enunciado «4 es impar» no es demostrable”
     MAC El teorema de incompletitud de Gödel
```

## ¡Importante!
Páginas: 28
Palabras clave: ¡Importante!
Tipo: teoría

```text
¡Importante!
                              Aquí hay dos niveles de lectura:
                         un nivel meramente aritmético, literal, y
            un nivel metamatemático, que depende de la numeración de Gödel
     MAC El teorema de incompletitud de Gödel
```

## El método de autorreferencia
Páginas: 29
Palabras clave: El método de autorreferencia
Tipo: teoría

```text
El método de autorreferencia
       Hemos visto que, vía la numeración de Gödel, hay enunciados aritméticos que
       se refieren a otros enunciados aritméticos.
       Veremos ahora cómo podemos obtener un enunciado que se refiera a sí
       mismo.
     MAC El teorema de incompletitud de Gödel
```

## El método de autorreferencia
Páginas: 30
Palabras clave: El método de autorreferencia
Tipo: teoría

```text
El método de autorreferencia
      ¿Es realmente posible construir un enunciado que se refiera a su propio código?
      En  su  artículo,  Gödel  expuso  un  método  sistemático  que  permite  escribir
      enunciados aritméticos que se refieren a su propio código.
      Este método, llamado método de autorreferencia, explica cómo escribir un
      enunciado que puede traducirse como “Mi código cumple la propiedad 𝑃”.
      La herramienta esencial de este método es una función, denotada 𝑑(𝑥), a la que
      Gödel llamó función diagonal.
     MAC El teorema de incompletitud de Gödel
```

## La función diagonal
Páginas: 31
Palabras clave: La función diagonal; función diagonal; autorreferencia
Tipo: teoría

```text
La función diagonal
      La función diagonal 𝑑, definida para el conjunto de números de Gödel de fórmulas
      𝑃(𝑥) que tienen una variable libre 𝑥, es la función que toma el número de Gödel 𝑛
      de la fórmula 𝑃(𝑥) y devuelve 𝑑(𝑛) que es el número de Gödel del enunciado
      𝑃(𝑛), obtenido al reemplazar 𝑥 por 𝑛.
     MAC El teorema de incompletitud de Gödel
```

## Ejemplo 1
Páginas: 32
Palabras clave: Ejemplo 1
Tipo: ejemplo

```text
Ejemplo 1
      Recordemos que, en nuestro ejemplo, el número de Gödel de “𝑥 es par” es 171.
      A continuación, sustituimos 𝑥 por el número 171 y obtenemos el enunciado:
                         “171 es par”, cuyo número de Gödel es 61
      Por lo tanto, 𝑑(171) = 61.
     MAC El teorema de incompletitud de Gödel
```

## Ejemplo 2
Páginas: 33
Palabras clave: Ejemplo 2
Tipo: ejemplo

```text
Ejemplo 2
      La fórmula “𝑥 es divisible por 18” tiene número de Gödel 162.
      Al sustituir 𝑥 por el número 162 y obtenemos el enunciado:
                  “162 es divisible por 18”, cuyo número de Gödel es 103
      Así, concluimos que 𝑑(162) = 103.
     MAC El teorema de incompletitud de Gödel
```

## ¡Importante!
Páginas: 34
Palabras clave: ¡Importante!
Tipo: teoría

```text
¡Importante!
                 Todos los pasos que definen a la función diagonal pueden
                 verificarse algorítmicamente, por lo tanto, su definición es
                expresable usando sumas, productos y operaciones lógicas.
     MAC El teorema de incompletitud de Gödel
```

## El método de autorreferencia
Páginas: 35
Palabras clave: El método de autorreferencia
Tipo: teoría

```text
El método de autorreferencia
      Así, como la función diagonal 𝑑 es expresable, entonces podemos sustituir en
      cualquier fórmula con variable libre 𝑥 por 𝑑(𝑥).
      Supongamos ahora que a “𝑑(𝑥) es par” le corresponde el número de Gödel 423.
      A continuación, sustituimos 𝑥 por el número 423 y obtenemos el enunciado:
                     “𝑑(423) es par”, cuyo número de Gödel es 𝑑(423)
     MAC El teorema de incompletitud de Gödel
```

## El método de autorreferencia
Páginas: 36
Palabras clave: El método de autorreferencia
Tipo: teoría

```text
El método de autorreferencia
      Es decir, “𝑑(243) es par” puede leerse como un enunciado autorreferente que
      está hablando de su propio código y que dice “Mi código es un número par”.
      Si “𝑑(243) es par” tuviera número de Gödel 503, entonces el enunciado podría
      reescribirse como “503 es par” y estaría diciendo, falsamente, que su propio
      código es par.
      ¡Importante! El método de autorreferencia nos dice que el mismo procedimiento
      puede aplicarse a cualquier propiedad aritmética.
     MAC El teorema de incompletitud de Gödel
```

## El método de autorreferencia
Páginas: 37
Palabras clave: El método de autorreferencia
Tipo: teoría

```text
El método de autorreferencia
      En particular, éste puede aplicarse a la fórmula expresable:
                        “El enunciado de código 𝑥 es demostrable”,
                                     y a su negación:
                       “El enunciado de código 𝑥 no es demostrable”
      Entonces, por el método de autorreferencia podemos escribir:
                     “El enunciado de código 𝑑(𝑥) no es demostrable”
     MAC El teorema de incompletitud de Gödel
```

## El método de autorreferencia
Páginas: 38
Palabras clave: El método de autorreferencia
Tipo: teoría

```text
El método de autorreferencia
      Si ésta última tiene número de Gödel 𝑔, entonces definimos:
                   𝐺: “El enunciado de código 𝑑(𝑔) no es demostrable”,
      que puede leerse como un enunciado autorreferente que habla de su propio
      código y dice:
              “Mi propio código no corresponde a un enunciado demostrable”
      Si 𝐺 fuera falso, debido a lo que 𝐺 dice de sí mismo, concluiríamos que 𝐺 es
      demostrable. Pero 𝐺 sería a la vez falso y demostrable, lo cual es imposible.
      En conclusión, 𝐺 es verdadero y, por lo que dice de sí mismo, no es demostrable.
     MAC El teorema de incompletitud de Gödel
```

## Teorema (incompletitud de Gödel)
Páginas: 39
Palabras clave: Teorema (incompletitud de Gödel); teorema de incompletitud; Gödel; consistente; completa
Tipo: teoría

```text
Teorema (incompletitud de Gödel)
      Ninguna teoría matemática formal
      capaz de describir los números
      naturales y la aritmética con
      suficiente expresividad es a la vez
      consistente y completa.
     MAC El teorema de incompletitud de Gödel
```

## ¿Preguntas?
Páginas: 40
Palabras clave: ¿Preguntas?
Tipo: teoría

```text
¿Preguntas?
     MAC El teorema de incompletitud de Gödel
```
