---
title: "Aplicación Práctica: Construcción de una Red Neuronal con Keras"
date: 2025-10-02
author: "Alvaro Efren Bolaños Scalante"
tags: ["keras", "tensorflow", "python", "práctica", "mnist"]
series: "Deep Learning desde Cero"
part: 4
---

# Aplicación Práctica: Construcción de una Red Neuronal con Keras

## Introducción

Tras explorar los fundamentos matemáticos, es hora de **pasar de la teoría a la práctica**. Utilizaremos **Keras**, una biblioteca de alto nivel para Deep Learning, para construir, entrenar y evaluar una red neuronal.

## Caso de Estudio: Clasificación de Dígitos (MNIST)

Trabajaremos con el dataset **MNIST**: 70,000 imágenes de dígitos escritos a mano (0-9).

```
📊 Dataset MNIST:
   - Imágenes: 28×28 píxeles en escala de grises
   - Entrenamiento: 60,000 imágenes
   - Prueba: 10,000 imágenes
   - Clases: 10 (dígitos 0-9)
```

---

## Paso 1: Preparación y Preprocesado de Datos

### 1.1 Instalación de Dependencias

```bash
pip install tensorflow numpy matplotlib scikit-learn
```

### 1.2 Importar Bibliotecas

```python
import numpy as np
import matplotlib.pyplot as plt
from tensorflow import keras
from tensorflow.keras import Sequential
from tensorflow.keras.layers import Dense, Flatten
from tensorflow.keras.utils import to_categorical
```

### 1.3 Cargar el Dataset

```python
# Cargar MNIST
(x_train, y_train), (x_test, y_test) = keras.datasets.mnist.load_data()

print(f"Forma de x_train: {x_train.shape}")  # (60000, 28, 28)
print(f"Forma de y_train: {y_train.shape}")  # (60000,)
print(f"Forma de x_test: {x_test.shape}")    # (10000, 28, 28)
```

### 1.4 Visualizar Ejemplos

```python
# Visualizar las primeras 9 imágenes
plt.figure(figsize=(10, 10))
for i in range(9):
    plt.subplot(3, 3, i+1)
    plt.imshow(x_train[i], cmap='gray')
    plt.title(f"Etiqueta: {y_train[i]}")
    plt.axis('off')
plt.tight_layout()
plt.show()
```

### 1.5 Normalización

Escalar píxeles de [0, 255] → [0, 1]:

```python
# Normalizar
x_train = x_train.astype('float32') / 255.0
x_test = x_test.astype('float32') / 255.0

print(f"Rango de valores: [{x_train.min()}, {x_train.max()}]")
# Salida: [0.0, 1.0]
```

### 1.6 Codificación One-Hot

Convertir etiquetas en vectores:

```python
# One-hot encoding
y_train_encoded = to_categorical(y_train, num_classes=10)
y_test_encoded = to_categorical(y_test, num_classes=10)

print(f"Etiqueta original: {y_train[0]}")
print(f"Etiqueta codificada:\n{y_train_encoded[0]}")

# Salida:
# Etiqueta original: 5
# Etiqueta codificada: [0. 0. 0. 0. 0. 1. 0. 0. 0. 0.]
```

---

## Paso 2: Definición y Compilación del Modelo

### 2.1 Arquitectura de la Red

```python
model = Sequential([
    # Aplanar imagen 28x28 a vector 784
    Flatten(input_shape=(28, 28)),
    
    # Primera capa oculta: 128 neuronas con ReLU
    Dense(128, activation='relu'),
    
    # Segunda capa oculta: 64 neuronas con ReLU
    Dense(64, activation='relu'),
    
    # Capa de salida: 10 neuronas con Softmax
    Dense(10, activation='softmax')
])
```

**Arquitectura Visual:**

```
┌─────────────┐
│   Input     │  28×28 imagen
│  (28, 28)   │
└──────┬──────┘
       │
┌──────▼──────┐
│  Flatten    │  Transforma a vector 784
│   (784)     │
└──────┬──────┘
       │
┌──────▼──────┐
│  Dense      │  128 neuronas + ReLU
│   (128)     │
└──────┬──────┘
       │
┌──────▼──────┐
│  Dense      │  64 neuronas + ReLU
│    (64)     │
└──────┬──────┘
       │
┌──────▼──────┐
│  Dense      │  10 neuronas + Softmax
│    (10)     │  (probabilidades por clase)
└─────────────┘
```

### 2.2 Resumen del Modelo

```python
model.summary()
```

**Salida:**

```
_________________________________________________________________
Layer (type)                 Output Shape              Param #   
=================================================================
flatten (Flatten)            (None, 784)               0         
_________________________________________________________________
dense (Dense)                (None, 128)               100480    
_________________________________________________________________
dense_1 (Dense)              (None, 64)                8256      
_________________________________________________________________
dense_2 (Dense)              (None, 10)                650       
=================================================================
Total params: 109,386
Trainable params: 109,386
Non-trainable params: 0
```

### 2.3 Compilar el Modelo

```python
model.compile(
    optimizer='adam',                    # Optimizador Adam
    loss='categorical_crossentropy',     # Para clasificación multiclase
    metrics=['accuracy']                 # Métrica a monitorear
)
```

**Opciones de optimizadores:**
- `'sgd'`: Descenso de gradiente estocástico
- `'adam'`: Adam (recomendado para principiantes)
- `'rmsprop'`: RMSprop

---

## Paso 3: Entrenamiento del Modelo

### 3.1 Entrenar

```python
history = model.fit(
    x_train, 
    y_train_encoded,
    epochs=10,              # Número de épocas
    batch_size=32,          # Tamaño del mini-lote
    validation_split=0.2,   # 20% para validación
    verbose=1               # Mostrar progreso
)
```

**Salida durante el entrenamiento:**

```
Epoch 1/10
1500/1500 [======] - 3s 2ms/step - loss: 0.2645 - accuracy: 0.9234 - val_loss: 0.1345 - val_accuracy: 0.9612
Epoch 2/10
1500/1500 [======] - 2s 1ms/step - loss: 0.1123 - accuracy: 0.9665 - val_loss: 0.1012 - val_accuracy: 0.9701
...
```

### 3.2 Visualizar el Aprendizaje

```python
# Extraer historial
train_loss = history.history['loss']
val_loss = history.history['val_loss']
train_acc = history.history['accuracy']
val_acc = history.history['val_accuracy']

# Crear gráficas
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

# Gráfica de pérdida
ax1.plot(train_loss, label='Entrenamiento', marker='o')
ax1.plot(val_loss, label='Validación', marker='s')
ax1.set_title('Pérdida durante el Entrenamiento')
ax1.set_xlabel('Época')
ax1.set_ylabel('Pérdida')
ax1.legend()
ax1.grid(True)

# Gráfica de precisión
ax2.plot(train_acc, label='Entrenamiento', marker='o')
ax2.plot(val_acc, label='Validación', marker='s')
ax2.set_title('Precisión durante el Entrenamiento')
ax2.set_xlabel('Época')
ax2.set_ylabel('Precisión')
ax2.legend()
ax2.grid(True)

plt.tight_layout()
plt.show()
```

---

## Paso 4: Evaluación del Modelo

### 4.1 Evaluar en Datos de Prueba

```python
test_loss, test_accuracy = model.evaluate(x_test, y_test_encoded, verbose=0)

print(f"\n{'='*50}")
print(f"📊 RESULTADOS EN DATOS DE PRUEBA")
print(f"{'='*50}")
print(f"Pérdida (Loss): {test_loss:.4f}")
print(f"Precisión (Accuracy): {test_accuracy:.4f} ({test_accuracy*100:.2f}%)")
print(f"{'='*50}")
```

**Salida esperada:**

```
==================================================
📊 RESULTADOS EN DATOS DE PRUEBA
==================================================
Pérdida (Loss): 0.0856
Precisión (Accuracy): 0.9741 (97.41%)
==================================================
```

### 4.2 Hacer Predicciones

```python
# Predecir las primeras 10 imágenes del test
predictions = model.predict(x_test[:10])

# Convertir probabilidades a clases
predicted_classes = np.argmax(predictions, axis=1)
true_classes = np.argmax(y_test_encoded[:10], axis=1)

# Mostrar resultados
print("\n🔮 PREDICCIONES:")
print(f"{'Índice':<10}{'Predicho':<12}{'Real':<10}{'¿Correcto?'}")
print("-" * 45)
for i in range(10):
    correcto = "✅" if predicted_classes[i] == true_classes[i] else "❌"
    print(f"{i:<10}{predicted_classes[i]:<12}{true_classes[i]:<10}{correcto}")
```

### 4.3 Visualizar Predicciones

```python
plt.figure(figsize=(15, 6))
for i in range(10):
    plt.subplot(2, 5, i+1)
    plt.imshow(x_test[i], cmap='gray')
    
    pred = predicted_classes[i]
    true = true_classes[i]
    color = 'green' if pred == true else 'red'
    
    plt.title(f"Pred: {pred}\nReal: {true}", color=color)
    plt.axis('off')
plt.tight_layout()
plt.show()
```

---

## Paso 5: Guardar y Cargar el Modelo

### 5.1 Guardar el Modelo

```python
# Guardar el modelo completo
model.save('modelo_mnist.h5')
print("✅ Modelo guardado como 'modelo_mnist.h5'")

# O guardar solo los pesos
model.save_weights('pesos_mnist.h5')
```

### 5.2 Cargar el Modelo

```python
# Cargar modelo completo
modelo_cargado = keras.models.load_model('modelo_mnist.h5')

# Verificar que funciona
test_loss_cargado, test_acc_cargado = modelo_cargado.evaluate(
    x_test, y_test_encoded, verbose=0
)
print(f"Precisión del modelo cargado: {test_acc_cargado:.4f}")
```

---

## Código Completo

```python
"""
Red Neuronal para Clasificación de Dígitos MNIST
Autor: Alvaro Efren Bolaños Scalante
"""

import numpy as np
import matplotlib.pyplot as plt
from tensorflow import keras
from tensorflow.keras import Sequential
from tensorflow.keras.layers import Dense, Flatten
from tensorflow.keras.utils import to_categorical

# ============================================
# 1. CARGAR Y PREPROCESAR DATOS
# ============================================
print("📦 Cargando datos...")
(x_train, y_train), (x_test, y_test) = keras.datasets.mnist.load_data()

# Normalizar
x_train = x_train.astype('float32') / 255.0
x_test = x_test.astype('float32') / 255.0

# One-hot encoding
y_train = to_categorical(y_train, 10)
y_test = to_categorical(y_test, 10)

print(f"✅ Datos cargados: {x_train.shape[0]} entrenamiento, {x_test.shape[0]} prueba")

# ============================================
# 2. DEFINIR MODELO
# ============================================
print("\n🏗️ Construyendo modelo...")
model = Sequential([
    Flatten(input_shape=(28, 28)),
    Dense(128, activation='relu'),
    Dense(64, activation='relu'),
    Dense(10, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

model.summary()

# ============================================
# 3. ENTRENAR
# ============================================
print("\n🚀 Entrenando modelo...")
history = model.fit(
    x_train, y_train,
    epochs=10,
    batch_size=32,
    validation_split=0.2,
    verbose=1
)

# ============================================
# 4. EVALUAR
# ============================================
print("\n📊 Evaluando modelo...")
test_loss, test_acc = model.evaluate(x_test, y_test, verbose=0)
print(f"\nPrecisión en test: {test_acc:.4f} ({test_acc*100:.2f}%)")

# ============================================
# 5. VISUALIZAR
# ============================================
# Gráficas de aprendizaje
plt.figure(figsize=(14, 5))

plt.subplot(1, 2, 1)
plt.plot(history.history['loss'], label='Entrenamiento')
plt.plot(history.history['val_loss'], label='Validación')
plt.title('Pérdida')
plt.xlabel('Época')
plt.ylabel('Loss')
plt.legend()
plt.grid(True)

plt.subplot(1, 2, 2)
plt.plot(history.history['accuracy'], label='Entrenamiento')
plt.plot(history.history['val_accuracy'], label='Validación')
plt.title('Precisión')
plt.xlabel('Época')
plt.ylabel('Accuracy')
plt.legend()
plt.grid(True)

plt.tight_layout()
plt.savefig('entrenamiento.png')
plt.show()

print("\n✅ ¡Entrenamiento completado!")
```

---

## Ejercicios Propuestos

1. **Cambiar la arquitectura**: Prueba con más/menos capas y neuronas
2. **Probar otros optimizadores**: `'sgd'`, `'rmsprop'`
3. **Ajustar hiperparámetros**: learning rate, batch size
4. **Usar Fashion-MNIST**: Dataset de prendas de ropa
5. **Agregar regularización**: Dropout para evitar overfitting

```python
# Ejemplo con Dropout
from tensorflow.keras.layers import Dropout

model = Sequential([
    Flatten(input_shape=(28, 28)),
    Dense(128, activation='relu'),
    Dropout(0.5),  # 50% de dropout
    Dense(64, activation='relu'),
    Dropout(0.3),
    Dense(10, activation='softmax')
])
```

---

## Referencias

- Torres, J. (2020). *Python Deep Learning: Introducción práctica con Keras y TensorFlow 2*. Marcombo.
- Documentación de Keras: https://keras.io
- TensorFlow Tutorials: https://www.tensorflow.org/tutorials

---

**Anterior:** [← Blog 3: Proceso de Entrenamiento](03-proceso-entrenamiento-redes-neuronales.md)

**Próximo:** [Blog 5: Evaluación y Desafíos →](05-evaluacion-rendimiento-desafios.md)