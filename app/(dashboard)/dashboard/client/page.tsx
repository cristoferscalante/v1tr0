import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClientProjectList } from "@/components/dashboard/client-project-list"
import { ClientProjectTimeline } from "@/components/dashboard/client-project-timeline"
import { ClientMeetings } from "@/components/dashboard/client-meetings"
import { ClientPayments } from "@/components/dashboard/client-payments"
import { ClientDocuments } from "@/components/dashboard/client-documents"

export default function ClientDashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Portal de Cliente</h2>
      </div>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">Mis Proyectos</TabsTrigger>
          <TabsTrigger value="timeline">Línea de Tiempo</TabsTrigger>
          <TabsTrigger value="meetings">Reuniones</TabsTrigger>
          <TabsTrigger value="payments">Pagos</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mis Proyectos</CardTitle>
              <CardDescription>Proyectos activos y completados</CardDescription>
            </CardHeader>
            <CardContent>
              <ClientProjectList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Línea de Tiempo de Proyectos</CardTitle>
              <CardDescription>Seguimiento de fases y progreso de tus proyectos</CardDescription>
            </CardHeader>
            <CardContent>
              <ClientProjectTimeline />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meetings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reuniones</CardTitle>
              <CardDescription>Historial y próximas reuniones</CardDescription>
            </CardHeader>
            <CardContent>
              <ClientMeetings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pagos</CardTitle>
              <CardDescription>Historial de pagos y facturas pendientes</CardDescription>
            </CardHeader>
            <CardContent>
              <ClientPayments />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentos</CardTitle>
              <CardDescription>Contratos, entregables y documentación</CardDescription>
            </CardHeader>
            <CardContent>
              <ClientDocuments />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
