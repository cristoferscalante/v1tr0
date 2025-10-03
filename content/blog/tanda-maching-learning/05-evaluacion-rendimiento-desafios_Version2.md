---
title: "Evaluación del Rendimiento y Desafíos Comunes en Deep Learning"
date: 2025-10-02
author: "Alvaro Efren Bolaños Scalante"
tags: ["evaluación", "métricas", "overfitting", "underfitting", "confusion-matrix"]
series: "Deep Learning desde Cero"
part: 5
description: "Aprende a evaluar modelos de Deep Learning con métricas avanzadas y soluciona los desafíos más comunes como overfitting y underfitting."
---

# 5. Evaluación del Rendimiento y Desafíos Comunes

## 🎯 Introducción

Aunque la **precisión (accuracy)** es una métrica intuitiva, no siempre es suficiente para una evaluación completa de un modelo. Además, durante el desarrollo de modelos, es común enfrentarse a desafíos como el **sobreajuste** y el **subajuste**, que deben ser identificados y gestionados adecuadamente.

---

## 📊 La Matriz de Confusión

Una herramienta más profunda para la evaluación es la **Matriz de Confusión**. Esta tabla visualiza el rendimiento de un algoritmo de clasificación, mostrando explícitamente cuándo una clase es confundida con otra.

### Para Clasificación Binaria

|                          | **Predicción Positiva** | **Predicción Negativa** |
|--------------------------|-------------------------|-------------------------|
| **Observación Positiva** | Verdaderos Positivos (VP) | Falsos Negativos (FN)   |
| **Observación Negativa** | Falsos Positivos (FP)    | Verdaderos Negativos (VN) |

**Componentes:**
- **VP (True Positives):** Casos positivos correctamente identificados
- **VN (True Negatives):** Casos negativos correctamente identificados
- **FP (False Positives):** Error Tipo I - predecir positivo cuando es negativo
- **FN (False Negatives):** Error Tipo II - predecir negativo cuando es positivo

### Implementación en Python

```python
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay
import matplotlib.pyplot as plt
import numpy as np

# Obtener predicciones del modelo
y_pred = model.predict(x_test)
y_pred_classes = np.argmax(y_pred, axis=1)
y_true = np.argmax(y_test, axis=1)

# Calcular matriz de confusión
cm = confusion_matrix(y_true, y_pred_classes)

# Visualizar la matriz de confusión
disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=range(10))
disp.plot(cmap='Blues', values_format='d')
plt.title('Matriz de Confusión - MNIST')
plt.show()

print(f"Matriz de Confusión:\n{cm}")
```

### Visualización Avanzada

```python
import seaborn as sns

def plot_confusion_matrix_detailed(y_true, y_pred, classes):
    """
    Crea una matriz de confusión detallada y visualmente atractiva
    """
    cm = confusion_matrix(y_true, y_pred)
    
    plt.figure(figsize=(12, 10))
    sns.heatmap(cm, annot=True, fmt='d', cmap='YlOrRd', 
                xticklabels=classes, yticklabels=classes,
                cbar_kws={'label': 'Frecuencia'})
    
    plt.title('Matriz de Confusión Detallada', fontsize=16, fontweight='bold', pad=20)
    plt.ylabel('Etiqueta Verdadera', fontsize=14)
    plt.xlabel('Etiqueta Predicha', fontsize=14)
    plt.tight_layout()
    plt.savefig('confusion_matrix_detailed.png', dpi=300, bbox_inches='tight')
    plt.show()

# Usar la función
plot_confusion_matrix_detailed(y_true, y_pred_classes, classes=range(10))
```

---

## 📈 Métricas Derivadas

### 1. Precisión (Accuracy)

Mide la proporción de predicciones correctas sobre el total.

**Fórmula:**
```
Accuracy = (VP + VN) / (VP + VN + FP + FN)
```

**Limitación:** No es adecuada para conjuntos de datos desbalanceados.

**Ejemplo de problema:** Si el 95% de los datos son de la clase negativa, un modelo que siempre predice "negativo" tendría 95% de accuracy, pero sería completamente inútil.

```python
from sklearn.metrics import accuracy_score

accuracy = accuracy_score(y_true, y_pred_classes)
print(f"Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
```

### 2. Recall (Sensibilidad o Exhaustividad)

Mide la proporción de positivos reales que fueron correctamente identificados por el modelo.

**Fórmula:**
```
Recall = VP / (VP + FN)
```

**¿Cuándo es crucial?**
- 🏥 **Detección de enfermedades**: Es crítico no perder ningún caso positivo
- 💳 **Identificación de fraudes**: Detectar todas las transacciones fraudulentas
- 🍄 **Clasificación de setas venenosas**: No queremos clasificar erróneamente una seta venenosa como comestible

**Caso crítico:** En un modelo que predice si una seta es venenosa:
- **Falso Negativo (FN):** Clasificar una seta venenosa como comestible → ¡PELIGRO MORTAL! 💀
- **Falso Positivo (FP):** Clasificar una seta comestible como venenosa → Menos grave (solo pierdes una comida)

Por ejemplo, en un modelo que predice si una seta es venenosa, un **Falso Negativo** (clasificar una seta venenosa como comestible) es mucho más grave que un **Falso Positivo**. En este caso, **maximizar el Recall** sería un objetivo prioritario.

```python
from sklearn.metrics import recall_score

# Para clasificación multiclase
recall = recall_score(y_true, y_pred_classes, average='weighted')
print(f"Recall: {recall:.4f}")

# Para clasificación binaria específica
recall_binary = recall_score(y_true_binary, y_pred_binary)
print(f"Recall (Binario): {recall_binary:.4f}")
```

### 3. Precisión (Precision)

Mide la proporción de predicciones positivas que fueron correctas.

**Fórmula:**
```
Precision = VP / (VP + FP)
```

**¿Cuándo es crucial?**
- 📧 **Filtrado de spam**: Minimizar que correos legítimos vayan a spam
- 🎯 **Recomendaciones de productos**: Asegurar que las recomendaciones sean relevantes
- 🔍 **Búsqueda de información**: Resultados precisos y relevantes

```python
from sklearn.metrics import precision_score

precision = precision_score(y_true, y_pred_classes, average='weighted')
print(f"Precision: {precision:.4f}")
```

### 4. F1-Score

Media armónica entre Precision y Recall. Proporciona un balance entre ambas métricas.

**Fórmula:**
```
F1 = 2 · (Precision · Recall) / (Precision + Recall)
```

**Ventaja:** Es útil cuando necesitas un balance entre Precision y Recall, especialmente con datos desbalanceados.

```python
from sklearn.metrics import f1_score

f1 = f1_score(y_true, y_pred_classes, average='weighted')
print(f"F1-Score: {f1:.4f}")
```

### Reporte Completo de Clasificación

```python
from sklearn.metrics import classification_report

# Generar reporte completo
print("\n" + "="*70)
print("REPORTE COMPLETO DE CLASIFICACIÓN")
print("="*70 + "\n")

report = classification_report(y_true, y_pred_classes, 
                               target_names=[str(i) for i in range(10)],
                               digits=4)
print(report)
```

**Salida ejemplo:**

```
======================================================================
REPORTE COMPLETO DE CLASIFICACIÓN
======================================================================

              precision    recall  f1-score   support

           0     0.9837    0.9908    0.9872       980
           1     0.9868    0.9912    0.9890      1135
           2     0.9748    0.9767    0.9757      1032
           3     0.9752    0.9614    0.9683      1010
           4     0.9765    0.9776    0.9771       982
           5     0.9753    0.9697    0.9725       892
           6     0.9791    0.9833    0.9812       958
           7     0.9689    0.9650    0.9669      1028
           8     0.9641    0.9681    0.9661       974
           9     0.9613    0.9673    0.9643      1009

    accuracy                         0.9741     10000
   macro avg     0.9746    0.9751    0.9748     10000
weighted avg     0.9741    0.9741    0.9741     10000
```

### Visualización de Métricas

```python
def plot_metrics_comparison(y_true, y_pred, class_names):
    """
    Visualiza precision, recall y f1-score por clase
    """
    from sklearn.metrics import precision_recall_fscore_support
    
    precision, recall, f1, support = precision_recall_fscore_support(
        y_true, y_pred, average=None
    )
    
    x = np.arange(len(class_names))
    width = 0.25
    
    fig, ax = plt.subplots(figsize=(14, 6))
    
    rects1 = ax.bar(x - width, precision, width, label='Precision', color='#3498db')
    rects2 = ax.bar(x, recall, width, label='Recall', color='#e74c3c')
    rects3 = ax.bar(x + width, f1, width, label='F1-Score', color='#2ecc71')
    
    ax.set_ylabel('Score', fontsize=12)
    ax.set_xlabel('Clases', fontsize=12)
    ax.set_title('Comparación de Métricas por Clase', fontsize=14, fontweight='bold')
    ax.set_xticks(x)
    ax.set_xticklabels(class_names)
    ax.legend(fontsize=11)
    ax.grid(axis='y', alpha=0.3)
    ax.set_ylim([0.9, 1.0])
    
    plt.tight_layout()
    plt.savefig('metrics_comparison.png', dpi=300, bbox_inches='tight')
    plt.show()

# Usar la función
plot_metrics_comparison(y_true, y_pred_classes, class_names=[str(i) for i in range(10)])
```

---

## ⚠️ Desafíos Comunes: Subajuste y Sobreajuste

Dos de los problemas más comunes en el entrenamiento de modelos son el **subajuste (underfitting)** y el **sobreajuste (overfitting)**.

### 🔻 Subajuste (Underfitting)

**Definición:** Ocurre cuando un modelo es demasiado simple para capturar la complejidad subyacente de los datos.

**Características:**
- ❌ Alto error en datos de entrenamiento
- ❌ Alto error en datos de validación/prueba
- ❌ El modelo no aprende los patrones subyacentes
- ❌ Rendimiento pobre en general

**Gráfica típica:**

```
Error
  │
  │  ──────────────── Entrenamiento (alto ~30%)
  │  ──────────────── Validación (alto ~32%)
  │
  │  Ambas curvas permanecen altas y no mejoran
  │
  └────────────────────────────────────── Épocas
```

**Código para detectar underfitting:**

```python
def detectar_underfitting(history):
    """
    Detecta si el modelo sufre de underfitting
    """
    train_loss = history.history['loss'][-5:]  # Últimas 5 épocas
    val_loss = history.history['val_loss'][-5:]
    
    avg_train_loss = np.mean(train_loss)
    avg_val_loss = np.mean(val_loss)
    
    # Si ambos errores son altos (>0.5 es un umbral ejemplo)
    if avg_train_loss > 0.5 and avg_val_loss > 0.5:
        print("⚠️ ALERTA: Posible UNDERFITTING detectado")
        print(f"   - Error promedio de entrenamiento: {avg_train_loss:.4f}")
        print(f"   - Error promedio de validación: {avg_val_loss:.4f}")
        print("\n💡 Soluciones sugeridas:")
        print("   1. Aumentar la complejidad del modelo")
        print("   2. Añadir más capas o neuronas")
        print("   3. Entrenar por más épocas")
        print("   4. Reducir la regularización")
        return True
    return False

# Usar después del entrenamiento
detectar_underfitting(history)
```

**Estrategias de solución:**

#### 1. Aumentar la Complejidad del Modelo

```python
# Modelo SIMPLE (propenso a underfitting)
model_simple = Sequential([
    Flatten(input_shape=(28, 28)),
    Dense(32, activation='relu'),
    Dense(10, activation='softmax')
])

# Modelo MÁS COMPLEJO (mejor capacidad)
model_complejo = Sequential([
    Flatten(input_shape=(28, 28)),
    Dense(256, activation='relu'),
    Dense(128, activation='relu'),
    Dense(64, activation='relu'),
    Dense(10, activation='softmax')
])
```

#### 2. Añadir Más Características Relevantes

```python
# Feature engineering para mejorar los datos
def agregar_caracteristicas(X):
    """
    Añade características derivadas
    """
    # Ejemplo: gradientes de la imagen
    gradiente_x = np.gradient(X, axis=1)
    gradiente_y = np.gradient(X, axis=2)
    
    return np.concatenate([X, gradiente_x, gradiente_y], axis=-1)
```

#### 3. Entrenar por Más Épocas

```python
# Entrenar con más épocas
history = model.fit(
    x_train, y_train,
    epochs=50,  # Aumentar de 10 a 50
    batch_size=32,
    validation_split=0.2
)
```

#### 4. Reducir Regularización

```python
# Si tenías mucha regularización
model = Sequential([
    Flatten(input_shape=(28, 28)),
    Dense(128, activation='relu', 
          kernel_regularizer=regularizers.l2(0.0001)),  # Reducir de 0.01 a 0.0001
    Dense(10, activation='softmax')
])
```

---

### 🔺 Sobreajuste (Overfitting)

**Definición:** Ocurre cuando un modelo es demasiado complejo y "memoriza" los datos de entrenamiento en lugar de aprender las relaciones generales.

**Características:**
- ✅ Muy bajo error en datos de entrenamiento
- ❌ Alto error en datos de validación/prueba
- ⚠️ Gran brecha entre error de entrenamiento y validación
- ⚠️ El modelo no generaliza bien

**Gráfica típica:**

```
Error
  │  
  │                     ╱── Validación (aumenta)
  │                   ╱
  │                 ╱  ← OVERFITTING
  │               ╱
  │  ───────────╱────── Entrenamiento (disminuye)
  │
  └────────────────────────────────────── Épocas
            ↑
      Punto óptimo
```

**Código para detectar overfitting:**

```python
def detectar_overfitting(history, threshold=0.1):
    """
    Detecta si el modelo sufre de overfitting
    """
    train_loss = history.history['loss'][-5:]
    val_loss = history.history['val_loss'][-5:]
    
    avg_train_loss = np.mean(train_loss)
    avg_val_loss = np.mean(val_loss)
    
    gap = avg_val_loss - avg_train_loss
    
    if gap > threshold:
        print("⚠️ ALERTA: Posible OVERFITTING detectado")
        print(f"   - Error de entrenamiento: {avg_train_loss:.4f}")
        print(f"   - Error de validación: {avg_val_loss:.4f}")
        print(f"   - Brecha: {gap:.4f}")
        print("\n💡 Soluciones sugeridas:")
        print("   1. Usar Dropout")
        print("   2. Aplicar regularización L1/L2")
        print("   3. Usar Early Stopping")
        print("   4. Aumentar datos de entrenamiento")
        print("   5. Simplificar el modelo")
        return True
    return False

# Usar después del entrenamiento
detectar_overfitting(history)
```

**Estrategias de solución:**

#### 1. Simplificar el Modelo

```python
# Modelo COMPLEJO (propenso a overfitting)
model_complejo = Sequential([
    Flatten(input_shape=(28, 28)),
    Dense(512, activation='relu'),
    Dense(256, activation='relu'),
    Dense(128, activation='relu'),
    Dense(64, activation='relu'),
    Dense(10, activation='softmax')
])

# Modelo MÁS SIMPLE (mejor generalización)
model_simple = Sequential([
    Flatten(input_shape=(28, 28)),
    Dense(128, activation='relu'),
    Dense(64, activation='relu'),
    Dense(10, activation='softmax')
])
```

#### 2. Dropout

Desactiva aleatoriamente neuronas durante el entrenamiento para prevenir co-adaptación.

```python
from tensorflow.keras.layers import Dropout

model = Sequential([
    Flatten(input_shape=(28, 28)),
    Dense(128, activation='relu'),
    Dropout(0.5),  # Desactiva 50% de neuronas
    Dense(64, activation='relu'),
    Dropout(0.3),  # Desactiva 30% de neuronas
    Dense(10, activation='softmax')
])

print("✅ Dropout aplicado para reducir overfitting")
```

**¿Cómo funciona Dropout?**

```python
# Durante el entrenamiento
# Algunas neuronas se desactivan aleatoriamente
# [1, 0.5, 0, 0.8, 0, 0.3] → [1, 0.5, 0, 0.8, 0, 0.3]
#                              ↑         ↑     ↑
#                           activa    activa desactivada

# Durante la predicción
# Todas las neuronas están activas (escaladas)
```

#### 3. Regularización L1/L2

Penaliza pesos grandes para mantener el modelo simple.

```python
from tensorflow.keras import regularizers

model = Sequential([
    Flatten(input_shape=(28, 28)),
    
    # Regularización L2 (Ridge)
    Dense(128, activation='relu', 
          kernel_regularizer=regularizers.l2(0.01)),
    
    # Regularización L1 (Lasso)
    Dense(64, activation='relu',
          kernel_regularizer=regularizers.l1(0.01)),
    
    # Regularización L1+L2 (Elastic Net)
    Dense(32, activation='relu',
          kernel_regularizer=regularizers.l1_l2(l1=0.01, l2=0.01)),
    
    Dense(10, activation='softmax')
])

print("✅ Regularización L1/L2 aplicada")
```

**Fórmulas de regularización:**

```
L2: Loss_total = Loss_original + λ · Σ(w²)
L1: Loss_total = Loss_original + λ · Σ(|w|)
```

#### 4. Early Stopping

Detiene el entrenamiento cuando la validación deja de mejorar.

```python
from tensorflow.keras.callbacks import EarlyStopping

early_stop = EarlyStopping(
    monitor='val_loss',        # Métrica a monitorear
    patience=10,                # Esperar 10 épocas sin mejora
    restore_best_weights=True, # Restaurar los mejores pesos
    verbose=1,
    mode='min'                 # Buscar el mínimo
)

history = model.fit(
    x_train, y_train,
    epochs=100,  # Muchas épocas, pero se detendrá antes
    validation_split=0.2,
    callbacks=[early_stop]
)

print(f"✅ Entrenamiento detenido en época {len(history.history['loss'])}")
```

#### 5. Data Augmentation

Genera variaciones artificiales de los datos de entrenamiento.

```python
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# Configurar aumentación de datos
datagen = ImageDataGenerator(
    rotation_range=10,         # Rotar hasta ±10 grados
    width_shift_range=0.1,     # Desplazar horizontalmente 10%
    height_shift_range=0.1,    # Desplazar verticalmente 10%
    zoom_range=0.1,            # Zoom ±10%
    shear_range=0.1,           # Distorsión
    fill_mode='nearest'        # Rellenar píxeles vacíos
)

# Entrenar con datos aumentados
history = model.fit(
    datagen.flow(x_train, y_train, batch_size=32),
    steps_per_epoch=len(x_train) // 32,
    epochs=20,
    validation_data=(x_test, y_test)
)

print("✅ Data augmentation aplicado")
```

**Visualización de data augmentation:**

```python
import matplotlib.pyplot as plt

def visualizar_augmentation(x_train, datagen, num_ejemplos=9):
    """
    Muestra ejemplos de data augmentation
    """
    fig, axes = plt.subplots(3, 3, figsize=(10, 10))
    
    # Tomar una imagen de ejemplo
    img = x_train[0:1]
    
    # Generar variaciones
    it = datagen.flow(img, batch_size=1)
    
    for i, ax in enumerate(axes.flat):
        batch = next(it)
        image = batch[0]
        ax.imshow(image, cmap='gray')
        ax.axis('off')
        ax.set_title(f'Variación {i+1}')
    
    plt.tight_layout()
    plt.savefig('data_augmentation_examples.png', dpi=300)
    plt.show()

visualizar_augmentation(x_train, datagen)
```

#### 6. Más Datos de Entrenamiento

La mejor solución (si es posible): conseguir más datos.

```python
# Técnicas para obtener más datos:
# 1. Recolección de nuevos datos
# 2. Transferir datos de dominios similares
# 3. Usar datasets públicos complementarios
# 4. Generación sintética de datos
# 5. Web scraping (con precaución legal)
```

---

## 📉 Visualización Completa del Entrenamiento

```python
def plot_training_analysis(history, save_path='training_analysis.png'):
    """
    Crea una visualización completa del entrenamiento
    """
    fig = plt.figure(figsize=(16, 10))
    gs = fig.add_gridspec(3, 2, hspace=0.3, wspace=0.3)
    
    # 1. Pérdida
    ax1 = fig.add_subplot(gs[0, 0])
    ax1.plot(history.history['loss'], 'b-', label='Entrenamiento', linewidth=2)
    ax1.plot(history.history['val_loss'], 'r-', label='Validación', linewidth=2)
    ax1.set_title('Pérdida durante el Entrenamiento', fontsize=14, fontweight='bold')
    ax1.set_xlabel('Época')
    ax1.set_ylabel('Pérdida')
    ax1.legend()
    ax1.grid(True, alpha=0.3)
    
    # Marcar mejor época
    best_epoch = np.argmin(history.history['val_loss'])
    ax1.axvline(x=best_epoch, color='g', linestyle='--', alpha=0.7)
    ax1.text(best_epoch + 0.5, ax1.get_ylim()[1] * 0.9,
            f'Mejor época: {best_epoch}', fontsize=10, color='green')
    
    # 2. Precisión
    ax2 = fig.add_subplot(gs[0, 1])
    ax2.plot(history.history['accuracy'], 'b-', label='Entrenamiento', linewidth=2)
    ax2.plot(history.history['val_accuracy'], 'r-', label='Validación', linewidth=2)
    ax2.set_title('Precisión durante el Entrenamiento', fontsize=14, fontweight='bold')
    ax2.set_xlabel('Época')
    ax2.set_ylabel('Precisión')
    ax2.legend()
    ax2.grid(True, alpha=0.3)
    
    # 3. Brecha (Gap) entre entrenamiento y validación
    ax3 = fig.add_subplot(gs[1, :])
    gap_loss = np.array(history.history['val_loss']) - np.array(history.history['loss'])
    ax3.plot(gap_loss, 'purple', linewidth=2)
    ax3.axhline(y=0, color='black', linestyle='--', alpha=0.5)
    ax3.fill_between(range(len(gap_loss)), 0, gap_loss, 
                     where=(gap_loss > 0), alpha=0.3, color='red', label='Overfitting')
    ax3.fill_between(range(len(gap_loss)), 0, gap_loss, 
                     where=(gap_loss < 0), alpha=0.3, color='blue', label='Underfitting')
    ax3.set_title('Brecha entre Entrenamiento y Validación', fontsize=14, fontweight='bold')
    ax3.set_xlabel('Época')
    ax3.set_ylabel('Gap (Val Loss - Train Loss)')
    ax3.legend()
    ax3.grid(True, alpha=0.3)
    
    # 4. Distribución de pérdidas
    ax4 = fig.add_subplot(gs[2, 0])
    ax4.hist(history.history['loss'], bins=30, alpha=0.7, label='Train Loss', color='blue')
    ax4.hist(history.history['val_loss'], bins=30, alpha=0.7, label='Val Loss', color='red')
    ax4.set_title('Distribución de Pérdidas', fontsize=12, fontweight='bold')
    ax4.set_xlabel('Pérdida')
    ax4.set_ylabel('Frecuencia')
    ax4.legend()
    ax4.grid(True, alpha=0.3)
    
    # 5. Tasa de cambio (derivada)
    ax5 = fig.add_subplot(gs[2, 1])
    loss_derivative = np.gradient(history.history['loss'])
    val_loss_derivative = np.gradient(history.history['val_loss'])
    ax5.plot(loss_derivative, 'b-', label='Train Loss Rate', linewidth=2)
    ax5.plot(val_loss_derivative, 'r-', label='Val Loss Rate', linewidth=2)
    ax5.axhline(y=0, color='black', linestyle='--', alpha=0.5)
    ax5.set_title('Tasa de Cambio de la Pérdida', fontsize=12, fontweight='bold')
    ax5.set_xlabel('Época')
    ax5.set_ylabel('Derivada de la Pérdida')
    ax5.legend()
    ax5.grid(True, alpha=0.3)
    
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    plt.show()

# Usar después del entrenamiento
plot_training_analysis(history)
```

---

## 🎯 Resumen de Estrategias

| **Problema**     | **Síntoma**                              | **Soluciones**                                                                 |
|------------------|------------------------------------------|--------------------------------------------------------------------------------|
| **Underfitting** | • Alto error en train y test<br>• Modelo demasiado simple<br>• No aprende patrones | • Aumentar complejidad del modelo<br>• Más capas/neuronas<br>• Más características<br>• Entrenar más épocas<br>• Reducir regularización |
| **Overfitting**  | • Bajo error en train<br>• Alto error en test<br>• Gran brecha entre ambos | • Dropout (0.3-0.5)<br>• Regularización L1/L2<br>• Early stopping<br>• Data augmentation<br>• Simplificar modelo<br>• Más datos de entrenamiento |

---

## 🧪 Ejemplo Completo: Pipeline Anti-Overfitting

```python
"""
Pipeline completo para entrenar un modelo robusto
con técnicas anti-overfitting
"""

import numpy as np
from tensorflow import keras
from tensorflow.keras import Sequential
from tensorflow.keras.layers import Dense, Flatten, Dropout
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
from tensorflow.keras import regularizers
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# ============================================
# 1. CARGAR Y PREPARAR DATOS
# ============================================
print("📦 Cargando datos...")
(x_train, y_train), (x_test, y_test) = keras.datasets.mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0
y_train = keras.utils.to_categorical(y_train, 10)
y_test = keras.utils.to_categorical(y_test, 10)

# ============================================
# 2. DEFINIR MODELO CON TÉCNICAS ANTI-OVERFITTING
# ============================================
print("\n🏗️ Construyendo modelo con técnicas anti-overfitting...")
model = Sequential([
    Flatten(input_shape=(28, 28)),
    
    # Primera capa con regularización L2
    Dense(128, activation='relu',
          kernel_regularizer=regularizers.l2(0.001)),
    Dropout(0.5),
    
    # Segunda capa con regularización L2
    Dense(64, activation='relu',
          kernel_regularizer=regularizers.l2(0.001)),
    Dropout(0.3),
    
    # Capa de salida
    Dense(10, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

model.summary()

# ============================================
# 3. CONFIGURAR CALLBACKS
# ============================================
print("\n⚙️ Configurando callbacks...")

# Early Stopping
early_stop = EarlyStopping(
    monitor='val_loss',
    patience=10,
    restore_best_weights=True,
    verbose=1
)

# Model Checkpoint
checkpoint = ModelCheckpoint(
    'mejor_modelo_mnist.h5',
    monitor='val_accuracy',
    save_best_only=True,
    verbose=1
)

# Reduce Learning Rate on Plateau
reduce_lr = ReduceLROnPlateau(
    monitor='val_loss',
    factor=0.5,
    patience=5,
    min_lr=1e-7,
    verbose=1
)

callbacks = [early_stop, checkpoint, reduce_lr]

# ============================================
# 4. DATA AUGMENTATION (Opcional para imágenes)
# ============================================
datagen = ImageDataGenerator(
    rotation_range=10,
    width_shift_range=0.1,
    height_shift_range=0.1,
    zoom_range=0.1
)

# ============================================
# 5. ENTRENAR
# ============================================
print("\n🚀 Entrenando modelo...")
history = model.fit(
    x_train, y_train,
    epochs=100,
    batch_size=32,
    validation_split=0.2,
    callbacks=callbacks,
    verbose=1
)

# ============================================
# 6. EVALUAR
# ============================================
print("\n📊 Evaluando modelo...")
test_loss, test_acc = model.evaluate(x_test, y_test, verbose=0)

print(f"\n{'='*60}")
print(f"RESULTADOS FINALES")
print(f"{'='*60}")
print(f"Pérdida en test: {test_loss:.4f}")
print(f"Precisión en test: {test_acc:.4f} ({test_acc*100:.2f}%)")
print(f"{'='*60}\n")

# ============================================
# 7. DETECTAR PROBLEMAS
# ============================================
print("🔍 Analizando resultados...\n")
detectar_underfitting(history)
detectar_overfitting(history)

# ============================================
# 8. VISUALIZAR
# ============================================
print("\n📈 Generando visualizaciones...")
plot_training_analysis(history)

# ============================================
# 9. MÉTRICAS DETALLADAS
# ============================================
from sklearn.metrics import classification_report

y_pred = model.predict(x_test)
y_pred_classes = np.argmax(y_pred, axis=1)
y_true = np.argmax(y_test, axis=1)

print("\n" + "="*70)
print("REPORTE DE CLASIFICACIÓN DETALLADO")
print("="*70 + "\n")
print(classification_report(y_true, y_pred_classes, 
                          target_names=[str(i) for i in range(10)]))

print("\n✅ ¡Entrenamiento completado exitosamente!")
```

---

## 📊 Comparación de Modelos

```python
def comparar_modelos(modelos_dict, x_test, y_test):
    """
    Compara múltiples modelos entrenados
    
    Args:
        modelos_dict: Dict con nombre del modelo y objeto modelo
        x_test: Datos de prueba
        y_test: Etiquetas de prueba
    """
    resultados = []
    
    for nombre, modelo in modelos_dict.items():
        loss, acc = modelo.evaluate(x_test, y_test, verbose=0)
        resultados.append({
            'Modelo': nombre,
            'Loss': loss,
            'Accuracy': acc
        })
    
    # Crear DataFrame
    import pandas as pd
    df = pd.DataFrame(resultados)
    df = df.sort_values('Accuracy', ascending=False)
    
    print("\n" + "="*60)
    print("COMPARACIÓN DE MODELOS")
    print("="*60)
    print(df.to_string(index=False))
    print("="*60 + "\n")
    
    # Visualizar
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
    
    # Accuracy
    ax1.barh(df['Modelo'], df['Accuracy'], color='#3498db')
    ax1.set_xlabel('Accuracy')
    ax1.set_title('Comparación de Accuracy', fontweight='bold')
    ax1.grid(axis='x', alpha=0.3)
    
    # Loss
    ax2.barh(df['Modelo'], df['Loss'], color='#e74c3c')
    ax2.set_xlabel('Loss')
    ax2.set_title('Comparación de Loss', fontweight='bold')
    ax2.grid(axis='x', alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('comparacion_modelos.png', dpi=300, bbox_inches='tight')
    plt.show()

# Ejemplo de uso
modelos = {
    'Modelo Simple': modelo_simple,
    'Modelo con Dropout': modelo_dropout,
    'Modelo con Regularización': modelo_regularizado,
    'Modelo Completo': model
}

comparar_modelos(modelos, x_test, y_test)
```

---

## 🎓 Conclusión

Hemos completado este recorrido exhaustivo por los fundamentos matemáticos y la aplicación práctica del Deep Learning:

1. ✅ **Fundamentos del ML**: Paradigmas y conceptos básicos
2. ✅ **Redes Neuronales**: Arquitectura y componentes matemáticos
3. ✅ **Entrenamiento**: Función de costo, gradiente y backpropagation
4. ✅ **Implementación**: Aplicación práctica con Keras
5. ✅ **Evaluación**: Métricas avanzadas y solución de desafíos comunes

### Puntos Clave para Recordar

🔹 **Evaluación**:
- No te bases solo en accuracy
- Usa métricas múltiples (precision, recall, F1)
- La matriz de confusión es tu mejor amiga

🔹 **Underfitting**:
- Modelo demasiado simple
- Solución: Más complejidad, más features, más épocas

🔹 **Overfitting**:
- Modelo demasiado complejo
- Solución: Dropout, regularización, early stopping, más datos

🔹 **Balance**:
- Busca el punto óptimo entre simplicidad y complejidad
- Monitorea constantemente train vs validation
- Usa callbacks inteligentes

### Próximos Pasos Recomendados

1. 🎯 **Practica con diferentes datasets**: Fashion-MNIST, CIFAR-10, IMDB
2. 🧪 **Experimenta con arquitecturas**: CNNs, RNNs, Transformers
3. 📚 **Profundiza en técnicas avanzadas**: Transfer Learning, Fine-tuning
4. 🚀 **Proyectos reales**: Aplica lo aprendido a problemas del mundo real

La comprensión conjunta de la **teoría matemática** y las **herramientas prácticas** es fundamental para desarrollar soluciones de IA **robustas**, **eficientes** y **efectivas**.

---

## 📚 Referencias

- Goodfellow, I., Bengio, Y., & Courville, A. (2016). *Deep learning*. MIT Press.
- AWS. (s.f.). ¿En qué consiste el ajuste de hiperparámetros? https://aws.amazon.com/es/what-is/hyperparameter-tuning/
- AWS. (s.f.). Parámetros de entrenamiento. https://docs.aws.amazon.com/es_es/machine-learning/latest/dg/training-parameters1.html
- Zhang, Y. (Ed.). (2010). *Machine learning*. IntechOpen.
- Ng, A. (2017). Neural Networks and Deep Learning. Coursera.

---

## 🔗 Enlaces de la Serie

**← Anterior:** [Blog 4: Aplicación Práctica con Keras](04-aplicacion-practica-keras.md)

**🏠 Inicio de la serie:** [Blog 1: Introducción al Machine Learning](01-introduccion-al-aprendizaje-automatico.md)

---

## 💬 Feedback

*¿Te ha resultado útil este artículo? ¿Tienes sugerencias o preguntas? Déjame tus comentarios y comparte si te ha gustado.*

**Etiquetas:** #DeepLearning #MachineLearning #Python #Keras #TensorFlow #AI #DataScience #Overfitting #Underfitting #ModelEvaluation

---

**Autor:** Alvaro Efren Bolaños Scalante  
**Fecha:** 2 de Octubre, 2025  
**Proyecto:** v1tr0 - Serie Deep Learning desde Cero  
**Licencia:** MIT