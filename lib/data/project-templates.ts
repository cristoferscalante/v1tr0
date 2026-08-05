import type { ServiceType } from "@/components/shared/service-type"
import type { ProjectTrack } from "@/lib/db/schema"

export interface TemplateTask {
  name: string
  icon: string
}

export interface TemplatePhase {
  name: string
  track: ProjectTrack
  order: number
  tasks: TemplateTask[]
}

// Fases+tareas sembradas al crear un proyecto, según su serviceType. El
// admin puede editar/borrar/agregar después — esto solo es el punto de
// partida (ver lib/db/seed-project-template.ts). Cada rama llega hasta una
// tarea final real (lanzamiento/entrega/publicación), no se corta a medias.
export const PROJECT_TEMPLATES: Record<ServiceType, TemplatePhase[]> = {
  landing_page: [
    {
      name: "Planeación", track: "planning", order: 0,
      tasks: [
        { name: "Reunión de kickoff", icon: "kickoff" },
        { name: "Investigación de referentes", icon: "research" },
        { name: "Copywriting", icon: "requirements" },
        { name: "Wireframe", icon: "wireframe" },
      ],
    },
    {
      name: "Desarrollo", track: "development", order: 1,
      tasks: [
        { name: "Diseño de sección hero", icon: "ui-design" },
        { name: "Maquetación responsive", icon: "mobile" },
        { name: "Formulario de contacto", icon: "forms" },
        { name: "Integración de imágenes", icon: "images" },
        { name: "Optimización SEO", icon: "seo" },
        { name: "Optimización de rendimiento", icon: "performance" },
      ],
    },
    {
      name: "Calidad y entrega", track: "quality", order: 2,
      tasks: [
        { name: "Pruebas cross-browser", icon: "testing" },
        { name: "Revisión del cliente", icon: "review" },
        { name: "Conexión de analítica", icon: "analytics" },
        { name: "Publicación", icon: "launch" },
      ],
    },
    {
      name: "Mantenimiento", track: "maintenance", order: 3,
      tasks: [
        { name: "Soporte post-lanzamiento", icon: "support" },
        { name: "Actualizaciones y parches", icon: "maintenance" },
        { name: "Monitoreo y respaldo", icon: "monitoring" },
      ],
    },
  ],
  ecommerce: [
    {
      name: "Planeación", track: "planning", order: 0,
      tasks: [
        { name: "Reunión de kickoff", icon: "kickoff" },
        { name: "Definir catálogo", icon: "requirements" },
        { name: "Moodboard de marca", icon: "moodboard" },
        { name: "Wireframe de tienda", icon: "wireframe" },
      ],
    },
    {
      name: "Desarrollo", track: "development", order: 1,
      tasks: [
        { name: "Catálogo de productos", icon: "catalog" },
        { name: "Carrito de compras", icon: "cart" },
        { name: "Pasarela de pago", icon: "payments" },
        { name: "Gestión de inventario", icon: "inventory" },
        { name: "Envíos", icon: "shipping" },
        { name: "Notificaciones de pedido", icon: "notifications" },
        { name: "Cuentas de usuario", icon: "auth" },
      ],
    },
    {
      name: "Calidad y entrega", track: "quality", order: 2,
      tasks: [
        { name: "Pruebas de checkout", icon: "testing" },
        { name: "Auditoría de seguridad", icon: "security" },
        { name: "Revisión del cliente", icon: "review" },
        { name: "Lanzamiento", icon: "launch" },
      ],
    },
    {
      name: "Mantenimiento", track: "maintenance", order: 3,
      tasks: [
        { name: "Soporte post-lanzamiento", icon: "support" },
        { name: "Actualizaciones y parches", icon: "maintenance" },
        { name: "Monitoreo y respaldo", icon: "monitoring" },
      ],
    },
  ],
  web_app: [
    {
      name: "Planeación", track: "planning", order: 0,
      tasks: [
        { name: "Reunión de kickoff", icon: "kickoff" },
        { name: "Definir requisitos", icon: "requirements" },
        { name: "Arquitectura del sistema", icon: "wireframe" },
      ],
    },
    {
      name: "Desarrollo", track: "development", order: 1,
      tasks: [
        { name: "Autenticación", icon: "auth" },
        { name: "Base de datos", icon: "database" },
        { name: "Panel principal", icon: "frontend" },
        { name: "Integración API", icon: "api" },
        { name: "Notificaciones", icon: "notifications" },
        { name: "Panel de administración", icon: "backend" },
      ],
    },
    {
      name: "Calidad y entrega", track: "quality", order: 2,
      tasks: [
        { name: "Pruebas", icon: "testing" },
        { name: "Auditoría de seguridad", icon: "security" },
        { name: "Documentación", icon: "documentation" },
        { name: "Despliegue", icon: "deployment" },
      ],
    },
    {
      name: "Mantenimiento", track: "maintenance", order: 3,
      tasks: [
        { name: "Soporte post-lanzamiento", icon: "support" },
        { name: "Actualizaciones y parches", icon: "maintenance" },
        { name: "Monitoreo y respaldo", icon: "monitoring" },
      ],
    },
  ],
  mobile_app: [
    {
      name: "Planeación", track: "planning", order: 0,
      tasks: [
        { name: "Reunión de kickoff", icon: "kickoff" },
        { name: "Wireframes", icon: "wireframe" },
        { name: "Definir requisitos", icon: "requirements" },
      ],
    },
    {
      name: "Desarrollo", track: "development", order: 1,
      tasks: [
        { name: "Diseño UI móvil", icon: "mobile" },
        { name: "Autenticación", icon: "auth" },
        { name: "Notificaciones push", icon: "notifications" },
        { name: "Integración API", icon: "api" },
        { name: "Modo offline", icon: "database" },
      ],
    },
    {
      name: "Calidad y entrega", track: "quality", order: 2,
      tasks: [
        { name: "Pruebas en dispositivos", icon: "testing" },
        { name: "Corrección de errores", icon: "bugfix" },
        { name: "Publicación en tiendas", icon: "launch" },
      ],
    },
    {
      name: "Mantenimiento", track: "maintenance", order: 3,
      tasks: [
        { name: "Soporte post-lanzamiento", icon: "support" },
        { name: "Actualizaciones y parches", icon: "maintenance" },
        { name: "Monitoreo y respaldo", icon: "monitoring" },
      ],
    },
  ],
  branding: [
    {
      name: "Planeación", track: "planning", order: 0,
      tasks: [
        { name: "Reunión de kickoff", icon: "kickoff" },
        { name: "Investigación de mercado", icon: "research" },
        { name: "Moodboard", icon: "moodboard" },
      ],
    },
    {
      name: "Desarrollo", track: "development", order: 1,
      tasks: [
        { name: "Diseño de logo", icon: "branding" },
        { name: "Paleta de color", icon: "moodboard" },
        { name: "Tipografía", icon: "documentation" },
        { name: "Aplicaciones de marca", icon: "images" },
        { name: "Manual de marca", icon: "documentation" },
      ],
    },
    {
      name: "Calidad y entrega", track: "quality", order: 2,
      tasks: [
        { name: "Revisión final", icon: "review" },
        { name: "Retroalimentación del cliente", icon: "feedback" },
        { name: "Entrega de archivos", icon: "launch" },
      ],
    },
    {
      name: "Mantenimiento", track: "maintenance", order: 3,
      tasks: [
        { name: "Soporte post-entrega", icon: "support" },
        { name: "Actualizaciones de marca", icon: "maintenance" },
      ],
    },
  ],
  maintenance: [
    {
      name: "Planeación", track: "planning", order: 0,
      tasks: [
        { name: "Diagnóstico inicial", icon: "research" },
        { name: "Plan de mantenimiento", icon: "requirements" },
      ],
    },
    {
      name: "Desarrollo", track: "development", order: 1,
      tasks: [
        { name: "Actualizaciones", icon: "automation" },
        { name: "Corrección de errores", icon: "bugfix" },
        { name: "Respaldo de datos", icon: "backup" },
        { name: "Optimización de rendimiento", icon: "performance" },
      ],
    },
    {
      name: "Calidad y entrega", track: "quality", order: 2,
      tasks: [
        { name: "Monitoreo continuo", icon: "monitoring" },
        { name: "Informe de mantenimiento", icon: "documentation" },
      ],
    },
  ],
  other: [
    {
      name: "Planeación", track: "planning", order: 0,
      tasks: [
        { name: "Reunión de kickoff", icon: "kickoff" },
        { name: "Definir alcance", icon: "requirements" },
      ],
    },
    {
      name: "Desarrollo", track: "development", order: 1,
      tasks: [
        { name: "Desarrollo", icon: "workflow" },
        { name: "Revisión intermedia", icon: "review" },
      ],
    },
    {
      name: "Calidad y entrega", track: "quality", order: 2,
      tasks: [
        { name: "Pruebas", icon: "testing" },
        { name: "Entrega", icon: "launch" },
      ],
    },
    {
      name: "Mantenimiento", track: "maintenance", order: 3,
      tasks: [
        { name: "Soporte post-entrega", icon: "support" },
        { name: "Actualizaciones", icon: "maintenance" },
      ],
    },
  ],
}
