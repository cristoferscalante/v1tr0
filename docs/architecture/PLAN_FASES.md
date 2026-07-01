# PLAN DE IMPLEMENTACIÓN - FASES 3-7

**Proyecto:** Sistema V1TR0 de 3 Ejes  
**Fecha inicio:** Junio 26, 2026  
**Metodología:** Agile, entregas incrementales

---

## FASE 3: ECOMMERCE - FUNDACIÓN
**Duración estimada:** 2-3 días  
**Prioridad:** ALTA

### 3.1 Base de Datos Ecommerce
- [ ] Crear migración SQL completa
- [ ] Tablas de productos y variantes
- [ ] Tablas de órdenes y pagos
- [ ] Tablas de carritos
- [ ] RLS policies
- [ ] Indexes para performance

### 3.2 Servicios Base
- [ ] Servicio de productos (`lib/services/products.ts`)
- [ ] Servicio de carritos (`lib/services/cart.ts`)
- [ ] Servicio de órdenes (`lib/services/orders.ts`)
- [ ] Servicio Mercado Pago (`lib/services/mercadopago.ts`)
- [ ] Servicio Cryptomus (`lib/services/cryptomus.ts`)

### 3.3 Hooks y Estado
- [ ] Hook `useCart` con Zustand
- [ ] Hook `useCheckout`
- [ ] Hook `useProducts`
- [ ] Context de carrito persistente

---

## FASE 4: ECOMMERCE - FRONTEND PÚBLICO
**Duración estimada:** 3-4 días  
**Prioridad:** ALTA

### 4.1 Hero de Tienda
- [ ] Componente `ShopHero` (estilo Hero actual)
- [ ] Sección de proyectos destacados
  - [ ] Card de Cyber Decks
  - [ ] Card de Sistemas POS
- [ ] Categorías principales
- [ ] Call-to-action prominente

### 4.2 Catálogo de Productos
- [ ] Página `/shop` - Grid de productos
- [ ] Componente `ProductCard`
- [ ] Filtros por categoría
- [ ] Búsqueda de productos
- [ ] Ordenamiento (precio, nombre, popular)

### 4.3 Detalle de Producto
- [ ] Página `/shop/producto/[slug]`
- [ ] Galería de imágenes
- [ ] Selector de variantes
- [ ] Botón "Agregar al Carrito"
- [ ] Descripción completa (MDX)
- [ ] Productos relacionados
- [ ] Reviews (opcional)

### 4.4 Carrito y Checkout
- [ ] Drawer de carrito
- [ ] Página `/shop/carrito`
- [ ] Página `/shop/checkout`
- [ ] Formulario de envío
- [ ] Integración Mercado Pago
- [ ] Integración Cryptomus
- [ ] Página de confirmación

### 4.5 APIs Públicas
- [ ] `/api/products` - Listar productos
- [ ] `/api/products/[id]` - Detalle
- [ ] `/api/cart` - Gestión de carrito
- [ ] `/api/checkout` - Procesamiento
- [ ] `/api/webhooks/mercadopago` - Webhooks
- [ ] `/api/webhooks/cryptomus` - Webhooks

---

## FASE 5: ECOMMERCE - ADMINISTRACIÓN
**Duración estimada:** 2-3 días  
**Prioridad:** ALTA

### 5.1 Dashboard de Tienda
- [ ] Página `/dashboard/tienda`
- [ ] Resumen de ventas
- [ ] Productos destacados
- [ ] Órdenes recientes
- [ ] Estadísticas en tiempo real

### 5.2 Gestión de Productos
- [ ] Página `/dashboard/tienda/productos`
- [ ] Lista de productos (tabla)
- [ ] Formulario crear/editar producto
- [ ] Upload de imágenes múltiples
- [ ] Gestión de variantes
- [ ] Gestión de inventario
- [ ] Productos en draft

### 5.3 Gestión de Órdenes
- [ ] Página `/dashboard/tienda/ordenes`
- [ ] Lista de órdenes (filtrable)
- [ ] Detalle de orden
- [ ] Cambio de estado
- [ ] Generación de factura
- [ ] Tracking de envío
- [ ] Reembolsos

### 5.4 Finanzas de Tienda
- [ ] Dashboard financiero
- [ ] Reporte de ventas
- [ ] Análisis por producto
- [ ] Gráficos de ingresos
- [ ] Exportación de datos

---

## FASE 6: CONTENIDO - MULTIMEDIA
**Duración estimada:** 2-3 días  
**Prioridad:** MEDIA

### 6.1 Base de Datos Multimedia
- [ ] Migración de tablas multimedia
- [ ] Tabla `media_items`
- [ ] Tabla `media_albums`
- [ ] Storage bucket en Supabase

### 6.2 Servicios de Integración
- [ ] Servicio YouTube API (`lib/services/youtube.ts`)
- [ ] Servicio Instagram API (`lib/services/instagram.ts`)
- [ ] Servicio TikTok API (`lib/services/tiktok.ts`)
- [ ] Servicio de uploads (`lib/services/media-upload.ts`)
- [ ] Extractor de metadata

### 6.3 Gestor de Multimedia (Admin)
- [ ] Página `/dashboard/contenido/multimedia`
- [ ] Biblioteca de medios (grid)
- [ ] Formulario "Agregar por URL"
- [ ] Upload de archivos
- [ ] Gestión de álbumes
- [ ] Preview de contenido
- [ ] Edición de metadata

### 6.4 Galería Pública
- [ ] Página `/multimedia`
- [ ] Grid responsive de contenido
- [ ] Filtros por tipo/álbum
- [ ] Modal de vista previa
- [ ] Embeds funcionales
- [ ] Lazy loading de medios

---

## FASE 7: EMPRESA - CRM MEJORADO
**Duración estimada:** 2-3 días  
**Prioridad:** MEDIA

### 7.1 Mejoras a Gestión de Clientes
- [ ] Lista de clientes mejorada
- [ ] Formulario completo de cliente
- [ ] Historial de interacciones
- [ ] Upload de documentos
- [ ] Estados del cliente (lead, activo, etc.)
- [ ] Notas y seguimiento

### 7.2 Mejoras a Proyectos
- [ ] Dashboard de proyecto individual
- [ ] Tracking de tiempo
- [ ] Presupuesto vs. gastado
- [ ] Timeline visual
- [ ] Archivos del proyecto

### 7.3 Facturación
- [ ] Generación de facturas
- [ ] Plantilla de factura PDF
- [ ] Envío por email
- [ ] Tracking de pagos
- [ ] Reportes financieros

---

## ORDEN DE IMPLEMENTACIÓN SUGERIDO

### Sprint 1 (Semana 1)
1. **Fase 3.1** - Base de datos ecommerce (1 día)
2. **Fase 3.2 + 3.3** - Servicios y hooks (1 día)
3. **Fase 4.1** - Hero de tienda (1 día)

### Sprint 2 (Semana 2)
4. **Fase 4.2 + 4.3** - Catálogo y detalle (2 días)
5. **Fase 4.4** - Carrito y checkout (2 días)

### Sprint 3 (Semana 3)
6. **Fase 4.5** - APIs públicas (1 día)
7. **Fase 5.1 + 5.2** - Dashboard y productos (2 días)

### Sprint 4 (Semana 4)
8. **Fase 5.3 + 5.4** - Órdenes y finanzas (2 días)
9. **Fase 6.1 + 6.2** - Multimedia base (2 días)

### Sprint 5 (Semana 5)
10. **Fase 6.3 + 6.4** - Gestor y galería (2 días)
11. **Testing y refinamiento** (2 días)

---

## TECNOLOGÍAS Y LIBRERÍAS NUEVAS

### Ecommerce
```json
{
  "mercadopago": "^2.0.0",
  "cryptomus-sdk": "^1.0.0",
  "zustand": "^4.5.0"
}
```

### Multimedia
```json
{
  "youtube-api": "^3.0.0",
  "instagram-graph-api": "^2.0.0"
}
```

### UI Components
```json
{
  "react-dropzone": "^14.2.0",  // Ya instalado
  "react-player": "^2.16.0"
}
```

---

## PRINCIPIOS A SEGUIR

### SOLID

**S - Single Responsibility**
- Cada servicio tiene una sola responsabilidad
- Componentes enfocados en una tarea

**O - Open/Closed**
- Servicios extensibles sin modificar código existente
- Uso de interfaces y tipos genéricos

**L - Liskov Substitution**
- Implementaciones intercambiables
- Contratos bien definidos

**I - Interface Segregation**
- Interfaces específicas por funcionalidad
- No forzar dependencias innecesarias

**D - Dependency Inversion**
- Dependencia de abstracciones, no implementaciones
- Inyección de dependencias

### DRY (Don't Repeat Yourself)
- Componentes reutilizables
- Utilidades compartidas
- Hooks personalizados

### KISS (Keep It Simple, Stupid)
- Soluciones simples primero
- Evitar sobre-ingeniería
- Código legible

---

## CRITERIOS DE ACEPTACIÓN

### Cada Feature Debe:
- ✅ Build sin errores
- ✅ TypeScript sin errores
- ✅ Responsive (mobile, tablet, desktop)
- ✅ Modo oscuro compatible
- ✅ Accesible (ARIA, keyboard)
- ✅ Documentado con comentarios
- ✅ Probado manualmente
- ✅ Performance optimizado

---

## SIGUIENTE PASO

**Pregunta:** ¿Por dónde quieres empezar?

**Opciones:**

A) **Hero de Tienda + Catálogo básico** (recomendado)
   - Empezar con lo visual
   - Ver resultados inmediatos
   - Iterar sobre diseño

B) **Base de datos completa primero**
   - Fundación sólida
   - Luego construir encima
   - Más estructurado

C) **Multimedia primero**
   - Feature más rápido
   - Menos complejo
   - Ganar momentum

---

**Fecha de creación:** Junio 26, 2026  
**Mantenido por:** Equipo V1TR0
