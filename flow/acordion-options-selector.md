{
  "componentName": "Cat Accordion / Options Selector",
  "description": "Un componente interactivo tipo acordeón con imágenes de gatos que se expande al hacer clic, con diseño responsivo completo",
  "architecture": {
    "framework": "Next.js 14+ con App Router",
    "language": "TypeScript",
    "styling": "CSS-in-JS con estilos inline + Tailwind CSS",
    "stateManagement": "React useState (local state)"
  },
  "dependencies": {
    "required": [
      "react",
      "next",
      "typescript"
    ],
    "external": [
      "Font Awesome 5.15.4 (CDN)",
      "Google Fonts - Roboto (CDN)"
    ],
    "optional": [
      "tailwindcss (para utilidades adicionales)",
      "@types/react",
      "@types/node"
    ]
  },
  "assets": {
    "images": [
      {
        "file": "tabby-cat.png",
        "description": "Gato con gafas de sol",
        "usage": "Opción 1 - Cool cat"
      },
      {
        "file": "cat-hat.png", 
        "description": "Gato con sombrero de verano",
        "usage": "Opción 2 - Poolside vibes"
      },
      {
        "file": "cat-box.png",
        "description": "Gato en una caja",
        "usage": "Opción 3 - Box explorer"
      },
      {
        "file": "cracker-cat.png",
        "description": "Gato comiendo galleta",
        "usage": "Opción 4 - Snack time"
      },
      {
        "file": "galaxy-cat.png",
        "description": "Gato espacial/cósmico",
        "usage": "Opción 5 - Cosmic kitty"
      }
    ],
    "icons": [
      "fas fa-glasses",
      "fas fa-sun", 
      "fas fa-box",
      "fas fa-cookie-bite",
      "fas fa-star"
    ]
  },
  "fileStructure": {
    "components/": {
      "options-selector.tsx": "Componente principal del acordeón"
    },
    "public/": {
      "tabby-cat.png": "Imagen del gato con gafas",
      "cat-hat.png": "Imagen del gato con sombrero",
      "cat-box.png": "Imagen del gato en caja",
      "cracker-cat.png": "Imagen del gato comiendo",
      "galaxy-cat.png": "Imagen del gato espacial"
    },
    "app/": {
      "page.tsx": "Página principal que usa el componente",
      "layout.tsx": "Layout con fuentes Geist",
      "globals.css": "Estilos globales de Tailwind"
    }
  },
  "coreFeatures": {
    "interactivity": {
      "clickToExpand": "Al hacer clic en una opción se expande mostrando más información",
      "smoothTransitions": "Transiciones suaves con cubic-bezier personalizado",
      "activeState": "Manejo de estado activo con useState"
    },
    "responsive": {
      "desktop": "Layout horizontal tipo acordeón",
      "tablet": "Layout vertical con opciones inactivas como círculos",
      "mobile": "Adaptación completa para pantallas pequeñas"
    },
    "styling": {
      "backgroundImages": "Cada opción tiene imagen de fondo personalizada",
      "colorScheme": "Colores únicos por opción (#ED5565, #FC6E51, etc.)",
      "typography": "Fuente Roboto con pesos 400 y 700"
    }
  },
  "dataStructure": {
    "OptionData": {
      "id": "number - Identificador único",
      "background": "string - Ruta de la imagen de fondo",
      "icon": "string - Clase de Font Awesome",
      "main": "string - Texto principal",
      "sub": "string - Texto secundario",
      "defaultColor": "string - Color hex para el ícono"
    }
  },
  "bestPractices": {
    "structure": {
      "recommendation": "Separar en múltiples componentes para mejor mantenimiento",
      "suggested": [
        "OptionItem.tsx - Componente individual de opción",
        "OptionsContainer.tsx - Contenedor principal",
        "types/index.ts - Definiciones de TypeScript",
        "constants/optionsData.ts - Datos de configuración"
      ]
    },
    "styling": {
      "recommendation": "Migrar CSS-in-JS a archivos CSS modules o styled-components",
      "benefits": "Mejor performance, separación de responsabilidades, reutilización"
    },
    "assets": {
      "recommendation": "Optimizar imágenes y usar Next.js Image component",
      "formats": "WebP para mejor compresión, lazy loading automático"
    },
    "accessibility": {
      "improvements": [
        "Agregar aria-labels y roles ARIA",
        "Soporte para navegación por teclado",
        "Alt text para imágenes",
        "Focus indicators visibles"
      ]
    }
  },
  "implementation": {
    "steps": [
      "1. Crear estructura de carpetas según fileStructure",
      "2. Instalar dependencias listadas",
      "3. Copiar assets a public/",
      "4. Implementar componente options-selector.tsx",
      "5. Configurar layout.tsx con fuentes",
      "6. Usar componente en page.tsx",
      "7. Probar responsividad en diferentes dispositivos"
    ],
    "customization": {
      "easyChanges": [
        "Cambiar imágenes en public/",
        "Modificar textos en optionsData array",
        "Ajustar colores en defaultColor",
        "Cambiar íconos de Font Awesome"
      ],
      "advancedChanges": [
        "Modificar breakpoints responsivos",
        "Cambiar animaciones y transiciones",
        "Agregar más opciones al array",
        "Integrar con APIs externas"
      ]
    }
  },
  "performance": {
    "considerations": [
      "Lazy loading de imágenes",
      "Optimización de CSS crítico",
      "Preload de fuentes importantes",
      "Minimizar re-renders con useMemo/useCallback"
    ]
  },
  "scalability": {
    "dataSource": "Actualmente hardcoded, fácil migrar a CMS o API",
    "internationalization": "Preparado para i18n en textos main/sub",
    "theming": "Colores centralizados, fácil implementar tema oscuro"
  }
}