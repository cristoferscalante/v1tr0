# ARQUITECTURA DE 3 EJES - SISTEMA V1TR0

**Versión:** 3.0  
**Fecha:** Junio 26, 2026  
**Principios:** SOLID, DRY, Clean Architecture

---

## ÍNDICE

1. [Visión General](#visión-general)
2. [Eje 1: Gestión Empresarial](#eje-1-gestión-empresarial)
3. [Eje 2: Gestión de Ecommerce](#eje-2-gestión-de-ecommerce)
4. [Eje 3: Gestión de Contenido](#eje-3-gestión-de-contenido)
5. [Sistema de Roles y Permisos](#sistema-de-roles-y-permisos)
6. [Base de Datos](#base-de-datos)
7. [Flujos de Usuario](#flujos-de-usuario)

---

## VISIÓN GENERAL

### Concepto

Sistema integral de gestión dividido en **3 ejes independientes** pero interconectados:

```
┌─────────────────────────────────────────────────────────┐
│                    USUARIO AUTENTICADO                  │
└─────────────────────────────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
     ┌─────▼─────┐  ┌──────▼──────┐  ┌────▼─────┐
     │   EJE 1   │  │    EJE 2    │  │  EJE 3   │
     │  EMPRESA  │  │  ECOMMERCE  │  │ CONTENIDO│
     └───────────┘  └─────────────┘  └──────────┘
```

### Filosofía de Diseño

**Separation of Concerns (SoC):**
- Cada eje es independiente
- Servicios compartidos cuando sea necesario
- Permisos granulares por eje

**Domain-Driven Design (DDD):**
- Cada eje tiene su propio dominio
- Bounded contexts claros
- Entidades bien definidas

**SOLID Principles:**
- Single Responsibility
- Open/Closed
- Liskov Substitution
- Interface Segregation
- Dependency Inversion

---

## EJE 1: GESTIÓN EMPRESARIAL

### Propósito

Gestión integral de la operación de V1TR0 como empresa de desarrollo.

### Módulos

#### 1.1 Gestión de Clientes (CRM)

**Funcionalidades:**
- ✅ CRUD de clientes
- ✅ Historial de interacciones
- ✅ Notas y seguimiento
- ✅ Estados del cliente (lead, activo, inactivo)
- ✅ Documentos del cliente
- ✅ Contactos asociados

**Entidades:**
```typescript
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  industry?: string;
  status: 'lead' | 'active' | 'inactive' | 'archived';
  source: 'web' | 'referral' | 'marketing' | 'other';
  assignedTo?: string; // Team member ID
  tags: string[];
  customFields?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

interface ClientInteraction {
  id: string;
  clientId: string;
  type: 'email' | 'call' | 'meeting' | 'note';
  subject: string;
  description: string;
  createdBy: string; // User ID
  createdAt: Date;
}

interface ClientDocument {
  id: string;
  clientId: string;
  name: string;
  type: string;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}
```

#### 1.2 Gestión de Proyectos

**Funcionalidades:**
- ✅ CRUD de proyectos
- ✅ Asignación de equipo
- ✅ Tareas y milestones
- ✅ Tracking de tiempo
- ✅ Presupuesto y facturación
- ✅ Archivos del proyecto
- ✅ Timeline del proyecto

**Entidades:**
```typescript
interface Project {
  id: string;
  clientId: string;
  name: string;
  description: string;
  status: 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  type: 'development' | 'consulting' | 'design' | 'other';
  startDate: Date;
  endDate?: Date;
  budget: number;
  spent: number;
  teamMembers: ProjectTeamMember[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectTeamMember {
  userId: string;
  role: 'lead' | 'developer' | 'designer' | 'pm';
  hourlyRate?: number;
}

interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  estimatedHours?: number;
  actualHours?: number;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

#### 1.3 Gestión de Equipo

**Funcionalidades:**
- ✅ Perfiles de empleados
- ✅ Roles y permisos
- ✅ Disponibilidad y calendario
- ✅ Evaluaciones de desempeño
- ✅ Documentación del empleado

**Entidades:**
```typescript
interface TeamMember {
  id: string;
  userId: string; // Referencia a auth.users
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position: string;
  department: 'development' | 'design' | 'pm' | 'sales' | 'admin';
  hireDate: Date;
  hourlyRate?: number;
  skills: string[];
  availability: 'available' | 'busy' | 'vacation' | 'sick';
  createdAt: Date;
  updatedAt: Date;
}
```

#### 1.4 Finanzas y Facturación

**Funcionalidades:**
- ✅ Generación de facturas
- ✅ Pagos y cobros
- ✅ Reportes financieros
- ✅ Gastos del proyecto
- ✅ Dashboard financiero

**Entidades:**
```typescript
interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  projectId?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issuedDate: Date;
  dueDate: Date;
  paidDate?: Date;
  notes?: string;
  createdAt: Date;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}
```

### Rutas del Eje 1

```
/dashboard/empresa/
├── /clientes                    # Lista de clientes
│   ├── /nuevo                  # Crear cliente
│   └── /[id]                   # Detalle del cliente
│       ├── /editar
│       ├── /proyectos
│       ├── /interacciones
│       └── /documentos
├── /proyectos                   # Lista de proyectos
│   ├── /nuevo
│   └── /[id]
│       ├── /tareas
│       ├── /equipo
│       ├── /archivos
│       └── /finanzas
├── /equipo                      # Gestión de equipo
│   ├── /miembros
│   ├── /evaluaciones
│   └── /disponibilidad
└── /finanzas                    # Finanzas
    ├── /facturas
    ├── /pagos
    └── /reportes
```

---

## EJE 2: GESTIÓN DE ECOMMERCE

### Propósito

Venta de productos físicos (hardware IoT) y digitales (proyectos/servicios).

### Productos Principales

#### 2.1 Hardware IoT
```typescript
const HARDWARE_PRODUCTS = {
  'cyber-decks': {
    name: 'Cyber Decks de Seguridad',
    description: 'Dispositivos de hacking y seguridad diseñados por V1TR0',
    category: 'hardware',
    subcategory: 'security',
    type: 'physical',
  },
  'cardputers': {
    name: 'Cardputer',
    description: 'Computadora de bolsillo para hacking',
    category: 'hardware',
    subcategory: 'development',
    type: 'physical',
  },
  'esp32-heltec': {
    name: 'ESP32 Heltec V4',
    description: 'Microcontrolador con LoRa y pantalla OLED',
    category: 'hardware',
    subcategory: 'iot',
    type: 'physical',
  },
  'raspberry-pi': {
    name: 'Raspberry Pi',
    description: 'Computadora de placa única',
    category: 'hardware',
    subcategory: 'computing',
    type: 'physical',
  },
};
```

#### 2.2 Proyectos Digitales
```typescript
const DIGITAL_PRODUCTS = {
  'pos-system': {
    name: 'Sistema POS V1TR0',
    description: 'Sistema de punto de venta completo',
    category: 'software',
    subcategory: 'business',
    type: 'digital',
    deliveryMethod: 'download',
  },
  'cyber-deck-os': {
    name: 'Cyber Deck OS',
    description: 'Sistema operativo para Cyber Decks',
    category: 'software',
    subcategory: 'security',
    type: 'digital',
    deliveryMethod: 'download',
  },
};
```

### Módulos del Ecommerce

#### 2.1 Catálogo de Productos

**Funcionalidades:**
- ✅ CRUD de productos
- ✅ Categorías y subcategorías
- ✅ Variantes de producto (tallas, colores, etc.)
- ✅ Gestión de inventario
- ✅ Imágenes múltiples
- ✅ SEO por producto
- ✅ Productos relacionados
- ✅ Reviews y ratings

**Entidades:**
```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  
  // Tipo de producto
  type: 'physical' | 'digital' | 'service';
  category: 'hardware' | 'software' | 'service';
  subcategory: string;
  
  // Precio
  price: number;
  compareAtPrice?: number; // Precio "antes" para descuentos
  cost?: number; // Costo (privado, para cálculos internos)
  
  // Inventario
  trackInventory: boolean;
  stockQuantity: number;
  lowStockThreshold: number;
  sku?: string;
  barcode?: string;
  
  // Digital products
  downloadUrl?: string;
  downloadLimit?: number;
  
  // Características
  featured: boolean;
  status: 'draft' | 'active' | 'archived';
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  
  // Media
  images: ProductImage[];
  
  // Categorización
  tags: string[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  displayOrder: number;
}

interface ProductVariant {
  id: string;
  productId: string;
  name: string; // "Talla L - Azul"
  sku?: string;
  price?: number; // Override price
  stockQuantity: number;
  attributes: Record<string, string>; // { size: "L", color: "blue" }
}

interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  imageUrl?: string;
  displayOrder: number;
}
```

#### 2.2 Carrito y Checkout

**Funcionalidades:**
- ✅ Carrito persistente (localStorage + DB)
- ✅ Cálculo de impuestos automático
- ✅ Descuentos y cupones
- ✅ Múltiples métodos de pago
- ✅ Dirección de envío
- ✅ Confirmación por email

**Entidades:**
```typescript
interface Cart {
  id: string;
  userId?: string; // Null para guests
  sessionId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode?: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  unitPrice: number;
  total: number;
  // Snapshot de datos (por si se elimina el producto)
  productName: string;
  productImage?: string;
}
```

#### 2.3 Órdenes y Pagos

**Funcionalidades:**
- ✅ Gestión de órdenes
- ✅ Estados de orden
- ✅ Tracking de envío
- ✅ Facturación automática
- ✅ Reembolsos
- ✅ Notificaciones por email

**Entidades:**
```typescript
interface Order {
  id: string;
  orderNumber: string; // "ORD-20260626-0001"
  userId?: string; // Null para guests
  
  // Cliente
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  
  // Dirección
  shippingAddress: Address;
  billingAddress: Address;
  
  // Items
  items: OrderItem[];
  
  // Montos
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  
  // Estado
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  
  // Pago
  paymentMethod: 'mercado_pago' | 'cryptomus' | 'cash';
  paymentIntentId?: string;
  transactionId?: string;
  
  // Envío
  shippingMethod?: string;
  trackingNumber?: string;
  
  // Notas
  customerNote?: string;
  internalNote?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
}

interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  productName: string;
  productSku?: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  // Para productos digitales
  downloadUrl?: string;
  downloadLimit?: number;
  downloadsRemaining?: number;
}

interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}
```

#### 2.4 Pagos - Mercado Pago & Cryptomus

**Integración Mercado Pago:**
```typescript
interface MercadoPagoConfig {
  publicKey: string;
  accessToken: string;
  webhookSecret: string;
}

interface MercadoPagoPayment {
  id: string;
  orderId: string;
  mercadoPagoId: string;
  status: 'pending' | 'approved' | 'rejected' | 'refunded';
  amount: number;
  currency: 'COP' | 'USD';
  paymentMethod: string;
  createdAt: Date;
}
```

**Integración Cryptomus (Crypto):**
```typescript
interface CryptomusConfig {
  merchantId: string;
  apiKey: string;
  webhookSecret: string;
}

interface CryptomusPayment {
  id: string;
  orderId: string;
  cryptomusId: string;
  status: 'pending' | 'completed' | 'failed' | 'expired';
  amount: number;
  currency: 'BTC' | 'ETH' | 'USDT';
  address: string;
  createdAt: Date;
}
```

#### 2.5 Analytics y Reportes

**Funcionalidades:**
- ✅ Dashboard de ventas
- ✅ Productos más vendidos
- ✅ Ingresos por período
- ✅ Conversión de carrito
- ✅ Análisis de clientes
- ✅ Inventario bajo stock

### Rutas del Eje 2

```
/shop/                           # Tienda pública
├── /                           # Hero + Productos destacados
├── /categoria/[slug]           # Productos por categoría
├── /producto/[slug]            # Detalle del producto
├── /carrito                    # Carrito de compras
├── /checkout                   # Proceso de compra
└── /orden/[id]                # Confirmación de orden

/dashboard/tienda/              # Gestión admin
├── /productos                  # Lista de productos
│   ├── /nuevo
│   └── /[id]/editar
├── /categorias                 # Gestión de categorías
├── /ordenes                    # Órdenes
│   └── /[id]                  # Detalle de orden
├── /inventario                 # Gestión de inventario
├── /descuentos                 # Cupones y promociones
├── /finanzas                   # Finanzas de tienda
│   ├── /ventas
│   ├── /pagos
│   └── /reportes
└── /configuracion              # Config de tienda
    ├── /envios
    ├── /impuestos
    └── /pagos
```

---

## EJE 3: GESTIÓN DE CONTENIDO

### Propósito

Gestión integral de contenido web: blog, multimedia y redes sociales.

### Módulos

#### 3.1 Blog

**Funcionalidades:**
- ✅ CRUD de posts
- ✅ Categorías y tags
- ✅ Editor MDX
- ✅ Programación de posts
- ✅ SEO por post
- ✅ Comentarios (opcional)
- ✅ Vistas y analytics

**Entidades:**
```typescript
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // MDX
  coverImage?: string;
  
  // Autor
  authorId: string;
  
  // Categorización
  category?: string;
  tags: string[];
  
  // Estado
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  
  // Programación
  publishedAt?: Date;
  scheduledFor?: Date;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  
  // Analytics
  views: number;
  likes: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}
```

#### 3.2 Multimedia (NUEVO)

**Funcionalidades:**
- ✅ Gestión de contenido multimedia
- ✅ Integración con YouTube
- ✅ Integración con Instagram
- ✅ Integración con TikTok
- ✅ Upload de archivos propios
- ✅ Organización por álbumes/colecciones
- ✅ Embed automático
- ✅ Metadata y descripción

**Entidades:**
```typescript
interface MediaItem {
  id: string;
  title: string;
  description?: string;
  type: 'video' | 'image' | 'audio' | 'document';
  
  // Fuente
  platform: 'youtube' | 'instagram' | 'tiktok' | 'twitter' | 'own' | 'other';
  platformId?: string; // ID en la plataforma original
  url: string;
  embedUrl?: string;
  
  // Para archivos propios
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  
  // Metadata
  thumbnailUrl?: string;
  duration?: number; // Para videos/audio (en segundos)
  width?: number;
  height?: number;
  
  // Organización
  albumId?: string;
  tags: string[];
  
  // Estado
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  
  // Analytics
  views: number;
  likes: number;
  shares: number;
  
  // Timestamps
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  uploadedBy: string; // User ID
}

interface MediaAlbum {
  id: string;
  name: string;
  slug: string;
  description?: string;
  coverImage?: string;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

**Integraciones de Plataformas:**

```typescript
// YouTube
interface YouTubeIntegration {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: number;
  publishedAt: Date;
  viewCount: number;
  likeCount: number;
}

// Instagram
interface InstagramIntegration {
  postId: string;
  caption: string;
  mediaType: 'image' | 'video' | 'carousel';
  mediaUrl: string;
  thumbnailUrl: string;
  permalink: string;
  timestamp: Date;
  likeCount: number;
  commentsCount: number;
}

// TikTok
interface TikTokIntegration {
  videoId: string;
  description: string;
  videoUrl: string;
  coverImageUrl: string;
  createTime: Date;
  viewCount: number;
  likeCount: number;
  shareCount: number;
}
```

#### 3.3 Gestor de Enlaces y Embeds

**Funcionalidades:**
- ✅ Agregar contenido por URL
- ✅ Preview automático
- ✅ Metadata extraction
- ✅ Validación de URL
- ✅ Categorización automática

**Proceso de Agregado:**
```typescript
async function addMediaFromUrl(url: string) {
  // 1. Detectar plataforma
  const platform = detectPlatform(url);
  
  // 2. Extraer ID
  const platformId = extractPlatformId(url, platform);
  
  // 3. Obtener metadata
  const metadata = await fetchPlatformMetadata(platform, platformId);
  
  // 4. Crear MediaItem
  return await createMediaItem({
    platform,
    platformId,
    url,
    ...metadata,
  });
}
```

### Rutas del Eje 3

```
/blog/                          # Blog público
├── /                          # Lista de posts
├── /[slug]                    # Post individual
├── /categoria/[slug]          # Posts por categoría
└── /tag/[slug]               # Posts por tag

/multimedia/                    # Galería multimedia (NUEVO)
├── /                          # Grid de contenido
├── /videos                    # Solo videos
├── /imagenes                  # Solo imágenes
└── /album/[slug]             # Álbum específico

/dashboard/contenido/          # Gestión admin
├── /blog                      # Gestión de blog
│   ├── /posts                # Lista de posts
│   │   ├── /nuevo
│   │   └── /[id]/editar
│   ├── /categorias           # Categorías
│   └── /tags                 # Tags
├── /multimedia               # Gestión multimedia (NUEVO)
│   ├── /biblioteca          # Biblioteca de medios
│   ├── /agregar             # Agregar por URL o upload
│   ├── /albumes             # Gestión de álbumes
│   └── /integraciones       # Config de APIs (YouTube, etc.)
└── /analytics                # Analytics de contenido
    ├── /blog
    └── /multimedia
```

---

## SISTEMA DE ROLES Y PERMISOS

### Roles Definidos

```typescript
enum Role {
  SUPER_ADMIN = 'super_admin',      // Acceso total
  ADMIN = 'admin',                  // Acceso a todo excepto config crítica
  MANAGER_EMPRESA = 'manager_empresa', // Solo Eje 1
  MANAGER_TIENDA = 'manager_tienda',   // Solo Eje 2
  MANAGER_CONTENIDO = 'manager_contenido', // Solo Eje 3
  EMPLEADO = 'empleado',            // Acceso limitado a proyectos asignados
  CLIENTE = 'cliente',              // Solo ver sus proyectos/órdenes
}
```

### Matriz de Permisos

| Rol | Eje 1 (Empresa) | Eje 2 (Tienda) | Eje 3 (Contenido) |
|-----|----------------|----------------|-------------------|
| Super Admin | ✅ Full | ✅ Full | ✅ Full |
| Admin | ✅ Full | ✅ Full | ✅ Full |
| Manager Empresa | ✅ Full | ❌ Read | ❌ Read |
| Manager Tienda | ❌ Read | ✅ Full | ❌ Read |
| Manager Contenido | ❌ Read | ❌ Read | ✅ Full |
| Empleado | ⚠️ Assigned | ❌ None | ⚠️ Own Posts |
| Cliente | ⚠️ Own Data | ⚠️ Own Orders | ❌ None |

### Implementación de Permisos

```typescript
interface Permission {
  resource: string; // 'clients', 'products', 'posts', etc.
  action: 'create' | 'read' | 'update' | 'delete';
  scope: 'all' | 'own' | 'assigned' | 'none';
}

const PERMISSIONS: Record<Role, Permission[]> = {
  [Role.SUPER_ADMIN]: [
    { resource: '*', action: '*', scope: 'all' }
  ],
  
  [Role.MANAGER_TIENDA]: [
    { resource: 'products', action: '*', scope: 'all' },
    { resource: 'orders', action: '*', scope: 'all' },
    { resource: 'categories', action: '*', scope: 'all' },
    { resource: 'clients', action: 'read', scope: 'all' },
  ],
  
  // ... más configuraciones
};

// Middleware de autorización
function authorize(user: User, resource: string, action: string) {
  const permissions = PERMISSIONS[user.role];
  return permissions.some(p => 
    (p.resource === resource || p.resource === '*') &&
    (p.action === action || p.action === '*') &&
    p.scope !== 'none'
  );
}
```

---

## BASE DE DATOS

### Esquema Completo (Supabase PostgreSQL)

Ver archivo separado: `docs/database/SCHEMA.sql`

### Tablas Principales

**Autenticación y Usuarios:**
- `auth.users` (Supabase Auth)
- `profiles` - Perfil extendido
- `team_members` - Miembros del equipo

**Eje 1 - Empresa:**
- `clients` - Clientes
- `projects` - Proyectos
- `project_team_members` - Relación proyecto-equipo
- `tasks` - Tareas
- `client_interactions` - Interacciones
- `client_documents` - Documentos
- `invoices` - Facturas
- `invoice_items` - Items de factura

**Eje 2 - Ecommerce:**
- `products` - Productos
- `product_categories` - Categorías
- `product_images` - Imágenes
- `product_variants` - Variantes
- `product_category_mapping` - Relación producto-categoría
- `orders` - Órdenes
- `order_items` - Items de orden
- `carts` - Carritos
- `cart_items` - Items de carrito
- `payment_transactions` - Transacciones

**Eje 3 - Contenido:**
- `blog_posts` - Posts
- `blog_categories` - Categorías de blog
- `blog_tags` - Tags
- `blog_post_tags` - Relación post-tag
- `media_items` - Items multimedia (NUEVO)
- `media_albums` - Álbumes (NUEVO)
- `media_album_items` - Relación álbum-item (NUEVO)

---

## FLUJOS DE USUARIO

### Flujo de Compra (Eje 2)

```
1. Usuario navega /shop
2. Busca/filtra productos
3. Click en producto → /shop/producto/[slug]
4. Selecciona variante (si aplica)
5. Click "Agregar al Carrito"
   ├─ Si no autenticado: Carrito en localStorage
   └─ Si autenticado: Carrito en DB
6. Click "Ver Carrito" → /shop/carrito
7. Revisa items, aplica cupón (opcional)
8. Click "Proceder al Checkout" → /shop/checkout
9. Completa información:
   ├─ Email
   ├─ Dirección de envío
   ├─ Método de pago
   └─ Método de envío (si aplica)
10. Confirma orden
11. Redirige a pasarela de pago (Mercado Pago/Cryptomus)
12. Completa pago
13. Webhook actualiza estado → /shop/orden/[id]
14. Email de confirmación enviado
```

### Flujo de Gestión de Contenido (Eje 3)

```
1. Admin ingresa /dashboard/contenido/multimedia
2. Click "Agregar Contenido"
3. Selecciona método:
   ├─ URL (YouTube, Instagram, TikTok)
   │   ├─ Pega URL
   │   ├─ Sistema detecta plataforma
   │   ├─ Extrae metadata automático
   │   └─ Preview del contenido
   │
   └─ Upload de archivo
       ├─ Selecciona archivo
       ├─ Sube a Supabase Storage
       └─ Crea thumbnail automático
4. Completa información:
   ├─ Título
   ├─ Descripción
   ├─ Tags
   ├─ Álbum (opcional)
   └─ Estado (draft/published)
5. Guarda
6. Contenido aparece en /multimedia
```

---

**Siguiente paso:** Implementación de cada eje por fases.

**Prioridad sugerida:**
1. Eje 2 (Ecommerce) - Hero de tienda + catálogo básico
2. Eje 3 (Contenido) - Gestor multimedia
3. Eje 1 (Empresa) - Mejoras a CRM actual

---

**Mantenido por:** Equipo V1TR0  
**Última actualización:** Junio 26, 2026  
**Versión:** 3.0
