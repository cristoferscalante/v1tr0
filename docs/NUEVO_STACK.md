# V1TR0 — Nuevo Stack

## Stack Final

| Capa | Tecnología | Propósito |
|------|-----------|-----------|
| **DB** | Neon (PostgreSQL) | Sin pausas, auto-wake, serverless |
| **Auth** | NextAuth v5 (Auth.js) | Google OAuth + email + sesiones |
| **Pagos** | Wompi (Bancolombia) | PSE + Nequi + Tarjetas Colombia |
| **ORM** | Drizzle | Tipado fuerte, migraciones, queries |
| **Storage** | Uploadthing | Subida de archivos directa desde frontend |
| **Deploy** | Vercel | Next.js nativo |

## Archivos Archivados (backup/)

| Carpeta | Contenido | Motivo |
|---------|-----------|--------|
| `backup/legacy-supabase/` | Migraciones viejas, config.toml, FIX_RLS | Reemplazado por schema unificado |
| `backup/legacy-auth/` | use-auth.tsx, supabase client/server, auth-errors | Reemplazado por NextAuth |
| `backup/legacy-cart/` | CartContext.tsx, CartDrawer, FloatingCartTab | Se reescribirá con persistencia DB |
| `backup/legacy-mock-data/` | mockProducts.ts, package data | Reemplazado por DB products table |

## Esquema de DB (`supabase/migrations/000_v1tr0_ecommerce.sql`)

18 tablas en orden:

```
users (NextAuth)
  └── profiles (role, account_type, credits)
        ├── addresses (envío/facturación)
        ├── orders (Wompi-ready)
        │     └── order_items → products
        ├── carts → cart_items → products
        │     └── product_variants
        ├── appointments → service_slots → products
        └── projects → tasks

products (catálogo con seed de 8 productos)
```

Características del schema:
- `users` + `accounts` + `sessions` = tablas de NextAuth v5
- `profiles` extiende users con `account_type` (free/premium/enterprise)
- `orders` tiene campos nativos Wompi: `wompi_transaction_id`, `wompi_reference`, `wompi_status`
- Triggers: auto-crear profile + auto-crear carrito al registrarse
- Seed: 8 productos iniciales en todas las categorías

## Próximos Pasos

1. Crear cuenta en Neon → copiar DATABASE_URL
2. Crear cuenta en Wompi → copiar keys
3. Crear cuenta en Google Cloud → OAuth credentials
4. Configurar NextAuth con Drizzle adapter
5. Migrar el frontend (páginas y componentes)
