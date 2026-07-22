-- ============================================================
-- V1TR0 E-COMMERCE — SCHEMA COMPLETO
-- DB: PostgreSQL (Neon o Supabase)
-- Auth: NextAuth v5 (compatible)
-- Pagos: Wompi (Bancolombia)
-- ============================================================

-- 0. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. USUARIOS Y PERFILES
-- Tabla base para NextAuth (seeded por el adapter)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT,
    email TEXT UNIQUE,
    email_verified TIMESTAMPTZ,
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accounts (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    provider_account_id TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at BIGINT,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    PRIMARY KEY (provider, provider_account_id)
);

CREATE TABLE IF NOT EXISTS sessions (
    session_token TEXT NOT NULL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS verification_tokens (
    identifier TEXT NOT NULL,
    token TEXT NOT NULL,
    expires TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (identifier, token)
);

-- ============================================================
-- 2. PERFILES DE NEGOCIO (extiende users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin', 'team')),
    account_type TEXT NOT NULL DEFAULT 'free' CHECK (account_type IN ('free', 'premium', 'enterprise')),
    account_status TEXT NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'cancelled')),
    credits INTEGER NOT NULL DEFAULT 0 CHECK (credits >= 0),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_account_type ON profiles(account_type);

-- ============================================================
-- 3. DIRECCIONES
-- ============================================================
CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    alias TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    street TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT,
    zip_code TEXT,
    country TEXT NOT NULL DEFAULT 'CO',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_addresses_profile ON addresses(profile_id);

-- ============================================================
-- 4. CATÁLOGO DE PRODUCTOS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    short_description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    original_price DECIMAL(10,2) CHECK (original_price >= price),
    product_type TEXT NOT NULL DEFAULT 'digital'
        CHECK (product_type IN ('digital', 'physical', 'service', 'subscription')),
    category TEXT NOT NULL,
    subcategory TEXT,
    tags TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    stock INTEGER DEFAULT -1,
    features JSONB DEFAULT '[]',
    specifications JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    badge TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_type ON products(product_type);
CREATE INDEX idx_products_active ON products(is_active);

-- ============================================================
-- 5. VARIANTES DE PRODUCTO
-- ============================================================
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price_adjustment DECIMAL(10,2) DEFAULT 0,
    stock INTEGER DEFAULT -1,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_variants_product ON product_variants(product_id);

-- ============================================================
-- 6. CARRITO PERSISTENTE
-- ============================================================
CREATE TABLE IF NOT EXISTS carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price_snapshot DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. ÓRDENES DE COMPRA (Wompi-ready)
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    order_number TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'COP',
    -- Wompi campos
    wompi_transaction_id TEXT,
    wompi_reference TEXT,
    wompi_status TEXT,
    wompi_payment_method TEXT,
    wompi_payment_method_type TEXT,
    wompi_processor_response TEXT,
    payment_status TEXT DEFAULT 'pending'
        CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partially_paid')),
    billing_address_id UUID REFERENCES addresses(id),
    shipping_address_id UUID REFERENCES addresses(id),
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_profile ON orders(profile_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_wompi ON orders(wompi_transaction_id);
CREATE UNIQUE INDEX idx_orders_number ON orders(order_number);

-- ============================================================
-- 8. ITEMS DE ÓRDENES
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    variant_id UUID REFERENCES product_variants(id),
    product_name TEXT NOT NULL,
    product_slug TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ============================================================
-- 9. AGENDAMIENTO DE SERVICIOS
-- ============================================================
CREATE TABLE IF NOT EXISTS service_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    max_capacity INTEGER DEFAULT 1,
    buffer_minutes INTEGER DEFAULT 15,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slot_id UUID NOT NULL REFERENCES service_slots(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    slot_id UUID NOT NULL REFERENCES service_slots(id),
    order_item_id UUID REFERENCES order_items(id) ON DELETE SET NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled'
        CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_appointments_profile ON appointments(profile_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_start ON appointments(start_time);

-- ============================================================
-- 10. COTIZACIONES (solicitudes de presupuesto)
-- ============================================================
CREATE TABLE IF NOT EXISTS quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    project_type TEXT NOT NULL,
    description TEXT NOT NULL,
    budget TEXT,
    timeline TEXT,
    tech_reqs TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quotes_profile ON quotes(profile_id);
CREATE INDEX idx_quotes_status ON quotes(status);

-- ============================================================
-- 11. PROYECTOS Y TAREAS (gestión interna)
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active'
        CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    client_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(50) DEFAULT 'pendiente'
        CHECK (estado IN ('completada', 'en progreso', 'pendiente')),
    prioridad VARCHAR(20) DEFAULT 'media'
        CHECK (prioridad IN ('alta', 'media', 'baja')),
    categoria VARCHAR(50) NOT NULL
        CHECK (categoria IN ('planeacion', 'diseno', 'desarrollo', 'testing', 'despliegue')),
    finalizada BOOLEAN DEFAULT FALSE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    assigned_to TEXT REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 12. SOLICITUDES DE REUNIÓN
-- ============================================================
CREATE TABLE IF NOT EXISTS meeting_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    preferred_date TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_meeting_requests_profile ON meeting_requests(profile_id);
CREATE INDEX idx_meeting_requests_status ON meeting_requests(status);

-- ============================================================
-- 13. FASES DE PROYECTO (línea de tiempo inteligente)
-- ============================================================
CREATE TABLE IF NOT EXISTS project_phases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_phases_project ON project_phases(project_id);

-- ============================================================
-- 14. TAREAS DE FASE
-- ============================================================
CREATE TABLE IF NOT EXISTS phase_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phase_id UUID NOT NULL REFERENCES project_phases(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    assigned_to TEXT REFERENCES profiles(id),
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_phase_tasks_phase ON phase_tasks(phase_id);

-- ============================================================
-- 15. TRIGGER: AUTO-CREAR PERFIL AL REGISTRARSE
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, role, name, email, account_type)
    VALUES (
        NEW.id,
        'client',
        COALESCE(NEW.name, split_part(COALESCE(NEW.email, 'user@email.com'), '@', 1)),
        NEW.email,
        'free'
    )
    ON CONFLICT (id) DO UPDATE SET
        name = COALESCE(EXCLUDED.name, profiles.name),
        email = COALESCE(EXCLUDED.email, profiles.email),
        updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 16. TRIGGER: CARRITO AUTOMÁTICO AL CREAR PERFIL
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_profile_cart()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.carts (profile_id) VALUES (NEW.id)
    ON CONFLICT (profile_id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_created ON profiles;
CREATE TRIGGER on_profile_created
    AFTER INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_profile_cart();

-- ============================================================
-- 17. TRIGGER: UPDATED_AT
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 18. SEED: PRODUCTOS INICIALES
-- ============================================================
INSERT INTO products (name, slug, description, short_description, price, original_price, product_type, category, stock, is_featured, badge, features) VALUES
(
    'Auditoría de Ciberseguridad',
    'auditoria-ciberseguridad',
    'Análisis completo de vulnerabilidades, pruebas de penetración y protección de activos digitales. Incluye informe detallado y plan de remediación.',
    'Protege tu infraestructura digital',
    1200000, 1500000, 'service', 'ciberseguridad', -1, TRUE, 'Más vendido',
    '["Escaneo de vulnerabilidades", "Pruebas de penetración", "Informe ejecutivo", "Plan de remediación", "Soporte 30 días"]'::jsonb
),
(
    'Sistema POS Completo',
    'sistema-pos',
    'Plataforma de punto de venta con facturación electrónica, control de inventario, reportes en tiempo real y Dashboard analítico.',
    'Facturación electrónica e inventario',
    600000, 800000, 'digital', 'facturacion', 50, TRUE, 'Oferta',
    '["Facturación electrónica", "Control de inventario", "Reportes en tiempo real", "Múltiples sucursales", "Soporte 24/7"]'::jsonb
),
(
    'Kit Hardware Básico POS',
    'kit-hardware-basico',
    'Lector de código de barras, cajón monedero e impresora térmica. Compatible con cualquier sistema POS.',
    'Tu primer kit POS',
    1600000, 2000000, 'physical', 'hardware', 20, TRUE, 'Envío gratis',
    '["Lector código de barras", "Cajón monedero", "Impresora térmica", "Cables incluidos", "Garantía 1 año"]'::jsonb
),
(
    'Plataforma IoT',
    'plataforma-iot',
    'Monitoreo remoto de dispositivos con dashboard en tiempo real, alertas inteligentes y análisis predictivo.',
    'Conecta tus dispositivos IoT',
    800000, NULL, 'subscription', 'iot', -1, TRUE, 'Nuevo',
    '["Dashboard en tiempo real", "Alertas inteligentes", "Análisis predictivo", "API abierta", "Soporte multicliente"]'::jsonb
),
(
    'Desarrollo Web Profesional',
    'desarrollo-web-profesional',
    'Página web profesional con SEO optimizado, diseño responsive, panel administrable y hosting incluido por 1 año.',
    'Tu sitio web profesional',
    2500000, 3500000, 'service', 'desarrollo', -1, TRUE, 'Recomendado',
    '["Diseño responsive", "SEO optimizado", "Panel administrable", "Hosting 1 año", "Dominio .com.co"]'::jsonb
),
(
    'Sistema de Comunicación Descentralizado',
    'sistema-comunicacion-descentralizado',
    'Plataforma de mensajería y videollamadas cifradas con arquitectura descentralizada. Sin servidores centrales.',
    'Comunicación segura y descentralizada',
    1000000, 1400000, 'digital', 'comunicacion', -1, FALSE, NULL,
    '["Mensajería cifrada", "Videollamadas", "Arquitectura P2P", "Sin servidores centrales", "Código abierto"]'::jsonb
),
(
    'Consultoría en Transformación Digital',
    'consultoria-transformacion-digital',
    'Diagnóstico, estrategia y hoja de ruta para la transformación digital de tu empresa.',
    'Transforma tu negocio digitalmente',
    3500000, NULL, 'service', 'consultoria', -1, FALSE, NULL,
    '["Diagnóstico inicial", "Estrategia personalizada", "Hoja de ruta", "Acompañamiento 3 meses", "KPIs de medición"]'::jsonb
),
(
    'App Mobile POS',
    'app-mobile-pos',
    'Aplicación móvil para punto de venta. Facturación, inventario y ventas desde tu celular.',
    'Tu POS en el bolsillo',
    350000, 450000, 'digital', 'facturacion', 100, FALSE, NULL,
    '["Facturación móvil", "Inventario en línea", "Ventas offline", "Escanea códigos", "Multi-dispositivo"]'::jsonb
);

-- ============================================================
-- 19. PERMISOS (RLS)
-- Nota: RLS se configura desde la app con Drizzle
-- Estos son permisos base para operación
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- FIN DEL SCHEMA
-- ============================================================
