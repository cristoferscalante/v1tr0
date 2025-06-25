"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Eye, FileText, Calendar } from "lucide-react"

export function ClientDocuments() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")

  // Datos de ejemplo para los documentos
  const documents = [
    {
      id: "1",
      name: "Contrato de Servicios",
      type: "Contrato",
      date: "15 Mar 2023",
      status: "signed",
      description: "Contrato principal de servicios para el desarrollo del proyecto.",
      file: "contrato_servicios_v1.pdf",
    },
    {
      id: "2",
      name: "Acuerdo de Confidencialidad",
      type: "NDA",
      date: "15 Mar 2023",
      status: "signed",
      description: "Acuerdo de confidencialidad para proteger la información del proyecto.",
      file: "nda_v1.pdf",
    },
    {
      id: "3",
      name: "Términos y Condiciones",
      type: "Términos",
      date: "15 Mar 2023",
      status: "signed",
      description: "Términos y condiciones generales del servicio.",
      file: "terminos_condiciones_v1.pdf",
    },
    {
      id: "4",
      name: "Adenda al Contrato",
      type: "Adenda",
      date: "10 May 2023",
      status: "pending",
      description: "Adenda al contrato principal para incluir nuevas funcionalidades.",
      file: "adenda_contrato_v1.pdf",
    },
    {
      id: "5",
      name: "Acuerdo de Nivel de Servicio",
      type: "SLA",
      date: "15 Mar 2023",
      status: "signed",
      description: "Acuerdo de nivel de servicio para el mantenimiento del proyecto.",
      file: "sla_v1.pdf",
    },
    {
      id: "6",
      name: "Propuesta Técnica",
      type: "Propuesta",
      date: "10 Mar 2023",
      status: "signed",
      description: "Propuesta técnica detallada del proyecto.",
      file: "propuesta_tecnica_v1.pdf",
    },
    {
      id: "7",
      name: "Wireframes",
      type: "Diseño",
      date: "05 Abr 2023",
      status: "signed",
      description: "Wireframes de la interfaz de usuario.",
      file: "wireframes_v1.pdf",
    },
    {
      id: "8",
      name: "Manual de Usuario",
      type: "Manual",
      date: "Pendiente",
      status: "pending",
      description: "Manual de usuario de la plataforma.",
      file: "manual_usuario_v1.pdf",
    },
  ]

  // Filtrar documentos según el término de búsqueda y el filtro
  const filteredDocuments = documents.filter(
    (document) =>
      (document.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        document.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        document.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filter === "all" ||
        (filter === "signed" && document.status === "signed") ||
        (filter === "pending" && document.status === "pending")),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textMuted" />
          <Input
            type="search"
            placeholder="Buscar documentos..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex rounded-md overflow-hidden">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            className="rounded-r-none"
            onClick={() => setFilter("all")}
          >
            Todos
          </Button>
          <Button
            variant={filter === "signed" ? "default" : "outline"}
            size="sm"
            className="rounded-none border-x-0"
            onClick={() => setFilter("signed")}
          >
            Firmados
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            size="sm"
            className="rounded-l-none"
            onClick={() => setFilter("pending")}
          >
            Pendientes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocuments.map((document) => (
          <div
            key={document.id}
            className="flex flex-col p-4 rounded-lg border border-custom-2/20 bg-custom-1/10 hover:bg-custom-1/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-custom-2/30">
                  <FileText className="h-6 w-6 text-highlight" />
                </div>
                <div>
                  <h4 className="font-medium">{document.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className="bg-custom-2/50 text-textPrimary">{document.type}</Badge>
                    <Badge
                      className={document.status === "signed" ? "bg-green-500 text-white" : "bg-highlight text-white"}
                    >
                      {document.status === "signed" ? "Firmado" : "Pendiente"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-textMuted mb-4">{document.description}</p>

            <div className="mt-auto pt-4 border-t border-custom-2/10">
              <div className="flex justify-between items-center">
                <div className="flex items-center text-xs text-textMuted">
                  <Calendar className="h-3 w-3 mr-2" />
                  <span>Fecha: {document.date}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                  {document.status === "signed" && (
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
