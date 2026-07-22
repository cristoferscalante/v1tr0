# Arquitectura de Usuarios — V1TR0

> Proyecto: **v1tr0-new-ecomerce**
> Fecha: Julio 2026
> Propósito: Documentar el diagnóstico, la arquitectura de cuenta mixta y el plan de migración

---

## 1. Diagnóstico del Estado Actual

### 1.1 Lo que funciona

| Componente | Estado |
|-----------|--------|
| Registro email/password | Funcional (usa `@/lib/supabase/client`) |
| Login email/password + Google OAuth | Funcional |
| Auto-creación de perfil en callback OAuth | Corregido |
| Catálogo de productos (UI) | 12 productos mock, grid, filtros, búsqueda |
| Carrito de compras (UI) | Contexto React, drawer, contador flotante |
| Admin CRUD productos/paquetes | Formularios con Zod + localStorage |
| Roles base (`client`, `admin`, `team`) | Operativos en middleware + providers |
| AuthProvider unificado | Hook `use-auth.tsx` (único activo) |

### 1.2 Lo que falta o está roto

| Componente | Estado | Impacto |
|-----------|--------|---------|
| **Checkout / Pasarela de pago** | Botón "Finalizar compra" sin handler | El carrito no puede concretar ventas |
| **Órdenes de compra** | No existe schema ni rutas | No hay historial de compras |
| **Carrito persistente** | Solo estado en memoria | Se pierde al recargar página |
| **Agendamiento de servicios** | No existe | No se pueden reservar citas/servicios |
| **Tipos de cuenta** | No existe `account_type` | No hay diferenciación free/premium |
| **Tipos dispersos** | `Product` en componente, `CartItem` duplicado | Mantenimiento difícil |
| **Trigger auto-profile** | Comentado en migración 004 | Perfiles no se crean automáticamente |
| **Conexión a DB** | Proyecto anterior eliminado (>90 días pausado) | Schema y datos perdidos |

---

## 2. Arquitectura Propuesta: Cuenta Mixta

### 2.1 Modelo de Usuario

```
auth.users (Supabase Auth)
  │ (1:1)
  └── profiles
        ├── role: 'client' | 'admin' | 'team'       ← permisos de sistema
        ├── account_type: 'free' | 'premium' | 'enterprise'  ← nivel de cuenta
        ├── account_status: 'active' | 'suspended'   ← estado
        ├── credits: integer                          ← saldo / folios
        └── metadata: JSONB                           ← extensión futura
              │
              ├── addresses (1:N)                     ← direcciones de envío/facturación
              ├── orders (1:N)                        ← historial de compras
              │     └── order_items (1:N) → products
              │           └── appointments (1:N)      ← servicios agendados
              ├── carts (1:1)                         ← carrito persistente
              │     └── cart_items (1:N) → products
              └── appointments (1:N) → service_slots  ← citas agendadas directas
```

### 2.2 Principios de diseño

1. **`role` vs `account_type` son ortogonales**: `role` controla acceso interno (admin/team/client). `account_type` controla features del producto (free puede comprar, premium tiene descuentos, enterprise tiene soporte prioritario).

2. **Escalabilidad vertical**: `metadata: JSONB` en cada tabla permite agregar campos sin migrar schema.

3. **RLS policies granulares**: cada tabla define quién puede SELECT/INSERT/UPDATE según `role` y `auth.uid()`.

4. **Snapshot de precios**: `order_items` y `cart_items` guardan el precio al momento de la acción, no referencian dinámicamente al producto (evita cambios de precio retroactivos).

5. **Un solo perfil de usuario**: `profiles` es la entidad central, todo cuelga de ahí con FK.

### 2.3 Mapa de Rutas vs Estado

| Ruta | Estado | Acción |
|------|--------|--------|
| `/tienda` | ✅ Existe | Mostrar catálogo desde DB |
| `/tienda/[slug]` | ✅ Existe | Detalle de producto/servicio |
| `/checkout` | ❌ No existe | Crear con flujo de pago Stripe |
| `/client-dashboard/orders` | ❌ No existe | Crear historial de órdenes |
| `/client-dashboard/appointments` | ❌ No existe | Crear gestión de citas |
| `/admin/orders` | ❌ No existe | Crear admin de órdenes |
| `/admin/products` | ✅ Existe | Migrar a usar DB en vez de mock/localStorage |

---

## 3. Schema de Base de Datos

El schema completo está en:
- **`supabase/migrations/999_v1tr0_new_ecomerce.sql`** — migración única para el nuevo proyecto
- 12 tablas, 5 triggers, RLS policies granulares

**Nuevas tablas respecto al schema anterior:**

| Tabla | Función |
|-------|---------|
| `addresses` | Direcciones de envío y facturación |
| `products` | Catálogo de productos/servicios (antes era mock data) |
| `product_variants` | Variantes (tallas, licencias, duración) |
| `carts` | Carrito persistente por usuario |
| `cart_items` | Items en el carrito con precio snapshot |
| `orders` | Órdenes de compra con estado y pago |
| `order_items` | Items de cada orden con snapshot |
| `service_slots` | Tipos de servicio agendable |
| `service_availability` | Horarios disponibles por slot |
| `appointments` | Citas agendadas por usuarios |

**Tablas preservadas del schema anterior:**

| Tabla | Nota |
|-------|------|
| `profiles` | Expandida con `account_type`, `account_status`, `credits`, `metadata` |
| `projects` | Se mantiene igual (gestión de proyectos) |
| `tasks` | Se mantiene igual |
| `meetings` | Se mantiene igual |
| `meeting_summaries` | Se mantiene igual |
| `meeting_tasks` | Se mantiene igual |
| `task_comments` | Se mantiene igual |

---

## 4. Comparativa: Antes vs Ahora

### Perfil de usuario (antes)
```sql
profiles (id, name, email, avatar, role)
```

### Perfil de usuario (ahora)
```sql
profiles (
  id, name, email, avatar, phone,
  role,           -- client | admin | team
  account_type,   -- free | premium | enterprise  ← NUEVO
  account_status, -- active | suspended            ← NUEVO
  credits,        -- saldo/folios                  ← NUEVO
  metadata,       -- JSONB extensible              ← NUEVO
  created_at, updated_at
)
```

### Flujo de compra (antes)
```
Producto mock → Carrito (memoria) → [Dead end]
```

### Flujo de compra (ahora)
```
Producto (DB) → Carrito (DB) → Checkout → Stripe → Order (DB) → Confirmation
```

### Servicios (antes)
```
No existía
```

### Servicios (ahora)
```
Service Slot (DB) → Availability (DB) → Appointment (DB) → Calendar integration
```

---

## 5. Plan de Migración

### Paso 1: Obtener credenciales del nuevo proyecto

1. Ir a https://supabase.com/dashboard/project/[NUEVO_REF]/settings/api
2. Copiar:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL` en `.env.local`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY` en `.env.local`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` en `.env.local`

### Paso 2: Aplicar schema a la DB

**Opción A — Dashboard SQL Editor:**
1. Ir a https://supabase.com/dashboard/project/[NUEVO_REF]/sql/new
2. Copiar contenido de `supabase/migrations/999_v1tr0_new_ecomerce.sql`
3. Ejecutar

**Opción B — CLI:**
```bash
supabase login
supabase link --project-ref [NUEVO_REF]
supabase db push
```

### Paso 3: Configurar Google OAuth

1. Supabase Dashboard → Authentication → Providers → Google → **Enable**
2. Client ID: de `.env.local` (`GOOGLE_CLIENT_ID`)
3. Client Secret: de `.env.local` (`GOOGLE_CLIENT_SECRET`)
4. Redirect URI ya configurado: `https://[NUEVO_REF].supabase.co/auth/v1/callback`

### Paso 4: Configurar SMTP para emails de confirmación

1. Supabase Dashboard → Authentication → Settings
2. SMTP Settings → Enable custom SMTP
3. Usar credenciales de `.env.local`:
   - Host: `smtp.hostinger.com`
   - Port: `465`
   - User: `buzon@v1tr0.com`
   - Pass: de `.env.local`

### Paso 5: Verificar

```bash
# Desde el proyecto
node tests/utils/test-supabase.js
```

Debería mostrar:
```
✅ Conexión establecida
✅ Tabla profiles accesible
✅ Tabla products accesible
✅ Tabla orders accesible
```

---

## 6. Checklist de Configuración en Supabase Dashboard

- [ ] Google OAuth activado (Authentication → Providers → Google)
- [ ] SMTP configurado (Authentication → Settings → SMTP)
- [ ] Site URL configurado: `http://localhost:3000` (y producción)
- [ ] Redirect URLs: `http://localhost:3000/auth/callback`
- [ ] Políticas RLS aplicadas (ya incluidas en el schema)
- [ ] Trigger auto-profile aplicado
- [ ] Extensiones habilitadas: `pgcrypto`

---

## 7. Próximos Pasos (Desarrollo)

### Fase 1 — Fundación DB (ahora)
- [x] Crear schema completo
- [ ] Aplicar a nuevo proyecto Supabase
- [ ] Configurar Google OAuth + SMTP

### Fase 2 — Checkout + Pagos
- [ ] Integrar Stripe (`@stripe/stripe-js` + API route)
- [ ] Crear `/checkout` page
- [ ] Conectar carrito con `carts`/`cart_items` en DB
- [ ] Webhook Stripe → actualizar `orders`

### Fase 3 — Órdenes
- [ ] Ruta `/client-dashboard/orders` (historial)
- [ ] Ruta `/admin/orders` (gestión)
- [ ] Email de confirmación de orden

### Fase 4 — Servicios
- [ ] Panel de administración de `service_slots`
- [ ] Selector de horarios en frontend
- [ ] Ruta `/client-dashboard/appointments`
- [ ] Notificaciones de recordatorio

### Fase 5 — Tipos de Cuenta
- [ ] Lógica de `account_type` en middleware
- [ ] Features flags por nivel
- [ ] Upgrade flow (free → premium → enterprise)

---

## 8. Notas Técnicas

### Stripe Webhook Flow
```
Comprador → Frontend Checkout → API Route /api/checkout
  → Stripe Create Payment Intent → stripe_payment_intent_id
  → Redirect a Stripe Checkout
  → Stripe Webhook → /api/webhooks/stripe
  → Actualizar orders.payment_status = 'paid'
  → Actualizar orders.status = 'confirmed'
  → Crear order_items
  → Si es servicio: crear appointment
```

### Carrito Persistente
- Sincronizar `CartContext` (memoria) con `carts`/`cart_items` en DB
- Cada cambio en el carrito → `upsert` a Supabase
- Al cargar página → fetch carrito desde Supabase
- Estrategia: optimistic UI, sync en background

### Account Types
- **free**: acceso básico, puede comprar productos individuales
- **premium**: descuentos, soporte prioritario, features exclusivas
- **enterprise**: custom pricing, API access, SLA
