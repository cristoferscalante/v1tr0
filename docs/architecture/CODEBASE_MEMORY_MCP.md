# Codebase Memory MCP - Guía de Uso para V1TR0

## ¿Qué es?

**codebase-memory-mcp** es un motor de inteligencia de código que construye un grafo de conocimiento persistente de todo nuestro codebase. Indexa el proyecto completo en segundos y permite consultas estructurales ultra-rápidas.

## Beneficios para V1TR0

### 1. **Navegación Inteligente del Código (99% menos tokens)**
En lugar de que los agentes de IA lean archivo por archivo consumiendo ~412,000 tokens, pueden hacer consultas estructurales que consumen solo ~3,400 tokens.

### 2. **Análisis de Arquitectura Instantáneo**
- Ve todos los componentes y su estructura
- Identifica clusters funcionales
- Detecta puntos críticos (hotspots)
- Mapea rutas HTTP automáticamente

### 3. **Trazado de Dependencias**
- ¿Qué funciones llaman a `useAuth`?
- ¿Qué componentes dependen de `CartContext`?
- ¿Qué archivos importan cierto módulo?

### 4. **Detección de Código Muerto**
Encuentra funciones, componentes o módulos que nunca se usan.

### 5. **Análisis de Impacto**
Antes de cambiar código, ve qué se va a afectar:
```bash
codebase-memory-mcp cli detect_changes
```

### 6. **Visualización 3D del Grafo**
Explora la arquitectura visualmente en `http://localhost:9749`

## Instalación

Ya está instalado y configurado en este proyecto. Se instaló con:

```bash
curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh | bash -s -- --ui
```

## Configuración Actual

- **Auto-indexación:** ✅ Habilitada
- **Límite de archivos:** 100,000
- **UI de visualización:** ✅ Disponible
- **Base de datos:** `~/.cache/codebase-memory-mcp/`

## Estadísticas del Proyecto V1TR0

```
📊 Nodos:    3,566 (funciones, clases, componentes, rutas)
🔗 Edges:    5,348 (relaciones, llamadas, importaciones)
📁 Archivos: 346
🗣️ Lenguajes:
   - TypeScript: 254 archivos
   - SQL: 13 archivos
   - CSS: 7 archivos
   - JavaScript: 5 archivos
```

## Uso con Agentes de IA

### Desde OpenCode (este agente)

Simplemente pregunta:

- "¿Qué componentes usan el CartContext?"
- "Muéstrame el call graph de la función handleCheckout"
- "¿Qué rutas HTTP tenemos definidas?"
- "Encuentra código muerto en el proyecto"
- "¿Qué se va a afectar si modifico ProductCard?"

El agente automáticamente usará codebase-memory-mcp para responder.

### Comandos CLI Directos

#### Ver arquitectura general
```bash
codebase-memory-mcp cli get_architecture '{
  "aspects": ["summary", "languages", "routes", "clusters", "hotspots"]
}'
```

#### Buscar por patrón
```bash
codebase-memory-mcp cli search_graph '{
  "name_pattern": ".*Product.*",
  "label": "Function"
}'
```

#### Trazar llamadas
```bash
codebase-memory-mcp cli trace_path '{
  "function_name": "addToCart",
  "direction": "both",
  "depth": 3
}'
```

#### Detectar cambios y su impacto
```bash
codebase-memory-mcp cli detect_changes '{
  "include_blast_radius": true
}'
```

#### Buscar código
```bash
codebase-memory-mcp cli search_code '{
  "query": "useEffect",
  "file_pattern": "*.tsx"
}'
```

#### Consultas Cypher (grafo avanzado)
```bash
codebase-memory-mcp cli query_graph '{
  "query": "MATCH (f:Function)-[:CALLS]->(g) WHERE f.name CONTAINS \"Product\" RETURN f.name, g.name LIMIT 10"
}'
```

#### Detectar código muerto
```bash
codebase-memory-mcp cli query_graph '{
  "query": "MATCH (f:Function) WHERE NOT EXISTS { (f)<-[:CALLS]-() } RETURN f.name, f.file"
}'
```

## Arquitectura Detectada

### Rutas HTTP Principales
```
POST /auth/login
POST /auth/register
GET  /auth/me
GET  /projects/
POST /projects/
GET  /projects/:id
GET  /meetings/project/:projectId
POST /meetings/
GET  /ai/chat/:projectId
GET  /ai/insights/:projectId
```

### Clusters Funcionales Principales

1. **Cluster 4** (45 miembros) - UI Components
   - Card, MultiSelect, TaskCard, TimelineFilters

2. **Cluster 13** (44 miembros) - Admin & Theme
   - useTheme, PaquetesAdminPage, CharacterBackground

3. **Cluster 0** (38 miembros) - Auth & Projects
   - useAuth, ProjectTasks, ProjectsPage

4. **Cluster 12** (36 miembros) - CRUD Operations
   - getAll, create, About, useDeviceDetection

## Visualización del Grafo

Inicia el servidor UI:

```bash
codebase-memory-mcp --ui=true --port=9749
```

Luego abre: `http://localhost:9749`

Verás una visualización 3D interactiva de todo el codebase con:
- Nodos coloreados por tipo (función, clase, módulo)
- Edges mostrando relaciones
- Clusters agrupados
- Zoom y navegación 3D

## Integración con Git

El sistema detecta cambios automáticamente. Cada vez que:
- Haces commit
- Cambias de rama
- Pulls nuevos cambios

El grafo se actualiza automáticamente.

## Compartir el Grafo con el Equipo

Puedes exportar el grafo comprimido para que tu equipo no tenga que re-indexar:

```bash
# El grafo se guarda automáticamente en:
.codebase-memory/graph.db.zst
```

Si haces commit de este archivo, tus compañeros de equipo pueden:
1. Clonar el repo
2. El sistema detecta el archivo
3. Importa el grafo (en segundos)
4. Solo indexa los cambios nuevos

## Ignorar Archivos

Crea `.cbmignore` en la raíz del proyecto (sintaxis gitignore):

```
# Ejemplo
*.test.ts
**/mocks/**
**/__snapshots__/**
```

## Casos de Uso Prácticos para V1TR0

### 1. Antes de Refactorizar
```bash
# Ver qué usa CartContext
codebase-memory-mcp cli search_graph '{
  "name_pattern": ".*Cart.*"
}'

# Ver quién llama a estas funciones
codebase-memory-mcp cli trace_path '{
  "function_name": "addToCart",
  "direction": "inbound"
}'
```

### 2. Auditar Rutas HTTP
```bash
codebase-memory-mcp cli get_architecture '{
  "aspects": ["routes"]
}'
```

### 3. Encontrar Componentes Sin Usar
```bash
codebase-memory-mcp cli query_graph '{
  "query": "MATCH (c:Function) WHERE c.name ENDS WITH \"Component\" AND NOT EXISTS { (c)<-[:CALLS|IMPORTS]-() } RETURN c.name, c.file"
}'
```

### 4. Ver Dependencias de un Componente
```bash
codebase-memory-mcp cli trace_path '{
  "function_name": "ProductCard",
  "direction": "outbound",
  "depth": 2
}'
```

### 5. Análisis de Seguridad
```bash
# Encuentra todas las funciones que manejan auth
codebase-memory-mcp cli search_graph '{
  "name_pattern": ".*(auth|Auth|login|password|token).*",
  "label": "Function"
}'
```

## Mantenimiento

### Ver proyectos indexados
```bash
codebase-memory-mcp cli list_projects
```

### Re-indexar (si algo sale mal)
```bash
codebase-memory-mcp cli delete_project '{
  "project": "home-efren-cyborg-1.Cyborg-Town-3.V1TR0-Town-1.proyectos-endogenos-1.v1tr0-proyec-1.v1tr0-web"
}'

codebase-memory-mcp cli index_repository '{
  "repo_path": "."
}'
```

### Actualizar codebase-memory-mcp
```bash
codebase-memory-mcp update
```

### Ver configuración
```bash
codebase-memory-mcp config list
```

## Soporte Multi-Lenguaje

El sistema soporta 158 lenguajes, pero tiene **Hybrid LSP** (resolución semántica de tipos) para:

- ✅ TypeScript/JavaScript/JSX/TSX (lo que usamos)
- ✅ Python
- ✅ Go
- ✅ Rust
- ✅ Java/Kotlin
- ✅ C/C++
- ✅ C#
- ✅ PHP

Esto significa que para estos lenguajes, el grafo no solo conoce sintaxis, sino que **entiende tipos**, herencia, genéricos, etc.

## Seguridad y Privacidad

- ✅ **100% local** - tu código nunca sale de tu máquina
- ✅ **Sin API keys** - no necesita conexión a internet
- ✅ **Código abierto** - puedes auditar el source
- ✅ **Binarios verificados** - checksums SHA-256 + VirusTotal (0/72 detecciones)
- ✅ **SLSA Level 3** - provenance criptográfica de builds

## Performance

- Indexación inicial: **~0.5 segundos** (346 archivos)
- Re-indexación incremental: **<0.1 segundos**
- Consultas: **<1ms** para la mayoría
- Memoria: Liberada después de indexar
- Storage: `~2-5MB` comprimido

## Recursos Adicionales

- [Documentación oficial](https://deusdata.github.io/codebase-memory-mcp/)
- [GitHub Repository](https://github.com/DeusData/codebase-memory-mcp)
- [Paper de investigación](https://arxiv.org/abs/2603.27277)

## Troubleshooting

### El agente no ve el servidor MCP
```bash
# Verificar configuración
cat ~/.config/opencode/opencode.json | grep codebase

# Reiniciar el agente
```

### Indexación falla
```bash
# Ver logs detallados
export CBM_LOG_LEVEL=debug
codebase-memory-mcp cli index_repository '{"repo_path": "."}'
```

### Queries lentas
```bash
# Ver estadísticas
codebase-memory-mcp cli get_graph_schema
```

---

## Conclusión

codebase-memory-mcp convierte nuestro codebase en un **grafo de conocimiento navegable**, permitiendo a los agentes de IA (y a nosotros) entender la arquitectura sin leer miles de líneas de código.

**Ahorro estimado:** 99.2% en tokens (de ~412K a ~3.4K por sesión)

**Tiempo ahorrado:** Horas de exploración manual → Segundos de consultas estructuradas
