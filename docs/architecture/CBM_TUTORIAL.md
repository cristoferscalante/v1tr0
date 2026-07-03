# 🎬 Tutorial Rápido: Codebase Memory MCP

## 🎯 Qué vas a aprender

En 5 minutos aprenderás a usar **codebase-memory-mcp** para navegar el código de V1TR0 como un experto.

---

## 📋 Paso 1: Verificar Instalación

```bash
# Verificar que está instalado
codebase-memory-mcp --version

# Debería mostrar: codebase-memory-mcp 0.8.1
```

Si no está instalado, ejecuta:
```bash
curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh | bash -s -- --ui
```

---

## 📋 Paso 2: Ver el Estado del Proyecto

```bash
# Ver estadísticas
./cbm.sh stats
```

**Output esperado:**
```json
{
  "projects": [{
    "name": "home-efren-cyborg-1.Cyborg-Town...",
    "nodes": 3566,
    "edges": 5348,
    "files": 346
  }]
}
```

---

## 📋 Paso 3: Explorar la Arquitectura

```bash
# Ver resumen completo
./cbm.sh architecture
```

Esto te muestra:
- ✅ Lenguajes usados
- ✅ Distribución de archivos
- ✅ Clusters funcionales
- ✅ Estadísticas generales

---

## 📋 Paso 4: Ver Todas las Rutas HTTP

```bash
# Listar rutas
./cbm.sh routes
```

**Output esperado:**
```
POST    /auth/login
POST    /auth/register
GET     /auth/me
GET     /projects/
POST    /projects/
...
```

Útil para:
- 📝 Documentar API
- 🔍 Encontrar endpoints
- 🔐 Auditar rutas de auth

---

## 📋 Paso 5: Buscar Componentes

```bash
# Buscar todo relacionado con "Product"
./cbm.sh search Product
```

**Output esperado:**
```
Function: ProductCard - components/shop/products/ProductCard.tsx
Function: ProductGrid - components/shop/products/ProductGrid.tsx
Interface: ProductCardProps - components/shop/products/ProductCard.tsx
...
```

**Más ejemplos:**
```bash
./cbm.sh search Cart      # Todo del carrito
./cbm.sh search Auth      # Todo de autenticación
./cbm.sh search Dashboard # Todo del dashboard
```

---

## 📋 Paso 6: Trazar Dependencias

```bash
# Ver qué usa y qué lo usa
./cbm.sh trace CartProvider
```

Esto te muestra:
- **Callers:** Quién llama a `CartProvider`
- **Callees:** Qué funciones llama `CartProvider`

**Casos de uso:**
- Antes de borrar código
- Entender flujo de datos
- Refactoring seguro

---

## 📋 Paso 7: Encontrar Código Muerto

```bash
# Funciones que nadie usa
./cbm.sh dead-code
```

**Output esperado:**
```
handleOldFeature - lib/utils/old.ts
unusedHelper - components/deprecated/helper.tsx
...
```

Útil para:
- 🧹 Limpieza de código
- 📦 Reducir bundle size
- 🚀 Mejorar performance

---

## 📋 Paso 8: Analizar Impacto de Cambios

```bash
# Antes de hacer commit
./cbm.sh changes
```

Te dice:
- ✅ Qué archivos cambiaron
- ✅ Qué funciones se afectaron
- ✅ Blast radius (alcance del impacto)

**Workflow recomendado:**
```bash
# 1. Haces cambios en ProductCard.tsx
# 2. Antes de commit:
./cbm.sh changes

# 3. Ves que afecta a 15 componentes
# 4. Revisas esos componentes
# 5. Commit seguro
```

---

## 📋 Paso 9: Visualizar en 3D 🎨

```bash
# Iniciar UI
./cbm.sh ui
```

Luego abre: **http://localhost:9749**

**Qué verás:**
- 🌐 Grafo 3D interactivo
- 🎨 Nodos coloreados por tipo
  - 🔵 Funciones
  - 🟢 Clases
  - 🟡 Módulos
- 🔗 Líneas mostrando relaciones
- 📊 Clusters agrupados

**Controles:**
- 🖱️ Click + Drag: Rotar
- 🖱️ Scroll: Zoom
- 🖱️ Click en nodo: Ver detalles
- 🔍 Buscar por nombre

---

## 📋 Paso 10: Consultas Avanzadas (Cypher)

Para usuarios avanzados, puedes usar **Cypher** (lenguaje de grafos):

```bash
# Encontrar todas las funciones que llaman a useAuth
codebase-memory-mcp cli query_graph '{
  "query": "MATCH (f:Function)-[:CALLS]->(g) WHERE g.name = \"useAuth\" RETURN f.name, f.file"
}'
```

**Más ejemplos:**

```bash
# Funciones con más de 10 llamadas
codebase-memory-mcp cli query_graph '{
  "query": "MATCH (f:Function)<-[r:CALLS]-() WITH f, count(r) as calls WHERE calls > 10 RETURN f.name, calls ORDER BY calls DESC"
}'

# Componentes que importan React
codebase-memory-mcp cli query_graph '{
  "query": "MATCH (f:Function)-[:IMPORTS]->(m) WHERE m.name = \"react\" RETURN f.name LIMIT 20"
}'
```

---

## 💡 Tips y Trucos

### 1. **Alias útiles**

Agrega a tu `~/.bashrc`:

```bash
alias cbm='./cbm.sh'
alias cbm-ui='codebase-memory-mcp --ui=true --port=9749'
```

Ahora puedes usar:
```bash
cbm search Product
cbm-ui
```

### 2. **Buscar en archivos específicos**

```bash
codebase-memory-mcp cli search_code '{
  "query": "useState",
  "file_pattern": "components/shop/**/*.tsx"
}'
```

### 3. **Exportar resultados**

```bash
./cbm.sh architecture > architecture.json
./cbm.sh routes > routes.txt
```

### 4. **Integrar con CI/CD**

```bash
# En GitHub Actions
- name: Check for dead code
  run: |
    ./cbm.sh dead-code | tee dead-code-report.txt
    if [ -s dead-code-report.txt ]; then
      echo "⚠️ Found dead code!"
    fi
```

---

## 🎯 Workflows Recomendados

### Workflow 1: Nueva Feature
```bash
# 1. Buscar código relacionado
./cbm.sh search ShoppingCart

# 2. Ver dependencias
./cbm.sh trace addToCart

# 3. Implementar feature
# ...

# 4. Verificar impacto
./cbm.sh changes

# 5. Commit
git commit -m "feat: nueva feature de cart"
```

### Workflow 2: Refactoring
```bash
# 1. Identificar código a refactorizar
./cbm.sh search OldComponent

# 2. Ver quién lo usa
./cbm.sh trace OldComponent

# 3. Refactorizar con confianza
# ...

# 4. Verificar que nada se rompió
./cbm.sh changes
```

### Workflow 3: Code Review
```bash
# 1. Checkout del PR
git checkout feature/nueva-feature

# 2. Ver qué cambió
./cbm.sh changes

# 3. Analizar clusters afectados
./cbm.sh clusters

# 4. Revisar en UI 3D
./cbm.sh ui
```

---

## ❓ FAQ

**P: ¿Necesito re-indexar manualmente?**  
R: No, con `auto_index = true` se re-indexa automáticamente.

**P: ¿Funciona con otros lenguajes?**  
R: Sí, soporta 158 lenguajes. TypeScript/JavaScript tienen soporte completo.

**P: ¿Consume muchos recursos?**  
R: No, indexa en ~500ms y libera memoria después.

**P: ¿Puedo usarlo en CI/CD?**  
R: Sí, todos los comandos CLI son automatizables.

**P: ¿Se sincroniza con Git?**  
R: Sí, detecta cambios automáticamente.

---

## 🎓 Siguiente Nivel

Una vez domines lo básico:

1. **Lee la documentación completa:**  
   [`docs/architecture/CODEBASE_MEMORY_MCP.md`](./CODEBASE_MEMORY_MCP.md)

2. **Explora Cypher queries:**  
   [openCypher Documentation](https://opencypher.org/)

3. **Integra con tu IDE:**  
   Configura atajos de teclado para comandos comunes

4. **Automatiza con scripts:**  
   Crea tus propios helpers basados en `cbm.sh`

---

## 📚 Recursos

- 📖 [Documentación completa](./CODEBASE_MEMORY_MCP.md)
- 📊 [Resumen de integración](./CBM_INTEGRATION_SUMMARY.md)
- 🐙 [GitHub oficial](https://github.com/DeusData/codebase-memory-mcp)
- 📄 [Paper de investigación](https://arxiv.org/abs/2603.27277)

---

## 🎉 ¡Listo!

Ya sabes usar **codebase-memory-mcp** en V1TR0.

**Recuerda:**
- ⚡ 99% menos tokens
- 🚀 Exploración instantánea
- 🎨 Visualización 3D
- 🔍 Zero grep manual

**¡Feliz coding!** 🚀
