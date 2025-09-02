'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Plus,
  Filter,
  Search,
  Calendar,
  Edit,
  Upload,
  ExternalLink,
  AlertCircle,
  Info
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LegalDocument {
  id: string;
  name: string;
  type: 'contract' | 'nda' | 'license' | 'policy' | 'agreement' | 'compliance' | 'other';
  status: 'draft' | 'review' | 'approved' | 'signed' | 'expired' | 'rejected';
  version: string;
  createdDate: string;
  lastModified: string;
  expiryDate?: string;
  signedDate?: string;
  parties: {
    name: string;
    role: string;
    email: string;
    signed: boolean;
    signedDate?: string;
  }[];
  description: string;
  fileUrl?: string;
  fileSize?: number;
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: {
    name: string;
    email: string;
  };
  notes?: string;
}

interface ComplianceItem {
  id: string;
  requirement: string;
  category: 'gdpr' | 'security' | 'accessibility' | 'performance' | 'legal' | 'other';
  status: 'compliant' | 'non_compliant' | 'in_progress' | 'not_applicable';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence?: string;
  lastChecked: string;
  nextReview: string;
  assignedTo?: {
    name: string;
    email: string;
  };
  actions: {
    description: string;
    completed: boolean;
    dueDate: string;
  }[];
}

interface ProjectLegalProps {
  projectId?: string;
}

export function ProjectLegal({}: ProjectLegalProps) {
  const [documents] = useState<LegalDocument[]>([
    {
      id: '1',
      name: 'Contrato de Desarrollo de Software',
      type: 'contract',
      status: 'signed',
      version: '2.1',
      createdDate: '2024-01-15',
      lastModified: '2024-02-01',
      signedDate: '2024-02-05',
      parties: [
        {
          name: 'V1tr0 Solutions',
          role: 'Proveedor',
          email: 'legal@v1tr0.com',
          signed: true,
          signedDate: '2024-02-05'
        },
        {
          name: 'TechCorp Solutions',
          role: 'Cliente',
          email: 'legal@techcorp.com',
          signed: true,
          signedDate: '2024-02-05'
        }
      ],
      description: 'Contrato principal para el desarrollo de la plataforma web',
      fileSize: 2048576,
      tags: ['contrato', 'desarrollo', 'principal'],
      priority: 'high'
    },
    {
      id: '2',
      name: 'Acuerdo de Confidencialidad (NDA)',
      type: 'nda',
      status: 'signed',
      version: '1.0',
      createdDate: '2024-01-10',
      lastModified: '2024-01-10',
      signedDate: '2024-01-12',
      parties: [
        {
          name: 'V1tr0 Solutions',
          role: 'Receptor',
          email: 'legal@v1tr0.com',
          signed: true,
          signedDate: '2024-01-12'
        },
        {
          name: 'TechCorp Solutions',
          role: 'Divulgador',
          email: 'legal@techcorp.com',
          signed: true,
          signedDate: '2024-01-12'
        }
      ],
      description: 'Acuerdo de confidencialidad para proteger información sensible',
      fileSize: 512000,
      tags: ['nda', 'confidencialidad'],
      priority: 'high'
    },
    {
      id: '3',
      name: 'Licencia de Software de Terceros',
      type: 'license',
      status: 'approved',
      version: '1.0',
      createdDate: '2024-02-15',
      lastModified: '2024-02-20',
      expiryDate: '2025-02-15',
      parties: [
        {
          name: 'V1tr0 Solutions',
          role: 'Licenciatario',
          email: 'legal@v1tr0.com',
          signed: false
        }
      ],
      description: 'Licencias para bibliotecas y frameworks utilizados',
      fileSize: 256000,
      tags: ['licencia', 'terceros', 'software'],
      priority: 'medium',
      assignedTo: {
        name: 'Ana García',
        email: 'ana.garcia@v1tr0.com'
      }
    },
    {
      id: '4',
      name: 'Política de Privacidad',
      type: 'policy',
      status: 'review',
      version: '1.2',
      createdDate: '2024-03-01',
      lastModified: '2024-03-15',
      parties: [
        {
          name: 'V1tr0 Solutions',
          role: 'Responsable',
          email: 'legal@v1tr0.com',
          signed: false
        }
      ],
      description: 'Política de privacidad para cumplimiento GDPR',
      fileSize: 128000,
      tags: ['política', 'privacidad', 'gdpr'],
      priority: 'high',
      assignedTo: {
        name: 'Carlos López',
        email: 'carlos.lopez@v1tr0.com'
      },
      notes: 'Pendiente revisión legal externa'
    },
    {
      id: '5',
      name: 'Acuerdo de Nivel de Servicio (SLA)',
      type: 'agreement',
      status: 'draft',
      version: '1.0',
      createdDate: '2024-03-20',
      lastModified: '2024-03-25',
      parties: [
        {
          name: 'V1tr0 Solutions',
          role: 'Proveedor',
          email: 'legal@v1tr0.com',
          signed: false
        },
        {
          name: 'TechCorp Solutions',
          role: 'Cliente',
          email: 'legal@techcorp.com',
          signed: false
        }
      ],
      description: 'Definición de niveles de servicio y disponibilidad',
      fileSize: 384000,
      tags: ['sla', 'servicio', 'disponibilidad'],
      priority: 'medium',
      assignedTo: {
        name: 'María Rodríguez',
        email: 'maria.rodriguez@v1tr0.com'
      }
    }
  ]);

  const [compliance] = useState<ComplianceItem[]>([
    {
      id: '1',
      requirement: 'Cumplimiento GDPR - Consentimiento de Usuarios',
      category: 'gdpr',
      status: 'compliant',
      priority: 'critical',
      description: 'Implementar mecanismos de consentimiento explícito para el procesamiento de datos personales',
      evidence: 'Formularios de consentimiento implementados y auditados',
      lastChecked: '2024-03-15',
      nextReview: '2024-06-15',
      assignedTo: {
        name: 'Ana García',
        email: 'ana.garcia@v1tr0.com'
      },
      actions: [
        {
          description: 'Implementar banner de cookies',
          completed: true,
          dueDate: '2024-02-15'
        },
        {
          description: 'Crear formularios de consentimiento',
          completed: true,
          dueDate: '2024-02-28'
        }
      ]
    },
    {
      id: '2',
      requirement: 'Seguridad - Cifrado de Datos en Tránsito',
      category: 'security',
      status: 'compliant',
      priority: 'high',
      description: 'Todos los datos deben transmitirse usando HTTPS/TLS',
      evidence: 'Certificados SSL configurados y renovación automática activa',
      lastChecked: '2024-03-20',
      nextReview: '2024-04-20',
      assignedTo: {
        name: 'Carlos López',
        email: 'carlos.lopez@v1tr0.com'
      },
      actions: [
        {
          description: 'Configurar certificados SSL',
          completed: true,
          dueDate: '2024-01-30'
        },
        {
          description: 'Implementar redirección HTTPS',
          completed: true,
          dueDate: '2024-02-05'
        }
      ]
    },
    {
      id: '3',
      requirement: 'Accesibilidad - WCAG 2.1 AA',
      category: 'accessibility',
      status: 'in_progress',
      priority: 'high',
      description: 'La aplicación debe cumplir con las pautas WCAG 2.1 nivel AA',
      evidence: 'Auditoría parcial completada, correcciones en progreso',
      lastChecked: '2024-03-10',
      nextReview: '2024-04-10',
      assignedTo: {
        name: 'María Rodríguez',
        email: 'maria.rodriguez@v1tr0.com'
      },
      actions: [
        {
          description: 'Auditoría de accesibilidad inicial',
          completed: true,
          dueDate: '2024-03-01'
        },
        {
          description: 'Implementar etiquetas ARIA',
          completed: false,
          dueDate: '2024-04-15'
        },
        {
          description: 'Mejorar contraste de colores',
          completed: false,
          dueDate: '2024-04-20'
        }
      ]
    },
    {
      id: '4',
      requirement: 'Rendimiento - Tiempo de Carga < 3s',
      category: 'performance',
      status: 'non_compliant',
      priority: 'medium',
      description: 'Las páginas principales deben cargar en menos de 3 segundos',
      evidence: 'Métricas actuales muestran 4.2s promedio',
      lastChecked: '2024-03-25',
      nextReview: '2024-04-25',
      assignedTo: {
        name: 'David Martín',
        email: 'david.martin@v1tr0.com'
      },
      actions: [
        {
          description: 'Optimizar imágenes',
          completed: false,
          dueDate: '2024-04-10'
        },
        {
          description: 'Implementar lazy loading',
          completed: false,
          dueDate: '2024-04-15'
        },
        {
          description: 'Configurar CDN',
          completed: false,
          dueDate: '2024-04-20'
        }
      ]
    },
    {
      id: '5',
      requirement: 'Legal - Términos y Condiciones',
      category: 'legal',
      status: 'in_progress',
      priority: 'high',
      description: 'Términos y condiciones actualizados y accesibles',
      evidence: 'Borrador en revisión legal',
      lastChecked: '2024-03-18',
      nextReview: '2024-04-18',
      assignedTo: {
        name: 'Ana García',
        email: 'ana.garcia@v1tr0.com'
      },
      actions: [
        {
          description: 'Redactar términos y condiciones',
          completed: true,
          dueDate: '2024-03-15'
        },
        {
          description: 'Revisión legal externa',
          completed: false,
          dueDate: '2024-04-05'
        },
        {
          description: 'Implementar en la aplicación',
          completed: false,
          dueDate: '2024-04-12'
        }
      ]
    }
  ]);

  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('documents');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed':
      case 'approved':
      case 'compliant':
        return 'bg-green-100 text-green-800';
      case 'review':
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
      case 'rejected':
      case 'non_compliant':
        return 'bg-red-100 text-red-800';
      case 'not_applicable':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Borrador';
      case 'review': return 'En Revisión';
      case 'approved': return 'Aprobado';
      case 'signed': return 'Firmado';
      case 'expired': return 'Vencido';
      case 'rejected': return 'Rechazado';
      case 'compliant': return 'Cumple';
      case 'non_compliant': return 'No Cumple';
      case 'in_progress': return 'En Progreso';
      case 'not_applicable': return 'No Aplica';
      default: return 'Desconocido';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed':
      case 'approved':
      case 'compliant':
        return <CheckCircle className="h-4 w-4" />;
      case 'review':
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'draft':
        return <FileText className="h-4 w-4" />;
      case 'expired':
      case 'rejected':
      case 'non_compliant':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'critical': return 'Crítica';
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'Normal';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'contract': return 'Contrato';
      case 'nda': return 'NDA';
      case 'license': return 'Licencia';
      case 'policy': return 'Política';
      case 'agreement': return 'Acuerdo';
      case 'compliance': return 'Cumplimiento';
      case 'gdpr': return 'GDPR';
      case 'security': return 'Seguridad';
      case 'accessibility': return 'Accesibilidad';
      case 'performance': return 'Rendimiento';
      case 'legal': return 'Legal';
      case 'other': return 'Otro';
      default: return 'Desconocido';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) {
      return '0 Bytes';
    }
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) {
      return false;
    }
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) {
      return false;
    }
    return new Date(expiryDate) < new Date();
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesType && matchesStatus && matchesSearch;
  });

  const filteredCompliance = compliance.filter(item => {
    const matchesCategory = filterType === 'all' || item.category === filterType;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      item.requirement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesStatus && matchesSearch;
  });

  // Estadísticas
  const documentStats = {
    total: documents.length,
    signed: documents.filter(d => d.status === 'signed').length,
    pending: documents.filter(d => d.status === 'review' || d.status === 'draft').length,
    expiring: documents.filter(d => isExpiringSoon(d.expiryDate)).length
  };

  const complianceStats = {
    total: compliance.length,
    compliant: compliance.filter(c => c.status === 'compliant').length,
    nonCompliant: compliance.filter(c => c.status === 'non_compliant').length,
    inProgress: compliance.filter(c => c.status === 'in_progress').length
  };

  const complianceRate = complianceStats.total > 0 ? (complianceStats.compliant / complianceStats.total) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Alertas importantes */}
      <div className="space-y-3">
        {documents.some(d => isExpired(d.expiryDate)) && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Hay documentos vencidos que requieren atención inmediata.
            </AlertDescription>
          </Alert>
        )}
        
        {documents.some(d => isExpiringSoon(d.expiryDate)) && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Hay documentos que vencen en los próximos 30 días.
            </AlertDescription>
          </Alert>
        )}
        
        {complianceStats.nonCompliant > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Hay {complianceStats.nonCompliant} requisito{complianceStats.nonCompliant !== 1 ? 's' : ''} de cumplimiento que no se está{complianceStats.nonCompliant !== 1 ? 'n' : ''} cumpliendo.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Documentos Totales</p>
              <p className="text-2xl font-bold text-blue-600">{documentStats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Firmados</p>
              <p className="text-2xl font-bold text-green-600">{documentStats.signed}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tasa de Cumplimiento</p>
              <p className="text-2xl font-bold text-purple-600">{complianceRate.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2">
            <Progress value={complianceRate} className="h-2" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Por Vencer</p>
              <p className="text-2xl font-bold text-orange-600">{documentStats.expiring}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Pestañas principales */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="documents">Documentos Legales</TabsTrigger>
          <TabsTrigger value="compliance">Cumplimiento</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          {/* Filtros y acciones para documentos */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar documentos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      <SelectItem value="contract">Contratos</SelectItem>
                      <SelectItem value="nda">NDAs</SelectItem>
                      <SelectItem value="license">Licencias</SelectItem>
                      <SelectItem value="policy">Políticas</SelectItem>
                      <SelectItem value="agreement">Acuerdos</SelectItem>
                      <SelectItem value="other">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="draft">Borrador</SelectItem>
                      <SelectItem value="review">En Revisión</SelectItem>
                      <SelectItem value="approved">Aprobado</SelectItem>
                      <SelectItem value="signed">Firmado</SelectItem>
                      <SelectItem value="expired">Vencido</SelectItem>
                      <SelectItem value="rejected">Rechazado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Subir
                  </Button>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Documento
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabla de documentos */}
          <Card>
            <CardHeader>
              <CardTitle>Documentos Legales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Documento</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Prioridad</TableHead>
                      <TableHead>Partes</TableHead>
                      <TableHead>Fechas</TableHead>
                      <TableHead>Asignado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((doc) => (
                      <TableRow key={doc.id} className={isExpired(doc.expiryDate) ? 'bg-red-50' : isExpiringSoon(doc.expiryDate) ? 'bg-yellow-50' : ''}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{doc.name}</div>
                            <div className="text-sm text-gray-500">v{doc.version}</div>
                            <div className="text-xs text-gray-400">
                              {doc.fileSize && formatFileSize(doc.fileSize)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getTypeText(doc.type)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(doc.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(doc.status)}
                              {getStatusText(doc.status)}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(doc.priority)}>
                            {getPriorityText(doc.priority)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {doc.parties.map((party, index) => (
                              <div key={index} className="flex items-center gap-1">
                                {party.signed ? (
                                  <CheckCircle className="h-3 w-3 text-green-600" />
                                ) : (
                                  <Clock className="h-3 w-3 text-gray-400" />
                                )}
                                <span className="truncate">{party.name}</span>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>Creado: {formatDate(doc.createdDate)}</div>
                            {doc.signedDate && (
                              <div className="text-green-600">Firmado: {formatDate(doc.signedDate)}</div>
                            )}
                            {doc.expiryDate && (
                              <div className={isExpired(doc.expiryDate) ? 'text-red-600' : isExpiringSoon(doc.expiryDate) ? 'text-orange-600' : 'text-gray-500'}>
                                Vence: {formatDate(doc.expiryDate)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {doc.assignedTo && (
                            <div className="text-sm">
                              <div className="font-medium">{doc.assignedTo.name}</div>
                              <div className="text-gray-500">{doc.assignedTo.email}</div>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          {/* Filtros para cumplimiento */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar requisitos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      <SelectItem value="gdpr">GDPR</SelectItem>
                      <SelectItem value="security">Seguridad</SelectItem>
                      <SelectItem value="accessibility">Accesibilidad</SelectItem>
                      <SelectItem value="performance">Rendimiento</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                      <SelectItem value="other">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="compliant">Cumple</SelectItem>
                      <SelectItem value="non_compliant">No Cumple</SelectItem>
                      <SelectItem value="in_progress">En Progreso</SelectItem>
                      <SelectItem value="not_applicable">No Aplica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Requisito
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de cumplimiento */}
          <div className="space-y-4">
            {filteredCompliance.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{item.requirement}</h3>
                        <Badge className={getStatusColor(item.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(item.status)}
                            {getStatusText(item.status)}
                          </div>
                        </Badge>
                        <Badge className={getPriorityColor(item.priority)}>
                          {getPriorityText(item.priority)}
                        </Badge>
                        <Badge variant="outline">
                          {getTypeText(item.category)}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{item.description}</p>
                      
                      {item.evidence && (
                        <div className="mb-3">
                          <span className="text-sm font-medium text-gray-700">Evidencia: </span>
                          <span className="text-sm text-gray-600">{item.evidence}</span>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Última revisión: </span>
                          <span className="text-gray-600">{formatDate(item.lastChecked)}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Próxima revisión: </span>
                          <span className="text-gray-600">{formatDate(item.nextReview)}</span>
                        </div>
                        {item.assignedTo && (
                          <div>
                            <span className="font-medium text-gray-700">Asignado a: </span>
                            <span className="text-gray-600">{item.assignedTo.name}</span>
                          </div>
                        )}
                      </div>
                      
                      {item.actions.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-700 mb-2">Acciones:</h4>
                          <div className="space-y-2">
                            {item.actions.map((action, index) => (
                              <div key={index} className="flex items-center gap-3 text-sm">
                                {action.completed ? (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Clock className="h-4 w-4 text-gray-400" />
                                )}
                                <span className={action.completed ? 'line-through text-gray-500' : 'text-gray-700'}>
                                  {action.description}
                                </span>
                                <span className="text-gray-500">- Vence: {formatDate(action.dueDate)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}