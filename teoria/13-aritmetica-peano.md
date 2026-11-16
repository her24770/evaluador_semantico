# El sistema formal de la aritmética de Peano

Fuente: tema-13

## El sistema formal de
Páginas: 1
Palabras clave: El sistema formal de
Tipo: teoría

```text
El sistema formal de
   la aritmética de
   Peano
     MM3032 Lógica Matemática
     MAC El sistema formal de la aritmética de Peano
```

## Objetivos
Páginas: 2
Palabras clave: Objetivos
Tipo: teoría

```text
Objetivos
      Definir   el   sistema   formal   de   la
      aritmética de Peano
      Escribir demostraciones formales en el
      sistema de la aritmética de Peano.
     MAC El sistema formal de la aritmética de Peano
```

## El sistema formal de la aritmética
Páginas: 3
Palabras clave: El sistema formal de la aritmética
Tipo: teoría

```text
El sistema formal de la aritmética
      El lenguaje de la aritmética de Peano ℒ_{𝑃}𝐴 consta de:
      Símbolos lógicos:
      1. Variables individuales: 𝑥_{1}, 𝑥_{2}, …
      2. Conectivos: ¬, ∧, ∨ y →
      3. Símbolo de igualdad: =
      4. Paréntesis: ) y (
     MAC El sistema formal de la aritmética de Peano
```

## El sistema formal de la aritmética
Páginas: 4
Palabras clave: El sistema formal de la aritmética; aritmética de Peano; sucesor; suma; multiplicación
Tipo: teoría

```text
El sistema formal de la aritmética
      Símbolos no lógicos:
      1. Cuantificadores: ∀ y ∃
      2. Predicados: símbolos 𝑛 −arios 𝑃1, 𝑃2, …
      3. Constantes individuales: 𝟎
      4. Símbolos funcionales: + (suma), ⋅ (multiplicación) y 𝑆 (función sucesor)
     MAC El sistema formal de la aritmética de Peano
```

## Observación
Páginas: 5
Palabras clave: Observación
Tipo: teoría

```text
Observación
      Sabemos que los números naturales pueden obtenerse a partir del 0 contando de
      uno en uno, es decir, el conjunto de los números naturales está formado por el
      cero, el siguiente del cero, el siguiente del siguiente del cero, etc.
      De  esta  forma  la  secuencia  de  todos  los  números  naturales  se  escribe  en  el
      lenguaje formal como 0, 𝑆(0), 𝑆(𝑆(0)), …
      Una  vez  hecha  esta  precisión,  en  lugar  de  0, 𝑆(0), 𝑆(𝑆(0)), …  usaremos  como
      abreviatura los números usuales: 0, 1, 2 …
     MAC El sistema formal de la aritmética de Peano
```

## Ejemplo
Páginas: 6
Palabras clave: Ejemplo
Tipo: ejemplo

```text
Ejemplo
      Con los símbolos hasta aquí definidos ya podemos traducir al lenguaje formal la
      afirmación “Dos más dos es cuatro” como:
                           𝑆(𝑆(0)) + 𝑆(𝑆(0)) = 𝑆 (𝑆 (𝑆(𝑆(0))))
      o bien, con las abreviaturas:
                                        2 + 2 = 4
     MAC El sistema formal de la aritmética de Peano
```

## Ejercicio 1
Páginas: 7
Palabras clave: Ejercicio 1
Tipo: ejercicio

```text
Ejercicio 1
       ¡Importante! Este ejercicio deberá entregarse resuelto en Canvas al finalizar la sesión de clase.
      Sea 𝑃(𝑥) el predicado unario “𝑥 es par”.
      Escribir en el lenguaje formal el enunciado:
                    “La suma de dos números pares es un número par”
     MAC El sistema formal de la aritmética de Peano
```

## Ejercicio 2
Páginas: 8
Palabras clave: Ejercicio 2
Tipo: ejercicio

```text
Ejercicio 2
       ¡Importante! Este ejercicio deberá entregarse resuelto en Canvas al finalizar la sesión de clase.
      Sea 𝑃(𝑥) el predicado unario “𝑥 es primo”.
      Escribir en el lenguaje formal el enunciado:
                  “Todo número mayor que 1 es divisible por algún primo”
     MAC El sistema formal de la aritmética de Peano
```

## Términos
Páginas: 9
Palabras clave: Términos
Tipo: teoría

```text
Términos
      Los términos del lenguaje son:
      1. Las variables individuales.
      2. Las constantes individuales.
      3. Si 𝑡_{1}, 𝑡_{2}, … , 𝑡_{𝑛} son términos de ℒ_{𝑃}𝐴 y 𝑓 un símbolo funcional 𝑛 −ario, entonces
         𝑓𝑡_{1}𝑡_{2} … 𝑡_{𝑛} es un término de ℒ_{𝑃}𝐴.
      Los términos son las expresiones que se obtienen a partir del número 0 y de las
      variables al aplicar sucesivamente la función 𝑆 y las operaciones de + y ⋅ .
     MAC El sistema formal de la aritmética de Peano
```

## Fórmulas bien formadas
Páginas: 10
Palabras clave: Fórmulas bien formadas
Tipo: teoría

```text
Fórmulas bien formadas
      Fórmulas atómicas
      1. Si 𝑡_{1} y 𝑡_{2} son términos, 𝑡_{1} = 𝑡_{2} es una fórmula atómica.
      2. Si 𝑡_{1}, 𝑡_{2}, … , 𝑡_{𝑛} son términos y 𝑃 un predicado 𝑛 −ario, entonces 𝑃(𝑡_{1}, 𝑡_{2}, … , 𝑡_{𝑛})
         es una fórmula atómica.
      Fórmulas bien formadas (o compuestas)
      1. Toda fórmula atómica es una ebf.
      2. Si 𝛼 y 𝛽 son ebf’s, entonces también ¬𝛼, 𝛼 ∧ 𝛽, 𝛼 ∨ 𝛽 y 𝛼 → 𝛽 son ebf’s.
      3. Si 𝛼 es ebf y 𝑥 una variable, entonces ∀𝑥𝛼 y ∃𝑥𝛼 son ebf’s.
     MAC El sistema formal de la aritmética de Peano
```

## Ejemplo
Páginas: 11
Palabras clave: Ejemplo
Tipo: ejemplo

```text
Ejemplo
      Ejemplos de fórmulas:
      ▪ 𝑥 + 2 = 3
      ▪  (𝑥 = 𝑦) ⇒ (𝑆𝑥 = 𝑆𝑦)
      ▪ ∀𝑥∀𝑦(¬(𝑥 = 𝑦) ⇒ ¬(𝑆𝑥 = 𝑆𝑦))
     MAC El sistema formal de la aritmética de Peano
```

## Reglas de inferencia
Páginas: 12
Palabras clave: Reglas de inferencia
Tipo: teoría

```text
Reglas de inferencia
      Las reglas de inferencia son las de la lógica de predicados de primer orden y las
      reglas para el símbolo de la igualdad:
                                                           𝑡_{1} = 𝑡_{2}
                          =_{𝑖}                               𝜙[𝑡_{1}/𝑥]
                     𝑡 = 𝑡                                  𝜙[𝑡_{2}/𝑥]
         en donde 𝑡 es cualquier término          con 𝑡_{1} y 𝑡_{2} libres para 𝑥 en 𝜙.
     MAC El sistema formal de la aritmética de Peano
```

## Axiomas de Peano
Páginas: 13
Palabras clave: Axiomas de Peano; axiomas de Peano; esquema de inducción; AP1; AP2; AP3; AP4; AP5; AP6; AP7
Tipo: teoría

```text
Axiomas de Peano
      Los siguientes son los axiomas de Peano para la aritmética:
             AP1   ∀𝑥¬(𝑆(𝑥) = 0)
             AP2   ∀𝑥∀𝑦 ((𝑆(𝑥) = 𝑆(𝑦)) → 𝑥 = 𝑦)
             AP3   ∀𝑥(𝑥 + 0 = 𝑥)
             AP4   ∀𝑥∀𝑦(𝑥 + 𝑆(𝑦) = 𝑆(𝑥 + 𝑦))
             AP5   ∀𝑥(𝑥 ⋅ 0 = 0)
             AP6   ∀𝑥∀𝑦(𝑥 ⋅ 𝑆(𝑦) = (𝑥 ⋅ 𝑦) + 𝑥)
             AP7   Para cualquier fórmula 𝑃(𝑥),
                           (𝑃(0) ∧ ∀𝑥 (𝑃(𝑥) → 𝑃(𝑆(𝑥)))) → ∀𝑥𝑃(𝑥)
     MAC El sistema formal de la aritmética de Peano
```

## Ejemplo
Páginas: 14
Palabras clave: Ejemplo
Tipo: ejemplo

```text
Ejemplo
      Demostrar formalmente que ⊢ (𝑡_{1} = 𝑡_{2}) → (𝑆(𝑡_{1}) = 𝑆(𝑡_{2})).
      1.     𝑡_{1} = 𝑡_{2}                           Suposición
      2.     𝑆(𝑡_{1}) = 𝑆(𝑡_{1})                     =_{𝑖}
                                                          Nota: La fórmula 𝜙 es 𝑆(𝑡_{1}) = 𝑆(𝑥), de
      3.     𝑆(𝑡_{1}) = 𝑆(𝑡_{2})                     =_{𝑒} 1, 2   manera que la línea 2. es 𝜙[𝑡_{1}/𝑥].
      4. (𝑡_{1} = 𝑡_{2}) → (𝑆(𝑡_{1}) = 𝑆(𝑡_{2}))            →_{𝑖} 1 – 3
      Nota: Esta regla derivada se llama Congruencia del sucesor, la denotaremos CS.
     MAC El sistema formal de la aritmética de Peano
```

## Ejemplo
Páginas: 15
Palabras clave: Ejemplo
Tipo: ejemplo

```text
Ejemplo
      Demostrar formalmente que 2 + 1 = 3.
      1. ∀𝑥∀𝑦(𝑥 + 𝑆(𝑦) = 𝑆(𝑥 + 𝑦))                                   AP4
      2. ∀𝑦 (𝑆(𝑆(0)) + 𝑆(𝑦) = 𝑆(𝑆(𝑆(0)) + 𝑦))                         ∀𝑥_{𝑒} 1
      3. 𝑆(𝑆(0)) + 𝑆(0) = 𝑆(𝑆(𝑆(0)) + 0)                              ∀𝑦𝑒 2
      4. ∀𝑥(𝑥 + 0 = 𝑥)                                               AP3
      5. 𝑆(𝑆(0)) + 0 = 𝑆(𝑆(0))                                        ∀𝑥_{𝑒} 4
      6. 𝑆(𝑆(0)) + 0 = 𝑆(𝑆(0)) → 𝑆(𝑆(𝑆(0)) + 0) = 𝑆 (𝑆(𝑆(0)))         CS
      7. 𝑆(𝑆(𝑆(0)) + 0) = 𝑆 (𝑆(𝑆(0)))                                 MP 5, 6
      8. 𝑆(𝑆(0)) + 𝑆(0) = 𝑆 (𝑆(𝑆(0)))                                 Trans. = 3, 7
     MAC El sistema formal de la aritmética de Peano
```

## Ejercicio 3
Páginas: 16
Palabras clave: Ejercicio 3
Tipo: ejercicio

```text
Ejercicio 3
       ¡Importante! Este ejercicio deberá entregarse resuelto en Canvas al finalizar la sesión de clase.
      Demostrar formalmente que 1 + 1 = 2.
     MAC El sistema formal de la aritmética de Peano
```

## ¿Preguntas?
Páginas: 17
Palabras clave: ¿Preguntas?
Tipo: teoría

```text
¿Preguntas?
     MAC El sistema formal de la aritmética de Peano
```
