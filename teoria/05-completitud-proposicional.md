# Completitud de la lógica proposicional

Fuente: tema-05

## Completitud de la
Páginas: 1
Palabras clave: Completitud de la
Tipo: teoría

```text
Completitud de la
   lógica proposicional
     MM3032 Lógica Matemática
     MAC Completitud de la lógica proposicional
```

## Objetivos
Páginas: 2
Palabras clave: Objetivos
Tipo: teoría

```text
Objetivos
      Definir el concepto de tautología.
      Estudiar el teorema de completitud para
      la lógica proposicional.
      Determinar si existe un demostración
      de un secuente.
     MAC Completitud de la lógica proposicional
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
     MAC Completitud de la lógica proposicional
```

## Completitud
Páginas: 4
Palabras clave: Completitud; completitud; completud; deducción natural
Tipo: teoría

```text
Completitud
       Las reglas de deducción natural son completas:
       Si 𝜙_{1}, 𝜙_{2}, … , 𝜙_{𝑛} ⊨ 𝜓, entonces existe una demostración para 𝜙_{1}, 𝜙_{2}, … , 𝜙_{𝑛} ⊢ 𝜓
     MAC Completitud de la lógica proposicional
```

## Tautología
Páginas: 5
Palabras clave: Tautología; tautología; todas las valuaciones
Tipo: teoría

```text
Tautología
      Sea 𝜙 una fórmula del lenguaje formal de la lógica proposicional.
      Decimos que 𝜙 es una tautología si y solo si su valor es 𝑇 en todas las valuaciones
      de sus átomos, es decir, si y solo si ⊨ 𝜙.
     MAC Completitud de la lógica proposicional
```

## Metalema (valuación para la completitud proposicional)
Páginas: 6
Palabras clave: Metalema (valuación para la completitud proposicional)
Tipo: teoría

```text
Metalema (valuación para la completitud proposicional)
      Sean 𝜙 una fórmula del lenguaje formal de la lógica proposicional cuyos únicos
      átomos son 𝑝_{1}, 𝑝_{2}, … , 𝑝_{𝑛}, 𝑘 cualquier línea en la tabla de verdad de 𝜙 y para cada
      1 ≤ 𝑖 ≤ 𝑛 sea 𝑝Ƹ_{𝑖} igual a 𝑝_{𝑖} si el valor de 𝑝_{𝑖} en la línea 𝑘 es 𝑇, en caso contrario 𝑝Ƹ_{𝑖}
      es ¬𝑝_{𝑖}.
      Entonces:
      1. Si el valor de 𝜙 en la línea 𝑘 es 𝑇, 𝑝Ƹ_{1}, 𝑝Ƹ_{2}, … , 𝑝Ƹ_{𝑛} ⊢ 𝜙 es demostrable.
      2. Si el valor de 𝜙 en la línea 𝑘 es 𝐹, 𝑝Ƹ_{1}, 𝑝Ƹ_{2}, … , 𝑝Ƹ_{𝑛} ⊢ ¬𝜙 es demostrable.
     MAC Completitud de la lógica proposicional
```

## Ejercicio 1
Páginas: 7
Palabras clave: Ejercicio 1
Tipo: ejercicio

```text
Ejercicio 1
      Escribir una demostración sintáctica en deducción natural del teorema:
                                   𝜙 → 𝜓, ¬𝜙 → 𝜓 ⊢ 𝜓
      Nota:  Esta  derivación  es  llamada  principio  del  dilema  (abreviación  PD)  y  básicamente
      “dice” que, si 𝜓 se deduce de 𝜙 y, además, 𝜓 se deduce de ¬𝜙, entonces 𝜓 es válido de
      forma incondicional.
     MAC Completitud de la lógica proposicional
```

## Metateorema (de completitud)
Páginas: 8
Palabras clave: Metateorema (de completitud)
Tipo: teoría

```text
Metateorema (de completitud)
      Sean 𝜙_{1}, 𝜙_{2}, … , 𝜙_{𝑛} y 𝜓 fórmulas del lenguaje formal de la lógica proposicional.
      Si 𝜙_{1}, 𝜙_{2}, … , 𝜙_{𝑛}⊨ 𝜓, entonces 𝜙_{1}, 𝜙_{2}, … , 𝜙_{𝑛} ⊢ 𝜓.
      Nota: En palabras, si 𝜓 es consecuencia semántica de 𝜙_{1}, 𝜙_{2}, …, 𝜙_{𝑛}, entonces 𝜓 es
      demostrable a partir de 𝜙_{1}, 𝜙_{2}, …, 𝜙_{𝑛}.
     MAC Completitud de la lógica proposicional
```

## Lógica proposicional Teorema de
Páginas: 9
Palabras clave: Lógica proposicional Teorema de
Tipo: teoría

```text
Lógica proposicional                    Teorema de
                               (semántica)                          Validez
                       𝜙_{1}, … , 𝜙_{𝑛} ⊨ 𝜓
                                                            Lógica proposicional
                                                            (sintaxis)
                              Teorema de
                               Completud                                𝜙_{1}, … , 𝜙_{𝑛} ⊢ 𝜓
     MAC Completitud de la lógica proposicional
```

## ¿Preguntas?
Páginas: 10
Palabras clave: ¿Preguntas?
Tipo: teoría

```text
¿Preguntas?
     MAC Completitud de la lógica proposicional
```
