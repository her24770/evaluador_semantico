# Interpretaciones

Fuente: tema-10

## Interpretaciones
Páginas: 1
Palabras clave: Interpretaciones
Tipo: teoría

```text
Interpretaciones
     MM3032 Lógica Matemática
     MAC Interpretaciones
```

## Objetivos
Páginas: 2
Palabras clave: Objetivos
Tipo: teoría

```text
Objetivos
      Definir el concepto de interpretación de
      un lenguaje de primer orden.
     MAC Interpretaciones
```

## ¡Importante!
Páginas: 3
Palabras clave: ¡Importante!
Tipo: teoría

```text
¡Importante!
              Para los lenguajes de primer orden vamos a necesitar interpretar
            todos los símbolos no lógicos del lenguaje de manera que podamos
                 decidir cuáles fórmulas se traducen como proposiciones
                      verdaderas y cuáles como proposiciones falsas.
     MAC Interpretaciones
```

## Interpretación
Páginas: 4
Palabras clave: Interpretación; interpretación; estructura; dominio del discurso; relación; función; constante
Tipo: teoría

```text
Interpretación
      Sea ℒ un lenguaje de primer orden.
      Una interpretación para ℒ es una tupla ℐ = (𝒟, 𝒞, ℱ, 𝒫) que consiste en:
      ▪  un conjunto 𝒟 llamado dominio del discurso;
      ▪  𝒞 asigna a cada constante 𝑐 de ℒ, un elemento 𝑐^{ℐ} ∈ 𝒟;
      ▪  ℱ asigna a cada símbolo funcional 𝑛-ario de ℒ, una función 𝑓^{ℐ}: 𝒟^{𝑛} → 𝒟;
      ▪  𝒫 asigna a cada predicado 𝑛-ario de ℒ, una relación 𝑛-aria 𝑅^{ℐ} ⊆ 𝒟^{𝑛}
      Nota:  Una  interpretación  es una estructura que asigna significados a los símbolos no
      lógicos de ℒ.
     MAC Interpretaciones
```

## Ejemplo
Páginas: 5
Palabras clave: Ejemplo
Tipo: ejemplo

```text
Ejemplo
      Sea ℒ  un  lenguaje  de  primer  orden  con  un  predicado  unario  𝑃  y  un  predicado
      binario 𝑅. Consideremos la siguiente interpretación ℐ de ℒ:
      ▪  𝒟 = {1, 2, 3} (dominio del discurso)
      ▪  𝑃^{ℐ} = {1, 2} ⊆ 𝒟 (los elementos que tienen la propiedad 𝑃)
      ▪  𝑅^{ℐ} = {(1, 3), (2, 1), (3, 2)} ⊆ 𝒟^{2} (los pares que están relacionados por 𝑅)
      Verificamos de manera informal algunas fórmulas de la lógica de predicados para
      esta interpretación: ∀𝑥 𝑃(𝑥), ∀𝑥∃𝑦 𝑅(𝑥, 𝑦) y ∀𝑥∀𝑦(𝑃(𝑥) → 𝑅(𝑥, 𝑦)).
     MAC Interpretaciones
```

## Ejemplo
Páginas: 6
Palabras clave: Ejemplo
Tipo: ejemplo

```text
Ejemplo
      Sea ℒ un lenguaje de primer orden, 𝑒 una constante, un símbolo funcional binario
      𝑓 y un predicado binario 𝑅. Consideremos la siguiente interpretación ℐ de ℒ:
      ▪  𝒟 = {𝑥 ∈ Σ^{∗}| Σ = {0,1}} (dominio del discurso)
      ▪  𝑒^{ℐ} = 𝜖 (la cadena vacía)
      ▪  𝑓^{ℐ}: 𝒟^{2} → 𝒟 con 𝑓^{ℐ} (𝑠_{1}, 𝑠_{2}) = 𝑠_{1}𝑠_{2} (la concatenación de las cadenas 𝑠_{1} y 𝑠_{2})
      ▪  𝑅^{ℐ} = {(𝑠_{1}, 𝑠_{2})| 𝑠_{1} es un prefijo de 𝑠_{2}} ⊆ 𝒟^{2}
      Verificamos algunas fórmulas de la lógica de predicados para esta interpretación:
      ∀𝑥 (𝑅(𝑥, 𝑓(𝑥, 𝑒)) ∧ 𝑅(𝑓(𝑥, 𝑒), 𝑥))  ,    ∃𝑦∀𝑥 𝑅(𝑦, 𝑥)      y    ∀𝑥∀𝑦∀𝑧 (𝑅(𝑥, 𝑦) →
      𝑅(𝑓(𝑥, 𝑧), 𝑓(𝑦, 𝑧))).
     MAC Interpretaciones
```

## Ejemplo
Páginas: 7
Palabras clave: Ejemplo
Tipo: ejemplo

```text
Ejemplo
      Sea ℒ un lenguaje de primer orden, 𝑖 una constante, 𝑅 un predicado unario y 𝑄 un
      predicado binario. Consideremos la siguiente interpretación ℐ de ℒ:
      ▪  𝒟 = {𝑎, 𝑏, 𝑐}
      ▪  𝑖^{ℐ} = 𝑎
      ▪  𝑅^{ℐ} = {𝑏, 𝑐}
      ▪  𝑄^{ℐ} = {(𝑎, 𝑎), (𝑎, 𝑏), (𝑎, 𝑐), (𝑏, 𝑐), (𝑐, 𝑐)} ⊆ 𝒟^{2}
      Verificamos algunas fórmulas de la lógica de predicados para esta interpretación:
      ∃𝑦 𝑄(𝑖, 𝑦), ¬𝑅(𝑖), ∀𝑥∀𝑦∀𝑧 ((𝑄(𝑥, 𝑦) ∧ 𝑄(𝑥, 𝑧)) → 𝑦 = 𝑧) y ∀𝑥∃𝑦 𝑄(𝑥, 𝑦).
     MAC Interpretaciones
```

## Fórmulas cerradas y abiertas
Páginas: 8
Palabras clave: Fórmulas cerradas y abiertas; fórmula cerrada; fórmula abierta; enunciado; variable libre
Tipo: teoría

```text
Fórmulas cerradas y abiertas
      Sea ℒ un lenguaje de primer orden y 𝜙 una fórmula de ℒ.
      Se dice que 𝜙 es una fórmula cerrada si cada variable que aparece en 𝜙 está
      ligada.
      Además, si 𝜙 no es una fórmula cerrada, se dice que es una fórmula abierta.
      Nota: A las fórmulas cerradas también se les llama enunciados.
     MAC Interpretaciones
```

## ¡Importante!
Páginas: 9
Palabras clave: ¡Importante!
Tipo: teoría

```text
¡Importante!
               Dada una interpretación, todo enunciado es verdadero o falso.
     MAC Interpretaciones
```

## ¿Preguntas?
Páginas: 10
Palabras clave: ¿Preguntas?
Tipo: teoría

```text
¿Preguntas?
     MAC Interpretaciones
```
