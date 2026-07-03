# DISEÑO UI/UX - SISTEMA V1TR0

**Versión:** 3.0  
**Fecha:** Junio 26, 2026  
**Autor:** Equipo V1TR0

---

## ÍNDICE

1. [Filosofía de Diseño](#filosofía-de-diseño)
2. [Estética y Look & Feel](#estética-y-look--feel)
3. [Componentes del Hero](#componentes-del-hero)
4. [Sistema de Botones](#sistema-de-botones)
5. [Paleta de Colores](#paleta-de-colores)
6. [Tipografía](#tipografía)
7. [Animaciones](#animaciones)
8. [Grid y Layout](#grid-y-layout)
9. [Patrones de Diseño](#patrones-de-diseño)

---

## FILOSOFÍA DE DISEÑO

### Principios Core

1. **Minimalismo Tecnológico**
   - Espacios en blanco generosos
   - Elementos limpios y enfocados
   - Jerarquía visual clara

2. **Animaciones Sutiles**
   - Movimientos suaves y naturales
   - GSAP para transiciones complejas
   - Feedback visual inmediato

3. **Contraste Alto**
   - Modo oscuro por defecto
   - Acentos vibrantes (#08a696 - Primary)
   - Neón para highlights (#26ffdf)

4. **Responsive First**
   - Mobile-first approach
   - Breakpoints claros (sm, md, lg, xl, 2xl)
   - Touch-friendly (mínimo 44px táctil)

---

## ESTÉTICA Y LOOK & FEEL

### Visual Identity

**Descriptor:** *Cyberpunk Minimalista Profesional*

**Características:**
- Fondo oscuro (#0f0f10) con gradientes sutiles
- Acentos de color primario (#08a696 - Turquesa vibrante)
- Highlights neón (#26ffdf) para llamadas a la acción
- Tipografía sans-serif moderna (Bricolage Grotesque)
- Bordes redondeados suaves (8-16px)
- Sombras profundas para profundidad

### Mood Board de Referencia

```
[Oscuro] ━━━━━━━ [Vibrante] ━━━━━━━ [Limpio]
   ↓                 ↓                ↓
#0f0f10          #08a696          Espacios
(Fondo)         (Primary)         Generosos
```

### Inspiraciones
- GitHub Dark Theme (estructura limpia)
- Stripe Dashboard (profesionalismo)
- Vercel (minimalismo)
- Cyberpunk aesthetics (acentos neón)

---

## COMPONENTES DEL HERO

### Anatomía del Hero V1TR0

```tsx
<Hero>
  <BackgroundAnimation />     // Fondo animado sutil
  <Container>
    <HeroAnimated />          // Texto animado con GSAP
    <HeroSubtitle />          // Descripción
    <HeroCTA />               // Botones de acción
  </Container>
</Hero>
```

### Hero Animated - Características

**Archivo:** `components/home/hero/HeroAnimated.tsx`

**Elementos:**
1. **Línea 1:** Texto blanco (#ffffff)
   - Font-size: `text-3xl md:text-5xl`
   - Font-weight: `font-bold`
   - Color: `text-white`

2. **Línea 2:** Texto con color primario
   - Font-size: `text-3xl md:text-5xl`
   - Font-weight: `font-bold`
   - Color: `text-primary` (#08a696)

3. **Animaciones:**
   - Efecto typewriter
   - Transiciones GSAP suaves
   - Cambio de mensajes dinámico

**Código de referencia:**
```tsx
<div className="flex flex-col items-center select-none">
  <span className="text-3xl md:text-5xl font-bold text-white leading-tight">
    {line1}
  </span>
  <span className="text-3xl md:text-5xl font-bold text-primary leading-tight">
    {line2}
  </span>
</div>
```

### Hero para Ecommerce - Adaptación

**Nuevos elementos necesarios:**

1. **Hero con Proyectos Destacados**
   ```tsx
   <Hero variant="shop">
     <HeroTitle>Tienda V1TR0</HeroTitle>
     <HeroSubtitle>Hardware & Proyectos Digitales</HeroSubtitle>
     <ProjectsShowcase>
       <ProjectCard type="hardware">Cyber Decks</ProjectCard>
       <ProjectCard type="digital">Sistemas POS</ProjectCard>
     </ProjectsShowcase>
   </Hero>
   ```

2. **Secciones:**
   - Productos Destacados (carousel)
   - Categorías principales
   - Call-to-action de compra

---

## SISTEMA DE BOTONES

### Jerarquía de Botones

#### 1. Primary Button (Acción Principal)

**Uso:** Comprar, Agregar al carrito, Enviar formulario

**Variantes:**
```tsx
// Default
<Button variant="primary">
  Comprar Ahora
</Button>

// Con icono
<Button variant="primary" icon={<ShoppingCart />}>
  Agregar al Carrito
</Button>

// Loading state
<Button variant="primary" loading>
  Procesando...
</Button>
```

**Estilos:**
```css
.btn-primary {
  background: var(--color-primary);           /* #08a696 */
  color: white;
  padding: 0.75rem 1.5rem;                   /* py-3 px-6 */
  border-radius: var(--radius-lg);           /* 12px */
  font-weight: var(--font-weight-semibold);  /* 600 */
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px -1px rgb(8 166 150 / 0.3);
}

.btn-primary:hover {
  background: var(--color-primary-hover);    /* #06877a */
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgb(8 166 150 / 0.4);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:focus-visible {
  outline: 2px solid var(--color-highlight);
  outline-offset: 2px;
}
```

#### 2. Secondary Button (Acción Secundaria)

**Uso:** Ver más, Cancelar, Navegación

**Estilos:**
```css
.btn-secondary {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-semibold);
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--color-primary);
  color: white;
}
```

#### 3. Ghost Button (Acción Terciaria)

**Uso:** Links, navegación sutil

**Estilos:**
```css
.btn-ghost {
  background: transparent;
  color: var(--color-text-primary);
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-lg);
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  background: var(--color-background-secondary);
}
```

#### 4. Danger Button (Acciones Destructivas)

**Uso:** Eliminar, Cancelar orden

**Estilos:**
```css
.btn-danger {
  background: var(--color-danger);    /* #ff2c10 */
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-semibold);
}

.btn-danger:hover {
  background: var(--color-danger-hover);
}
```

#### 5. Icon Button (Solo Icono)

**Uso:** Cerrar modal, favoritos, compartir

**Estilos:**
```css
.btn-icon {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: var(--color-background-secondary);
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background: var(--color-primary);
  color: white;
}
```

### Tamaños de Botones

```tsx
<Button size="sm">Pequeño</Button>     // py-2 px-4, text-sm
<Button size="md">Mediano</Button>     // py-3 px-6, text-base (default)
<Button size="lg">Grande</Button>      // py-4 px-8, text-lg
<Button size="xl">Extra Grande</Button> // py-5 px-10, text-xl
```

### Estados de Botones

```tsx
<Button disabled>Deshabilitado</Button>
<Button loading>Cargando...</Button>
<Button success>Completado ✓</Button>
<Button error>Error ✗</Button>
```

---

## PALETA DE COLORES

### Colores Principales

```css
/* Primary (Turquesa Vibrante) */
--color-primary: #08a696;
--color-primary-hover: #06877a;
--color-primary-light: #e6f7f6;
--color-primary-dark: #025159;

/* Accent (Turquesa Oscuro) */
--color-accent: #1e7d7d;

/* Highlight (Neón) */
--color-highlight-light: #08a696;
--color-highlight-dark: #26ffdf;  /* Modo oscuro */

/* Semánticos */
--color-danger: #ff2c10;
--color-warning: #f26a1b;
--color-success: #10b981;
--color-info: #3b82f6;
```

### Colores de Fondo

```css
/* Modo Claro */
--color-background: #faf9f7;
--color-background-secondary: #f5f4f1;
--color-surface: #ffffff;

/* Modo Oscuro */
--color-background: #0f0f10;
--color-background-secondary: #011c26;
--color-surface: #1a1a1b;
```

### Colores de Texto

```css
/* Modo Claro */
--color-text-primary: #011c26;
--color-text-secondary: #025159;
--color-text-muted: #6b7280;

/* Modo Oscuro */
--color-text-primary: #ffffff;
--color-text-secondary: #e5e5e5;
--color-text-muted: #a0a0a0;
```

### Uso de Colores por Contexto

| Elemento | Modo Claro | Modo Oscuro |
|----------|------------|-------------|
| Fondo principal | `#faf9f7` | `#0f0f10` |
| Texto principal | `#011c26` | `#ffffff` |
| Botón primario | `#08a696` | `#08a696` |
| Highlight/CTA | `#08a696` | `#26ffdf` |
| Links | `#08a696` | `#26ffdf` |
| Bordes | `#e5e7eb` | `#2d3748` |

---

## TIPOGRAFÍA

### Fuente Principal

**Familia:** Bricolage Grotesque (Google Fonts)

**Uso:**
```css
font-family: var(--font-bricolage-grotesque), sans-serif;
```

### Escala Tipográfica

| Nivel | Tamaño | Uso |
|-------|--------|-----|
| `text-xs` | 12px | Etiquetas pequeñas |
| `text-sm` | 14px | Texto secundario |
| `text-base` | 16px | Cuerpo de texto |
| `text-lg` | 18px | Texto destacado |
| `text-xl` | 20px | Subtítulos |
| `text-2xl` | 24px | Títulos sección |
| `text-3xl` | 30px | Títulos página |
| `text-4xl` | 36px | Hero secundario |
| `text-5xl` | 48px | Hero principal |
| `text-6xl` | 60px | Display grande |
| `text-7xl` | 72px | Display extra |

### Pesos de Fuente

```css
font-weight: 400;  /* font-normal */
font-weight: 500;  /* font-medium */
font-weight: 600;  /* font-semibold */
font-weight: 700;  /* font-bold */
font-weight: 800;  /* font-extrabold */
```

### Line Height

```css
line-height: 1.25;  /* leading-tight - Headings */
line-height: 1.5;   /* leading-normal - Body */
line-height: 1.75;  /* leading-relaxed - Long text */
line-height: 2;     /* leading-loose - Poesía */
```

---

## ANIMACIONES

### Animaciones del Hero

**Typewriter Effect:**
```tsx
useEffect(() => {
  // Animación de escritura letra por letra
  const interval = setInterval(() => {
    setDisplayText(prev => fullText.slice(0, prev.length + 1));
  }, 100);
  
  return () => clearInterval(interval);
}, []);
```

**GSAP Transitions:**
```tsx
gsap.to(ref.current, {
  opacity: 0,
  y: -20,
  duration: 0.5,
  ease: "power2.inOut"
});
```

### Animaciones de Botones

**Hover Lift:**
```css
.btn:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}
```

**Click Feedback:**
```css
.btn:active {
  transform: scale(0.98);
}
```

### Animaciones de Entrada

**Slide In Up:**
```css
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in-up {
  animation: slideInUp 0.5s ease-out;
}
```

**Fade In:**
```css
.fade-in {
  animation: fadeIn 0.3s ease-out;
}
```

---

## GRID Y LAYOUT

### Container Sizes

```css
.container {
  max-width: 1280px;        /* xl breakpoint */
  margin: 0 auto;
  padding: 0 1rem;          /* Mobile */
}

@media (min-width: 640px) {
  .container { padding: 0 2rem; }  /* Tablet */
}

@media (min-width: 1024px) {
  .container { padding: 0 4rem; }  /* Desktop */
}
```

### Grid Systems

**Productos Grid:**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {products.map(product => <ProductCard key={product.id} />)}
</div>
```

**Dashboard Grid:**
```tsx
<div className="grid grid-cols-12 gap-6">
  <div className="col-span-12 lg:col-span-8">
    {/* Contenido principal */}
  </div>
  <div className="col-span-12 lg:col-span-4">
    {/* Sidebar */}
  </div>
</div>
```

### Spacing System

```css
/* Padding/Margin escala */
p-0  → 0px
p-1  → 4px
p-2  → 8px
p-3  → 12px
p-4  → 16px
p-6  → 24px
p-8  → 32px
p-12 → 48px
p-16 → 64px
p-24 → 96px
```

---

## PATRONES DE DISEÑO

### Cards

**Product Card:**
```tsx
<div className="
  bg-surface 
  rounded-lg 
  border border-border 
  p-4 
  hover:shadow-xl 
  hover:-translate-y-1 
  transition-all
">
  <img className="rounded-md mb-4" />
  <h3 className="text-xl font-semibold mb-2">Título</h3>
  <p className="text-muted mb-4">Descripción</p>
  <Button variant="primary" fullWidth>Agregar al Carrito</Button>
</div>
```

**Stats Card:**
```tsx
<div className="bg-surface rounded-lg border border-border p-6">
  <div className="flex items-center justify-between mb-4">
    <h4 className="text-sm font-medium text-muted">Total Ventas</h4>
    <DollarSign className="text-primary" />
  </div>
  <p className="text-3xl font-bold">$45,231</p>
  <p className="text-sm text-success mt-2">+20.1% vs mes anterior</p>
</div>
```

### Modals

```tsx
<Dialog>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Título del Modal</DialogTitle>
      <DialogDescription>Descripción opcional</DialogDescription>
    </DialogHeader>
    {/* Contenido */}
    <DialogFooter>
      <Button variant="ghost">Cancelar</Button>
      <Button variant="primary">Confirmar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Forms

```tsx
<form className="space-y-6">
  <div className="space-y-2">
    <Label htmlFor="name">Nombre del Producto</Label>
    <Input 
      id="name" 
      placeholder="Ej: ESP32 Heltec V3"
      className="w-full"
    />
  </div>
  
  <div className="space-y-2">
    <Label htmlFor="price">Precio</Label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
      <Input 
        id="price" 
        type="number"
        placeholder="0.00"
        className="pl-8"
      />
    </div>
  </div>
  
  <div className="flex gap-4">
    <Button variant="ghost" type="button">Cancelar</Button>
    <Button variant="primary" type="submit">Guardar Producto</Button>
  </div>
</form>
```

---

## GUÍA DE IMPLEMENTACIÓN

### Checklist para Nuevos Componentes

- [ ] Usa design tokens (nunca valores hardcoded)
- [ ] Responsive (mobile-first)
- [ ] Modo oscuro compatible
- [ ] Animaciones sutiles (max 300ms)
- [ ] Accesible (ARIA labels, keyboard navigation)
- [ ] Tipado con TypeScript
- [ ] Documentado con comentarios

### Ejemplo Completo

```tsx
import { Button } from '@/components/ui/button';
import { designTokens } from '@/config/design-tokens';

interface ProductCardProps {
  title: string;
  price: number;
  image: string;
  onAddToCart: () => void;
}

export function ProductCard({ title, price, image, onAddToCart }: ProductCardProps) {
  return (
    <div className="
      bg-surface 
      border border-border 
      rounded-lg 
      p-4 
      hover:shadow-lg 
      hover:-translate-y-1 
      transition-all 
      duration-200
    ">
      <img 
        src={image} 
        alt={title}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      
      <h3 className="text-xl font-semibold text-textPrimary mb-2">
        {title}
      </h3>
      
      <p className="text-2xl font-bold text-primary mb-4">
        ${price.toFixed(2)}
      </p>
      
      <Button 
        variant="primary" 
        fullWidth 
        onClick={onAddToCart}
        className="animate-slide-in-up"
      >
        Agregar al Carrito
      </Button>
    </div>
  );
}
```

---

**Mantenido por:** Equipo de Diseño V1TR0  
**Última actualización:** Junio 26, 2026  
**Versión:** 3.0
