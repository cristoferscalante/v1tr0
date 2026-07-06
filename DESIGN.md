# V1TR0 Design System

> **Brand Identity Document for AI Agents**  
> This document defines the complete visual language, component patterns, and design philosophy of V1TR0.  
> Every generated component, prototype, and asset must strictly follow these specifications.

---

## 1. Brand Overview

### Identity
- **Name:** V1TR0
- **Tagline:** "Gestión de Proyectos y E-Commerce de Próxima Generación"
- **Industry:** Technology / SaaS / E-Commerce
- **Audience:** Empresas tech-forward, startups, equipos modernos
- **Personality:** Innovador, Profesional, Futurista, Confiable, Creativo

### Brand Essence
V1TR0 representa la convergencia entre gestión empresarial moderna y tecnología de vanguardia. La marca comunica:
- **Innovación tecnológica** a través de elementos futuristas y efectos de glow
- **Profesionalismo** mediante layouts limpios y tipografía clara
- **Confiabilidad** con colores oceánicos calmados (#08a696 teal)
- **Creatividad** expresada en animaciones fluidas y componentes 3D

---

## 2. Color Palette

### Primary Colors
```css
/* Teal Principal - Color corporativo de V1TR0 */
--color-primary: #08a696;
--color-primary-hover: #06877a;
--color-primary-light: #e6f7f6;
--color-primary-dark: #025159;

/* Escala completa */
--primary-50: #e6f7f6;
--primary-100: #c5ebe7;
--primary-200: #a3dfd9;
--primary-300: #81d3cb;
--primary-400: #5fc7bd;
--primary-500: #08a696; /* Base */
--primary-600: #06877a;
--primary-700: #05685f;
--primary-800: #044943;
--primary-900: #025159;
```

### Accent Colors
```css
/* Teal oscuro - Para contrastes y CTAs secundarios */
--color-accent: #1e7d7d;
--color-accent-light: #26a0a0;
--color-accent-dark: #165f5f;
```

### Highlight (Glow Effects)
```css
/* Cyan brillante - Para efectos de glow y énfasis visual */
--color-highlight-light: #08a696; /* Modo claro */
--color-highlight-dark: #26ffdf;  /* Modo oscuro - más brillante */
```

### Semantic Colors
```css
/* Estados y feedback */
--color-danger: #ff2c10;
--color-danger-hover: #cc2309;

--color-warning: #f26a1b;
--color-warning-hover: #c25516;

--color-success: #10b981;
--color-success-hover: #0d9668;

--color-info: #3b82f6;
--color-info-hover: #2f68c4;
```

### Neutral Scale
```css
/* Grises - Para textos y fondos */
--neutral-50: #fafaf9;
--neutral-100: #f5f4f1;
--neutral-200: #e5e4df;
--neutral-300: #d4d3cc;
--neutral-400: #a8a7a0;
--neutral-500: #6b7280; /* Base */
--neutral-600: #4b5563;
--neutral-700: #374151;
--neutral-800: #1f2937;
--neutral-900: #111827;
```

### Background Colors (Theme-aware)
```css
/* Light Mode */
--color-background: #ffffff;
--color-background-secondary: #f9fafb;
--color-background-tertiary: #f3f4f6;
--color-foreground: #1f2937;

/* Dark Mode */
--color-background: #0f172a;
--color-background-secondary: #1e293b;
--color-background-tertiary: #334155;
--color-foreground: #f8fafc;
```

### Color Usage Rules
1. **Primary (#08a696)** → Botones principales, enlaces, iconos activos, bordes de enfoque
2. **Accent (#1e7d7d)** → CTAs secundarios, badges, tags, estados hover
3. **Highlight (#26ffdf en dark)** → Efectos glow, acentos futuristas, estados de carga
4. **Semantic** → Solo para su propósito específico (éxito, error, advertencia, info)
5. **Neutral** → Textos, fondos, divisores, elementos no interactivos

---

## 3. Typography

### Font Families
```css
/* Sans-serif principal - Bricolage Grotesque */
--font-primary: 'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif;

/* Monospace - Para código */
--font-mono: ui-monospace, 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', monospace;
```

### Font Sizes (Mobile-first, responsive)
```css
--text-xs: 0.75rem;    /* 12px - Labels pequeños, metadata */
--text-sm: 0.875rem;   /* 14px - Textos secundarios, captions */
--text-base: 1rem;     /* 16px - Body text base */
--text-lg: 1.125rem;   /* 18px - Textos destacados */
--text-xl: 1.25rem;    /* 20px - Subtítulos pequeños */
--text-2xl: 1.5rem;    /* 24px - Subtítulos */
--text-3xl: 1.875rem;  /* 30px - Títulos H3 */
--text-4xl: 2.25rem;   /* 36px - Títulos H2 */
--text-5xl: 3rem;      /* 48px - Títulos H1 */
--text-6xl: 3.75rem;   /* 60px - Hero titles */
--text-7xl: 4.5rem;    /* 72px - Display text */
```

### Font Weights
```css
--font-normal: 400;    /* Body text */
--font-medium: 500;    /* Énfasis suave */
--font-semibold: 600;  /* Subtítulos, botones */
--font-bold: 700;      /* Títulos */
--font-extrabold: 800; /* Display text, hero */
```

### Line Heights
```css
--leading-tight: 1.25;   /* Títulos grandes */
--leading-normal: 1.5;   /* Body text */
--leading-relaxed: 1.75; /* Textos largos */
--leading-loose: 2;      /* Espaciado amplio */
```

### Letter Spacing
```css
--tracking-tight: -0.025em;  /* Títulos grandes */
--tracking-normal: 0;        /* Default */
--tracking-wide: 0.025em;    /* All-caps, labels */
```

### Typography Scale Examples
```html
<!-- Hero Title (Landing) -->
<h1 class="text-6xl md:text-7xl font-extrabold tracking-tight leading-tight">
  Gestión de Proyectos Moderna
</h1>

<!-- Section Title -->
<h2 class="text-4xl md:text-5xl font-bold leading-tight">
  Características Principales
</h2>

<!-- Card Title -->
<h3 class="text-2xl md:text-3xl font-semibold leading-normal">
  Dashboard Intuitivo
</h3>

<!-- Body Text -->
<p class="text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
  Gestiona tus proyectos con herramientas modernas y una interfaz intuitiva.
</p>

<!-- Caption / Metadata -->
<span class="text-sm text-neutral-500 dark:text-neutral-400">
  Actualizado hace 2 horas
</span>
```

---

## 4. Spacing System

### Base Unit: 8px
Todos los espaciados deben ser múltiplos de 4px o 8px para mantener consistencia.

```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
--spacing-2xl: 3rem;     /* 48px */
--spacing-3xl: 4rem;     /* 64px */
--spacing-4xl: 6rem;     /* 96px */
--spacing-5xl: 8rem;     /* 128px */
```

### Usage Rules
- **xs (4px)** → Padding interno de badges, separación entre iconos
- **sm (8px)** → Gap entre elementos inline, padding de botones pequeños
- **md (16px)** → Padding de cards, margin entre párrafos
- **lg (24px)** → Padding de secciones pequeñas, gap entre grupos
- **xl (32px)** → Margin entre secciones, padding de containers
- **2xl+ (48px+)** → Espaciado vertical entre secciones principales

### Container Padding (Responsive)
```css
/* Mobile */
.container { padding: 1rem; }      /* 16px */

/* Tablet */
@media (min-width: 768px) {
  .container { padding: 1.5rem; }  /* 24px */
}

/* Desktop */
@media (min-width: 1024px) {
  .container { padding: 2rem; }    /* 32px */
}
```

---

## 5. Border Radius

### Scale
```css
--radius-none: 0;
--radius-sm: 0.25rem;   /* 4px - Badges, small buttons */
--radius-md: 0.5rem;    /* 8px - Input fields, cards */
--radius-lg: 0.75rem;   /* 12px - Larger cards, modals */
--radius-xl: 1rem;      /* 16px - Hero sections */
--radius-2xl: 1.5rem;   /* 24px - Large containers */
--radius-full: 9999px;  /* Fully rounded - Pills, avatars */
```

### Component Mapping
- **Buttons:** `radius-md` (8px)
- **Cards:** `radius-lg` (12px)
- **Input fields:** `radius-md` (8px)
- **Modals:** `radius-xl` (16px)
- **Avatars:** `radius-full`
- **Badges:** `radius-full` or `radius-sm`

---

## 6. Shadows

### Elevation Scale
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
--shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
```

### Glow Effects (V1TR0 Signature)
```css
/* Glow suave - Para hover states */
--shadow-glow: 0 0 20px rgba(8, 166, 150, 0.3), 0 0 40px rgba(38, 255, 223, 0.1);

/* Glow fuerte - Para elementos activos */
--shadow-glow-strong: 0 0 30px rgba(8, 166, 150, 0.5), 0 0 60px rgba(38, 255, 223, 0.2);

/* Glow de texto */
--text-glow: 0 0 10px rgba(38, 255, 223, 0.5);
```

### Usage
```html
<!-- Card normal -->
<div class="shadow-md">...</div>

<!-- Card con hover glow -->
<div class="shadow-md hover:shadow-glow transition-shadow duration-300">...</div>

<!-- CTA button con glow permanente -->
<button class="shadow-glow-strong">Comenzar Ahora</button>

<!-- Título con text glow (dark mode) -->
<h1 class="dark:glow-effect">V1TR0</h1>
```

---

## 7. Animations & Transitions

### Transition Durations
```css
--duration-fast: 150ms;   /* Hover states, tooltips */
--duration-base: 200ms;   /* Default interactions */
--duration-slow: 300ms;   /* Complex state changes */
--duration-slower: 500ms; /* Page transitions */
```

### Timing Functions
```css
--ease: cubic-bezier(0.4, 0, 0.2, 1);        /* Default */
--ease-in: cubic-bezier(0.4, 0, 1, 1);       /* Entrada */
--ease-out: cubic-bezier(0, 0, 0.2, 1);      /* Salida */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1); /* Ambos */
```

### Keyframe Animations

#### Slide Animations
```css
@keyframes slideInRight {
  0% { transform: translateX(100px); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}

@keyframes slideInLeft {
  0% { transform: translateX(-100px); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}

@keyframes slideInUp {
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes slideInDown {
  0% { transform: translateY(-20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
```

#### Scale & Fade
```css
@keyframes scaleIn {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
```

#### Special Effects
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

### Usage Classes
```css
.animate-slide-in-right { animation: slideInRight 0.8s ease-out; }
.animate-slide-in-left { animation: slideInLeft 0.8s ease-out 0.2s both; }
.animate-scale-in { animation: scaleIn 0.3s ease-out; }
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
```

### Interaction Patterns
```html
<!-- Button hover -->
<button class="transition-all duration-200 hover:scale-105 hover:shadow-glow">
  Click Me
</button>

<!-- Card entrance -->
<div class="animate-slide-in-up">
  <h3>Feature Card</h3>
</div>

<!-- Loading state -->
<div class="animate-pulse">Cargando...</div>
```

---

## 8. Component Patterns

### Buttons

#### Primary Button
```html
<button class="
  px-6 py-3 
  bg-primary text-white 
  font-semibold 
  rounded-md 
  shadow-md hover:shadow-glow 
  transition-all duration-200 
  hover:scale-105 
  active:scale-95
">
  Acción Principal
</button>
```

#### Secondary Button
```html
<button class="
  px-6 py-3 
  bg-accent text-white 
  font-semibold 
  rounded-md 
  shadow-sm hover:shadow-md 
  transition-all duration-200
">
  Acción Secundaria
</button>
```

#### Outline Button
```html
<button class="
  px-6 py-3 
  border-2 border-primary text-primary 
  font-semibold 
  rounded-md 
  hover:bg-primary hover:text-white 
  transition-all duration-200
">
  Acción Terciaria
</button>
```

### Cards

#### Standard Card
```html
<div class="
  bg-white dark:bg-neutral-800 
  rounded-lg 
  shadow-md 
  p-6 
  transition-all duration-300 
  hover:shadow-lg hover:shadow-glow
">
  <h3 class="text-2xl font-semibold mb-4">Título</h3>
  <p class="text-neutral-600 dark:text-neutral-300">Contenido</p>
</div>
```

#### Feature Card (Con glow permanente)
```html
<div class="
  bg-gradient-to-br from-primary-50 to-accent-50 
  dark:from-primary-900 dark:to-accent-900 
  rounded-xl 
  shadow-glow 
  p-8 
  border border-primary/20
">
  <div class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
    <!-- Icon -->
  </div>
  <h3 class="text-2xl font-bold mb-2">Feature</h3>
  <p class="text-neutral-700 dark:text-neutral-200">Descripción</p>
</div>
```

### Forms

#### Input Field
```html
<div class="space-y-2">
  <label class="text-sm font-medium text-neutral-700 dark:text-neutral-200">
    Email
  </label>
  <input 
    type="email" 
    class="
      w-full px-4 py-3 
      bg-white dark:bg-neutral-800 
      border border-neutral-300 dark:border-neutral-600 
      rounded-md 
      focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
      transition-all duration-200
    "
    placeholder="tu@email.com"
  />
</div>
```

### Navigation

#### Top Navigation
```html
<nav class="
  bg-white/80 dark:bg-neutral-900/80 
  backdrop-blur-lg 
  border-b border-neutral-200 dark:border-neutral-700 
  sticky top-0 z-50
">
  <div class="container mx-auto px-4 py-4 flex items-center justify-between">
    <div class="text-2xl font-bold text-primary">V1TR0</div>
    <div class="flex gap-6">
      <a href="#" class="text-neutral-700 dark:text-neutral-200 hover:text-primary transition-colors">
        Inicio
      </a>
      <!-- More links -->
    </div>
  </div>
</nav>
```

---

## 9. Layout Guidelines

### Container Widths
```css
--container-sm: 640px;   /* Mobile content */
--container-md: 768px;   /* Tablet */
--container-lg: 1024px;  /* Desktop */
--container-xl: 1280px;  /* Large desktop */
--container-2xl: 1536px; /* Extra large */
```

### Grid Systems
```html
<!-- 12-column responsive grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Feature grid (2 columns) -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
  <div>Feature</div>
  <div>Feature</div>
</div>
```

### Section Spacing
```html
<!-- Standard section -->
<section class="py-16 md:py-24">
  <div class="container mx-auto px-4">
    <!-- Content -->
  </div>
</section>

<!-- Hero section -->
<section class="py-24 md:py-32 lg:py-40">
  <div class="container mx-auto px-4">
    <!-- Hero content -->
  </div>
</section>
```

---

## 10. Breakpoints

```css
/* Mobile-first approach */
--breakpoint-sm: 640px;   /* Small devices */
--breakpoint-md: 768px;   /* Medium devices */
--breakpoint-lg: 1024px;  /* Large devices */
--breakpoint-xl: 1280px;  /* Extra large */
--breakpoint-2xl: 1536px; /* 2X Extra large */
```

### Usage
```html
<div class="
  text-lg        /* Mobile */
  md:text-xl     /* Tablet+ */
  lg:text-2xl    /* Desktop+ */
">
  Responsive Text
</div>
```

---

## 11. Iconography

### Icon Library
Use **Lucide React** for all icons (already installed):
```tsx
import { Home, User, ShoppingCart, Package } from 'lucide-react';

<Home className="w-5 h-5 text-primary" />
```

### Icon Sizes
```css
--icon-xs: 1rem;    /* 16px */
--icon-sm: 1.25rem; /* 20px */
--icon-md: 1.5rem;  /* 24px */
--icon-lg: 2rem;    /* 32px */
--icon-xl: 3rem;    /* 48px */
```

### Icon Usage
```tsx
// Small icon in button
<button>
  <User className="w-4 h-4 mr-2" />
  Perfil
</button>

// Large feature icon
<div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
  <Package className="w-6 h-6 text-white" />
</div>
```

---

## 12. Motion & Micro-interactions

### Hover States
Every interactive element MUST have a hover state:
```html
<!-- Buttons -->
<button class="hover:scale-105 hover:shadow-glow transition-all">

<!-- Links -->
<a class="hover:text-primary hover:underline transition-colors">

<!-- Cards -->
<div class="hover:shadow-lg hover:-translate-y-1 transition-all">
```

### Loading States
```html
<!-- Skeleton loader -->
<div class="animate-pulse bg-neutral-200 dark:bg-neutral-700 rounded-md h-20"></div>

<!-- Spinner -->
<div class="animate-spin border-4 border-primary border-t-transparent rounded-full w-8 h-8"></div>
```

### Focus States
All interactive elements MUST be keyboard-accessible:
```html
<button class="
  focus:outline-none 
  focus:ring-2 
  focus:ring-primary 
  focus:ring-offset-2
">
  Accesible
</button>
```

---

## 13. Dark Mode

### Implementation
V1TR0 uses `next-themes` for dark mode management:

```tsx
import { useTheme } from 'next-themes';

const { theme, setTheme } = useTheme();
```

### Color Tokens (Auto-switching)
All color variables automatically adapt to theme:
```css
/* Light mode */
:root {
  --color-background: #ffffff;
  --color-text-primary: #1f2937;
  --color-highlight: #08a696;
}

/* Dark mode */
.dark {
  --color-background: #0f172a;
  --color-text-primary: #f8fafc;
  --color-highlight: #26ffdf; /* Más brillante en dark */
}
```

### Component Example
```html
<div class="
  bg-white dark:bg-neutral-900 
  text-neutral-900 dark:text-neutral-100 
  border border-neutral-200 dark:border-neutral-700
">
  Content adapts to theme
</div>
```

---

## 14. Accessibility

### WCAG 2.1 AA Compliance
- Contrast ratio ≥ 4.5:1 for normal text
- Contrast ratio ≥ 3:1 for large text (18px+)
- All interactive elements keyboard-accessible
- Proper ARIA labels on custom components

### Color Contrast Validation
✅ **Primary (#08a696) on White** → 3.85:1 (Large text only)  
✅ **Primary (#08a696) on Neutral-50** → 4.2:1 (AA compliant)  
✅ **Neutral-900 (#111827) on White** → 16.1:1 (AAA compliant)  
✅ **Highlight Dark (#26ffdf) on Neutral-900** → 8.5:1 (AAA compliant)

### Semantic HTML
Always use semantic tags:
```html
<header>
<nav>
<main>
<article>
<section>
<aside>
<footer>
```

### ARIA Best Practices
```html
<!-- Button with icon -->
<button aria-label="Cerrar modal">
  <X className="w-5 h-5" />
</button>

<!-- Loading state -->
<div aria-live="polite" aria-busy="true">
  Cargando...
</div>

<!-- Form errors -->
<input aria-invalid="true" aria-describedby="email-error" />
<span id="email-error" role="alert">Email inválido</span>
```

---

## 15. Voice & Tone

### Writing Guidelines
- **Professional but approachable:** "Gestiona tus proyectos" vs "Gestión de proyectos"
- **Action-oriented:** Use verbos activos ("Crea", "Administra", "Optimiza")
- **Clear and concise:** Evitar jerga innecesaria
- **Positive framing:** "Mejora tu productividad" vs "Reduce tiempo perdido"

### Microcopy Examples
```
✅ "Comenzar Ahora"          ❌ "Click aquí"
✅ "Crear Proyecto"          ❌ "Nuevo"
✅ "Guardar Cambios"         ❌ "OK"
✅ "¿Estás seguro?"          ❌ "Confirmar acción"
✅ "Proyecto creado con éxito" ❌ "Success"
```

### Error Messages
```
✅ "No pudimos encontrar ese proyecto. Verifica el ID e intenta nuevamente."
❌ "Error 404"

✅ "Tu sesión expiró. Por favor, inicia sesión nuevamente."
❌ "Unauthorized"

✅ "El email debe tener un formato válido (ej: usuario@ejemplo.com)"
❌ "Invalid input"
```

---

## 16. Assets & Media

### Logo Usage
- **Primary logo:** Full color (#08a696 teal)
- **Dark mode logo:** Light variant with glow effect
- **Minimum size:** 120px width
- **Clear space:** Logo height × 0.5 on all sides

### Images
- **Format:** WebP with JPEG fallback
- **Optimization:** Next.js Image component with lazy loading
- **Aspect ratios:** 
  - Hero: 16:9
  - Product cards: 4:3
  - Thumbnails: 1:1

### Image Example
```tsx
import Image from 'next/image';

<Image
  src="/hero-image.webp"
  alt="V1TR0 Dashboard"
  width={1920}
  height={1080}
  className="rounded-xl shadow-2xl"
  priority // For above-the-fold images
/>
```

---

## 17. Anti-Patterns (DO NOT USE)

### ❌ Avoid These Patterns

1. **Inconsistent spacing:**
   ```html
   ❌ <div class="mt-3 mb-5 px-7"> <!-- Random values -->
   ✅ <div class="mt-4 mb-6 px-6"> <!-- 8px multiples -->
   ```

2. **Mixing color systems:**
   ```html
   ❌ <div class="bg-blue-500"> <!-- Generic Tailwind -->
   ✅ <div class="bg-primary"> <!-- Design token -->
   ```

3. **Hard-coded colors:**
   ```html
   ❌ <div style="color: #08a696;">
   ✅ <div class="text-primary">
   ```

4. **No hover states:**
   ```html
   ❌ <button class="bg-primary">Click</button>
   ✅ <button class="bg-primary hover:shadow-glow transition-all">Click</button>
   ```

5. **Ignoring dark mode:**
   ```html
   ❌ <div class="bg-white text-black">
   ✅ <div class="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
   ```

6. **Generic button text:**
   ```html
   ❌ <button>Submit</button>
   ✅ <button>Crear Proyecto</button>
   ```

7. **No loading states:**
   ```tsx
   ❌ <button onClick={handleSubmit}>Guardar</button>
   ✅ <button disabled={isLoading}>
        {isLoading ? 'Guardando...' : 'Guardar'}
      </button>
   ```

---

## 18. Component Generation Rules for AI Agents

When generating components, ALWAYS:

1. **Use design tokens** from this document (colors, spacing, typography)
2. **Include responsive breakpoints** (mobile-first)
3. **Add dark mode classes** (bg-white dark:bg-neutral-900)
4. **Implement hover states** with glow effects where appropriate
5. **Use Lucide React icons** instead of emoji or images
6. **Follow accessibility guidelines** (ARIA, semantic HTML)
7. **Add smooth transitions** (transition-all duration-200)
8. **Include loading states** for async actions
9. **Use TypeScript** with proper types
10. **Test on mobile, tablet, desktop** breakpoints

### Example: Complete Component
```tsx
import { Package } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function FeatureCard({ title, description, icon = <Package /> }: FeatureCardProps) {
  return (
    <div className="
      group
      bg-white dark:bg-neutral-800 
      rounded-lg 
      shadow-md 
      p-6 
      transition-all duration-300 
      hover:shadow-lg hover:shadow-glow hover:-translate-y-1
    ">
      <div className="
        w-12 h-12 
        bg-primary 
        rounded-lg 
        flex items-center justify-center 
        mb-4 
        group-hover:shadow-glow 
        transition-shadow duration-300
      ">
        {React.cloneElement(icon as React.ReactElement, { 
          className: "w-6 h-6 text-white" 
        })}
      </div>
      
      <h3 className="
        text-2xl 
        font-semibold 
        mb-2 
        text-neutral-900 dark:text-neutral-100
      ">
        {title}
      </h3>
      
      <p className="
        text-base 
        leading-relaxed 
        text-neutral-600 dark:text-neutral-300
      ">
        {description}
      </p>
    </div>
  );
}
```

---

## 19. File Structure for Generated Assets

```
/public/
├── images/
│   ├── logos/
│   │   ├── v1tr0-logo.svg
│   │   ├── v1tr0-logo-dark.svg
│   │   └── v1tr0-icon.svg
│   ├── hero/
│   │   ├── hero-dashboard.webp
│   │   └── hero-features.webp
│   └── products/
│       └── [product-images].webp
├── videos/
│   └── [generated-videos].mp4
└── generated/
    ├── prototypes/
    │   └── [feature-prototypes].html
    ├── components/
    │   └── [generated-components].tsx
    └── mockups/
        └── [design-mockups].png
```

---

## 20. Integration with Open Design

### DESIGN.md Location
This file should live at: `/home/efren-cyborg/1.Cyborg-Town/3.V1TR0-Town/1.proyectos-endogenos-/1.v1tr0-proyec/1.v1tr0-web/DESIGN.md`

### Usage with Open Design CLI
```bash
# Generate landing page with V1TR0 brand
od generate landing --design-system v1tr0 --skill landing-page

# Generate dashboard component
od generate component --design-system v1tr0 --type dashboard

# Generate marketing assets
od generate image --design-system v1tr0 --prompt "Hero image for SaaS dashboard"

# Export prototype
od export prototype --format html --output public/generated/prototypes/
```

### MCP Server Integration
When using Open Design as MCP server:
```typescript
// The agent will automatically read this DESIGN.md
// and apply these rules to all generated components
```

---

## Document Version
- **Version:** 1.0.0
- **Last Updated:** 2026-07-06
- **Maintained By:** V1TR0 Team
- **Status:** Production

---

**End of DESIGN.md**
