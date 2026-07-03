# Codebase Memory MCP - Grafo de Conocimiento

## Estado Actual
✅ **Grafo indexado y funcionando**

- **Proyecto**: `home-efren-cyborg-1.Cyborg-Town-3.V1TR0-Town-1.proyectos-endogenos-1.v1tr0-proyec-1.v1tr0-web`
- **Nodos**: 3,762
- **Relaciones**: 5,597
- **Archivos**: 354
- **Tamaño**: ~12.7 MB

## Cómo Funciona

El grafo de código se actualiza **automáticamente** después de cada commit mediante un hook de Git (`.husky/post-commit`).

### Ubicación del Grafo
```
~/.cache/codebase-memory-mcp/
└── home-efren-cyborg-1.Cyborg-Town-3.V1TR0-Town-1.proyectos-endogenos-1.v1tr0-proyec-1.v1tr0-web.db
```

## Comandos Disponibles

### Usando el script helper (`./cbm.sh`)

```bash
# Ver arquitectura general
./cbm.sh architecture

# Ver rutas HTTP
./cbm.sh routes

# Ver clusters funcionales  
./cbm.sh clusters

# Buscar funciones/componentes
./cbm.sh search ProductCard

# Trazar llamadas de función
./cbm.sh trace handleAddToCart

# Encontrar código muerto
./cbm.sh dead-code

# Detectar cambios e impacto
./cbm.sh changes

# Ver estadísticas
./cbm.sh stats

# Re-indexar manualmente
./cbm.sh reindex

# Abrir UI visual (puerto 9749)
./cbm.sh ui
```

## Actualización Manual

Si el grafo se pierde o necesita re-indexarse:

```bash
# Limpiar cache corrupta
rm -rf ~/.cache/codebase-memory-mcp/

# Re-indexar el proyecto
codebase-memory-mcp cli index_repository '{"repo_path": "/home/efren-cyborg/1.Cyborg-Town/3.V1TR0-Town/1.proyectos-endogenos-/1.v1tr0-proyec/1.v1tr0-web", "project": "v1tr0-web"}'
```

## Mantenimiento Automático

### Hook Post-Commit
El archivo `.husky/post-commit` re-indexa el grafo después de cada commit en segundo plano.

### Prevenir Pérdida del Grafo

**✅ NO hacer:**
- `rm -rf ~/.cache/*` (elimina el grafo)
- Borrar manualmente la carpeta `~/.cache/codebase-memory-mcp/`

**✅ SÍ hacer:**
- Commitear regularmente (actualiza el grafo automáticamente)
- Usar `./cbm.sh stats` para verificar el estado
- Re-indexar manualmente si es necesario

## Archivos Ignorados

Ver `.cbmignore` para la lista de archivos/carpetas excluidos del grafo:
- `.next/`, `node_modules/`, `dist/`
- Tests (`*.test.ts`, `*.spec.tsx`)
- Archivos de lock (`pnpm-lock.yaml`)
- Logs y temporales

## Troubleshooting

### El grafo no se carga
```bash
./cbm.sh stats
# Si muestra "No projects indexed", ejecutar:
./cbm.sh reindex
```

### Error de base de datos corrupta
```bash
rm -rf ~/.cache/codebase-memory-mcp/
./cbm.sh reindex
```

### Verificar estado
```bash
codebase-memory-mcp cli list_projects
```

## Beneficios del Grafo

- 🔍 **Búsqueda rápida**: Encuentra funciones, componentes, rutas
- 🔗 **Trazabilidad**: Ve quién llama a qué
- 📊 **Arquitectura**: Clusters, patrones, dependencias
- 🧹 **Código muerto**: Detecta funciones no usadas
- 💥 **Impacto de cambios**: Analiza blast radius
- 🎨 **Visualización**: UI 3D del grafo

## Documentación

- MCP Instructions: `~/.config/opencode/AGENTS.md` (sección codebase-memory-mcp)
- Script Helper: `./cbm.sh` (lista comandos)
