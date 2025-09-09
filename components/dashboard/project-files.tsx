'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Image, 
  Video, 
  Archive,
  Download,
  Eye,
  Upload,
  Search,
  Filter,
  MoreHorizontal,
  Folder,
  File
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProjectFile {
  id: string;
  name: string;
  type: 'document' | 'image' | 'video' | 'archive' | 'other';
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  category: string;
  url?: string;
}

interface ProjectFilesProps {
  projectId?: string;
}

export function ProjectFiles({}: ProjectFilesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // En un entorno real, estos datos vendrían de una API
  const [files] = useState<ProjectFile[]>([
    {
      id: '1',
      name: 'Especificaciones_Tecnicas.pdf',
      type: 'document',
      size: '2.4 MB',
      uploadedBy: 'Ana García',
      uploadedAt: '2024-01-15',
      category: 'Documentación'
    },
    {
      id: '2',
      name: 'Mockups_UI_Desktop.fig',
      type: 'other',
      size: '15.7 MB',
      uploadedBy: 'Carlos López',
      uploadedAt: '2024-02-01',
      category: 'Diseño'
    },
    {
      id: '3',
      name: 'Logo_Empresa.png',
      type: 'image',
      size: '245 KB',
      uploadedBy: 'Carlos López',
      uploadedAt: '2024-02-05',
      category: 'Recursos'
    },
    {
      id: '4',
      name: 'Demo_Funcionalidad.mp4',
      type: 'video',
      size: '45.2 MB',
      uploadedBy: 'Juan Pérez',
      uploadedAt: '2024-03-10',
      category: 'Demos'
    },
    {
      id: '5',
      name: 'Codigo_Fuente_v1.zip',
      type: 'archive',
      size: '12.8 MB',
      uploadedBy: 'María Rodríguez',
      uploadedAt: '2024-03-15',
      category: 'Código'
    },
    {
      id: '6',
      name: 'Manual_Usuario.pdf',
      type: 'document',
      size: '3.1 MB',
      uploadedBy: 'Elena Sánchez',
      uploadedAt: '2024-04-01',
      category: 'Documentación'
    },
    {
      id: '7',
      name: 'Wireframes_Mobile.sketch',
      type: 'other',
      size: '8.9 MB',
      uploadedBy: 'Carlos López',
      uploadedAt: '2024-02-10',
      category: 'Diseño'
    },
    {
      id: '8',
      name: 'Iconos_Aplicacion.zip',
      type: 'archive',
      size: '1.2 MB',
      uploadedBy: 'Carlos López',
      uploadedAt: '2024-02-20',
      category: 'Recursos'
    }
  ]);

  const categories = ['all', 'Documentación', 'Diseño', 'Recursos', 'Demos', 'Código'];

  const getFileIcon = (type: ProjectFile['type']) => {
    switch (type) {
      case 'document':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'image':
        // eslint-disable-next-line jsx-a11y/alt-text
        return <Image className="h-5 w-5 text-green-500" />;
      case 'video':
        return <Video className="h-5 w-5 text-purple-500" />;
      case 'archive':
        return <Archive className="h-5 w-5 text-orange-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleDownload = () => {
    // TODO: Implementar lógica de descarga de archivos
    // En un entorno real, aquí se manejaría la descarga del archivo
  };

  const handlePreview = () => {
    // TODO: Implementar vista previa de archivos
    // En un entorno real, aquí se abriría una vista previa del archivo
  };

  const handleUpload = () => {
    // TODO: Implementar diálogo de carga de archivos
    // En un entorno real, aquí se abriría un diálogo de carga de archivos
  };

  return (
    <div className="space-y-6">
      {/* Controles superiores */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar archivos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[120px]">
                <Filter className="h-4 w-4 mr-2" />
                {selectedCategory === 'all' ? 'Todas' : selectedCategory}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? 'Todas las categorías' : category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <Button onClick={handleUpload}>
          <Upload className="h-4 w-4 mr-2" />
          Subir Archivo
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white/80 dark:bg-background/10 rounded-2xl">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{files.length}</p>
            <p className="text-sm text-gray-600">Total Archivos</p>
          </div>
        </Card>
        <Card className="p-4 bg-white/80 dark:bg-background/10 rounded-2xl">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {files.filter(f => f.type === 'document').length}
            </p>
            <p className="text-sm text-gray-600">Documentos</p>
          </div>
        </Card>
        <Card className="p-4 bg-white/80 dark:bg-background/10 rounded-2xl">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {files.filter(f => f.type === 'image').length}
            </p>
            <p className="text-sm text-gray-600">Imágenes</p>
          </div>
        </Card>
        <Card className="p-4 bg-white/80 dark:bg-background/10 rounded-2xl">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {files.filter(f => f.type === 'video').length}
            </p>
            <p className="text-sm text-gray-600">Videos</p>
          </div>
        </Card>
      </div>

      {/* Lista de archivos */}
      <Card className="bg-white/80 dark:bg-background/10 rounded-2xl">
        <CardHeader>
          <CardTitle>Archivos del Proyecto ({filteredFiles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredFiles.length === 0 ? (
            <div className="text-center py-8">
              <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No se encontraron archivos</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-background/20">
                  <div className="flex items-center gap-4 flex-1">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{file.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>{file.size}</span>
                        <span>•</span>
                        <span>Subido por {file.uploadedBy}</span>
                        <span>•</span>
                        <span>{formatDate(file.uploadedAt)}</span>
                      </div>
                    </div>
                    <Badge variant="outline">{file.category}</Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handlePreview()}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownload()}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Renombrar</DropdownMenuItem>
                        <DropdownMenuItem>Mover</DropdownMenuItem>
                        <DropdownMenuItem>Compartir</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Eliminar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}