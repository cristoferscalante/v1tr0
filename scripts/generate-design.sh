#!/bin/bash

# V1TR0 Open Design - Script de Automatización de Componentes
# Genera componentes de diseño usando Open Design con la marca V1TR0

set -e

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Directorio base del proyecto
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DESIGN_FILE="$PROJECT_DIR/DESIGN.md"
OUTPUT_DIR="$PROJECT_DIR/public/generated"
COMPONENTS_DIR="$PROJECT_DIR/components/generated"

echo -e "${BLUE}==================================${NC}"
echo -e "${BLUE}  V1TR0 Open Design Generator${NC}"
echo -e "${BLUE}==================================${NC}\n"

# Verificar que existe DESIGN.md
if [ ! -f "$DESIGN_FILE" ]; then
    echo -e "${RED}Error: DESIGN.md no encontrado${NC}"
    echo "Ubicación esperada: $DESIGN_FILE"
    exit 1
fi

echo -e "${GREEN}✓${NC} DESIGN.md encontrado"

# Crear directorios si no existen
mkdir -p "$OUTPUT_DIR/prototypes"
mkdir -p "$OUTPUT_DIR/components"
mkdir -p "$OUTPUT_DIR/assets"
mkdir -p "$COMPONENTS_DIR"

echo -e "${GREEN}✓${NC} Directorios de salida creados"

# Función para generar componente
generate_component() {
    local component_type=$1
    local component_name=$2
    local description=$3
    
    echo -e "\n${YELLOW}Generando:${NC} $component_name ($component_type)"
    
    # Verificar que Open Design está instalado
    if ! command -v od &> /dev/null; then
        echo -e "${RED}Error: Open Design CLI no está instalado${NC}"
        echo "Instala con: npm install -g open-design"
        exit 1
    fi
    
    # Generar componente usando Open Design
    od generate component \
        --design-system "$DESIGN_FILE" \
        --type "$component_type" \
        --name "$component_name" \
        --description "$description" \
        --output "$COMPONENTS_DIR" \
        --format react-tsx
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} Componente generado: $component_name"
    else
        echo -e "${RED}✗${NC} Error al generar $component_name"
    fi
}

# Función para generar prototipo
generate_prototype() {
    local prototype_type=$1
    local prototype_name=$2
    local description=$3
    
    echo -e "\n${YELLOW}Generando prototipo:${NC} $prototype_name ($prototype_type)"
    
    od generate prototype \
        --design-system "$DESIGN_FILE" \
        --skill "$prototype_type" \
        --name "$prototype_name" \
        --description "$description" \
        --output "$OUTPUT_DIR/prototypes" \
        --format html
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} Prototipo generado: $prototype_name"
    else
        echo -e "${RED}✗${NC} Error al generar prototipo $prototype_name"
    fi
}

# Función para generar asset visual
generate_asset() {
    local asset_type=$1
    local asset_name=$2
    local prompt=$3
    
    echo -e "\n${YELLOW}Generando asset:${NC} $asset_name ($asset_type)"
    
    od generate image \
        --design-system "$DESIGN_FILE" \
        --type "$asset_type" \
        --name "$asset_name" \
        --prompt "$prompt" \
        --output "$OUTPUT_DIR/assets" \
        --format webp \
        --size 1920x1080
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} Asset generado: $asset_name"
    else
        echo -e "${RED}✗${NC} Error al generar asset $asset_name"
    fi
}

# Menú interactivo
show_menu() {
    echo -e "\n${BLUE}¿Qué deseas generar?${NC}"
    echo "1) Componente de landing page"
    echo "2) Widget de dashboard"
    echo "3) Card de producto (e-commerce)"
    echo "4) Formulario de contacto"
    echo "5) Hero section con 3D"
    echo "6) Prototipo de landing completo"
    echo "7) Asset visual (imagen hero)"
    echo "8) Generar todo (componentes + prototipos + assets)"
    echo "9) Salir"
    echo -n "Selecciona una opción [1-9]: "
}

# Loop principal
while true; do
    show_menu
    read -r option
    
    case $option in
        1)
            generate_component "hero-section" "HeroV1tr0" "Hero section principal con gradientes y glow effects"
            ;;
        2)
            generate_component "dashboard-widget" "ProjectStatsWidget" "Widget de estadísticas de proyectos con charts"
            ;;
        3)
            generate_component "product-card" "ProductCardV1tr0" "Card de producto con imagen, precio y botón CTA"
            ;;
        4)
            generate_component "contact-form" "ContactFormV1tr0" "Formulario de contacto con validación y estados de loading"
            ;;
        5)
            generate_component "hero-3d" "Hero3DV1tr0" "Hero section con elementos 3D usando Three.js"
            ;;
        6)
            generate_prototype "landing-page" "landing-v1tr0" "Landing page completa con hero, features, pricing y footer"
            ;;
        7)
            generate_asset "hero-image" "hero-dashboard-v1tr0" "Modern SaaS dashboard with teal accents and glow effects, V1TR0 branding, futuristic UI"
            ;;
        8)
            echo -e "\n${BLUE}Generando suite completa...${NC}\n"
            
            # Componentes
            generate_component "hero-section" "HeroV1tr0" "Hero section principal"
            generate_component "feature-card" "FeatureCardV1tr0" "Card de característica"
            generate_component "pricing-card" "PricingCardV1tr0" "Card de pricing"
            generate_component "testimonial" "TestimonialV1tr0" "Testimonial card"
            generate_component "footer" "FooterV1tr0" "Footer con enlaces y social"
            
            # Prototipos
            generate_prototype "landing-page" "landing-complete-v1tr0" "Landing page completa"
            generate_prototype "dashboard" "dashboard-v1tr0" "Dashboard de proyectos"
            
            # Assets
            generate_asset "hero-image" "hero-landing" "Modern project management hero"
            generate_asset "feature-image" "feature-dashboard" "Dashboard preview screenshot"
            
            echo -e "\n${GREEN}✓ Suite completa generada${NC}"
            ;;
        9)
            echo -e "\n${BLUE}Saliendo...${NC}\n"
            exit 0
            ;;
        *)
            echo -e "${RED}Opción inválida${NC}"
            ;;
    esac
done
