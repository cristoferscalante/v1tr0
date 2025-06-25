"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, FileText, ImageIcon, FileArchive, Download, Eye, MoreHorizontal, Upload, Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ProjectFilesProps {
  projectId?: string
}

export function ProjectFiles({ projectId }: ProjectFilesProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Datos de ejemplo para los archivos
  const files = [
    {
      id: "1",
      name: "Propuesta_Proyecto.pdf",
      type: "pdf",
      size: "2.4 MB",
      uploadedBy: "María González",
      uploadedDate: "15 Mar 2023",
      category: "Documentación",
      icon: <FileText className="h-10 w-10 text-red-500" />,
    },
    {
      id: "2",
      name: "Wireframes_UI.png",
      type: "image",
      size: "4.8 MB",
      uploadedBy: "Ana López",
      uploadedDate: "12 Abr 2023",
      category: "Diseño",
      icon: <ImageIcon className="h-10 w-10 text-blue-500" />,
    },
    {
      id: "3",
      name: "Diagrama_BD.pdf",
      type: "pdf",
      size: "1.2 MB",
      uploadedBy: "Pedro Sánchez",
      uploadedDate: "28 Abr 2023",
      category: "Desarrollo",
      icon: <FileText className="h-10 w-10 text-red-500" />,
    },
    {
      id: "4",
      name: "Mockups_App.zip",
      type: "archive",
      size: "15.7 MB",
      uploadedBy: "Ana López",
      uploadedDate: "05 May 2023",
      category: "Diseño",
      icon: <FileArchive className="h-10 w-10 text-yellow-500" />,
    },
    {
      id: "5",
      name: "Acta_Reunion_Inicial.pdf",
      type: "pdf",
      size: "0.8 MB",
      uploadedBy: "María González",
      uploadedDate: "15 Mar 2023",
      category: "Documentación",
      icon: <FileText className="h-10 w-10 text-red-500" />,
    },
    {
      id: "6",
      name: "Cronograma_Proyecto.pdf",
      type: "pdf",
      size: "1.5 MB",
      uploadedBy: "María González",
      uploadedDate: "20 Mar 2023",
      category: "Planificación",
      icon: <FileText className="h-10 w-10 text-red-500" />,
    },
    {
      id: "7",
      name: "Logos_Cliente.zip",
      type: "archive",
      size: "8.2 MB",
      uploadedBy: "Ana López",
      uploadedDate: "15 Abr 2023",
      category: "Diseño",
      icon: <FileArchive className="h-10 w-10 text-yellow-500" />,
    },
    {
      id: "8",
      name: "Manual_Usuario_v1.pdf",
      type: "pdf",
      size: "3.6 MB",
      uploadedBy: "Laura Martínez",
      uploadedDate: "10 Jun 2023",
      category: "Documentación",
      icon: <FileText className="h-10 w-10 text-red-500" />,
    },
  ]

  // Filtrar archivos según el término de búsqueda
  const filteredFiles = files.filter(
    (file) =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textMuted" />
          <Input
            type="search"
            placeholder="Buscar archivos..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Subir Archivo
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Archivo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file) => (
          <div
            key={file.id}
            className="flex flex-col p-4 rounded-lg border border-custom-2/20 bg-custom-1/10 hover:bg-custom-1/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {file.icon}
                <div>
                  <h4 className="font-medium">{file.name}</h4>
                  <p className="text-sm text-textMuted">{file.size}</p>
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
                    <span>Ver</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    <span>Descargar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-auto pt-4 border-t border-custom-2/10">
              <div className="flex justify-between text-xs text-textMuted">
                <span>Categoría: {file.category}</span>
                <span>{file.uploadedDate}</span>
              </div>
              <div className="text-xs text-textMuted mt-1">
                <span>Subido por: {file.uploadedBy}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
