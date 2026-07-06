# V1TR0 Open Design - Guía de Uso

## 🎨 Configuración Completa

Este proyecto ahora está configurado con **Open Design** para generar componentes, prototipos y assets visuales de forma automática siguiendo la identidad de marca V1TR0.

---

## 📁 Archivos Creados

```
v1tr0-web/
├── DESIGN.md                      # ⭐ Sistema de diseño completo
├── .opendesign/
│   ├── config.json                # Configuración de Open Design
│   └── skills/
│       └── README.md              # Skills personalizados V1TR0
└── scripts/
    └── generate-design.sh         # Script de generación automática
```

---

## 🚀 Instalación de Open Design

### Opción 1: Desktop App (Recomendado para GUI)

Descarga la app desde:
- **Linux:** https://github.com/nexu-io/open-design/releases/tag/open-design-v0.13.0
- Descarga: `open-design-0.13.0-linux-x64.AppImage`

```bash
# Hacer ejecutable
chmod +x open-design-0.13.0-linux-x64.AppImage

# Ejecutar
./open-design-0.13.0-linux-x64.AppImage
```

### Opción 2: MCP Server (Para uso con OpenCode)

```bash
# Instalar Open Design globalmente
npm install -g open-design

# Configurar MCP server para OpenCode
pnpm run od:mcp

# O manualmente:
od mcp install opencode
```

Esto configurará el servidor MCP en `~/.config/opencode/mcp.json` automáticamente.

---

## 💻 Uso desde la Línea de Comandos

### Scripts NPM disponibles

```bash
# Iniciar script interactivo de generación
pnpm run od:generate

# Generar componente específico
pnpm run od:component -- --type hero-section --name HeroV1tr0

# Generar prototipo
pnpm run od:prototype -- --skill landing-page --name landing-v1tr0

# Generar asset visual
pnpm run od:asset -- --prompt "Modern dashboard hero" --size 1920x1080

# Iniciar servidor MCP
pnpm run od:server
```

### Script Interactivo

El script `./scripts/generate-design.sh` ofrece un menú interactivo:

```bash
./scripts/generate-design.sh
```

**Opciones disponibles:**
1. Componente de landing page (Hero Section)
2. Widget de dashboard (Stats Widget)
3. Card de producto (E-commerce Card)
4. Formulario de contacto
5. Hero section con 3D
6. Prototipo de landing completo
7. Asset visual (imagen hero)
8. Generar suite completa (todo lo anterior)

---

## 🎯 Uso con OpenCode (MCP)

Una vez configurado el MCP server, puedes usar Open Design directamente desde OpenCode:

```typescript
// Ejemplo de prompt en OpenCode:
"Usa open-design para generar un hero section siguiendo DESIGN.md de V1TR0"

// OpenCode llamará automáticamente al MCP server y generará el componente
```

---

## 📦 Componentes Generados

Los componentes se guardarán en:

```
public/generated/
├── prototypes/        # Prototipos HTML completos
├── components/        # Componentes React individuales  
└── assets/           # Imágenes, videos, etc.

components/generated/  # Componentes React en el proyecto
```

---

## 🎨 Skills Personalizados V1TR0

Estos skills están predefinidos para la marca V1TR0:

### 1. **Landing Hero 3D** (`landing-hero-3d`)
Hero section con elementos 3D interactivos usando Three.js

### 2. **Dashboard Stats** (`dashboard-stats`)
Widget de estadísticas con gráficos y KPIs

### 3. **Product Card** (`product-card`)
Card de e-commerce con imagen, precio y CTA

### 4. **Contact Form** (`contact-form`)
Formulario con validación y estados de loading

### 5. **Feature Card** (`feature-card`)
Card de características con iconos

### 6. **Pricing Card** (`pricing-card`)
Card de planes con features y CTAs

### 7. **Testimonial** (`testimonial`)
Card de testimonial con avatar y quote

### 8. **Footer** (`footer`)
Footer completo con links y newsletter

---

## 🌈 Paleta de Colores V1TR0

```css
Primary:   #08a696  (Teal)
Accent:    #1e7d7d  (Dark Teal)
Highlight: #26ffdf  (Cyan - para glow effects)
```

Todos los componentes generados usarán automáticamente estos colores.

---

## ✨ Efectos Especiales

### Glow Effects
Los componentes V1TR0 incluyen efectos de glow característicos:

```html
<!-- Automáticamente aplicados en: -->
- Botones CTA (hover:shadow-glow)
- Cards destacadas (shadow-glow)
- Títulos en dark mode (text-glow)
```

### Animaciones
- Slide in (entrada de componentes)
- Scale on hover (botones y cards)
- Fade in (carga de contenido)

---

## 📖 Ejemplos de Generación

### Ejemplo 1: Generar Hero Section

```bash
od generate component \
  --design-system ./DESIGN.md \
  --type hero-section \
  --name HeroV1tr0 \
  --description "Hero section principal con gradientes y glow effects" \
  --output ./components/generated \
  --format react-tsx
```

### Ejemplo 2: Generar Landing Completo

```bash
od generate prototype \
  --design-system ./DESIGN.md \
  --skill landing-page \
  --name landing-v1tr0-complete \
  --output ./public/generated/prototypes \
  --format html
```

### Ejemplo 3: Generar Imagen Hero

```bash
od generate image \
  --design-system ./DESIGN.md \
  --prompt "Modern SaaS dashboard with teal accents and glow effects, V1TR0 branding, futuristic UI, 3D elements" \
  --output ./public/generated/assets \
  --format webp \
  --size 1920x1080
```

---

## 🔧 Configuración Avanzada

### Archivo `.opendesign/config.json`

Este archivo controla todos los aspectos de generación:

- **design.systemPath:** Ruta al DESIGN.md
- **components.library:** Biblioteca de componentes (shadcn-ui)
- **generation.outputDir:** Directorios de salida
- **ai.provider:** Proveedor de IA (opencode)
- **ai.model:** Modelo a usar (claude-sonnet-4.5)

### Personalizar System Prompt

Edita `ai.systemPrompt` en `config.json` para cambiar el comportamiento de generación.

---

## 🎬 Workflow Completo

### Para una nueva feature:

1. **Define el componente:**
   ```bash
   pnpm run od:generate
   # Selecciona el tipo de componente
   ```

2. **Revisa el código generado:**
   ```bash
   # El componente estará en:
   components/generated/TuComponente.tsx
   ```

3. **Importa y usa:**
   ```tsx
   import { HeroV1tr0 } from '@/components/generated/HeroV1tr0';
   
   export default function LandingPage() {
     return <HeroV1tr0 />;
   }
   ```

4. **Personaliza si es necesario:**
   El componente ya sigue DESIGN.md, pero puedes ajustar detalles específicos.

---

## 📚 Recursos

### Documentación de Open Design
- GitHub: https://github.com/nexu-io/open-design
- Docs: https://open-design.ai/docs

### DESIGN.md V1TR0
Consulta `DESIGN.md` para ver todas las especificaciones de diseño:
- Colores y paletas
- Tipografía
- Espaciado
- Componentes
- Animaciones
- Patrones de uso

---

## 🐛 Troubleshooting

### Error: "od: command not found"

```bash
# Instalar Open Design
npm install -g open-design

# Verificar instalación
od --version
```

### Error: "DESIGN.md not found"

```bash
# Verificar que existe el archivo
ls -la DESIGN.md

# El script busca en la raíz del proyecto
```

### MCP Server no conecta

```bash
# Verificar configuración
cat ~/.config/opencode/mcp.json

# Reinstalar MCP
od mcp install opencode --force
```

---

## 🎉 ¡Listo para usar!

Ahora puedes:

1. ✅ **Generar componentes** consistentes con la marca V1TR0
2. ✅ **Crear prototipos** de nuevas features automáticamente
3. ✅ **Producir assets visuales** (imágenes, videos) branded
4. ✅ **Automatizar el diseño** con scripts y MCP

**Siguiente paso recomendado:**
```bash
# Prueba el generador interactivo
./scripts/generate-design.sh

# Selecciona opción 8 para generar la suite completa
```

---

**Creado para V1TR0 Team** 🚀
