#!/bin/bash

# Codebase Memory MCP - Helper Script
# Simplifica comandos comunes con el nombre del proyecto

PROJECT_NAME="home-efren-cyborg-1.Cyborg-Town-3.V1TR0-Town-1.proyectos-endogenos-1.v1tr0-proyec-1.v1tr0-web"

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

function show_help() {
    echo -e "${BLUE}Codebase Memory MCP - Helper Commands${NC}\n"
    echo "Uso: ./cbm.sh [comando]"
    echo ""
    echo "Comandos disponibles:"
    echo ""
    echo -e "${GREEN}  architecture${NC}     - Ver resumen de arquitectura"
    echo -e "${GREEN}  routes${NC}           - Listar todas las rutas HTTP"
    echo -e "${GREEN}  clusters${NC}         - Ver clusters funcionales"
    echo -e "${GREEN}  search <patrón>${NC}  - Buscar por nombre (ej: ./cbm.sh search Product)"
    echo -e "${GREEN}  trace <función>${NC}  - Trazar llamadas de una función"
    echo -e "${GREEN}  dead-code${NC}        - Encontrar código muerto"
    echo -e "${GREEN}  changes${NC}          - Detectar cambios y su impacto"
    echo -e "${GREEN}  ui${NC}               - Iniciar visualización 3D"
    echo -e "${GREEN}  reindex${NC}          - Re-indexar el proyecto"
    echo -e "${GREEN}  stats${NC}            - Ver estadísticas del proyecto"
    echo ""
}

function architecture() {
    echo -e "${BLUE}📊 Obteniendo arquitectura...${NC}\n"
    codebase-memory-mcp cli get_architecture "{\"project\": \"$PROJECT_NAME\", \"aspects\": [\"summary\", \"languages\", \"clusters\"]}" 2>&1 | grep -v "^level=" | jq '.'
}

function routes() {
    echo -e "${BLUE}🛣️  Obteniendo rutas HTTP...${NC}\n"
    codebase-memory-mcp cli get_architecture "{\"project\": \"$PROJECT_NAME\", \"aspects\": [\"routes\"]}" 2>&1 | grep -v "^level=" | jq -r '.routes[] | "\(.method)\t\(.path)"' | column -t
}

function clusters() {
    echo -e "${BLUE}🔍 Clusters funcionales...${NC}\n"
    codebase-memory-mcp cli get_architecture "{\"project\": \"$PROJECT_NAME\", \"aspects\": [\"clusters\"]}" 2>&1 | grep -v "^level=" | jq -r '.clusters[] | "Cluster \(.id): \(.members) miembros - \(.top_nodes | join(", "))"'
}

function search() {
    local pattern="$1"
    if [ -z "$pattern" ]; then
        echo -e "${YELLOW}⚠️  Uso: ./cbm.sh search <patrón>${NC}"
        exit 1
    fi
    echo -e "${BLUE}🔍 Buscando: $pattern${NC}\n"
    codebase-memory-mcp cli search_graph "{\"project\": \"$PROJECT_NAME\", \"name_pattern\": \".*$pattern.*\", \"limit\": 20}" 2>&1 | grep -v "^level=" | jq -r '.results[]? | "\(.label): \(.name) - \(.file // "N/A")"'
}

function trace() {
    local func="$1"
    if [ -z "$func" ]; then
        echo -e "${YELLOW}⚠️  Uso: ./cbm.sh trace <función>${NC}"
        exit 1
    fi
    echo -e "${BLUE}🔗 Trazando: $func${NC}\n"
    codebase-memory-mcp cli trace_path "{\"project\": \"$PROJECT_NAME\", \"function_name\": \"$func\", \"direction\": \"both\", \"depth\": 3}" 2>&1 | grep -v "^level=" | jq '.'
}

function dead_code() {
    echo -e "${BLUE}🧹 Buscando código muerto...${NC}\n"
    codebase-memory-mcp cli query_graph "{\"project\": \"$PROJECT_NAME\", \"query\": \"MATCH (f:Function) WHERE NOT EXISTS { (f)<-[:CALLS]-() } RETURN f.name, f.file LIMIT 20\"}" 2>&1 | grep -v "^level=" | jq -r '.results[]? | "\(.["f.name"]) - \(.["f.file"] // "N/A")"'
}

function changes() {
    echo -e "${BLUE}📝 Detectando cambios...${NC}\n"
    codebase-memory-mcp cli detect_changes "{\"project\": \"$PROJECT_NAME\", \"include_blast_radius\": true}" 2>&1 | grep -v "^level=" | jq '.'
}

function start_ui() {
    echo -e "${BLUE}🎨 Iniciando UI en http://localhost:9749${NC}\n"
    codebase-memory-mcp --ui=true --port=9749
}

function reindex() {
    echo -e "${BLUE}🔄 Re-indexando proyecto...${NC}\n"
    codebase-memory-mcp cli index_repository "{\"repo_path\": \".\"}" 2>&1 | grep -v "^level=" | jq '.'
}

function stats() {
    echo -e "${BLUE}📊 Estadísticas del proyecto${NC}\n"
    codebase-memory-mcp cli list_projects 2>&1 | grep -v "^level=" | jq '.'
}

# Comando principal
case "$1" in
    architecture)
        architecture
        ;;
    routes)
        routes
        ;;
    clusters)
        clusters
        ;;
    search)
        search "$2"
        ;;
    trace)
        trace "$2"
        ;;
    dead-code)
        dead_code
        ;;
    changes)
        changes
        ;;
    ui)
        start_ui
        ;;
    reindex)
        reindex
        ;;
    stats)
        stats
        ;;
    *)
        show_help
        ;;
esac
