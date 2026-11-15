# Lógica de predicados (enfoque sintáctico)

Fuente: tema-09

## Lógica de predicados
Páginas: 1
Palabras clave: Lógica de predicados
Tipo: teoría

```text
Lógica de predicados
   (enfoque sintáctico)
     MM3032 Lógica Matemática
     MAC Lógica de predicados (enfoque sintáctico)
```

## Objetivos
Páginas: 2
Palabras clave: Objetivos
Tipo: teoría

```text
Objetivos
      Definir las reglas sintácticas para la
      introducción y eliminación de los
      símbolos de igualdad y cuantificadores.
      Escribir demostraciones sintácticas de
      secuentes.
     MAC Lógica de predicados (enfoque sintáctico)
```

## ¡Importante!
Páginas: 3
Palabras clave: ¡Importante!
Tipo: teoría

```text
¡Importante!
              Las demostraciones en el sistema de deducción natural para la
             lógica de predicados son similares a las de la lógica proposicional,
             excepto que disponemos de nuevas reglas de inferencia para tratar
                      los cuantificadores y el símbolo de igualdad.
     MAC Lógica de predicados (enfoque sintáctico)
```

## Reglas para el símbolo de igualdad
Páginas: 4
Palabras clave: Reglas para el símbolo de igualdad; introducción de igualdad; eliminación de igualdad
Tipo: teoría

```text
Reglas para el símbolo de igualdad
           Introducción de la igualdad                  Eliminación de la igualdad
      Abreviación: =i                            Abreviación: =e
      Formalización:                             Formalización:
                     𝑡 = 𝑡                                     𝑡_{1} = 𝑡_{2}
      en donde 𝑡 es cualquier término.                          𝜙[𝑡_{1}/𝑥]
                                                            𝜙[𝑡_{2}/𝑥]
      Nota:  Esta  regla  puede  verse  como  un       con 𝑡_{1} y 𝑡_{2} libres para 𝑥 en 𝜙.
      axioma, pues no depende de premisas.
     MAC Lógica de predicados (enfoque sintáctico)
```

## Ejemplo
Páginas: 5
Palabras clave: Ejemplo
Tipo: ejemplo

```text
Ejemplo
      Escribir demostraciones de los secuentes:
      a.   𝑡_{1} = 𝑡_{2} ⊢ 𝑡_{2} = 𝑡_{1}
      b.   𝑡_{1} = 𝑡_{2}, 𝑡_{2} = 𝑡_{3} ⊢ 𝑡_{1} = 𝑡_{3}
     MAC Lógica de predicados (enfoque sintáctico)
```

## Reglas para el cuantificador universal
Páginas: 6
Palabras clave: Reglas para el cuantificador universal; introducción universal; eliminación universal; generalización
Tipo: teoría

```text
Reglas para el cuantificador universal
              Introducción de ∀𝒙                         Eliminación de ∀𝒙
      Abreviación: ∀𝑥i                            Abreviación: ∀𝑥e
                   𝑥_{0}
                    ⋮                                           ∀𝑥 𝜙
                    𝜙[𝑥_{0}/𝑥]                                    𝜙[𝑡/𝑥]
                   ∀𝑥 𝜙                        con 𝑡 libre para 𝑥 en 𝜙.
      en  donde  𝑥_{0}   es  una  variable
      arbitraria.
      Nota: 𝑥_{0} es una nueva variable que no
      aparece fuera de su recuadro.
     MAC Lógica de predicados (enfoque sintáctico)
```

## Ejemplo
Páginas: 7
Palabras clave: Ejemplo
Tipo: ejemplo

```text
Ejemplo
      Escribir una demostración del secuente  ∀𝑥(𝑃(𝑥) → 𝑄(𝑥)), ∀𝑥 𝑃(𝑥) ⊢ ∀𝑥 𝑄(𝑥).
     MAC Lógica de predicados (enfoque sintáctico)
```

## Ejercicio 1
Páginas: 8
Palabras clave: Ejercicio 1
Tipo: ejercicio

```text
Ejercicio 1
      Escribir una demostración de 𝑃(𝑡), ∀𝑥(𝑃(𝑥) → ¬𝑄(𝑥)) ⊢ ¬𝑄(𝑡).
     MAC Lógica de predicados (enfoque sintáctico)
```

## Reglas para el cuantificador existencial
Páginas: 9
Palabras clave: Reglas para el cuantificador existencial; introducción existencial; eliminación existencial; variable nueva
Tipo: teoría

```text
Reglas para el cuantificador existencial
               Introducción de ∃𝒙                         Eliminación de ∃𝒙
      Abreviación: ∃𝑥i                            Abreviación: ∃𝑥e
                    𝜙[𝑡/𝑥]                                     ∃𝑥 𝜙
                                                            𝑥_{0} 𝜙[𝑥_{0}/𝑥]
                     ∃𝑥 𝜙                                        ⋮
      con 𝑡 libre para 𝑥 en 𝜙.                                      𝜒
                                                            𝜒
                                                         Nota: 𝑥_{0}  es una nueva variable que no
                                                         aparece fuera de su recuadro, en particular,
                                                no puede ocurrir en 𝜒.
     MAC Lógica de predicados (enfoque sintáctico)
```

## Ejemplo
Páginas: 10
Palabras clave: Ejemplo
Tipo: ejemplo

```text
Ejemplo
      Escribir una demostración del secuente  ∀𝑥(𝑃(𝑥) → 𝑄(𝑥)), ∃𝑥 𝑃(𝑥) ⊢ ∃𝑥 𝑄(𝑥).
     MAC Lógica de predicados (enfoque sintáctico)
```

## Ejercicio 2
Páginas: 11
Palabras clave: Ejercicio 2
Tipo: ejercicio

```text
Ejercicio 2
      Escribir una demostración del secuente:
                   ∀𝑥(𝑄(𝑥) → 𝑅(𝑥)), ∃𝑥(𝑃(𝑥) ∧ 𝑄(𝑥)) ⊢ ∃𝑥(𝑃(𝑥) ∧ 𝑅(𝑥))
     MAC Lógica de predicados (enfoque sintáctico)
```

## Ejercicio 3
Páginas: 12
Palabras clave: Ejercicio 3
Tipo: ejercicio

```text
Ejercicio 3
      Escribir una demostración del secuente:
                          ∃𝑥𝑃(𝑥), ∀𝑥∀𝑦(𝑃(𝑥) → 𝑄(𝑦)) ⊢ ∀𝑦𝑄(𝑦)
     MAC Lógica de predicados (enfoque sintáctico)
```

## Ejercicio 4
Páginas: 13
Palabras clave: Ejercicio 4
Tipo: ejercicio

```text
Ejercicio 4
      Sea 𝜙 una fórmula. Escribir una demostración del secuente  ¬∀𝑥 𝜙 ⊢ ∃𝑥 ¬𝜙.
      Sugerencia:
      Demostrar primero los secuentes:
                     ¬(𝑝_{1} ∧ 𝑝_{2}) ⊢ ¬𝑝_{1} ∨ ¬𝑝_{2} y ¬∀𝑥 𝑃(𝑥) ⊢ ∃𝑥 ¬𝑃(𝑥)
     MAC Lógica de predicados (enfoque sintáctico)
```

## ¿Preguntas?
Páginas: 14
Palabras clave: ¿Preguntas?
Tipo: teoría

```text
¿Preguntas?
     MAC Lógica de predicados (enfoque sintáctico)
```
