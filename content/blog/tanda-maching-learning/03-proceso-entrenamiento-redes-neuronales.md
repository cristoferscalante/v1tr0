---
title: "El Proceso de Entrenamiento de una Red Neuronal"
date: 2025-10-02
author: "Alvaro Efren Bolaños Scalante"
tags: ["entrenamiento", "backpropagation", "gradient-descent", "optimización"]
series: "Deep Learning desde Cero"
part: 3
---

# El Proceso de Entrenamiento de una Red Neuronal

## 🎯 Introducción

El entrenamiento de una red neuronal es un **ciclo de optimización** cuyo objetivo es ajustar los parámetros del modelo (pesos y sesgos) para minimizar su error.

Este proceso se fundamenta en **tres pilares matemáticos**:

1. 📉 **Función de Costo**
2. ⬇️ **Descenso de Gradiente**
3. 🔄 **Retropropagación**

## 1️⃣ La Función de Costo: Cuantificación del Error

La **función de costo J(w,b)** cuantifica cuán equivocadas están las predicciones del modelo.

### Analogía
Como una **balanza desequilibrada**: el objetivo es ajustarla hasta alcanzar el equilibrio (error mínimo).

### Fórmula General

```
J(w,b) = (1/m) · Σ L(y⁽ⁱ⁾, a[L]⁽ⁱ⁾)
```

**Componentes:**
- **m**: Número total de ejemplos de entrenamiento
- **L**: Función de pérdida (un ejemplo)
- **y⁽ⁱ⁾**: Etiqueta verdadera
- **a[L]⁽ⁱ⁾**: Predicción del modelo

### Error Cuadrático Medio (MSE)

```
L(y, ŷ) = (y − ŷ)²
```

```python
import numpy as np

def costo_mse(y_true, y_pred):
    m = len(y_true)
    return (1/m) * np.sum((y_true - y_pred)**2)

# Ejemplo
y_true = np.array([1, 0, 1, 1, 0])
y_pred = np.array([0.9, 0.1, 0.8, 0.7, 0.2])
print(f"Costo: {costo_mse(y_true, y_pred):.4f}")
```

**Objetivo:** Encontrar W y b que minimicen J(w,b).

## 2️⃣ Descenso del Gradiente: El Algoritmo de Optimización

El **Descenso de Gradiente Estocástico (SGD)** es el algoritmo más utilizado para minimizar la función de costo.

### 🏔️ Analogía: Descenso de una Montaña

Imagina que estás en una montaña con niebla densa. Para bajar:
1. Sientes la pendiente del terreno
2. Das un paso en la dirección más inclinada hacia abajo
3. Repites hasta llegar al valle

**Matemáticamente:** Moverse en la dirección opuesta al gradiente.

### Variante Moderna: Mini-Batch Gradient Descent

Actualiza parámetros usando un **pequeño lote** de muestras:
- Más eficiente que procesar todo el dataset
- Más estable que usar un solo ejemplo

### Pasos del Algoritmo

```python
# Pseudocódigo
def entrenar_red(X, y, epochs, learning_rate):
    # 1. Inicialización
    W, b = inicializar_parametros_aleatorios()
    
    for epoch in range(epochs):
        for batch in crear_mini_batches(X, y):
            # 2. Cálculo del gradiente
            gradientes = calcular_gradientes(batch, W, b)
            
            # 3. Actualización de parámetros
            W = W - learning_rate * gradientes['dW']
            b = b - learning_rate * gradientes['db']
    
    return W, b
```

### Ecuaciones de Actualización

```
w⁽ⁱ⁺¹⁾ = w⁽ⁱ⁾ − α · (∂J/∂w)
b⁽ⁱ⁺¹⁾ = b⁽ⁱ⁾ − α · (∂J/∂b)
```

**α** = **tasa de aprendizaje** (learning rate)
- Muy pequeña → Convergencia lenta
- Muy grande → Puede no converger

```python
# Ejemplo de actualización
W_nuevo = W_actual - 0.01 * gradiente_W
b_nuevo = b_actual - 0.01 * gradiente_b
```

## 3️⃣ Retropropagación: Cálculo Eficiente de Gradientes

La **backpropagation** calcula los gradientes aplicando la **regla de la cadena** del cálculo diferencial.

### Concepto Clave: El Error δ[l]

```
δ[l] = (∂J/∂a[l]) ⊙ σ'(z[l])
```

- **⊙**: Producto de Hadamard (elemento a elemento)
- **σ'(z[l])**: Derivada de la función de activación

### Algoritmo de Backpropagation

```python
def backpropagation(X, y, cache):
    m = X.shape[1]
    L = len(cache)  # Número de capas
    
    # 1. Calcular error en la capa de salida
    delta_L = cache['A_L'] - y
    
    # 2. Propagar hacia atrás
    gradientes = {}
    for l in reversed(range(1, L+1)):
        # Gradientes de pesos y sesgos
        gradientes[f'dW{l}'] = (1/m) * np.dot(delta, cache[f'A{l-1}'].T)
        gradientes[f'db{l}'] = (1/m) * np.sum(delta, axis=1, keepdims=True)
        
        # Error de la capa anterior
        if l > 1:
            delta = np.dot(cache[f'W{l}'].T, delta) * sigmoid_derivative(cache[f'Z{l-1}'])
    
    return gradientes
```

### Derivada de la Sigmoide

```python
def sigmoid_derivative(z):
    s = sigmoid(z)
    return s * (1 - s)
```

### Propagación hacia Atrás - Paso a Paso

```
Capa de Salida (L) ─────────────────┐
         ↑                           │
         │ Calcular δ[L]             │
         │                           │
Capa Oculta 2 ──────────────────────┤
         ↑                           │
         │ δ[L-1] = W[L]ᵀ·δ[L] ⊙ σ' │ Backprop
         │                           │
Capa Oculta 1 ──────────────────────┤
         ↑                           │
         │ δ[L-2] = W[L-1]ᵀ·δ[L-1]  │
         │                           │
Capa de Entrada ────────────────────┘
```

### Cálculo de Gradientes Finales

**Para los pesos:**
```
∂J/∂W[l] = δ[l] · a[l−1]ᵀ
```

**Para los sesgos:**
```
∂J/∂b[l] = δ[l]
```

## 🔄 El Ciclo Completo de Aprendizaje

```python
def ciclo_entrenamiento(X, y, arquitectura, epochs, alpha):
    # Inicializar parámetros
    parametros = inicializar_red(arquitectura)
    
    for epoch in range(epochs):
        # 1. FORWARD PROPAGATION
        cache = forward_propagation(X, parametros)
        
        # 2. CALCULAR COSTO
        costo = calcular_costo(cache['A_L'], y)
        
        # 3. BACKWARD PROPAGATION
        gradientes = backpropagation(X, y, cache)
        
        # 4. ACTUALIZAR PARÁMETROS
        parametros = actualizar_parametros(parametros, gradientes, alpha)
        
        if epoch % 100 == 0:
            print(f"Epoch {epoch}: Costo = {costo:.4f}")
    
    return parametros
```

## 📊 Visualización del Proceso

```
┌─────────────────────────────────────────────────────┐
│                 CICLO DE ENTRENAMIENTO              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. Forward Pass                                    │
│     X → Z1 → A1 → Z2 → A2 → ... → Ŷ                │
│                                                     │
│  2. Calcular Pérdida                               │
│     L = (Y - Ŷ)²                                    │
│                                                     │
│  3. Backward Pass                                   │
│     ∂L/∂Ŷ → ∂L/∂W[L] → ... → ∂L/∂W[1]              │
│                                                     │
│  4. Actualizar Parámetros                          │
│     W = W - α·∂L/∂W                                 │
│                                                     │
│  5. Repetir hasta convergencia                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## 💡 Consejos Prácticos

### Elegir la Tasa de Aprendizaje

```python
# Prueba diferentes valores
learning_rates = [0.001, 0.01, 0.1, 1.0]

for lr in learning_rates:
    modelo = entrenar(X, y, learning_rate=lr)
    print(f"LR={lr}: Costo Final={modelo.costo:.4f}")
```

### Monitorear el Entrenamiento

```python
import matplotlib.pyplot as plt

def plot_training(historial_costos):
    plt.plot(historial_costos)
    plt.xlabel('Época')
    plt.ylabel('Costo')
    plt.title('Evolución del Costo durante el Entrenamiento')
    plt.show()
```

---

## 📚 Referencias

- Goodfellow, I., Bengio, Y., & Courville, A. (2016). *Deep learning*. MIT Press.
- Mazur, M. (2015). A Step by Step Backpropagation Example.
- Ng, A. (2017). Neural Networks and Deep Learning. Coursera.

---

**Anterior:** [← Blog 2: Fundamentos del Deep Learning](02-fundamentos-deep-learning-redes-neuronales.md)

**Próximo:** [Blog 4: Aplicación Práctica con Keras →](04-aplicacion-practica-keras.md)