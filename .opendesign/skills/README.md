# V1TR0 Open Design - Skills Personalizados

## Landing Page Hero with 3D Elements

**Type:** `landing-hero-3d`  
**Framework:** React + Three.js + Framer Motion  
**Brand:** V1TR0

### Descripción
Genera un hero section moderno con elementos 3D interactivos, gradientes de marca V1TR0 y efectos de glow.

### Estructura
```tsx
- Hero container (full viewport height)
- Background gradient (primary to accent)
- 3D element canvas (Three.js)
- Content overlay
  - Título principal (text-7xl)
  - Subtítulo (text-xl)
  - CTA buttons (primary + outline)
- Scroll indicator
```

### Componentes incluidos
- 3D rotating cube/sphere con material teal
- Partículas flotantes con glow effect
- Texto con animación de entrada (slide + fade)
- Botones con hover:shadow-glow

---

## Dashboard Stats Widget

**Type:** `dashboard-stats`  
**Framework:** React + Recharts  
**Brand:** V1TR0

### Descripción
Widget de estadísticas para dashboard con gráficos, KPIs y animaciones.

### Estructura
```tsx
- Widget container (card with shadow-glow)
- Header
  - Título
  - Período selector (dropdown)
- Stats grid (4 KPIs)
  - Valor principal (text-4xl font-bold)
  - Label (text-sm text-muted)
  - Trend indicator (arrow + percentage)
- Chart area (Line/Bar chart con colores V1TR0)
- Footer con última actualización
```

### Datos de ejemplo
```typescript
const stats = [
  { label: 'Proyectos Activos', value: 24, trend: +12 },
  { label: 'Tareas Completadas', value: 156, trend: +8 },
  { label: 'Miembros del Equipo', value: 12, trend: +2 },
  { label: 'Tiempo Ahorrado', value: '24h', trend: +15 }
];
```

---

## E-Commerce Product Card

**Type:** `product-card`  
**Framework:** React  
**Brand:** V1TR0

### Descripción
Card de producto para tienda e-commerce con imagen, precio, rating y CTA.

### Estructura
```tsx
- Card container (hover:shadow-lg hover:-translate-y-1)
- Image container
  - Next/Image optimizado (aspect-ratio 4:3)
  - Badge de descuento (si aplica)
  - Heart icon (favorito)
- Content
  - Categoría (text-sm text-accent)
  - Nombre del producto (text-xl font-semibold)
  - Rating (stars + count)
  - Precio
    - Precio actual (text-3xl font-bold text-primary)
    - Precio anterior (text-lg line-through text-muted)
  - CTA button (bg-primary hover:shadow-glow)
```

---

## Contact Form

**Type:** `contact-form`  
**Framework:** React + react-hook-form + Zod  
**Brand:** V1TR0

### Descripción
Formulario de contacto con validación, estados de carga y feedback visual.

### Campos
```typescript
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  acceptTerms: boolean;
}
```

### Validaciones (Zod)
```typescript
const schema = z.object({
  name: z.string().min(2, 'Nombre muy corto'),
  email: z.string().email('Email inválido'),
  subject: z.string().min(5, 'Asunto requerido'),
  message: z.string().min(20, 'Mensaje debe tener al menos 20 caracteres'),
  acceptTerms: z.boolean().refine(val => val === true, 'Debes aceptar los términos')
});
```

### Estados
- Normal
- Loading (button con spinner)
- Success (mensaje verde con icon de check)
- Error (mensaje rojo con detalles)

---

## Feature Card with Icon

**Type:** `feature-card`  
**Framework:** React + Lucide Icons  
**Brand:** V1TR0

### Descripción
Card para mostrar características del producto con icon, título y descripción.

### Estructura
```tsx
- Card (group hover:shadow-glow)
- Icon container
  - Background circle (bg-primary w-12 h-12)
  - Lucide icon (w-6 h-6 text-white)
  - Glow effect on hover
- Content
  - Título (text-2xl font-semibold)
  - Descripción (text-base text-neutral-600)
  - Link "Saber más" (text-primary hover:underline)
```

### Icons disponibles (Lucide)
- Package (Gestión)
- Users (Equipos)
- BarChart (Analytics)
- Clock (Tiempo)
- Shield (Seguridad)
- Zap (Performance)

---

## Pricing Card

**Type:** `pricing-card`  
**Framework:** React  
**Brand:** V1TR0

### Descripción
Card de pricing con planes, features y CTA.

### Variantes
- **Free:** border-neutral-300
- **Pro:** border-primary shadow-glow (destacado)
- **Enterprise:** border-accent

### Estructura
```tsx
- Card container
- Header
  - Badge de plan (si es popular)
  - Nombre del plan (text-3xl font-bold)
  - Precio
    - Cantidad (text-5xl font-extrabold)
    - Período (text-lg text-muted)
- Features list
  - Check icon (green) para incluidos
  - X icon (muted) para no incluidos
- CTA button
  - Free: outline
  - Pro: bg-primary shadow-glow
  - Enterprise: bg-accent
```

---

## Testimonial Card

**Type:** `testimonial`  
**Framework:** React  
**Brand:** V1TR0

### Descripción
Card de testimonial con avatar, nombre, cargo y quote.

### Estructura
```tsx
- Card (bg-neutral-50 dark:bg-neutral-800)
- Quote icon (top-left, text-primary opacity-20)
- Content
  - Testimonial text (text-lg italic)
- Footer
  - Avatar (rounded-full w-12 h-12)
  - Info
    - Nombre (font-semibold)
    - Cargo + Empresa (text-sm text-muted)
  - Rating stars
```

---

## Footer

**Type:** `footer`  
**Framework:** React + Lucide Icons  
**Brand:** V1TR0

### Descripción
Footer completo con logo, links, newsletter y social.

### Secciones
```tsx
- Container (bg-neutral-900 dark:bg-black)
- Grid (4 columns en desktop)
  - Columna 1: Logo + descripción
  - Columna 2: Enlaces de producto
  - Columna 3: Enlaces de soporte
  - Columna 4: Newsletter signup
- Social icons row (bottom)
- Copyright + legal links
```

---

## Usage Example

Para usar estos skills con Open Design:

```bash
# Generar hero 3D
od generate component --skill landing-hero-3d --output ./components/generated

# Generar dashboard widget
od generate component --skill dashboard-stats --output ./components/generated

# Generar producto card
od generate component --skill product-card --output ./components/generated

# Generar formulario
od generate component --skill contact-form --output ./components/generated
```

Todos los componentes generados seguirán automáticamente las especificaciones de `DESIGN.md`.
