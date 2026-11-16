# Entornos

Fuente: tema-11

## Entornos
Páginas: 1
Palabras clave: Entornos
Tipo: teoría

```text
Entornos
     MM3032 Lógica Matemática
     MAC Entornos
```

## Objetivos
Páginas: 2
Palabras clave: Objetivos
Tipo: teoría

```text
Objetivos
      Definir  el  concepto  de  entorno,  verdad
      de una fórmula, implicación semántica,
      satisfacibilidad y validez.
     MAC Entornos
```

## Dada una fórmula ∀𝑥 𝜙 o ∃𝑥 𝜙, queremos verificar si 𝜙 se cumple para todos, o
Páginas: 3
Palabras clave: Dada una fórmula ∀𝑥 𝜙 o ∃𝑥 𝜙, queremos verificar si 𝜙 se cumple para todos, o
Tipo: teoría

```text
Dada una fórmula ∀𝑥 𝜙 o ∃𝑥 𝜙, queremos verificar si 𝜙 se cumple para todos, o
         para algún, valor 𝑎 ∈ 𝒟 en la interpretación ℐ.
                 Aunque  esto  es  intuitivo,  no  tenemos  forma  de  expresarlo  en  nuestra
                 sintaxis: la fórmula 𝜙 suele tener a 𝑥 como variable libre.
         𝜙[𝑎/𝑥] no es una fórmula lógica, pues 𝑎 no es un término del lenguaje,
         sino un elemento de 𝒟.
     MAC Entornos
```

## Entorno
Páginas: 4
Palabras clave: Entorno; entorno; asignación; variante de entorno; actualización local
Tipo: teoría

```text
Entorno
      Sea ℒ un lenguaje de primer orden, ℐ una interpretación de ℒ y 𝑉 el conjunto de
      variables de ℒ.
      Un entorno para 𝒟 es una función 𝑙: 𝑉 → 𝒟.
      Para un entorno 𝑙, escribimos 𝑙[𝑥 ⟼ 𝑎] para representar al entorno que mapea 𝑥
      en 𝑎 y cualquier otra variable 𝑦 en 𝑙(𝑦).
      Notas:
      ▪  Un entorno es una “tabla” que da un valor a cada variable.
      ▪  𝑙[𝑥 ⟼ 𝑎] produce una nueva tabla idéntica a 𝑙, excepto que ahora la variable 𝑥 tiene el
         valor 𝑎; es una actualización local de la tabla 𝑙.
     MAC Entornos
```

## Ejemplo
Páginas: 5
Palabras clave: Ejemplo
Tipo: ejemplo

```text
Ejemplo
      Supongamos que 𝒟 = {𝑎, 𝑏, 𝑐} y que 𝑉 = {𝑥, 𝑦, 𝑧}.
      Por ejemplo, podemos definir un entorno 𝑙 como:
                               𝑙(𝑥) = 𝑐, 𝑙(𝑦) = 𝑎 y 𝑙(𝑧) = 𝑐
      Además, 𝑙[𝑥 ⟼ 𝑏] cambia el valor de 𝑥 a 1, deja 𝑦 y 𝑧 como estaban, es decir:
                   𝑙[𝑥 ⟼ 𝑏] (𝑥) = 𝑏, 𝑙[𝑥 ⟼ 𝑏] (𝑦) = 𝑎 y 𝑙[𝑥 ⟼ 𝑏] (𝑧) = 𝑐
     MAC Entornos
```

## Verdad de una fórmula
Páginas: 6
Palabras clave: Verdad de una fórmula; verdad de fórmula atómica; pertenencia; tupla; evaluar predicado
Tipo: teoría

```text
Verdad de una fórmula
      Sean ℒ un lenguaje de primer orden, ℐ una interpretación de ℒ, 𝑙 un entorno y 𝜙
      una fórmula de ℒ.
      Decimos que 𝜙 es verdad en la interpretación ℐ con respecto al entorno 𝑙, lo cual
      se denota como ℐ ⊨_{𝑙} 𝜙.
      ▪  Si 𝜙 es 𝑃(𝑡_{1}, … , 𝑡_{𝑛}), interpretamos los términos 𝑡_{1}, … , 𝑡_{𝑛} sustituyendo todas las
        variables  por  sus  valores  según  el  entorno  𝑙.  De  esta  manera  calculamos
        valores  concretos  𝑎_{1}, … , 𝑎_{𝑛} ∈ 𝒟  para  cada  término,  donde  interpretamos  un
        símbolo funcional 𝑓 como 𝑓^{ℐ}. Entonces, ℐ ⊨_{𝑙} 𝑃(𝑡_{1}, … , 𝑡_{𝑛}) si y solo si (𝑎_{1}, … , 𝑎_{𝑛}) ∈
        𝑃^{ℐ}.
     MAC Entornos
```

## Verdad de una fórmula
Páginas: 7
Palabras clave: Verdad de una fórmula; evaluación universal; evaluación existencial; testigo; contraejemplo; conectivos; entorno
Tipo: teoría

```text
Verdad de una fórmula
      ▪  ℐ ⊨_{𝑙} ∀𝑥 𝜙 si y solo si ℐ ⊨_{𝑙[𝑥⟼𝑎]} 𝜙 para toda 𝑎 ∈ 𝒟.
      ▪  ℐ ⊨_{𝑙} ∃𝑥 𝜙 si y solo si ℐ ⊨_{𝑙[𝑥⟼𝑎]} 𝜙 para algún 𝑎 ∈ 𝒟.
      ▪  ℐ ⊨_{𝑙} ¬𝜙 si y solo si no es el caso que ℐ ⊨_{𝑙} 𝜙.
      ▪  ℐ ⊨_{𝑙} 𝜓_{1} ∨ 𝜓_{2} si y solo si ℐ ⊨_{𝑙} 𝜓_{1} o ℐ ⊨_{𝑙} 𝜓_{2}.
      ▪  ℐ ⊨_{𝑙} 𝜓_{1} ∧ 𝜓_{2} si y solo si ℐ ⊨_{𝑙} 𝜓_{1} y ℐ ⊨_{𝑙} 𝜓_{2}.
      ▪  ℐ ⊨_{𝑙} 𝜓_{1} → 𝜓_{2} si y solo si ℐ ⊨_{𝑙} 𝜓_{2} siempre que ℐ ⊨_{𝑙} 𝜓_{1}.
      Si 𝜙 es un enunciado, escribimos ℐ ⊨ 𝜙 para indicar que 𝜙 es verdadera en la
      interpretación ℐ (en este caso la elección de 𝑙 es irrelevante).
      Finalmente, escribimos ℐ ⊭_{𝑙} 𝜙 para denotar que no es verdad que ℐ ⊨_{𝑙} 𝜙.
     MAC Entornos
```

## Ejemplo
Páginas: 8
Palabras clave: Ejemplo; ejercicio de evaluación; entornos; cuantificadores anidados
Tipo: ejemplo

```text
Ejemplo
      Sea ℒ un lenguaje de primer orden, 𝑃 un predicado binario e ℐ una interpretación
      de ℒ dada por 𝒟 = {0, 1, 2} y 𝑃^{ℐ} = {(0, 1), (0, 2), (1, 2)}.
                                                            𝑥 → 0
      a.  Determinar el valor de verdad de 𝑃(𝑥, 𝑦) en ℐ bajo el entorno 𝑙_{1}: 𝑦 → 2.
                                                            𝑥 → 2
      b.  Determinar el valor de verdad de 𝑃(𝑥, 𝑦) en ℐ bajo el entorno 𝑙_{2}: 𝑦 → 1.
       Nota: La verdad no está en la fórmula sola, sino en la fórmula evaluada bajo un entorno.
      c.  Determinar el valor de verdad de ∃𝑥∀𝑦𝑃(𝑥, 𝑦) en ℐ.
     MAC Entornos
```

## Implicación semántica
Páginas: 9
Palabras clave: Implicación semántica; consecuencia semántica; implicación semántica; primer orden
Tipo: teoría

```text
Implicación semántica
      Sea ℒ un lenguaje de primer orden, Γ un conjunto de fórmulas de ℒ y 𝜓 una
      fórmula de ℒ.
      Decimos que 𝜓 es implicación semántica de Γ si y solo si para toda interpretación
      ℐ y todo entorno 𝑙, siempre que ℐ ⊨_{𝑙} 𝜙 es verdad para toda 𝜙 ∈ Γ, entonces
      ℐ ⊨_{𝑙} 𝜓 es verdad.
     MAC Entornos
```

## Ejemplo
Páginas: 10
Palabras clave: Ejemplo
Tipo: ejemplo

```text
Ejemplo
      Determinar si ∀𝑥(𝑃(𝑥) → 𝑄(𝑥)) es implicación semántica de ∀𝑥 𝑃(𝑥) → ∀𝑥 𝑄(𝑥).
     MAC Entornos
```

## Satisfacibilidad
Páginas: 11
Palabras clave: Satisfacibilidad; satisfacibilidad; satisfacible; modelo
Tipo: teoría

```text
Satisfacibilidad
      Sea ℒ un lenguaje de primer orden, Γ un conjunto de fórmulas de ℒ y 𝜓 una
      fórmula de ℒ.
      Decimos que 𝜓 es satisfacible si y solo si existe una interpretación ℐ y un entorno 𝑙
      tales que ℐ ⊨_{𝑙} 𝜓 es verdadera.
      Además, el conjunto de fórmulas Γ  es satisfacible si y solo si existe una
      interpretación ℐ y un entorno 𝑙 tales que ℐ ⊨_{𝑙} 𝜙 es verdadera para toda 𝜙 ∈ Γ.
     MAC Entornos
```

## Validez
Páginas: 12
Palabras clave: Validez; validez; válida; todas las interpretaciones
Tipo: teoría

```text
Validez
      Sea ℒ un lenguaje de primer orden, Γ un conjunto de fórmulas de ℒ y 𝜓 una
      fórmula de ℒ.
      Decimos que la fórmula 𝜓 es válida si y solo si ℐ ⊨_{𝑙} 𝜓 es verdadera para toda
      interpretación ℐ y todo entorno 𝑙 en los que podemos evaluar 𝜓.
     MAC Entornos
```

## Ejemplo
Páginas: 13
Palabras clave: Ejemplo
Tipo: ejemplo

```text
Ejemplo
      Encontrar una interpretación en la que la fórmula sea falsa, o demostrar que es
      válida:
      a.  (∀𝑥(𝑃(𝑥) → ∃𝑦 𝑄(𝑦)) ) → (∀𝑥∃𝑦(𝑃(𝑥) → 𝑄(𝑦)) )
      b.   ∀𝑥(𝑃(𝑥) ∨ 𝑄(𝑥)) → (∀𝑥𝑃(𝑥) ∨ ∀𝑥𝑄(𝑥))
     MAC Entornos
```

## ¿Preguntas?
Páginas: 14
Palabras clave: ¿Preguntas?
Tipo: teoría

```text
¿Preguntas?
     MAC Entornos
```
