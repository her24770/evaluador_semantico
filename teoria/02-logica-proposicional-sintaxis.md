# Lógica proposicional (enfoque sintáctico)

Fuente: tema-02

## Lógica proposicional
Páginas: 1
Palabras clave: Lógica proposicional
Tipo: teoría

```text
Lógica proposicional
   (enfoque sintáctico)
     MM3032 Lógica Matemática
     MAC Lógica proposicional (enfoque sintáctico)
```

## Objetivos
Páginas: 2
Palabras clave: Objetivos
Tipo: teoría

```text
Objetivos
      Definir los conceptos de teoría formal,
      demostración, teorema, deducción
      natural y equivalencia sintáctica.
      Escribir demostraciones en el sistema
      de deducción natural.
     MAC Lógica proposicional (enfoque sintáctico)
```

## ¿Qué es lo que diferencia a las
Páginas: 3
Palabras clave: ¿Qué es lo que diferencia a las
Tipo: teoría

```text
¿Qué es lo que diferencia a las
    matemáticas de otras ciencias?
       Uno de los aspectos que la distingue es la insistencia en la demostración.
       Las afirmaciones matemáticas no se aceptan como verdaderas hasta que se
       han verificado, y de una manera muy particular.
     MAC Lógica proposicional (enfoque sintáctico)
```

## A finales del siglo XIX, las matemáticas y la lógica sufrían una crisis de fundamentos.
Páginas: 4
Palabras clave: A finales del siglo XIX, las matemáticas y la lógica sufrían una crisis de fundamentos.
Tipo: teoría

```text
A finales del siglo XIX, las matemáticas y la lógica sufrían una crisis de fundamentos.
        Se descubrieron paradojas ocasionados
        por “confiar ciegamente” en
        la intuición sobre conceptos como
        conjunto, verdad o número.
        Muchos errores no venían de un mal
        razonamiento, sino de “cargar” los
        símbolos con significados implícitos
        que no estaban justificados.
     MAC Lógica proposicional (enfoque sintáctico)
```

## La solución fue radical: separar la forma (sintaxis) del contenido (semántica).
Páginas: 5
Palabras clave: La solución fue radical: separar la forma (sintaxis) del contenido (semántica).
Tipo: teoría

```text
La solución fue radical: separar la forma (sintaxis) del contenido (semántica).
                     Demostraciones                                      Independencia del modelo
                             =                                                           =
                   Objetos calculables                                       Poder de abstracción
              Si depende del significado, es                                Al vaciar de significado los
              subjetiva y difícil de verificar.                                 símbolos, un mismo sistema
                                                            formal puede servir para
                                                            modelar realidades
                                                            completamente distintas.
              Si las escribimos como                                      Esto permite aplicar la lógica
              secuencias de símbolos que se                              sin hacer cambios en el
              manipulan, la verificación                                    sistema deductivo.
              es mecánica.
     MAC Lógica proposicional (enfoque sintáctico)
```

## Teoría formal
Páginas: 6
Palabras clave: Teoría formal; sistema formal; teoría formal; componentes; axioma; regla de inferencia
Tipo: teoría

```text
Teoría formal
      Una teoría o sistema formal es una terna 𝒮 = (ℒ, 𝒜, ℛ) en donde:
      ▪  ℒ = (Σ, ℰ) es un lenguaje formal sobre un alfabeto Σ
      ▪  𝒜 ⊆ ℰ es el conjunto de axiomas del sistema, y
      ▪  ℛ es el conjunto de reglas de inferencia (derivación, deducción o producción)
      Notas:
      ▪  los axiomas son fórmulas que se aceptan como punto de partida válido dentro del
         sistema
      ▪  las reglas de inferencia son funciones que permiten transformar un conjunto de
         fórmulas iniciales (llamadas premisas) en una nueva fórmula (llamada conclusión)
     MAC Lógica proposicional (enfoque sintáctico)
```

## Demostraciones y teoremas
Páginas: 7
Palabras clave: Demostraciones y teoremas; demostración; premisas; conclusión; derivación
Tipo: teoría

```text
Demostraciones y teoremas
      En un sistema formal 𝒮 = (ℒ, 𝒜, ℛ), una demostración de una fórmula 𝜓 a partir
      de un conjunto de premisas Γ (que puede ser vacío) es una sucesión finita de
      fórmulas 𝜙_{1}, 𝜙_{2}, … , 𝜙_{𝑛} tal que:
      ▪  𝜙_{𝑛} es 𝜓
      ▪  para cada 𝜙_{𝑖} de la sucesión se debe cumplir al menos una condición:
           o 𝜙_{𝑖} ∈ 𝒜
           o 𝜙_{𝑖} ∈ Γ
           o 𝜙_{𝑖} es la conclusión de aplicar una regla de inferencia de ℛ a fórmulas
             anteriores de la sucesión (𝜙_{𝑗}, … , 𝜙_{𝑘} con 𝑗 ≤ 𝑘 < 𝑖)
     MAC Lógica proposicional (enfoque sintáctico)
```

## Demostraciones y teoremas
Páginas: 8
Palabras clave: Demostraciones y teoremas; teorema; demostrable
Tipo: teoría

```text
Demostraciones y teoremas
      Cuando existe tal secuencia, se dice que 𝜓 es demostrable (o derivable) a partir
      de Γ, y se escribe Γ ⊢ 𝜓.
      Si Γ es vacío (es decir, la fórmula se demuestra usando únicamente los axiomas y
      reglas del sistema), se escribe ⊢ 𝜓 y se dice que 𝜓 es un teorema del sistema.
     MAC Lógica proposicional (enfoque sintáctico)
```

## Ejemplo
Páginas: 9
Palabras clave: Ejemplo
Tipo: ejemplo

```text
Ejemplo
      A continuación se presenta una demostración para (𝑝 ∧ 𝑞) → 𝑟 ⊢ 𝑝 → (𝑞 → 𝑟):
      1. (𝑝 ∧ 𝑞) → 𝑟              Premisa
      2.   𝑝                       Suposición
      3.     𝑞                      Suposición
      4.     𝑝 ∧ 𝑞                  ∧i 2, 3
      5.     𝑟                       MP 1, 4
      6.   𝑞 → 𝑟                   →i 3 – 5
      7.  𝑝 → (𝑞 → 𝑟)             →i 2 – 6
     MAC Lógica proposicional (enfoque sintáctico)
```

## La deducción natural
Páginas: 10
Palabras clave: La deducción natural
Tipo: teoría

```text
La deducción natural
       Un sistema formal sin axiomas, introducido por Gerhard Gentzen en su trabajo
       Investigaciones sobre la inferencia lógica, publicado en 1934-1935.
     MAC Lógica proposicional (enfoque sintáctico)
```

## La deducción natural
Páginas: 11
Palabras clave: La deducción natural
Tipo: teoría

```text
La deducción natural
      La deducción natural es un sistema formal 𝒮 = (ℒ, 𝒜, ℛ) en donde:
      ▪  ℒ es el lenguaje formal de proposiciones
      ▪  𝒜 es vacío
      ▪  ℛ es un conjunto de reglas de inferencia para la introducción y eliminación de
        conectivos
     MAC Lógica proposicional (enfoque sintáctico)
```

## Recordatorio: Lenguaje formal de proposiciones
Páginas: 12
Palabras clave: Recordatorio: Lenguaje formal de proposiciones
Tipo: teoría

```text
Recordatorio: Lenguaje formal de proposiciones
      El lenguaje formal de proposiciones ℒ está formado por:
      Un alfabeto Σ que contiene:
      1. Símbolos llamados letras proposicionales 𝑝, 𝑞, 𝑟 … , 𝑝_{1}, 𝑝_{2}, 𝑝_{3}, …
      2. Símbolos llamados conectivos lógicos ¬, ∧,  ∨, →
      3. Símbolos de puntuación: ), (
     MAC Lógica proposicional (enfoque sintáctico)
```

## Recordatorio: Lenguaje formal de proposiciones
Páginas: 13
Palabras clave: Recordatorio: Lenguaje formal de proposiciones
Tipo: teoría

```text
Recordatorio: Lenguaje formal de proposiciones
      Un conjunto de fórmulas ℰ obtenidas de las reglas de formación:
      R1: Toda letra proposicional pertenece a ℰ.
      R2: Si 𝜙 y 𝜓 pertenecen a ℰ, entonces también pertenecen a ℰ las siguientes
      expresiones:
                             (¬𝜙), (𝜙 ∧ 𝜓), (𝜙 ∨ 𝜓) y (𝜙 → 𝜓)
      R3: Las únicas fórmulas son aquéllas que se obtienen por medio de R1 o R2.
     MAC Lógica proposicional (enfoque sintáctico)
```

## Reglas para conjunción
Páginas: 14
Palabras clave: Reglas para conjunción; conjunción; introducción; eliminación
Tipo: teoría

```text
Reglas para conjunción
          Introducción de la conjunción               Eliminación de la conjunción
      Abreviación: ∧i                             Abreviación: ∧e
      Formalización:                             Formalización:
                   𝜙     𝜙                                 𝜙 ∧ 𝜓 𝜙 ∧ 𝜓
                   𝜓     𝜓                                      ,
                       ,                                      𝜙     𝜓
                 𝜙 ∧ 𝜓 𝜓 ∧ 𝜙
     MAC Lógica proposicional (enfoque sintáctico)
```

## Ejercicio 1
Páginas: 15
Palabras clave: Ejercicio 1
Tipo: ejercicio

```text
Ejercicio 1
      Escribir una demostración de 𝑝 ∧ 𝑞, 𝑟 ⊢ 𝑞 ∧ 𝑟.
     MAC Lógica proposicional (enfoque sintáctico)
```

## Reglas para doble negación
Páginas: 16
Palabras clave: Reglas para doble negación
Tipo: teoría

```text
Reglas para doble negación
       Introducción de la doble negación           Eliminación de la doble negación
      Abreviación: ¬¬i                           Abreviación: ¬¬e
      Formalización:                             Formalización:
                       𝜙                                        ¬¬𝜙
                     ¬¬𝜙                                        𝜙
     MAC Lógica proposicional (enfoque sintáctico)
```

## Ejercicio 2
Páginas: 17
Palabras clave: Ejercicio 2
Tipo: ejercicio

```text
Ejercicio 2
      Escribir una demostración de 𝑝, ¬¬(𝑞 ∧ 𝑟) ⊢ ¬¬𝑝 ∧ 𝑟.
     MAC Lógica proposicional (enfoque sintáctico)
```

## Reglas para disyunción
Páginas: 18
Palabras clave: Reglas para disyunción; disyunción; demostración por casos
Tipo: teoría

```text
Reglas para disyunción
          Introducción de la disyunción                Eliminación de la disyunción
      Abreviación: ∨i                             Abreviación: ∨e
      Formalización:                             Formalización:
                   𝜙     𝜙                                    𝜙 ∨ 𝜓
                       ,                                        𝜙  𝜓
                 𝜙 ∨ 𝜓 𝜓 ∨ 𝜙                                  ⋮   ⋮
                                                            𝜒   𝜒
                                                            𝜒
     MAC Lógica proposicional (enfoque sintáctico)
```

## Ejercicio 3
Páginas: 19
Palabras clave: Ejercicio 3
Tipo: ejercicio

```text
Ejercicio 3
      Escribir una demostración de 𝑝 ∧ (𝑞 ∨ 𝑟) ⊢ (𝑝 ∧ 𝑞) ∨ (𝑝 ∧ 𝑟).
     MAC Lógica proposicional (enfoque sintáctico)
```

## Ejercicio 3
Páginas: 20
Palabras clave: Ejercicio 3
Tipo: ejercicio

```text
Ejercicio 3
      Escribir una demostración de 𝑝 ∧ (𝑞 ∨ 𝑟) ⊢ (𝑝 ∧ 𝑞) ∨ (𝑝 ∧ 𝑟).
      1. 𝑝 ∧ (𝑞 ∨ 𝑟)                    Premisa
       2. 𝑝                                ∧e 1
       3. 𝑞 ∨ 𝑟                             ∧e 1
       4.       𝑞                          Suposición
       5.       𝑝 ∧ 𝑞                       ∧i 2, 4
      6.      (𝑝 ∧ 𝑞) ∨ (𝑝 ∧ 𝑟)          ∨i 5
       7.       𝑟                          Suposición
       8.       𝑝 ∧ 𝑟                       ∧i 2, 7
      9.      (𝑝 ∧ 𝑞) ∨ (𝑝 ∧ 𝑟)          ∨i 8
      10. (𝑝 ∧ 𝑞) ∨ (𝑝 ∧ 𝑟)               ∨e 3, 4 – 6, 7 – 9
     MAC Lógica proposicional (enfoque sintáctico)
```

## Reglas para implicación
Páginas: 21
Palabras clave: Reglas para implicación; implicación; modus ponens; MP
Tipo: teoría

```text
Reglas para implicación
         Introducción de la implicación               Eliminación de la implicación
      Abreviación: →i                            Abreviación: →e o MP
      Formalización:                             Formalización:
                       𝜙                                         𝜙
                       ⋮                                       𝜙 → 𝜓
                       𝜓                                         𝜓
                    𝜙 → 𝜓                      Nota: También llamada Modus ponens.
     MAC Lógica proposicional (enfoque sintáctico)
```

## Ejercicio 4
Páginas: 22
Palabras clave: Ejercicio 4
Tipo: ejercicio

```text
Ejercicio 4
      Escribir una demostración de 𝑝 → (𝑞 → 𝑟) ⊢ (𝑝 ∧ 𝑞) → 𝑟.
     MAC Lógica proposicional (enfoque sintáctico)
```

## Ejercicio 4
Páginas: 23
Palabras clave: Ejercicio 4
Tipo: ejercicio

```text
Ejercicio 4
      Escribir una demostración de 𝑝 → (𝑞 → 𝑟) ⊢ (𝑝 ∧ 𝑞) → 𝑟.
      1. 𝑝 → (𝑞 → 𝑟)             Premisa
      2.     𝑝 ∧ 𝑞                Suposición
      3.     𝑝                    ∧e 2
      4.     𝑞 → 𝑟                MP 1, 3
      5.     𝑞                    ∧e 2
      6.     𝑟                    MP 4, 5
      7. (𝑝 ∧ 𝑞) → 𝑟               →i 2 – 6
     MAC Lógica proposicional (enfoque sintáctico)
```

## Reglas para negación
Páginas: 24
Palabras clave: Reglas para negación; negación; contradicción
Tipo: teoría

```text
Reglas para negación
          Introducción de la negación                 Eliminación de la negación
      Abreviación: ¬i                            Abreviación: ¬e
      Formalización:                             Formalización:
                       𝜙                                       𝜙  ¬𝜙
                       ⋮                                        ⋮    ⋮
                       ⊥                                      ¬𝜙  𝜙
                      ¬𝜙                                         ,
                                                            ⊥   ⊥
      Nota:   El  símbolo  ⊥    denota  una
      contradicción, una fórmula 𝜓 ∧ ¬𝜓.
     MAC Lógica proposicional (enfoque sintáctico)
```

## Regla para contradicción
Páginas: 25
Palabras clave: Regla para contradicción
Tipo: teoría

```text
Regla para contradicción
          Eliminación de contradicción
      Abreviación: ⊥e                                        ¡Importante!
      Formalización:
                       ⊥                               La tarea de escribir una
                                                 demostración consiste en llegar a la
                       𝜙                         conclusión a partir de las premisas
                                                    mediante la aplicación de una
      Nota:  Esta regla indica que a partir de         secuencia adecuada de reglas de
      una  contradicción  es  posible  derivar                    inferencia.
      cualquier fórmula.
     MAC Lógica proposicional (enfoque sintáctico)
```

## Ejercicio 5
Páginas: 26
Palabras clave: Ejercicio 5
Tipo: ejercicio

```text
Ejercicio 5
      Escribir una demostración de 𝜙 → 𝜓, ¬𝜓 ⊢ ¬𝜙.
      Nota: Ésta es derivación es llamada Modus tollens y se abrevia como MT.
     MAC Lógica proposicional (enfoque sintáctico)
```

## Ejercicio 5
Páginas: 27
Palabras clave: Ejercicio 5
Tipo: ejercicio

```text
Ejercicio 5
      Escribir una demostración de 𝜙 → 𝜓, ¬𝜓 ⊢ ¬𝜙.
      1. 𝜙 → 𝜓                   Premisa
      2. ¬𝜓                       Premisa
      3.     𝜙                    Suposición
      4.     𝜓                    MP 1, 3
      5.     ⊥                    ¬e 2, 4
      6. ¬𝜙                        ¬i 3 – 5
     MAC Lógica proposicional (enfoque sintáctico)
```

## Ejercicio 6
Páginas: 28
Palabras clave: Ejercicio 6
Tipo: ejercicio

```text
Ejercicio 6
      Escribir una demostración de 𝑝 → 𝑞 ⊢ ¬𝑞 → ¬𝑝.
     MAC Lógica proposicional (enfoque sintáctico)
```

## Ejercicio 6
Páginas: 29
Palabras clave: Ejercicio 6
Tipo: ejercicio

```text
Ejercicio 6
      Escribir una demostración de 𝑝 → 𝑞 ⊢ ¬𝑞 → ¬𝑝.
      1. 𝑝 → 𝑞                    Premisa
      2.     ¬𝑞                  Suposición
      3.     ¬𝑝                  MT 1, 2
      4. ¬𝑞 → ¬𝑝                →i 2 – 3
     MAC Lógica proposicional (enfoque sintáctico)
```

## Ejercicio 7
Páginas: 30
Palabras clave: Ejercicio 7
Tipo: ejercicio

```text
Ejercicio 7
      Escribir una demostración de 𝑝 → (𝑞 → 𝑟), 𝑝, ¬𝑟 ⊢ ¬𝑞.
     MAC Lógica proposicional (enfoque sintáctico)
```

## Ejercicio 7
Páginas: 31
Palabras clave: Ejercicio 7
Tipo: ejercicio

```text
Ejercicio 7
      Escribir una demostración de 𝑝 → (𝑞 → 𝑟), 𝑝, ¬𝑟 ⊢ ¬𝑞.
      1. 𝑝 → (𝑞 → 𝑟)             Premisa
      2. 𝑝                        Premisa
      3. ¬𝑟                       Premisa
      4. 𝑞 → 𝑟                    MP 1, 2
      5.     𝑞                    Suposición
      6.     𝑟                    MP 4, 5
      7.      ⊥                    ¬e 3, 6
      8. ¬𝑞                       ¬i 5 – 7
     MAC Lógica proposicional (enfoque sintáctico)
```

## Ejercicio 8
Páginas: 32
Palabras clave: Ejercicio 8
Tipo: ejercicio

```text
Ejercicio 8
      Escribir una demostración de ¬𝜙 →⊥⊢ 𝜙.
      Nota: Ésta es derivación es llamada prueba por contradicción y se abrevia como PBC.
     MAC Lógica proposicional (enfoque sintáctico)
```

## Ejercicio 8
Páginas: 33
Palabras clave: Ejercicio 8
Tipo: ejercicio

```text
Ejercicio 8
      Escribir una demostración de ¬𝜙 →⊥⊢ 𝜙.
      1. ¬𝜙 →⊥           Premisa
      2.     ¬𝜙           Suposición
      3.     ⊥             MP 1, 2
      4. ¬¬𝜙              ¬i 2 – 3
      5. 𝜙                  ¬¬e 4
     MAC Lógica proposicional (enfoque sintáctico)
```

## Ejercicio 9
Páginas: 34
Palabras clave: Ejercicio 9
Tipo: ejercicio

```text
Ejercicio 9
      Escribir una demostración de ⊢ 𝜙 ∨ ¬𝜙.
      Nota: Ésta es derivación es llamada principio del tercero excluido y se abrevia como LEM.
     MAC Lógica proposicional (enfoque sintáctico)
```

## Ejercicio 9
Páginas: 35
Palabras clave: Ejercicio 9
Tipo: ejercicio

```text
Ejercicio 9
      Escribir una demostración de ⊢ 𝜙 ∨ ¬𝜙.
      1.      ¬(𝜙 ∨ ¬𝜙)                  Suposición
      2.              𝜙                      Suposición
      3.              𝜙 ∨ ¬𝜙                 ∨i 2
      4.              ⊥                      ¬e 1, 3
      5.      ¬𝜙                            ¬i 2 – 4
      6.       𝜙 ∨ ¬𝜙                       ∨i 5
      7.      ⊥                              ¬e 1, 6
      8. ¬¬(𝜙 ∨ ¬𝜙)                     ¬i 1 – 7
      9. 𝜙 ∨ ¬𝜙                             ¬¬e 8
     MAC Lógica proposicional (enfoque sintáctico)
```

## Ejercicio 10
Páginas: 36
Palabras clave: Ejercicio 10
Tipo: ejercicio

```text
Ejercicio 10
      Escribir una demostración de 𝑝 → 𝑞 ⊢ ¬𝑝 ∨ 𝑞.
     MAC Lógica proposicional (enfoque sintáctico)
```

## Ejercicio 10
Páginas: 37
Palabras clave: Ejercicio 10
Tipo: ejercicio

```text
Ejercicio 10
      Escribir una demostración de 𝑝 → 𝑞 ⊢ ¬𝑝 ∨ 𝑞.
      1. 𝑝 → 𝑞                    Premisa
      2. 𝑝 ∨ ¬𝑝                   LEM
      3.     𝑝                    Suposición
      4.     𝑞                    MP 1, 3
      5.     ¬𝑝 ∨ 𝑞               ∨i 4
      6.     ¬𝑝                  Suposición
      7.      ¬𝑝 ∨ 𝑞               ∨i 6
      8. ¬𝑝 ∨ 𝑞                   ∨e 2, 3 – 5, 6 – 7
     MAC Lógica proposicional (enfoque sintáctico)
```

## Equivalencia sintáctica
Páginas: 38
Palabras clave: Equivalencia sintáctica; equivalencia sintáctica; derivabilidad
Tipo: teoría

```text
Equivalencia sintáctica
      Dos  fórmulas  𝜙  y  𝜓  son  sintácticamente  equivalentes,  denotado  𝜙 ⊣⊢ 𝜓,  si  se
      cumplen ambas:
      ▪  𝜙 ⊢ 𝜓
      ▪  𝜓 ⊢ 𝜙
     MAC Lógica proposicional (enfoque sintáctico)
```

## Ejercicio 11
Páginas: 39
Palabras clave: Ejercicio 11
Tipo: ejercicio

```text
Ejercicio 11
      Escribir una demostración de (𝑝 ∧ 𝑞) → 𝑟 ⊢ 𝑝 → (𝑞 → 𝑟).
      Nota: Éste y el ejercicio 4 muestran que 𝑝 → (𝑞 → 𝑟) ⊣⊢ (𝑝 ∧ 𝑞) → 𝑟.
     MAC Lógica proposicional (enfoque sintáctico)
```

## Ejercicio 11
Páginas: 40
Palabras clave: Ejercicio 11
Tipo: ejercicio

```text
Ejercicio 11
      Escribir una demostración de (𝑝 ∧ 𝑞) → 𝑟 ⊢ 𝑝 → (𝑞 → 𝑟).
      1. (𝑝 ∧ 𝑞) → 𝑟              Premisa
      2.     𝑝                    Suposición
      3.            𝑞             Suposición
      4.            𝑝 ∧ 𝑞         ∧i 2, 3
      5.            𝑟             MP 1, 4
      6.     𝑞 → 𝑟                →i 3 – 5
      7. 𝑝 → (𝑞 → 𝑟)              →i 2 – 6
     MAC Lógica proposicional (enfoque sintáctico)
```

## Ejercicio 12
Páginas: 41
Palabras clave: Ejercicio 12
Tipo: ejercicio

```text
Ejercicio 12
      Escribir una demostración de ¬𝑞 → ¬𝑝 ⊢ 𝑝 → 𝑞.
      Nota: Éste y el ejercicio 6 muestran que 𝑝 → 𝑞 ⊣⊢ ¬𝑞 → ¬𝑝.
     MAC Lógica proposicional (enfoque sintáctico)
```

## Ejercicio 12
Páginas: 42
Palabras clave: Ejercicio 12
Tipo: ejercicio

```text
Ejercicio 12
      Escribir una demostración de ¬𝑞 → ¬𝑝 ⊢ 𝑝 → 𝑞.
      1. ¬𝑞 → ¬𝑝                Premisa
      2.     𝑝                    Suposición
      3.     ¬¬𝑞                 MT 1, 2
      4.     𝑞                    ¬¬e 3
      5. 𝑝 → 𝑞                    →i 2 – 4
     MAC Lógica proposicional (enfoque sintáctico)
```

## Ejercicio 13
Páginas: 43
Palabras clave: Ejercicio 13
Tipo: ejercicio

```text
Ejercicio 13
      Escribir una demostración de ¬𝑝 ∨ 𝑞 ⊢ 𝑝 → 𝑞.
      Nota: Éste y el ejercicio 6 muestran que 𝑝 → 𝑞 ⊣⊢ ¬𝑝 ∨ 𝑞.
     MAC Lógica proposicional (enfoque sintáctico)
```

## Ejercicio 13
Páginas: 44
Palabras clave: Ejercicio 13
Tipo: ejercicio

```text
Ejercicio 13
      Escribir una demostración de ¬𝑝 ∨ 𝑞 ⊢ 𝑝 → 𝑞.
      1. ¬𝑝 ∨ 𝑞                      Premisa
      2.      𝑝                      Suposición
      3.              ¬𝑝             Suposición
      4.              ⊥              ¬e 2, 3
      5.              𝑞              ⊥e 4
      7.              𝑞              Suposición
      8.              𝑞              Repetición
      9.      𝑞                      ∨e 1, 3 – 5, 7 – 8
      10. 𝑝 → 𝑞                      →i 2 – 9
     MAC Lógica proposicional (enfoque sintáctico)
```

## Ejemplo
Páginas: 45
Palabras clave: Ejemplo
Tipo: ejemplo

```text
Ejemplo
      La demostración de 𝑝 ∨ 𝑞, ¬𝑞 ⊢ 𝑝 sería la siguiente:
      1. 𝑝 ∨ 𝑞              Premisa
      2. ¬𝑞                Premisa
      3.     𝑝             Suposición
      4.     𝑝             Repetición
      5.     𝑞             Suposición
      6.     ⊥             ¬e 2, 5
      7.      𝑝             ⊥e 6
      8. 𝑝                 ∨e 1, 3– 4, 5 – 7
     MAC Lógica proposicional (enfoque sintáctico)
```

## Ejemplo
Páginas: 46
Palabras clave: Ejemplo
Tipo: ejemplo

```text
Ejemplo
      Ésta podría modificarse de la siguiente manera:
      1. 𝑝 ∨ 𝑞        Premisa
      2.      ¬𝑞             Suposición
      3.              𝑝      Suposición
      4.              𝑝      Repetición
      5.              𝑞      Suposición               Y ahora tenemos una demostración
                                                  de 𝑝 ∨ 𝑞 ⊢ ¬𝑞 → 𝑝.
      6.              ⊥      ¬e 2, 5
      7.              𝑝      ⊥e 6
      8.      𝑝              ∨e 1, 3– 4, 5 – 7
      9. ¬𝑞 → 𝑝             →i 2 – 8
     MAC Lógica proposicional (enfoque sintáctico)
```

## Ejemplo
Páginas: 47
Palabras clave: Ejemplo
Tipo: ejemplo

```text
Ejemplo
      Incluso podría modificarse una vez más como:
      1.      𝑝 ∨ 𝑞                   Suposición
      2.              ¬𝑞             Suposición
      3.                      𝑝      Suposición
      4.                      𝑝      Repetición
      5.                      𝑞      Suposición        Y ahora tenemos una demostración
      6.                   ⊥      ¬e 2, 5           de ⊢ (𝑝 ∨ 𝑞) → (¬𝑞 → 𝑝) que es
      7.                      𝑝      ⊥e 6              un teorema del sistema.
      8.              𝑝              ∨e 1, 3– 4, 5 – 7
      9.      ¬𝑞 → 𝑝                →i 2 – 8
      10. (𝑝 ∨ 𝑞) → (¬𝑞 → 𝑝)       →i 1 – 9
     MAC Lógica proposicional (enfoque sintáctico)
```

## ¡Importante!
Páginas: 48
Palabras clave: ¡Importante!
Tipo: teoría

```text
¡Importante!
             Podemos transformar cualquier demostración de 𝜙_{1}, 𝜙_{2}, … , 𝜙_{𝑛} ⊢ 𝜓
            en una demostración del teorema ⊢ 𝜙_{1} → (𝜙_{2} → (… → (𝜙_{𝑛} → 𝜓)))
            al “aumentar” la demostración original con 𝑛 líneas de →i aplicadas
                         a las fórmulas 𝜙_{𝑛}, … , 𝜙_{2}, 𝜙_{1} en ese orden.
     MAC Lógica proposicional (enfoque sintáctico)
```

## ¿Preguntas?
Páginas: 49
Palabras clave: ¿Preguntas?
Tipo: teoría

```text
¿Preguntas?
     MAC Lógica proposicional (enfoque sintáctico)
```
