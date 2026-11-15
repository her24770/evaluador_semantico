# Epílogo de la lógica de predicados

Fuente: tema-12

## Epílogo de la lógica
Páginas: 1
Palabras clave: Epílogo de la lógica
Tipo: teoría

```text
Epílogo de la lógica
   de predicados
     MM3032 Lógica Matemática
     MAC Epílogo de la lógica de predicados
```

## Objetivos
Páginas: 2
Palabras clave: Objetivos
Tipo: teoría

```text
Objetivos
     MAC Epílogo de la lógica de predicados
```

## Metateorema (de validez)
Páginas: 3
Palabras clave: Metateorema (de validez); corrección de primer orden; validez
Tipo: teoría

```text
Metateorema (de validez)
      Sea ℒ el lenguaje de primer orden de la lógica de predicados, Γ un conjunto de
      fórmulas y 𝜓 una fórmula de ℒ.
      Si Γ ⊢ 𝜓, entonces Γ ⊨ 𝜓 en cada interpretación en el que todas las fórmulas de
      Γ sean verdaderas.
     MAC Epílogo de la lógica de predicados
```

## Metateorema (de completitud)
Páginas: 4
Palabras clave: Metateorema (de completitud); completitud de primer orden; Gödel
Tipo: teoría

```text
Metateorema (de completitud)
      Sea ℒ el lenguaje de primer orden de la lógica de predicados, Γ un conjunto de
      fórmulas y 𝜓 una fórmula de ℒ.
      Si  Γ ⊨ 𝜓  en  cada  interpretación  en  el  que  todas  las  fórmulas  de  Γ  sean
      verdaderas, entonces Γ ⊢ 𝜓.
      Nota: Este teorema lo demostró Kurt Gödel en 1929.
     MAC Epílogo de la lógica de predicados
```

## Lógica de predicados Teorema de
Páginas: 5
Palabras clave: Lógica de predicados Teorema de
Tipo: teoría

```text
Lógica de predicados                    Teorema de
                               (semántica)                          Validez
                       Γ ⊨ 𝜓
                                                            Lógica de predicados
                                                            (sintaxis)
                              Teorema de
                               Completud                                Γ ⊢ 𝜓
     MAC Epílogo de la lógica de predicados
```

## Metateorema (de consistencia)
Páginas: 6
Palabras clave: Metateorema (de consistencia)
Tipo: teoría

```text
Metateorema (de consistencia)
      El sistema formal de la lógica de predicados es consistente.
     MAC Epílogo de la lógica de predicados
```

## Metateorema (de indecidibilidad)
Páginas: 7
Palabras clave: Metateorema (de indecidibilidad); indecidibilidad; validez de predicados; Church Turing
Tipo: teoría

```text
Metateorema (de indecidibilidad)
      El sistema formal de la lógica de predicados es indecidible, es decir, no existe un
      algoritmo que determine si una fórmula arbitraria es válida.
      Nota: Este resultado se conoce como el teorema Church-Turing.
     MAC Epílogo de la lógica de predicados
```

## Halting problem
Páginas: 8
Palabras clave: Halting problem; problema de parada; halting problem; detención
Tipo: teoría

```text
Halting problem
       ¿Existe un programa universal capaz de analizar cualquier otro programa junto
       con su entrada y determinar si este terminará de ejecutarse o si se quedará
       atrapado en un bucle infinito?
     MAC Epílogo de la lógica de predicados
```

## Supongamos que existe un programa 𝐻 que,
Páginas: 9
Palabras clave: Supongamos que existe un programa 𝐻 que,
Tipo: teoría

```text
Supongamos que existe un programa 𝐻 que,
       para cualquier programa 𝑃 y cualquier entrada              def P(n):
       𝐼, siempre responde correctamente si 𝑃 se                 while n != 0:
                                                                    n = n - 1
       detendrá o se ejecutará indefinidamente.                        return "done"
       𝑯 nunca miente, nunca se atasca y siempre
       da una respuesta.                                         def Q(s):
                                                                while True:
                                                                    print(s)
         def H(P, I):
                  ...
                  return “HALTS” or “LOOPS”
                                                           ¿Qué devuelven P(5) y P(-1)?
                                                           ¿Qué devuelve Q(“Turing”)?
     MAC Epílogo de la lógica de predicados
```

## Como 𝐻 es un programa, podemos llamarlo
Páginas: 10
Palabras clave: Como 𝐻 es un programa, podemos llamarlo
Tipo: teoría

```text
Como 𝐻 es un programa, podemos llamarlo
       desde otro programa.                                 def D(X):
                                                                result = H(X, X)
                                                                if result == "HALTS":
       Definimos un programa 𝐷 que tome cualquier                 while True:
       programa 𝑋, le pregunte a 𝐻 si 𝑋 se detiene                    pass
       cuando se le da como entrada el propio código             else:
       de 𝑋, y luego haga lo contrario.                                return "done"
       Si 𝐻 responde HALTS, 𝐷 entra
       deliberadamente en un bucle infinito. Si 𝐻
       responde LOOPS, 𝐷 se detiene de inmediato.
     MAC Epílogo de la lógica de predicados
```

## Ahora le damos a 𝐷 su propio código como
Páginas: 11
Palabras clave: Ahora le damos a 𝐷 su propio código como
Tipo: teoría

```text
Ahora le damos a 𝐷 su propio código como
      entrada. Es decir, consideramos 𝐷(𝐷).               Si 𝐻(𝐷, 𝐷) devuelve HALTS, 𝐷(𝐷) entra en un
                                                            bucle infinito.
      ¿Qué hace 𝐷(𝐷)?                                Pero 𝐻 dijo que se detendría. Contradicción.
      Por definición, 𝐷 primero pregunta a 𝐻(𝐷, 𝐷).
      Es decir: “¿Se detendrá el programa 𝐷 cuando       Si 𝐻(𝐷, 𝐷) devuelve LOOPS, 𝐷(𝐷) se detiene.
       se le proporcione su propio código 𝐷 como         Pero 𝐻 dijo que no se detendría. Contradicción.
       entrada?”
       Dado  que  supusimos  que  𝐻  es perfecto,
      𝐻(𝐷, 𝐷)  debe dar una de dos respuestas:       Nota: Alan Turing propuso este argumento
       HALTS o LOOPS. Veamos ambas posibilidades.        en 1936.
     MAC Epílogo de la lógica de predicados
```

## ¡Importante!
Páginas: 12
Palabras clave: ¡Importante!
Tipo: teoría

```text
¡Importante!
               Ningún programa puede determinar correctamente, para cada
                 programa y cada entrada, si ese programa se detendrá o se
                                ejecutará indefinidamente.
     MAC Epílogo de la lógica de predicados
```

## Post correspondence problem -
Páginas: 13
Palabras clave: Post correspondence problem -; problema de correspondencia de Post; PCP
Tipo: teoría

```text
Post correspondence problem -
   PCP
       El PCP es un problema de decisión formal en la teoría de la computabilidad y
       la complejidad, propuesto por el matemático Emil Post en 1946.
     MAC Epílogo de la lógica de predicados
```

## Supongamos que se tiene un conjunto finito de
Páginas: 14
Palabras clave: Supongamos que se tiene un conjunto finito de
Tipo: teoría

```text
Supongamos que se tiene un conjunto finito de
       pares   de   cadenas   (llamados   dominós)              Los siguientes son ejemplos de
       construidos sobre un alfabeto.                             dominós:
       Cada dominó tiene una palabra en la parte                       𝑎𝑏      𝑎
       superior y otra en la parte inferior.
                                                            𝑎       𝑏𝑎
       El  objetivo  es  encontrar  una  secuencia
       dominós (se pueden repetir) de modo que la              Una solución sería, por ejemplo:
       concatenación de las cadenas de arriba sea
       exactamente igual a la concatenación de las
       cadenas de abajo.                                                     𝑎𝑏   𝑎
                                                            𝑎    𝑏𝑎
     MAC Epílogo de la lógica de predicados
```

## Instancia y solución de PCP
Páginas: 15
Palabras clave: Instancia y solución de PCP; instancia PCP; solución PCP; dominós
Tipo: teoría

```text
Instancia y solución de PCP
      Sea Σ un alfabeto no vacío.
      Una instancia de PCP es una secuencia finita de cadenas:
                         (𝑠_{1}, 𝑡_{1}), (𝑠_{2}, 𝑡_{2}), … , (𝑠_{𝑘}, 𝑡_{𝑘}) donde 𝑠_{𝑖}, 𝑡_{𝑖} ∈ Σ^{∗}
      Una solución de dicha instancia es una secuencia finita de índices 𝑖_{1}, 𝑖_{2}, … , 𝑖_{𝑛} con
      𝑛 ≥ 1 tal que la concatenación de 𝑠_{𝑖}1𝑠_{𝑖}2 … 𝑠_{𝑖}𝑛 sea igual a 𝑡_{𝑖}1𝑡_{𝑖}2 … 𝑡_{𝑖}𝑛.
     MAC Epílogo de la lógica de predicados
```

## Ejemplo
Páginas: 16
Palabras clave: Ejemplo
Tipo: ejemplo

```text
Ejemplo
      En el primer ejemplo, Σ = {𝑎, 𝑏} y 𝐶 = {(𝑎𝑏, 𝑎), (𝑎, 𝑏𝑎)} es una instancia de PCP.
      Tenemos 𝑠_{1} ≝ 𝑎𝑏, 𝑠_{2} ≝ 𝑎, 𝑡_{1} ≝ 𝑎 y 𝑡_{2} ≝ 𝑏𝑎
      La solución que vimos es la secuencia de índices 1, 2 ya que:
                         𝑠_{1}𝑠_{2} es la cadena 𝑎𝑏𝑎 que es igual a 𝑡_{1}𝑡_{2}
     MAC Epílogo de la lógica de predicados
```

## Ejercicio 1
Páginas: 17
Palabras clave: Ejercicio 1
Tipo: ejercicio

```text
Ejercicio 1
       ¡Importante! Este ejercicio deberá entregarse resuelto en Canvas al finalizar la sesión de clase.
      Sea Σ = {0, 1} y 𝐶 = {(011, 1), (1, 110)} una instancia de PCP.
      Encontrar una solución para dicha instancia.
     MAC Epílogo de la lógica de predicados
```

## Ejercicio 2
Páginas: 18
Palabras clave: Ejercicio 2
Tipo: ejercicio

```text
Ejercicio 2
       ¡Importante! Este ejercicio deberá entregarse resuelto en Canvas al finalizar la sesión de clase.
      Sea Σ = {0, 1} y 𝐶 = {(0, 01), (1, 0)} una instancia de PCP.
      Argumentar por qué no existe una solución para dicha instancia.
     MAC Epílogo de la lógica de predicados
```

## ¿Existe un algoritmo general que, para cada instancia, determine
Páginas: 19
Palabras clave: ¿Existe un algoritmo general que, para cada instancia, determine
Tipo: teoría

```text
¿Existe un algoritmo general que, para cada instancia, determine
                         correctamente si hay o no una solución?
     MAC Epílogo de la lógica de predicados
```

## Máquina de Turing
Páginas: 20
Palabras clave: Máquina de Turing; máquina de Turing; computación
Tipo: teoría

```text
Máquina de Turing
       Un dispositivo teórico y abstracto ideado por el matemático inglés Alan Turing
       en 1936 para modelar la computación y definir formalmente el concepto de
       algoritmo.
     MAC Epílogo de la lógica de predicados
```

## Supongamos una cinta de papel cuadriculado
Páginas: 21
Palabras clave: Supongamos una cinta de papel cuadriculado
Tipo: teoría

```text
Supongamos una cinta de papel cuadriculado
       infinitamente larga.
       La cinta está dividida en pequeñas celdas y
       cada celda contiene exactamente un símbolo
       de un alfabeto.                                          …   ⊔   1    1    0   ⊔   1    …
       Uno de los posibles símbolos es el símbolo
       “blank”; lo escribiremos como ␣.                                   #␣1 1 0␣1 #
                                                            Representación de la cinta
       La cinta es la memoria y el espacio de trabajo               # indica la parte que nos interesa
       de la máquina. Puede contener la entrada, los            (puede omitirse si no hay ambigüedad)
       cálculos intermedios y, finalmente, la salida.
     MAC Epílogo de la lógica de predicados
```

## La máquina de Turing tiene un cabezal que se
Páginas: 22
Palabras clave: La máquina de Turing tiene un cabezal que se
Tipo: teoría

```text
La máquina de Turing tiene un cabezal que se
       encuentra en exactamente una celda de la
       cinta en todo momento.
       Puede leer el símbolo que se encuentra en la
       celda en la que está actualmente.
                                                            …   ⊔    1    1    0    ⊔    1    …
       Puede  escribir  un  símbolo  en  esa  celda,
       reemplazando lo que había allí.
       Luego puede moverse una celda hacia la
       izquierda o una celda hacia la derecha.
     MAC Epílogo de la lógica de predicados
```

## La máquina de Turing también cuenta con un
Páginas: 23
Palabras clave: La máquina de Turing también cuenta con un
Tipo: teoría

```text
La máquina de Turing también cuenta con un
       conjunto finito de estados internos.
       En  cualquier  momento,  la  máquina  se                         𝑞_{0}
       encuentra exactamente en un solo estado.
                                                            …   ⊔    𝑎    𝑏    𝑐    ⊔    𝑎    …
       Hay un estado especial: el estado inicial,
       desde  donde  comienza  la  máquina.  Otro
       estado especial suele ser el estado final (o                     𝑎 𝑞_{0} 𝑏 𝑐␣𝑎
       aceptación/rechazo).                                                𝑞_{0}𝑏 significa
                                                            “Estoy en el estado 𝑞_{0} y el cabezal está en 𝑏”
       Los estados se suelen representar como 𝑞_{𝑖},
       donde 𝑖 es un símbolo que indica el estado.
     MAC Epílogo de la lógica de predicados
```

## El comportamiento de una máquina de Turing 𝑞_{𝐴}
Páginas: 24
Palabras clave: El comportamiento de una máquina de Turing 𝑞_{𝐴}
Tipo: teoría

```text
El comportamiento de una máquina de Turing                         𝑞_{𝐴}
       está controlado por su programa.
                                                            …   ⊔    0    1    0    ⊔    1    …
       Este consiste en una tabla de reglas.
       Cada regla tiene 5 elementos:                                      0 𝑞_{𝐴} 1 0␣1
       1. Estado actual
       2. Símbolo leído de la cinta
                                                            𝑞_{𝐵}
       3. Símbolo que debe escribir
       4. Dirección de movimiento                              …                               …
       5. Estado siguiente                                          ⊔   0    0    0   ⊔   1
        Una regla puede verse así:                                                 0 0 𝑞_{𝐵} 0␣1
        “Si estoy en el estado 𝐴 y la celda debajo del cabezal
        contiene el símbolo 1, entonces escribir 0, mover hacia
        la derecha y pasar al estado 𝐵.”
     MAC Epílogo de la lógica de predicados
```

## Ejemplo 3
Páginas: 25
Palabras clave: Ejemplo 3
Tipo: ejemplo

```text
Ejemplo 3
      Consideremos la siguiente máquina de Turing.
       Estado: 𝑞_{0} (inicial).
       Reglas:
       1.  Si se lee 1: escribir 0, mover a la derecha y permanecer en 𝑞_{0}.
       2.  Si se lee 0: escribir 1, mover a la derecha y permanecer en 𝑞_{0}.
       3.  Si se lee blank: detener.
      Supongamos que inicialmente la cinta es 𝑞_{0} 1 0 1 1.
      Mostrar la cinta en cada paso de la computación de la máquina de Turing.
     MAC Epílogo de la lógica de predicados
```

## Ejemplo 3
Páginas: 26
Palabras clave: Ejemplo 3
Tipo: ejemplo

```text
Ejemplo 3
      Solución: Inicialmente la cinta es 𝑞_{0} 1 0 1 1.
      Paso 1: 0 𝑞_{0} 0 1 1
      Paso 2: 0 1 𝑞_{0} 1 1
      Paso 3: 0 1 0 𝑞_{0} 1
      Paso 4: 0 1 0 0 𝑞_{0}
      Paso 5: 0 1 0 0 𝑞_{0}; HALT
     MAC Epílogo de la lógica de predicados
```

## En cualquier momento, la situación de la
Páginas: 27
Palabras clave: En cualquier momento, la situación de la
Tipo: teoría

```text
En  cualquier  momento, la  situación de la
       máquina puede resumirse mediante: el estado                Una computación completa
       interno actual, lo que está escrito en la cinta y                no es más que la secuencia
       la posición del cabezal.                                       de estos pasos, uno tras
                                                            otro, hasta que la máquina
       La máquina analiza su estado actual y el                se detiene —lo que significa
       símbolo que se encuentra debajo del cabezal.                  que  llega  a  un  estado
                                                            especial de detención o que
                                                            no hay ninguna regla que se
       Encuentra la regla correspondiente.                           aplique—.
       La regla le indica: qué escribir, en qué dirección                Si nunca se detiene, la
       moverse y a qué estado pasar a continuación.                  computación se ejecuta
                                                            indefinidamente.
       Luego repite el proceso.
     MAC Epílogo de la lógica de predicados
```

## Ejercicio 4
Páginas: 28
Palabras clave: Ejercicio 4
Tipo: ejercicio

```text
Ejercicio 4
       ¡Importante! Este ejercicio deberá entregarse resuelto en Canvas al finalizar la sesión de clase.
      Consideremos la siguiente máquina de Turing.
       Estados: 𝑞_{0} (inicial), 𝑞_{𝐴} (aceptación) y 𝑞_{𝑅} (rechazo).
       Reglas:
       1.  Si se lee 0, mover hacia la derecha y permanecer en 𝑞_{0}.
       2.  Si se lee 1, avanzar a 𝑞_{𝐴}.
       3.  Si se lee blank, avanzar a 𝑞_{𝑅}.
      Supongamos que inicialmente la cinta es 𝑞_{0} 0 0 1 0.
      Mostrar la cinta en cada paso de la computación de la máquina de Turing.  ¿Cuál es el
      estado final de la máquina?
     MAC Epílogo de la lógica de predicados
```

## Una computación de una máquina de Turing
Páginas: 29
Palabras clave: Una computación de una máquina de Turing
Tipo: teoría

```text
Una computación de una máquina de Turing
       puede expresarse como una secuencia de                Una máquina de Turing con
       instantáneas o snapshots:                                    entrada 𝑤 se detiene cuando
                       #𝐶_{0}#𝐶_{1}#𝐶_{2}#…                                existe un historial de cómputo
       donde cada par 𝐶_{𝑖} → 𝐶_{𝑖+}1 debe ser un paso                válido y finito que comienza
       válido de la máquina.                                         con el snapshot 𝑞_{0}𝑤 y termina
                                                            en un estado de HALT.
       Por ejemplo, la cadena:
                   #𝑞_{0}𝑎 𝑏#𝑎 𝑞_{1} 𝑏#𝑎 𝑐 𝑞_{1}#
       es un historial de cómputo; registra el proceso
       de la máquina paso a paso.
     MAC Epílogo de la lógica de predicados
```

## Ejemplo
Páginas: 30
Palabras clave: Ejemplo
Tipo: ejemplo

```text
Ejemplo
      Consideremos la máquina de Turing del Ejercicio 4.
      La computación de la máquina fue:
                        𝑞_{0} 0 0 1 0, 0 𝑞_{0} 0 1 0, 0 0 𝑞_{0} 1 0 y 0 0 𝑞_{𝐴} 1 0
      El historial de cómputo es #𝑞_{0} 0 0 1 0#0 𝑞_{0} 0 1 0#0 0 𝑞_{0} 1 0#0 0 𝑞_{𝐴} 1 0.
     MAC Epílogo de la lógica de predicados
```

## Observación
Páginas: 31
Palabras clave: Observación
Tipo: teoría

```text
Observación
      Ahora  vamos  a  definir  una  instancia  PCP  cuya  solución  será  el  historial  de
      cómputo #𝑞_{0} 0 0 1 0#0 𝑞_{0} 0 1 0#0 0 𝑞_{0} 1 0#0 0 𝑞_{𝐴} 1 0.
      Dominó inicial: 𝑐_{1} ≝ (#, #𝑞_{0} 0 0 1 0 #)
      Dominós de copia: 𝑐_{2} ≝ (0, 0), 𝑐_{3} ≝ (1, 1), 𝑐_{4} ≝ (␣, ␣) y 𝑐_{5} ≝ (#, #)
      Dominós de transición: 𝑐_{6} ≝ (𝑞_{0}0, 0𝑞_{0}), 𝑐_{7} ≝ (𝑞_{0}1, 𝑞_{𝐴}1) y 𝑐_{8} ≝ (𝑞_{0}␣, 𝑞_{𝑅}␣)
      Dominó final: 𝑐_{9} ≝ (00𝑞_{𝐴}1#, 𝜖)
      Entonces, la secuencia 1,6,2,3,2,2,5,2,6,3,2,2,5,2,2,7,2,2,5,9 es una solución de
      esta instancia de PCP.
     MAC Epílogo de la lógica de predicados
```

## Ejercicio 5
Páginas: 32
Palabras clave: Ejercicio 5
Tipo: ejercicio

```text
Ejercicio 5
       ¡Importante! Este ejercicio deberá entregarse resuelto en Canvas al finalizar la sesión de clase.
      Consideremos la máquina de Turing del Ejercicio 3.
      Supongamos que inicialmente la cinta es 𝑞_{0} 0 1 0.
      a.  Encontrar una instancia de PCP que corresponda a la computación de la
         máquina.
      b.  Encontrar una solución de esta instancia de PCP.
     MAC Epílogo de la lógica de predicados
```

## Es equivalente a:
Páginas: 33
Palabras clave: Es equivalente a:
Tipo: teoría

```text
Es equivalente a:
                        La pregunta:                                      ¿Existe un programa capaz de
              ¿Existe un algoritmo general capaz                          analizar cualquier otro programa y
             de determinar si cualquier instancia                           determinar si este terminará de
                 de PCP tiene o no solución?                            ejecutarse o si se quedará atrapado
                                                            en un bucle infinito?
               La existencia del algoritmo que determina si cualquier instancia de PCP tiene o no solución,
               implicaría  la  existencia  de  un  programa  capaz  de  analizar  cualquier  otro  programa  y
               determinar si terminará o no de ejecutarse.
               Pero este último es precisamente el halting problem, el cual sabemos que no tiene solución.
               Entonces, la existencia del algoritmo que determina si cualquier instancia de PCP tiene o no
               solución implicaría una contradicción.
               Por tanto, el PCP es indecidible.
     MAC Epílogo de la lógica de predicados
```

## ¡Importante!
Páginas: 34
Palabras clave: ¡Importante!
Tipo: teoría

```text
¡Importante!
              No existe un algoritmo general capaz de determinar si cualquier
                           instancia de PCP tiene o no solución
     MAC Epílogo de la lógica de predicados
```

## Metateorema (de indecidibilidad)
Páginas: 35
Palabras clave: Metateorema (de indecidibilidad)
Tipo: teoría

```text
Metateorema (de indecidibilidad)
      Prueba: Sea Σ un alfabeto y 𝐶 = {(𝑠_{1}, 𝑡_{1}), … , (𝑠_{𝑘}, 𝑡_{𝑘})} ⊆ Σ^{∗}2 una instancia de PCP.
      Vamos a construir una fórmula 𝜙 tal que ⊨ 𝜙 si y solo si la instancia 𝐶 tiene una
      solución.
      El lenguaje 𝓛 y su interpretación 𝓘
      ▪ 𝒟 ≝ Σ^{∗}
      ▪ 𝑒^{ℐ} ≝ 𝜖 (la cadena vacía)
      ▪ 𝑓𝑦^{ℐ}: 𝒟 → 𝒟 con 𝑓𝑦^{ℐ} (𝑥) = 𝑥𝑦 (la concatenación de 𝑥 con 𝑦)
      ▪  𝑃^{ℐ} ≝ {(𝑠, 𝑡)|existen índices 𝑖_{1}, 𝑖_{2}, … , 𝑖_{𝑚} tales que 𝑠 es 𝑠_{𝑖1}𝑠_{𝑖2} … 𝑠_{𝑖𝑚} y 𝑡 es 𝑡_{𝑖}1𝑡_{𝑖}2 … 𝑡_{𝑖}𝑚} ⊆ 𝒟^{2}
         (los posibles pares de cadenas que se pueden formar con los dominós en 𝐶)
     MAC Epílogo de la lógica de predicados
```

## Metateorema (de indecidibilidad)
Páginas: 36
Palabras clave: Metateorema (de indecidibilidad)
Tipo: teoría

```text
Metateorema (de indecidibilidad)
      La codificación de PCP en lenguaje de lógica de predicados
      Se define la fórmula:
                                                      𝑘
                                𝜙_{1} ≝ ⋀ 𝑃 (𝑓𝑠_{𝑖} (𝑒), 𝑓𝑡_{𝑖} (𝑒))
                                                     𝑖=1
      que expresa que para cada dominó 𝑖, de 1 a 𝑘, la cadena superior del dominó 𝑖,
      emparejada con la cadena inferior del dominó 𝑖, está en la relación 𝑃, es decir, se
      puede iniciar una secuencia con cualquier ficha de dominó.
     MAC Epílogo de la lógica de predicados
```

## Metateorema (de indecidibilidad)
Páginas: 37
Palabras clave: Metateorema (de indecidibilidad)
Tipo: teoría

```text
Metateorema (de indecidibilidad)
      Luego, se define la fórmula:
                                                            𝑘
                      𝜙_{2} ≝ ∀𝑣∀𝑤 (𝑃(𝑢, 𝑤) → ⋀ 𝑃 (𝑓𝑠_{𝑖} (𝑣), 𝑓𝑡_{𝑖} (𝑤)))
                                                            𝑖=1
      que expresa que para cualquier par de cadenas 𝑣 y 𝑤, si 𝑣 y 𝑤 forman un par
      válido, entonces, para cualquier dominó 𝑖, concatenamos la parte superior del
      dominó 𝑖 a 𝑣 y la parte inferior del dominó 𝑖 a 𝑤, el nuevo par también está en la
      relación 𝑃, es decir, 𝑃 es un conjunto cerrado respecto a la adición de dominós.
     MAC Epílogo de la lógica de predicados
```

## Metateorema (de indecidibilidad)
Páginas: 38
Palabras clave: Metateorema (de indecidibilidad)
Tipo: teoría

```text
Metateorema (de indecidibilidad)
      Finalmente, se define la fórmula:
                                     𝜙_{3} ≝ ∃𝑧 𝑃(𝑧, 𝑧)
      que expresa que existe alguna cadena 𝑧 tal que el par (𝑧, 𝑧) está en la relación 𝑃,
      es decir, precisamente la definición de una solución de PCP: una secuencia en la
      que la cadena superior es igual a la cadena inferior.
      Ahora procedemos a construir la fórmula 𝜙 ≝ (𝜙_{1} ∧ 𝜙_{2}) → 𝜙_{3} que expresa que si
      se puede iniciar una secuencia con cualquier ficha de dominó y 𝑃 es un conjunto
      cerrado respecto a la adición de dominós (𝜙_{2}), entonces 𝑃 debe contener un par
      coincidente (𝜙_{3}).
     MAC Epílogo de la lógica de predicados
```

## Metateorema (de indecidibilidad)
Páginas: 39
Palabras clave: Metateorema (de indecidibilidad)
Tipo: teoría

```text
Metateorema (de indecidibilidad)
      Notemos que preguntar si ⊨ 𝜙 equivale a preguntar si la instancia 𝐶 del PCP tiene
      solución.
      Supongamos, por absurdo, que el problema ⊨ 𝜙 es decidible. Entonces, existe un
      algoritmo capaz de determinar la validez de 𝜙. Si el algoritmo dice “válida”, la
      instancia 𝐶 del PCP tiene solución. Si dice “no válida”, la instancia 𝐶 del PCP no
      tiene solución. Pero el PCP es indecidible, lo que implica que la validez de 𝜙
      también es indecidible.
      En conclusión, el problema ⊨ 𝜙 es decidible, i.e., la lógica de predicados es
      indecidible. ∎
     MAC Epílogo de la lógica de predicados
```

## ¡Importante!
Páginas: 40
Palabras clave: ¡Importante!
Tipo: teoría

```text
¡Importante!
              No existe un algoritmo general capaz de determinar si cualquier
                    fórmula 𝜙 de la lógica de predicados es o no válida
     MAC Epílogo de la lógica de predicados
```

## ¿Preguntas?
Páginas: 41
Palabras clave: ¿Preguntas?
Tipo: teoría

```text
¿Preguntas?
     MAC Epílogo de la lógica de predicados
```
