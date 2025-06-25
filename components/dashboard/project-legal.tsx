"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Download, Eye, MoreHorizontal, FileText, Calendar, CheckCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ProjectLegalProps {
  projectId?: string
}

export function ProjectLegal({ projectId }: ProjectLegalProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Datos de ejemplo para los documentos legales
  const documents = [
    {
      id: "1",
      name: "Contrato de Servicios",
      type: "Contrato",
      date: "15 Mar 2023",
      status: "signed",
      parties: ["V1TR0 Technologies", "Comercio Electrónico S.A."],
      description: "Contrato principal de servicios para el desarrollo del proyecto.",
      file: "contrato_servicios_v1.pdf",
    },
    {
      id: "2",
      name: "Acuerdo de Confidencialidad",
      type: "NDA",
      date: "15 Mar 2023",
      status: "signed",
      parties: ["V1TR0 Technologies", "Comercio Electrónico S.A."],
      description: "Acuerdo de confidencialidad para proteger la información del proyecto.",
      file: "nda_v1.pdf",
    },
    {
      id: "3",
      name: "Términos y Condiciones",
      type: "Términos",
      date: "15 Mar 2023",
      status: "signed",
      parties: ["V1TR0 Technologies", "Comercio Electrónico S.A."],
      description: "Términos y condiciones generales del servicio.",
      file: "terminos_condiciones_v1.pdf",
    },
    {
      id: "4",
      name: "Adenda al Contrato",
      type: "Adenda",
      date: "10 May 2023",
      status: "pending",
      parties: ["V1TR0 Technologies", "Comercio Electrónico S.A."],
      description: "Adenda al contrato principal para incluir nuevas funcionalidades.",
      file: "adenda_contrato_v1.pdf",
    },
    {
      id: "5",
      name: "Acuerdo de Nivel de Servicio",
      type: "SLA",
      date: "15 Mar 2023",
      status: "signed",
      parties: ["V1TR0 Technologies", "Comercio Electrónico S.A."],
      description: "Acuerdo de nivel de servicio para el mantenimiento del proyecto.",
      file: "sla_v1.pdf",
    },
    {
      id: "6",
      name: "Cesión de Derechos",
      type: "Cesión",
      date: "15 Mar 2023",
      status: "signed",
      parties: ["V1TR0 Technologies", "Comercio Electrónico S.A."],
      description: "Documento de cesión de derechos de propiedad intelectual.",
      file: "cesion_derechos_v1.pdf",
    },
  ]

  // Filtrar documentos según el término de búsqueda
  const filteredDocuments = documents.filter(
    (document) =>
      document.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.description.toLowerCase().includes(searchTerm.toLowerCase()),
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
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Documento
        </Button>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="h-4 w-4 mr-2" />
                    <span>Ver Documento</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    <span>Descargar</span>
                  </DropdownMenuItem>
                  {document.status === "pending" && (
                    <DropdownMenuItem>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>Marcar como Firmado</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <p className="text-sm text-textMuted mb-4">{document.description}</p>

            <div className="mt-auto pt-4 border-t border-custom-2/10">
              <div className="flex flex-col space-y-2 text-xs text-textMuted">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-2" />
                  <span>Fecha: {document.date}</span>
                </div>
                <div>
                  <span>Partes: {document.parties.join(", ")}</span>
                </div>
                <div>
                  <span>Archivo: {document.file}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
