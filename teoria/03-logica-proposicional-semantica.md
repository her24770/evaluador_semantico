# Lógica proposicional (enfoque semántico)

Fuente: tema-03

## Lógica proposicional
Páginas: 1
Palabras clave: Lógica proposicional
Tipo: teoría

```text
Lógica proposicional
   (enfoque semántico)
     MM3032 Lógica Matemática
     MAC Lógica proposicional (enfoque semántico)
```

## Objetivos
Páginas: 2
Palabras clave: Objetivos
Tipo: teoría

```text
Objetivos
      Definir los conceptos de valuación y
      conectivos lógicos.
     MAC Lógica proposicional (enfoque semántico)
```

## Recordatorio: Proposiciones y conectivos
Páginas: 3
Palabras clave: Recordatorio: Proposiciones y conectivos; negación; conjunción; disyunción; condiciones de verdad
Tipo: teoría

```text
Recordatorio: Proposiciones y conectivos
      Una proposición es una expresión bien definida que puede ser verdadera o falsa,
      pero nunca ambas al mismo tiempo.
      Los conectivos lógicos son operadores que combinan proposiciones para formar
      proposiciones compuestas. Algunos conectivos comunes son:
      ▪  Negación: Invierte el valor de verdad de una proposición.
      ▪  Conjunción:  La  proposición  compuesta  es  verdadera  solo  si  ambas
        proposiciones son verdaderas y es falsa en cualquier otro caso.
      ▪  Disyunción: La proposición compuesta es verdadera si al menos una de las
        proposiciones es verdadera y es falsa en cualquier otro caso.
     MAC Lógica proposicional (enfoque semántico)
```

## Recordatorio: Proposiciones y conectivos
Páginas: 4
Palabras clave: Recordatorio: Proposiciones y conectivos; implicación; antecedente; consecuente; antecedente falso; bicondicional; equivalencia; falsa; verdadera
Tipo: teoría

```text
Recordatorio: Proposiciones y conectivos
      ▪  Implicación: La proposición compuesta es falsa solo si la primera proposición es
        verdadera y la segunda es falsa, y es verdadera en cualquier otro caso.
      ▪  Equivalencia: La proposición compuesta es verdadera si ambas proposiciones
        tienen el mismo valor de verdad y falsa en cualquier otro caso.
      Nota: En una fórmula 𝜙, por ejemplo (𝑝 ∧ 𝑞) → 𝑟, las letras 𝑝, 𝑞 y 𝑟 se llaman átomos de
      𝜙.
     MAC Lógica proposicional (enfoque semántico)
```

## Valuación
Páginas: 5
Palabras clave: Valuación; valuación; modelo proposicional; átomo
Tipo: teoría

```text
Valuación
      Sea 𝜙 una fórmula.
      El conjunto {𝑇, 𝐹} se llama conjunto de valores de verdad.
      Una valuación (o modelo) de 𝜙 es una función que asigna a cada átomo de 𝜙 un
      valor de verdad.
      Nota: Por convención, 𝑇 representa “verdad” y 𝐹 representa “falso”.
     MAC Lógica proposicional (enfoque semántico)
```

## Ejemplo
Páginas: 6
Palabras clave: Ejemplo
Tipo: ejemplo

```text
Ejemplo
      Si la fórmula 𝜙 sólo depende del átomo 𝑝, existen 2 valuaciones para 𝜙:
                          𝑝      𝑣_{1}       𝐹
                                                            𝒑
                                           𝑇
                                                            𝐹
                                 𝑣_{2}                                                    𝑇
                          𝑝               𝐹
                                           𝑇
     MAC Lógica proposicional (enfoque semántico)
```

## Ejemplo
Páginas: 7
Palabras clave: Ejemplo; cantidad de valuaciones; tabla de verdad
Tipo: ejemplo

```text
Ejemplo
      Si la fórmula 𝜙 depende de los átomos 𝑝 y 𝑞, existen 2^{2} valuaciones para 𝜙 y se
      presentan utilizando la siguiente tabla:
                                                    𝒑       𝒒
                                                    𝐹       𝐹
                                                    𝐹       𝑇
                                                    𝑇       𝐹
                                                    𝑇       𝑇
                                       ¡Importante!
                 Si una fórmula 𝜙 tiene 𝑛 átomos, hay 2^{𝑛} valuaciones de 𝜙.
     MAC Lógica proposicional (enfoque semántico)
```

## Conectivos lógicos
Páginas: 8
Palabras clave: Conectivos lógicos; tabla de verdad; conectivos; conjunción; disyunción; implicación; negación
Tipo: teoría

```text
Conectivos lógicos
      Dadas las fórmulas 𝜙 y 𝜓, los conectivos lógicos son funciones cuyos argumentos
      son valores de verdad y el resultado es un valor de verdad.
         𝜙   ¬𝜙           𝜙       𝜓     𝜓 ∧ 𝜓           𝜙       𝜓     𝜓 ∨ 𝜓           𝜙       𝜓    𝜓 → 𝜓
         𝐹    𝑇            𝐹       𝐹       𝐹             𝐹       𝐹       𝐹             𝐹       𝐹       𝑇
         𝑇    𝐹            𝐹       𝑇       𝐹             𝐹       𝑇       𝑇             𝐹       𝑇       𝑇
       Negación         𝑇      𝐹      𝐹            𝑇      𝐹      𝑇            𝑇      𝐹      𝐹
                            𝑇       𝑇       𝑇             𝑇       𝑇       𝑇             𝑇       𝑇       𝑇
                            Conjunción                 Disyunción                 Implicación
     MAC Lógica proposicional (enfoque semántico)
```

## ¿Preguntas?
Páginas: 9
Palabras clave: ¿Preguntas?
Tipo: teoría

```text
¿Preguntas?
     MAC Lógica proposicional (enfoque semántico)
```
