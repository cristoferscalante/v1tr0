-- ============================================================
-- V1TR0 - ESQUEMA COMPLETO PARA NUEVO PROYECTO
-- Proyecto: v1tr0-new-ecomerce
-- Uso: pegar en Supabase Dashboard > SQL Editor y ejecutar
-- ============================================================

-- 0. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. PERFILES DE USUARIO
-- ============================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT UNIQUE,
    avatar TEXT,
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
CREATE INDEX idx_profiles_email ON profiles(email);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select" ON profiles
    FOR SELECT USING (auth.uid() = id OR
        (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'team'));

CREATE POLICY "profiles_insert" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- ============================================================
-- 2. DIRECCIONES
-- ============================================================
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
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

ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "addresses_manage" ON addresses
    FOR ALL USING (auth.uid() = profile_id OR
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ============================================================
-- 3. CATALOGO DE PRODUCTOS/SERVICIOS
-- ============================================================
CREATE TABLE products (
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

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_select" ON products
    FOR SELECT USING (is_active OR
        (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'team'));

CREATE POLICY "products_manage" ON products
    FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ============================================================
-- 4. VARIANTES DE PRODUCTO
-- ============================================================
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price_adjustment DECIMAL(10,2) DEFAULT 0,
    stock INTEGER DEFAULT -1,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_variants_product ON product_variants(product_id);

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "variants_select" ON product_variants FOR SELECT USING (TRUE);
CREATE POLICY "variants_manage" ON product_variants
    FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ============================================================
-- 5. CARRITO PERSISTENTE
-- ============================================================
CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price_snapshot DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "carts_own" ON carts
    FOR ALL USING (auth.uid() = profile_id);

CREATE POLICY "cart_items_own" ON cart_items
    FOR ALL USING (
        EXISTS (SELECT 1 FROM carts
            WHERE carts.id = cart_items.cart_id
            AND carts.profile_id = auth.uid()));

-- ============================================================
-- 6. PROYECTOS (gestion de proyectos)
-- ============================================================
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active'
        CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_projects_client ON projects(client_id);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects_select" ON projects
    FOR SELECT USING (
        auth.uid() = client_id OR
        (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'team'));

CREATE POLICY "projects_manage" ON projects
    FOR ALL USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'team'));

-- ============================================================
-- 7. TAREAS
-- ============================================================
CREATE TABLE tasks (
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
    assigned_to UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tasks_select" ON tasks FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = tasks.project_id
        AND (projects.client_id = auth.uid() OR
            (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'team'))));

-- ============================================================
-- 8. REUNIONES
-- ============================================================
CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    duration INTEGER DEFAULT 60,
    status VARCHAR(50) DEFAULT 'scheduled'
        CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
    meeting_type VARCHAR(100) DEFAULT 'consultation',
    google_calendar_event_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "meetings_select" ON meetings
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "meetings_manage" ON meetings
    FOR ALL TO authenticated USING (true);

-- ============================================================
-- 9. AGENDAMIENTO DE SERVICIOS
-- ============================================================
CREATE TABLE service_slots (
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

CREATE TABLE service_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slot_id UUID NOT NULL REFERENCES service_slots(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    slot_id UUID NOT NULL REFERENCES service_slots(id),
    order_item_id UUID,
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

ALTER TABLE service_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "slots_select" ON service_slots FOR SELECT USING (TRUE);
CREATE POLICY "availability_select" ON service_availability FOR SELECT USING (TRUE);

CREATE POLICY "appointments_select" ON appointments
    FOR SELECT USING (auth.uid() = profile_id OR
        (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'team'));

CREATE POLICY "appointments_insert" ON appointments
    FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- ============================================================
-- 10. ORDENES DE COMPRA
-- ============================================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    order_number TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_method TEXT,
    payment_status TEXT DEFAULT 'pending'
        CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    stripe_payment_intent_id TEXT,
    billing_address_id UUID REFERENCES addresses(id),
    shipping_address_id UUID REFERENCES addresses(id),
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_profile ON orders(profile_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment ON orders(payment_status);
CREATE UNIQUE INDEX idx_orders_number ON orders(order_number);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_select" ON orders
    FOR SELECT USING (auth.uid() = profile_id OR
        (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'team'));

CREATE POLICY "orders_insert" ON orders
    FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "orders_update" ON orders
    FOR UPDATE USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'team'));

-- ============================================================
-- 11. ITEMS DE ORDENES
-- ============================================================
CREATE TABLE order_items (
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

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items_select" ON order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id
        AND (orders.profile_id = auth.uid() OR
            (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'team'))));

-- aging appointments FK despues de crear order_items
ALTER TABLE appointments
    ADD CONSTRAINT fk_appointment_order_item
    FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE SET NULL;

-- ============================================================
-- 12. REUNIONES - tablas extendidas
-- ============================================================
CREATE TABLE meeting_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    meeting_date DATE,
    participants JSONB,
    summary TEXT,
    key_decisions JSONB DEFAULT '[]'::jsonb,
    tasks JSONB DEFAULT '[]'::jsonb,
    follow_ups JSONB DEFAULT '[]'::jsonb,
    next_meeting JSONB,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE meeting_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "summaries_select" ON meeting_summaries
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "summaries_manage" ON meeting_summaries
    FOR ALL TO authenticated USING (true);

-- ============================================================
-- 13. TRIGGER: AUTO-CREAR PERFIL AL REGISTRARSE
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, role, name, email, avatar, account_type)
    VALUES (
        NEW.id,
        'client',
        COALESCE(
            NEW.raw_user_meta_data->>'name',
            NEW.raw_user_meta_data->>'full_name',
            split_part(NEW.email, '@', 1)
        ),
        NEW.email,
        NEW.raw_user_meta_data->>'avatar_url',
        'free'
    )
    ON CONFLICT (id) DO UPDATE SET
        name = COALESCE(EXCLUDED.name, profiles.name),
        email = COALESCE(EXCLUDED.email, profiles.email),
        avatar = COALESCE(EXCLUDED.avatar, profiles.avatar),
        updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 14. TRIGGER: CARRITO AUTOMATICO AL CREAR PERFIL
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
-- 15. TRIGGER: UPDATED_AT
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at
    BEFORE UPDATE ON addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meetings_updated_at
    BEFORE UPDATE ON meetings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_summaries_updated_at
    BEFORE UPDATE ON meeting_summaries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 16. PERMISOS
-- ============================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;

-- ============================================================
-- 17. SEED: PRODUCTOS INICIALES (opcional)
-- ============================================================
INSERT INTO products (name, slug, description, short_description, price, product_type, category, stock, is_featured) VALUES
('Auditoria de Ciberseguridad', 'auditoria-ciberseguridad', 'Analisis completo de vulnerabilidades y proteccion de activos digitales.', 'Protege tu infraestructura digital', 299.99, 'service', 'ciberseguridad', -1, TRUE),
('Sistema POS Completo', 'sistema-pos', 'Plataforma de punto de venta con facturacion electronica, inventario y reportes.', 'Facturacion electronica e inventario', 149.99, 'digital', 'facturacion', 50, TRUE),
('Kit Hardware Basico', 'kit-hardware-basico', 'Equipo basico para punto de venta: lector codigo de barras + cajon monedero.', 'Tu primer kit POS', 399.99, 'physical', 'hardware', 20, TRUE),
('Plataforma IoT', 'plataforma-iot', 'Monitoreo remoto de dispositivos con dashboard en tiempo real.', 'Conecta tus dispositivos', 199.99, 'subscription', 'iot', -1, TRUE),
('Desarrollo Web', 'desarrollo-web', 'Pagina web profesional con SEO, responsive y panel administrable.', 'Tu sitio web profesional', 599.99, 'service', 'desarrollo', -1, TRUE),
('Sistema de Comunicacion', 'sistema-comunicacion', 'Plataforma descentralizada de mensajeria y videollamadas cifradas.', 'Comunicacion segura y descentralizada', 249.99, 'digital', 'comunicacion', -1, TRUE);
