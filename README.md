# V1TR0 - Plataforma de Gestión de Proyectos y E-Commerce

Plataforma web completa construida con Next.js 15, TypeScript, Tailwind CSS y Supabase. Incluye gestión de proyectos, autenticación, dashboard de administración y tienda e-commerce.

## 🚀 Características

- ✅ **Autenticación completa** con Supabase Auth
- ✅ **Dashboard de proyectos** con tareas y equipos
- ✅ **E-commerce** con carrito y gestión de productos
- ✅ **Panel de administración** para productos y paquetes
- ✅ **Sistema de diseño** unificado con variables CSS
- ✅ **Componentes 3D** con Three.js y React Three Fiber
- ✅ **Blog** con MDX
- ✅ **Inteligencia de código** con codebase-memory-mcp

## 📊 Estadísticas del Proyecto

```
📦 Nodos:      3,566 (componentes, funciones, tipos)
🔗 Relaciones: 5,348 (llamadas, importaciones, dependencias)
📁 Archivos:   346
🗣️ Lenguajes:  TypeScript (254), SQL (13), CSS (7), JavaScript (5)
```

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 15 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS + CSS Variables
- **Base de datos:** Supabase (PostgreSQL)
- **Autenticación:** Supabase Auth
- **UI Components:** shadcn/ui + Radix UI
- **3D:** Three.js + React Three Fiber
- **Animaciones:** Framer Motion
- **Inteligencia de código:** codebase-memory-mcp

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🧠 Inteligencia de Código (codebase-memory-mcp)

Este proyecto usa **codebase-memory-mcp** para mantener un grafo de conocimiento del codebase.

### Beneficios:
- 🚀 **99% menos tokens** en análisis de código (3.4K vs 412K)
- 🔍 **Búsquedas instantáneas** de componentes y dependencias
- 📊 **Visualización 3D** del grafo de arquitectura
- 🎯 **Análisis de impacto** antes de refactorizar
- 🧹 **Detección de código muerto**

### Comandos útiles:

```bash
# Ver arquitectura general
codebase-memory-mcp cli get_architecture '{"aspects": ["summary", "routes", "clusters"]}'

# Buscar componentes
codebase-memory-mcp cli search_graph '{"name_pattern": ".*Product.*"}'

# Trazar dependencias
codebase-memory-mcp cli trace_path '{"function_name": "CartProvider", "direction": "both"}'

# Visualizar en 3D
codebase-memory-mcp --ui=true --port=9749
# Abrir: http://localhost:9749
```

Ver documentación completa en: [`docs/architecture/CODEBASE_MEMORY_MCP.md`](docs/architecture/CODEBASE_MEMORY_MCP.md)

## 📁 Estructura del Proyecto

```
v1tr0-web/
├── app/                    # Next.js App Router
│   ├── (admin)/           # Panel de administración
│   ├── (auth)/            # Autenticación
│   ├── (dashboard)/       # Dashboard de proyectos
│   └── (marketing)/       # Landing y tienda
├── components/            # Componentes React
│   ├── admin/            # Componentes de admin
│   ├── auth/             # Componentes de auth
│   ├── dashboard/        # Componentes de dashboard
│   ├── global/           # Componentes globales
│   ├── shop/             # Componentes de tienda
│   └── ui/               # UI primitives
├── lib/                   # Utilidades y contextos
│   ├── context/          # React contexts
│   ├── data/             # Datos mock
│   └── supabase/         # Cliente Supabase
├── styles/               # Estilos globales
│   └── design-system/    # Sistema de diseño
├── docs/                 # Documentación
│   └── architecture/     # Documentación de arquitectura
└── public/               # Assets estáticos
```

## 🔧 Configuración

1. **Variables de entorno:**

```bash
cp .env.example .env.local
```

Configurar:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

2. **Base de datos:**

Ver setup completo en: [`SETUP_USUARIOS_PRUEBA.md`](SETUP_USUARIOS_PRUEBA.md)

## 🎨 Sistema de Diseño

El proyecto usa un sistema de diseño unificado basado en variables CSS:

- **Colores:** Tema claro/oscuro automático
- **Tipografía:** Escala modular con Geist
- **Espaciado:** Sistema de 8px
- **Animaciones:** Colección reutilizable

Ver: [`docs/architecture/DESIGN_SYSTEM.md`](docs/architecture/DESIGN_SYSTEM.md)

## 🗺️ Rutas Principales

### Marketing
- `/` - Landing page
- `/tienda` - Catálogo de productos
- `/tienda/[slug]` - Detalle de producto
- `/blog` - Blog
- `/nosotros` - Sobre nosotros

### Dashboard
- `/dashboard` - Dashboard principal
- `/dashboard/projects` - Proyectos
- `/dashboard/team` - Equipo
- `/dashboard/messages` - Mensajes

### Admin
- `/admin` - Panel de administración
- `/admin/productos` - Gestión de productos
- `/admin/paquetes` - Gestión de paquetes

### Auth
- `/login` - Inicio de sesión
- `/register` - Registro

## 🧪 Testing

```bash
# Ejecutar tests (próximamente)
pnpm test
```

## 📚 Documentación Adicional

- [Plan de Fases](docs/architecture/PLAN_FASES.md) - Roadmap del proyecto
- [Sistema de 3 Ejes](docs/architecture/SISTEMA_3_EJES.md) - Arquitectura conceptual
- [Codebase Memory MCP](docs/architecture/CODEBASE_MEMORY_MCP.md) - Guía de inteligencia de código

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y pertenece a V1TR0.

---

**Desarrollado por el equipo V1TR0** 🚀
