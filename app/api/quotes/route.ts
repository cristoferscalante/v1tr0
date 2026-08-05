import { auth } from "@/auth"
import { db } from "@/lib/db"
import { quotes, projects } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { SERVICE_TYPE_META, type ServiceType } from "@/components/shared/service-type"
import { seedProjectTemplate } from "@/lib/db/seed-project-template"

// El árbol de "tipo de proyecto" del formulario (ver ProjectTypeTree) manda
// texto libre en español que no coincide 1:1 con las 7 claves de
// serviceType — este mapa traduce las etiquetas más comunes; lo que no
// aparezca aquí cae en "other".
const PROJECT_TYPE_TO_SERVICE_TYPE: Record<string, ServiceType> = {
  "E-Commerce": "ecommerce",
  "Landing Pages": "landing_page",
  "Web Apps": "web_app",
  "Apps Móviles": "mobile_app",
  "Software": "web_app",
}

function inferServiceType(projectType: string): ServiceType {
  return PROJECT_TYPE_TO_SERVICE_TYPE[projectType] ?? "other"
}

// Cotizaciones del cliente autenticado (su propio historial).
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const rows = await db
    .select()
    .from(quotes)
    .where(eq(quotes.profileId, session.user.id))
    .orderBy(desc(quotes.createdAt))

  return NextResponse.json(rows)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const body = await req.json()
  const { projectType, description, budget, timeline, techReqs, projectName, projectIcon } = body

  if (!projectType || !description) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
  }

  // Toda cotización nace ya como proyecto en el pipeline (etapa "planning" =
  // tarjeta roja en /client-dashboard/projects y en el Kanban de admin),
  // para que el cliente la vea de inmediato entre sus proyectos.
  const iconOverride = projectIcon && projectIcon in SERVICE_TYPE_META ? projectIcon : null

  const serviceType = inferServiceType(projectType)

  const project = await db
    .insert(projects)
    .values({
      name: (projectName || "").trim() || projectType,
      description,
      status: "planning",
      serviceType,
      icon: iconOverride,
      clientId: session.user.id,
    })
    .returning()
    .then((r) => r[0]!)

  // Punto de partida del árbol de 3 caminos: fases+tareas típicas de este
  // tipo de servicio, editables por el admin desde /admin/proyectos/[id].
  await seedProjectTemplate(project.id, serviceType)

  await db.insert(quotes).values({
    profileId: session.user.id,
    projectType,
    description,
    budget: budget || null,
    timeline: timeline || null,
    techReqs: techReqs || null,
    projectId: project.id,
  })

  return NextResponse.json({ success: true, projectId: project.id })
}
