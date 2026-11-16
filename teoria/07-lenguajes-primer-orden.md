# Lenguajes de primer orden

Fuente: tema-07

## Lenguajes de
Páginas: 1
Palabras clave: Lenguajes de
Tipo: teoría

```text
Lenguajes de
   primer orden
     MM3032 Lógica Matemática
     MAC Lenguajes de primer orden
```

## Objetivos
Páginas: 2
Palabras clave: Objetivos
Tipo: teoría

```text
Objetivos
      Definir los conceptos de lenguaje de
      primer orden, términos y fórmulas bien
      formadas.
     MAC Lenguajes de primer orden
```

## ¡Importante!
Páginas: 3
Palabras clave: ¡Importante!
Tipo: teoría

```text
¡Importante!
               La maquinaria de la lógica proposicional permite formalizar y
               teorizar sobre la validez de una gran cantidad de argumentos.
              Sin embargo, existen argumentos que son intuitivamente válidos,
              pero cuya validez no se puede probar por la lógica proposicional.
     MAC Lenguajes de primer orden
```

## Ejemplo: Un argumento no válido
Páginas: 4
Palabras clave: Ejemplo: Un argumento no válido
Tipo: ejemplo

```text
Ejemplo: Un argumento no válido
      Consideremos el siguiente argumento:
                          Todos los hombres son mortales.
                          Sócrates es un hombre.
                          Por lo tanto, Sócrates es mortal.
      Como las proposiciones no contienen conectivos, entonces, según la lógica
      proposicional, su formalización sería:
      𝑝: Todos los hombres son mortales.
      𝑞: Sócrates es un hombre.
      𝑟: Sócrates es mortal.
     MAC Lenguajes de primer orden
```

## Ejemplo: Un argumento no válido
Páginas: 5
Palabras clave: Ejemplo: Un argumento no válido
Tipo: ejemplo

```text
Ejemplo: Un argumento no válido
      Si el argumento fuera válido, la implicación (𝑝 ∧ 𝑞) → 𝑟 sería una tautología.
      Sin embargo, la tabla muestra que éste no es el caso.
                            𝑝       𝑞       𝑟      𝑝 ∧ 𝑞    (𝑝 ∧ 𝑞) → 𝑟
                                    0         0         0         0           1
                                    0         0         1         0           1
                                    0         1         0         0           1
                                    0         1         1         0           1
                                    1         0         0         0           1
                                    1         0         1         0           1
                                    1         1         0         1           0
                                    1         1         1         1           1
     MAC Lenguajes de primer orden
```

## ¡Importante!
Páginas: 6
Palabras clave: ¡Importante!
Tipo: teoría

```text
¡Importante!
             El problema fundamental es que la lógica proposicional trata a las
              proposiciones como bloques indivisibles y sólo se preocupa por
                      cómo éstas se conectan mediante operadores.
     MAC Lenguajes de primer orden
```

## ¡Importante!
Páginas: 7
Palabras clave: ¡Importante!
Tipo: teoría

```text
¡Importante!
            La lógica proposicional no es capaz de analizar la estructura interna
            de las proposiciones; no puede referirse a relaciones entre objetos o
                          propiedades en colecciones de objetos.
     MAC Lenguajes de primer orden
```

## ¡Importante!
Páginas: 8
Palabras clave: ¡Importante!
Tipo: teoría

```text
¡Importante!
             Necesitamos extender el lenguaje de proposiciones para expresar,
             por ejemplo, que todos o algunos de los miembros de un conjunto
                                tienen una propiedad dada.
     MAC Lenguajes de primer orden
```

## Ejemplo: Sócrates
Páginas: 9
Palabras clave: Ejemplo: Sócrates
Tipo: ejemplo

```text
Ejemplo: Sócrates
      La frase “Sócrates es hombre” involucra a un individuo y a una propiedad.
      Usamos una letra minúscula, digamos 𝑠, para nombrar al individuo y una letra
      mayúscula, digamos 𝐻, para nombrar a la propiedad “ser hombre”.
      Y así, escribimos 𝐻(𝑠) para expresar que el individuo 𝑠 tiene la propiedad 𝐻.
      De manera similar, si 𝑀 denota la propiedad de ser mortal entonces la frase
      “Sócrates es mortal” puede escribirse como 𝑀(𝑠).
      Nota: Las letras 𝐻 y 𝑀 son predicados 1-arios (unarios).
     MAC Lenguajes de primer orden
```

## Ejemplo: Sócrates
Páginas: 10
Palabras clave: Ejemplo: Sócrates
Tipo: ejemplo

```text
Ejemplo: Sócrates
      La frase “Todos los hombres son mortales” asegura que todo individuo que tenga
      la propiedad de ser hombre también tiene la propiedad de ser mortal.
      Usamos el símbolo ∀ para representar al concepto de “todos” y escribiremos:
                                    ∀𝑥(𝐻(𝑥) → 𝑀(𝑥))
      ¡Importante! Aquí la letra minúscula 𝑥  representa un individuo, pero no un
      individuo particular, como en el caso de 𝑠, sino un individuo arbitrario.
      Notas:
      ▪  La letra 𝑥 es una variable individual, mientras que la letra 𝑠 es una constante
         individual.
      ▪  El conjunto de individuos se llama dominio del discurso y se denota 𝒟.
     MAC Lenguajes de primer orden
```

## Ejemplo: Sócrates
Páginas: 11
Palabras clave: Ejemplo: Sócrates
Tipo: ejemplo

```text
Ejemplo: Sócrates
      La frase “Algún individuo es mortal” asegura que existe al menos un individuo que
      tiene la propiedad de ser mortal.
      Usamos el símbolo ∃ para representar al concepto de “existe” y escribimos:
                                         ∃𝑥𝑀(𝑥)
     MAC Lenguajes de primer orden
```

## Ejercicio 1
Páginas: 12
Palabras clave: Ejercicio 1
Tipo: ejercicio

```text
Ejercicio 1
      Usando estas interpretaciones que hemos dado a las letras y la interpretación
      normal que se da a los conectivos de cualquier lenguaje de proposiciones
      podemos traducir las siguientes expresiones:
      ¬𝑀(𝑠)
      ¬𝐻(𝑠)
      ¬𝑀(𝑠) ∧ ¬𝐻(𝑠)
      ¬∀𝑥(𝐻(𝑥) → 𝑀(𝑥))
      ∀𝑥(𝐻(𝑥) → ¬𝑀(𝑥))
      ∃𝑥(𝐻(𝑥) ∧ ¬𝑀(𝑥))
     MAC Lenguajes de primer orden
```

## Ejercicio 2
Páginas: 13
Palabras clave: Ejercicio 2
Tipo: ejercicio

```text
Ejercicio 2
      Suponga que la relación de orden entre los números naturales se representa por
      un predicado binario 𝑃, de tal forma que:
                        𝑃(𝑥, 𝑦) indica que “𝑥 es menor o igual a 𝑦”
      Traducir las siguientes afirmaciones acerca de los números naturales:
      a.  0 es menor o igual que cualquier número natural
      b.  No existe un último número natural
      c.  Para todo número natural hay un natural mayor o igual a él
      d.  La relación de orden en los naturales es transitiva
     MAC Lenguajes de primer orden
```

## Ejercicio 3
Páginas: 14
Palabras clave: Ejercicio 3
Tipo: ejercicio

```text
Ejercicio 3
      Usar los predicados:                        a.  María admira a todos los
      𝐴(𝑥, 𝑦): 𝑥 admira a 𝑦                          profesores.
      𝐵(𝑥, 𝑦): 𝑥 asistió a 𝑦                      b.  Algún profesor admira a María.
      𝑃(𝑥): 𝑥 es un profesor                     c.  María se admira a sí misma.
      𝑆(𝑥): 𝑥 es un estudiante                   d.  Ningún estudiante asistió a todas
                                                    las clases magistrales.
      𝐿(𝑥): 𝑥 es una clase magistral
                                                e.  Ninguna conferencia fue atendida
      y la constante 𝑚: María, para                   por todos los estudiantes
      traducer las frases a predicados.
                                                f.  Ningún estudiante asistió a
                                                    ninguna conferencia.
     MAC Lenguajes de primer orden
```

## Ejemplo: Números naturales y operaciones
Páginas: 15
Palabras clave: Ejemplo: Números naturales y operaciones
Tipo: ejemplo

```text
Ejemplo: Números naturales y operaciones
      También sería conveniente poder hablar de la suma y el producto de números
      naturales, que no son relaciones entre números sino operaciones.
      Para ello usamos símbolos funcionales:
      ▪  𝑆: ℕ^{2} → ℕ, con 𝑆(𝑥, 𝑦) = 𝑥 + 𝑦
      ▪  𝑄: ℕ^{2} → ℕ, con 𝑄(𝑥, 𝑦) = 𝑥 ⋅ 𝑦
      Así, por ejemplo, la frase “La suma de naturales es mayor o igual que una de sus
      partes” se escribe como:
                                   ∀𝑥∀𝑦 (𝑃(𝑥, 𝑆(𝑥, 𝑦)))
      Nota: Usando la notación usual escribimos ∀𝑥∀𝑦(𝑥 ≤ 𝑥 + 𝑦).
     MAC Lenguajes de primer orden
```

## ¡Importante!
Páginas: 16
Palabras clave: ¡Importante!
Tipo: teoría

```text
¡Importante!
                Queremos preservar todo lo que habíamos obtenido con los
               lenguajes proposicionales, de modo que los nuevos lenguajes
            formales sean extensiones. Para ello, usamos nuevos símbolos que
            representen individuos, propiedades de individuos, relaciones entre
                     individuos y a los conceptos “todos” y “algunos”.
     MAC Lenguajes de primer orden
```

## Lenguaje de primer orden
Páginas: 17
Palabras clave: Lenguaje de primer orden; símbolo lógico; igualdad; cuantificador; firma
Tipo: teoría

```text
Lenguaje de primer orden
      Un lenguaje de primer orden ℒ = (Σ, ℰ) es un lenguaje formal en el que el alfabeto
      Σ está dividido en dos:
      Símbolos lógicos:
      1. Variables individuales: 𝑥, 𝑦, 𝑧, … o bien 𝑥_{1}, 𝑥_{2}, …
      2. Conectivos: ¬, ∧, ∨ y →
      3. Cuantificadores: ∀ y ∃
      4. Símbolo de igualdad: =
      5. Paréntesis: ) y (
      Nota: Su significado es fijo e invariante en todas las interpretaciones posibles.
     MAC Lenguajes de primer orden
```

## Lenguaje de primer orden
Páginas: 18
Palabras clave: Lenguaje de primer orden; símbolo no lógico; constante; predicado; símbolo funcional; firma; aridad
Tipo: teoría

```text
Lenguaje de primer orden
      Símbolos no lógicos:
      1. Constantes individuales: 𝒞 = {𝑐_{1}, 𝑐_{2}, … }
      2. Predicados: ℛ = {𝑃1, 𝑃2, … } (relaciones 𝑛 −arias)
      3. Símbolos funcionales: ℱ = {𝑓1, 𝑓2, … } (funciones 𝑛 −arias)
      Notas:
      ▪  Su significado es variable y depende de la interpretación o estructura matemática que
         estemos estudiando.
      ▪  Los predicados son los símbolos que nos permiten hablar de propiedades de
         individuos y de relaciones de individuos entre sí.
      ▪  Los símbolos funcionales nos permiten denotar individuos.
     MAC Lenguajes de primer orden
```

## ¡Importante!
Páginas: 19
Palabras clave: ¡Importante!
Tipo: teoría

```text
¡Importante!
               El proceso de formar ebf’s no es tan sencillo como antes, pues
             recordemos que estamos tratando de reflejar la estructura interna
             de las proposiciones. Tendremos que pasar antes por expresiones
                                que denotan a individuos.
     MAC Lenguajes de primer orden
```

## Términos
Páginas: 20
Palabras clave: Términos; término; definición recursiva; función; argumentos
Tipo: teoría

```text
Términos
      Los términos de ℒ son:
      1. Las variables individuales.
      2. Las constantes individuales.
      3. Si 𝑡_{1}, 𝑡_{2}, … , 𝑡_{𝑛} son términos y 𝑓 ∈ ℱ un símbolo funcional 𝑛 −ario, entonces
         𝑓(𝑡_{1}, 𝑡_{2}, … 𝑡_{𝑛}) es un término de ℒ.
      4. Solo son términos aquellos indicados en 1, 2 o 3.
      Nota: Si ℒ no tiene símbolos funcionales entonces los términos de ℒ son las constantes y
      las variables individuales.
     MAC Lenguajes de primer orden
```

## Ejemplo: Términos
Páginas: 21
Palabras clave: Ejemplo: Términos
Tipo: ejemplo

```text
Ejemplo: Términos
      ▪  En un cierto lenguaje ℒ, supongamos 𝒞 = {0, 1, … } y ℱ = {𝑠, +,∗, −}, en donde 𝑠
        es unario y +,∗ y − son binarios. Entonces, ∗ (−(2, +(𝑠(𝑥), 𝑦)), 𝑥) es un
        término.
      Nota: Por lo general, los símbolos binarios se escriben en forma infix en lugar de prefix;
      por lo tanto, el término suele escribirse: (2 − (𝑠(𝑥) + 𝑦)) ∗ 𝑥.
      ▪  En otro lenguaje ℒ, supongamos 𝒞 = {𝑛} y ℱ = {𝑓, 𝑔}, en donde 𝑓 es unario y 𝑔
        es binario. Entonces, 𝑔(𝑓(𝑛), 𝑛) y 𝑓 (𝑔(𝑛, 𝑓(𝑛))) son términos.
     MAC Lenguajes de primer orden
```

## Fórmulas bien formadas
Páginas: 22
Palabras clave: Fórmulas bien formadas; fórmula atómica; igualdad; predicado
Tipo: teoría

```text
Fórmulas bien formadas
      El conjunto de expresiones bien formadas (o fórmulas) ℰ se define de forma
      recursiva:
      Fórmulas atómicas
      1. Si 𝑡_{1} y 𝑡_{2} son términos, entonces 𝑡_{1} = 𝑡_{2} es una fórmula atómica (y, por tanto,
         una ebf).
      2. Si  𝑡_{1}, 𝑡_{2}, … , 𝑡_{𝑛}  son  términos  y  𝑃 ∈ ℛ  un  predicado  𝑛 − ario,  entonces
         𝑃(𝑡_{1}, 𝑡_{2}, … , 𝑡_{𝑛}) es una fórmula atómica (y, por tanto, una ebf).
      3. Solo son fórmulas atómicas aquellas indicadas en 1 o 2.
      Nota: Son fórmulas atómicas las igualdades entre términos y los predicados aplicados a
      términos.
     MAC Lenguajes de primer orden
```

## Fórmulas bien formadas
Páginas: 23
Palabras clave: Fórmulas bien formadas; fórmula compuesta; ebf; cuantificador
Tipo: teoría

```text
Fórmulas bien formadas
      Fórmulas compuestas
      1. Si 𝜙 y 𝜓 son ebf’s, entonces también ¬𝜙, 𝜙 ∧ 𝜓, 𝜙 ∨ 𝜓 y 𝜙 → 𝜓 son ebf’s.
      3. Si 𝜙 es ebf y 𝑥 una variable, entonces ∀𝑥𝜙 y ∃𝑥𝜙 son ebf’s.
      4. Solo son ebf’s aquellas indicadas en 1, 2 o 3.
      Nota: El conjunto de ebf’s ℰ son las expresiones que afirman o niegan algo acerca de los
      individuos del dominio de discurso.
     MAC Lenguajes de primer orden
```

## Ejercicio 4
Páginas: 24
Palabras clave: Ejercicio 4; ejercicio de aridad; árbol sintáctico; fórmula inválida
Tipo: ejercicio

```text
Ejercicio 4
      En un cierto lenguaje ℒ, supongamos:
                      𝒞 = {𝑚}, ℱ = {𝑓(𝑡)} y ℛ = {𝑆(𝑡_{1}, 𝑡_{2}), 𝐵(𝑡_{1}, 𝑡_{2})}
      Determinar cuáles de las siguientes cadenas son fórmulas de ℒ. En el caso de las
      que no lo son, indicar el motivo. Dibujar los árboles sintácticos de las que sí lo son.
      a.  𝑆(𝑚, 𝑥)                f.      𝐵(𝑥, 𝑦) → (∃𝑧 𝑆(𝑧, 𝑦))
      b.  𝐵(𝑚, 𝑓(𝑚))            g.      𝑆(𝑥, 𝑦) → 𝑆 (𝑦, 𝑓(𝑓(𝑥)))
      c.  𝑓(𝑚)                  h.      𝐵(𝑥) → 𝐵(𝐵(𝑥))
      d.  𝐵(𝐵(𝑚, 𝑥), 𝑦)
      e.  𝑆(𝐵(𝑚), 𝑧)
     MAC Lenguajes de primer orden
```

## ¡Importante!
Páginas: 25
Palabras clave: ¡Importante!
Tipo: teoría

```text
¡Importante!
             Los cuantificadores se aplican sólo a variables individuales; no se
              acepta como fórmula una expresión como ∀𝑃(𝑎), donde 𝑃 es un
                                        predicado.
                      Por eso se llaman lenguajes de primer orden.
     MAC Lenguajes de primer orden
```

## Ejemplo: Teoría de conjuntos
Páginas: 26
Palabras clave: Ejemplo: Teoría de conjuntos
Tipo: ejemplo

```text
Ejemplo: Teoría de conjuntos
      El lenguaje de primer orden para la          Símbolos no lógicos
      teoría básica de conjuntos está              1. Predicado: símbolo binario ⊆
      formado por:
                                                2. Constantes individuales: ∅, 𝐴, 𝐵
      Símbolos lógicos
                                                3. Símbolos funcionales: funciones
      1. Variables individuales: 𝑥_{1}, 𝑥_{2}, …             binarias ∩, ∪ y −
      2. Conectivos: ¬, ∧, ∨ y →
      3. Cuantificadores: ∀ y ∃
      4. Símbolo de igualdad: =
      5. Paréntesis: ) y (
     MAC Lenguajes de primer orden
```

## Ejemplo: Teoría de conjuntos
Páginas: 27
Palabras clave: Ejemplo: Teoría de conjuntos
Tipo: ejemplo

```text
Ejemplo: Teoría de conjuntos
      Los términos del lenguaje son:              Ejemplos de ebf’s:
      ▪  Las variables y las constantes
      ▪  Si 𝑡_{1} y 𝑡_{2}, entonces 𝑡_{1} ∩ 𝑡_{2}, 𝑡_{1} ∪ 𝑡_{2}                   ∀𝑥(𝑥 ⊆ (𝑥 ∪ ∅))
        y 𝑡_{1} − 𝑡_{2} son términos
      Las fórmulas atómicas son de la                         ∀𝑥(𝑥 ⊆ 𝑥)
      forma:
      ▪  𝑡_{1} ⊆ 𝑡_{2}                                               𝐴 ∩ 𝐵 ⊆ 𝐴
      ▪  𝑡_{1} = 𝑡_{2},
      con 𝑡_{1} y 𝑡_{2} términos.
     MAC Lenguajes de primer orden
```

## Resumen
Páginas: 28
Palabras clave: Resumen
Tipo: teoría

```text
Resumen
       La lógica proposicional no es capaz de analizar la estructura interna de las proposiciones y por
       ello necesitamos extender su lenguaje.
              Los símbolos lógicos siempre serán interpretados de la misma manera.
       Los símbolos no lógicos tienen significados distintos según la interpretación en la cual se esté
       trabajando.
                      Los predicados hablan de propiedades de o relaciones entre individuos.
                                          Los símbolos funcionales nos permiten denotar individuos.
       Las ebf’s afirman o niegan algo acerca de los individuos del dominio de discurso.
     MAC Lenguajes de primer orden
```

## ¿Preguntas?
Páginas: 29
Palabras clave: ¿Preguntas?
Tipo: teoría

```text
¿Preguntas?
     MAC Lenguajes de primer orden
```
