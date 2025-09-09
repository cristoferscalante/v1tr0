import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectHeader } from "@/components/dashboard/project-header"
import { ProjectTimeline } from "@/components/dashboard/project-timeline"
import { ProjectFiles } from "@/components/dashboard/project-files"
import { ProjectTeam } from "@/components/dashboard/project-team"
import { ProjectMeetings } from "@/components/dashboard/project-meetings"
import { ProjectComments } from "@/components/dashboard/project-comments"
import { ProjectPayments } from "@/components/dashboard/project-payments"
import { ProjectLegal } from "@/components/dashboard/project-legal"

interface ProjectPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  // En un caso real, aquí cargaríamos los datos del proyecto desde una API o base de datos
  // Para este ejemplo, usaremos datos de muestra
  const { id: projectId } = await params

  // Simulamos que no se encuentra el proyecto si el ID no es válido
  if (projectId === "invalid") {
    notFound()
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <ProjectHeader projectId={projectId} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 w-full">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="timeline">Línea de Tiempo</TabsTrigger>
          <TabsTrigger value="files">Archivos</TabsTrigger>
          <TabsTrigger value="team">Equipo</TabsTrigger>
          <TabsTrigger value="meetings">Reuniones</TabsTrigger>
          <TabsTrigger value="comments">Comentarios</TabsTrigger>
          <TabsTrigger value="payments">Pagos</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2 bg-white/80 dark:bg-background/10 rounded-2xl">
          <CardHeader>
            <CardTitle>Descripción del Proyecto</CardTitle>
            <CardDescription>Detalles y objetivos</CardDescription>
          </CardHeader>
              <CardContent>
                <p className="text-textMuted">
                  Desarrollo de una plataforma web completa para V1TR0 con dashboard interactivo, gestión de proyectos
                  y sistema de autenticación avanzado. La plataforma incluye módulos de gestión de usuarios,
                  proyectos, tareas y análisis en tiempo real.
                </p>

                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Objetivos:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-textMuted">
                    <li>Desarrollar un dashboard interactivo y responsive</li>
                    <li>Implementar sistema de autenticación y autorización robusto</li>
                    <li>Crear módulos de gestión de proyectos y tareas</li>
                    <li>Integrar análisis y reportes en tiempo real</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-background/10 rounded-2xl">
          <CardHeader>
            <CardTitle>Información del Proyecto</CardTitle>
          </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-textMuted">Cliente</h4>
                    <p className="font-medium">V1TR0 Technologies</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-textMuted">Fecha de Inicio</h4>
                    <p className="font-medium">1 de Diciembre, 2024</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-textMuted">Fecha de Entrega</h4>
                    <p className="font-medium">15 de Marzo, 2025</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-textMuted">Estado</h4>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <p className="font-medium">En Progreso</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-textMuted">Presupuesto</h4>
                    <p className="font-medium">$75,000 USD</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/80 dark:bg-background/10 rounded-2xl">
          <CardHeader>
            <CardTitle>Progreso del Proyecto</CardTitle>
            <CardDescription>Fases completadas y pendientes</CardDescription>
          </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="font-medium">Análisis y Planificación</span>
                    </div>
                    <span className="text-sm text-textMuted">100%</span>
                  </div>
                  <div className="w-full h-2 bg-custom-1/30 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: "100%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="font-medium">Diseño de UI/UX</span>
                    </div>
                    <span className="text-sm text-textMuted">100%</span>
                  </div>
                  <div className="w-full h-2 bg-custom-1/30 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: "100%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-highlight mr-2"></div>
                      <span className="font-medium">Desarrollo Frontend</span>
                    </div>
                    <span className="text-sm text-textMuted">75%</span>
                  </div>
                  <div className="w-full h-2 bg-custom-1/30 rounded-full overflow-hidden">
                    <div className="h-full bg-highlight rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-highlight mr-2"></div>
                      <span className="font-medium">Desarrollo Backend</span>
                    </div>
                    <span className="text-sm text-textMuted">60%</span>
                  </div>
                  <div className="w-full h-2 bg-custom-1/30 rounded-full overflow-hidden">
                    <div className="h-full bg-highlight rounded-full" style={{ width: "60%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-custom-2 mr-2"></div>
                      <span className="font-medium">Pruebas</span>
                    </div>
                    <span className="text-sm text-textMuted">20%</span>
                  </div>
                  <div className="w-full h-2 bg-custom-1/30 rounded-full overflow-hidden">
                    <div className="h-full bg-custom-2 rounded-full" style={{ width: "20%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                      <span className="font-medium">Implementación</span>
                    </div>
                    <span className="text-sm text-textMuted">0%</span>
                  </div>
                  <div className="w-full h-2 bg-custom-1/30 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-400 rounded-full" style={{ width: "0%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card className="bg-white/80 dark:bg-background/10 rounded-2xl">
          <CardHeader>
            <CardTitle>Línea de Tiempo del Proyecto</CardTitle>
            <CardDescription>Fases, hitos y progreso</CardDescription>
          </CardHeader>
            <CardContent>
              <ProjectTimeline projectId={projectId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          <Card className="bg-white/80 dark:bg-background/10 rounded-2xl">
          <CardHeader>
            <CardTitle>Archivos del Proyecto</CardTitle>
            <CardDescription>Documentos, diseños y entregables</CardDescription>
          </CardHeader>
            <CardContent>
              <ProjectFiles projectId={projectId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card className="bg-white/80 dark:bg-background/10 rounded-2xl">
          <CardHeader>
            <CardTitle>Equipo del Proyecto</CardTitle>
            <CardDescription>Miembros y roles</CardDescription>
          </CardHeader>
            <CardContent>
              <ProjectTeam projectId={projectId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meetings" className="space-y-4">
          <Card className="bg-white/80 dark:bg-background/10 rounded-2xl">
          <CardHeader>
            <CardTitle>Reuniones</CardTitle>
            <CardDescription>Historial y próximas reuniones</CardDescription>
          </CardHeader>
            <CardContent>
              <ProjectMeetings projectId={projectId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <Card className="bg-white/80 dark:bg-background/10 rounded-2xl">
          <CardHeader>
            <CardTitle>Comentarios y Notas</CardTitle>
            <CardDescription>Comunicación del proyecto</CardDescription>
          </CardHeader>
            <CardContent>
              <ProjectComments projectId={projectId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card className="bg-white/80 dark:bg-background/10 rounded-2xl">
          <CardHeader>
            <CardTitle>Pagos</CardTitle>
            <CardDescription>Historial de pagos y facturas</CardDescription>
          </CardHeader>
            <CardContent>
              <ProjectPayments projectId={projectId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal" className="space-y-4">
          <Card className="bg-white/80 dark:bg-background/10 rounded-2xl">
          <CardHeader>
            <CardTitle>Documentación Legal</CardTitle>
            <CardDescription>Contratos y documentos legales</CardDescription>
          </CardHeader>
            <CardContent>
              <ProjectLegal projectId={projectId} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
