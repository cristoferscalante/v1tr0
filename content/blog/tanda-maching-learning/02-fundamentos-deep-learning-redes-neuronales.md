---
title: "Fundamentos del Deep Learning y las Redes Neuronales"
date: 2025-10-02
author: "Alvaro Efren Bolaños Scalante"
tags: ["deep-learning", "redes-neuronales", "matemáticas", "neurona-artificial"]
series: "Deep Learning desde Cero"
part: 2
---

# Fundamentos del Deep Learning y las Redes Neuronales

## ¿Qué es Deep Learning?

El **Aprendizaje Profundo** o **Deep Learning** es una subdisciplina del aprendizaje automático que se distingue por el uso de algoritmos basados en **redes neuronales profundas**. Estas redes replican, de manera conceptual, la interconexión de las neuronas biológicas en el cerebro humano.

Como señala Verónica Hernández (BBVA AI Factory):

> "El 'deep learning' se centra en crear algoritmos que pueden aprender a través de redes neuronales profundas"

Las redes neuronales profundas crean una jerarquía de conceptos donde las representaciones más abstractas se construyen a partir de otras más simples.

## Estructura de una Red Neuronal Artificial

Una **red neuronal artificial** es un modelo computacional compuesto por nodos interconectados, denominados "neuronas", que trabajan en conjunto para procesar y analizar datos.

**Matemáticamente:** Una red neuronal transforma un vector de entradas en un vector de salidas mediante operaciones matemáticas organizadas en capas.

## Componentes Matemáticos de una Neurona

### 1. Características de entrada (X)

Vector de entrada: **X ∈ ℝⁿ**

```python
# Ejemplo: imagen de 28x28 píxeles
X = [0.2, 0.8, 0.3, ..., 0.9]  # 784 valores
```

### 2. Pesos (W)

Matriz que pondera la importancia de cada conexión.

```python
W = [[0.5, -0.3, 0.8],
     [0.2, 0.7, -0.1],
     ...]
```

### 3. Sesgos (b)

Parámetro escalar que proporciona flexibilidad al modelo.

```python
b = 0.5
```

## La Función de Activación Sigmoide

La operación central de una neurona involucra una **función de activación no lineal**.

### Función Sigmoide σ(z)

**Fórmula:**
```
σ(z) = 1 / (1 + e⁻ᶻ)
```

**Comportamiento:**
- Entrada grande y positiva → salida ≈ 1 (neurona activa)
- Entrada grande y negativa → salida ≈ 0 (neurona inactiva)
- Rango de salida: [0, 1]

```python
import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

# Ejemplo
z = np.array([-2, 0, 2])
print(sigmoid(z))  # [0.119, 0.5, 0.881]
```

### Ajuste con Parámetros

En la expresión **σ(3(z−5))**:
- Factor **3**: Intensifica la pendiente (transición más abrupta)
- Desplazamiento **-5**: Mueve el punto de transición hacia la derecha

## Redes Multicapa

En una red multicapa, las neuronas se organizan en capas sucesivas:

```
Capa Entrada → Capa Oculta 1 → Capa Oculta 2 → Capa Salida
```

### Fórmula de Activación

```
aᵢ[ˡ] = σ(Σ(wᵢⱼ[ˡ] · aⱼ[ˡ⁻¹]) + bᵢ[ˡ])
```

**Donde:**
- **aⱼ[ˡ⁻¹]**: Activación de la neurona j de la capa anterior
- **wᵢⱼ[ˡ]**: Peso de conexión
- **bᵢ[ˡ]**: Sesgo de la neurona i

```python
# Ejemplo conceptual
def calcular_activacion(a_anterior, W, b):
    z = np.dot(W, a_anterior) + b
    return sigmoid(z)
```

## El Proceso de Aprendizaje

Para que la red "aprenda", necesitamos:

1. **Mecanismo para medir** predicciones → **Función de Costo**
2. **Método para ajustar** parámetros → **Descenso de Gradiente**
3. **Algoritmo para calcular** gradientes → **Retropropagación**

Estos conceptos se explorarán en detalle en el próximo blog.

## Ventajas del Deep Learning

- 📈 **Escalabilidad**: Mejora con más datos
- 🔄 **Aprendizaje automático de características**: No requiere ingeniería manual
- 🎨 **Versatilidad**: Aplica a imágenes, texto, audio, video
- 🚀 **Estado del arte**: Mejores resultados en muchas tareas

## Arquitectura Visual

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Capa      │────▶│   Capas     │────▶│   Capa      │
│   Entrada   │     │   Ocultas   │     │   Salida    │
│  (784)      │     │  (128, 64)  │     │    (10)     │
└─────────────┘     └─────────────┘     └─────────────┘
     ▲                     │                    │
     │                     ▼                    ▼
  Imagen              Extracción          Clasificación
  28x28               de Features         (0-9)
```

---

## Referencias

- Goodfellow, I., Bengio, Y., & Courville, A. (2016). *Deep learning*. MIT Press.
- IBM. (s.f.). ¿Qué es Deep learning? https://www.ibm.com/es-es/topics/deep-learning
- Higham, C. F., & Higham, D. J. (2019). Deep learning: An introduction for applied mathematicians.

---

**Anterior:** [← Blog 1: Introducción al Machine Learning](01-introduccion-al-aprendizaje-automatico.md)

**Próximo:** [Blog 3: El Proceso de Entrenamiento →](03-proceso-entrenamiento-redes-neuronales.md)