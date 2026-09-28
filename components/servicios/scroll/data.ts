import { servicesData } from "@/components/home/sections/ServicesTabSection"

export type Service = (typeof servicesData)[number]

/**
 * Qué resuelve cada categoría, alineado por id con `servicesData`. Las
 * especialidades se explican con su propia descripción de `servicesData`.
 */
export const CHAPTER_INTRO: Record<string, string> = {
  desarrollo:
    "El software con el que tu negocio vende y atiende en línea: desde una landing que convierte visitas en clientes hasta la app que tus clientes usan a diario. Lo diseñamos, lo programamos y lo ponemos en producción.",
  sistemas:
    "Reunimos la información que hoy está repartida en hojas de cálculo y sistemas sueltos, y la convertimos en tableros y análisis para decidir con datos.",
  automatizacion:
    "Programamos bots, flujos e integraciones que ejecutan las tareas repetitivas y conectan tus herramientas, para que tu equipo recupere horas cada semana.",
}

/** Proyectos publicados, en orden, con la categoría y subcategoría a la que pertenecen. */
export const publishedProjects = servicesData.flatMap((service) =>
  service.subcategories.flatMap((sub) =>
    sub.examples.map((example) => ({
      ...example,
      category: service.title,
      subcategory: sub.name,
    })),
  ),
)

/** Subcategorías que aún no tienen proyecto publicado: se muestran como maqueta. */
export const upcomingSubcategories = servicesData.flatMap((service) =>
  service.subcategories.filter((sub) => sub.examples.length === 0).map((sub) => ({ ...sub, category: service.title })),
)

export const subcategoryCount = servicesData.reduce((sum, service) => sum + service.subcategories.length, 0)

/** "5" → "05": los contadores del recorrido van siempre a dos dígitos. */
export const pad = (n: number) => String(n).padStart(2, "0")
