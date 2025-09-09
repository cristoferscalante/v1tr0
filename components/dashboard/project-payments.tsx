'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  DollarSign, 
  Calendar,
  Download,
  Eye,
  Plus,
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Send
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

interface Payment {
  id: string;
  invoiceNumber: string;
  description: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled' | 'draft';
  dueDate: string;
  paidDate?: string;
  createdDate: string;
  paymentMethod?: 'credit_card' | 'bank_transfer' | 'paypal' | 'check';
  client: {
    name: string;
    email: string;
  };
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  taxes: {
    name: string;
    rate: number;
    amount: number;
  }[];
  subtotal: number;
  totalTaxes: number;
  total: number;
  notes?: string;
}

interface ProjectPaymentsProps {
  projectId?: string;
}

export function ProjectPayments({}: ProjectPaymentsProps) {
  const [payments] = useState<Payment[]>([
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      description: 'Desarrollo Frontend - Sprint 1',
      amount: 15000,
      currency: 'USD',
      status: 'paid',
      dueDate: '2024-02-15',
      paidDate: '2024-02-10',
      createdDate: '2024-01-15',
      paymentMethod: 'bank_transfer',
      client: {
        name: 'TechCorp Solutions',
        email: 'billing@techcorp.com'
      },
      items: [
        {
          description: 'Desarrollo de componentes UI',
          quantity: 80,
          unitPrice: 150,
          total: 12000
        },
        {
          description: 'Integración de APIs',
          quantity: 20,
          unitPrice: 150,
          total: 3000
        }
      ],
      taxes: [
        {
          name: 'IVA',
          rate: 0.21,
          amount: 3150
        }
      ],
      subtotal: 15000,
      totalTaxes: 3150,
      total: 18150
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      description: 'Desarrollo Backend - Sprint 1',
      amount: 12000,
      currency: 'USD',
      status: 'paid',
      dueDate: '2024-03-01',
      paidDate: '2024-02-28',
      createdDate: '2024-02-01',
      paymentMethod: 'credit_card',
      client: {
        name: 'TechCorp Solutions',
        email: 'billing@techcorp.com'
      },
      items: [
        {
          description: 'Desarrollo de APIs REST',
          quantity: 60,
          unitPrice: 150,
          total: 9000
        },
        {
          description: 'Configuración de base de datos',
          quantity: 20,
          unitPrice: 150,
          total: 3000
        }
      ],
      taxes: [
        {
          name: 'IVA',
          rate: 0.21,
          amount: 2520
        }
      ],
      subtotal: 12000,
      totalTaxes: 2520,
      total: 14520
    },
    {
      id: '3',
      invoiceNumber: 'INV-2024-003',
      description: 'Desarrollo Frontend - Sprint 2',
      amount: 18000,
      currency: 'USD',
      status: 'pending',
      dueDate: '2024-04-15',
      createdDate: '2024-03-15',
      client: {
        name: 'TechCorp Solutions',
        email: 'billing@techcorp.com'
      },
      items: [
        {
          description: 'Desarrollo de dashboard',
          quantity: 100,
          unitPrice: 150,
          total: 15000
        },
        {
          description: 'Optimización de rendimiento',
          quantity: 20,
          unitPrice: 150,
          total: 3000
        }
      ],
      taxes: [
        {
          name: 'IVA',
          rate: 0.21,
          amount: 3780
        }
      ],
      subtotal: 18000,
      totalTaxes: 3780,
      total: 21780
    },
    {
      id: '4',
      invoiceNumber: 'INV-2024-004',
      description: 'Testing y QA - Sprint 2',
      amount: 8000,
      currency: 'USD',
      status: 'overdue',
      dueDate: '2024-03-30',
      createdDate: '2024-03-01',
      client: {
        name: 'TechCorp Solutions',
        email: 'billing@techcorp.com'
      },
      items: [
        {
          description: 'Testing automatizado',
          quantity: 40,
          unitPrice: 150,
          total: 6000
        },
        {
          description: 'Testing manual',
          quantity: 20,
          unitPrice: 100,
          total: 2000
        }
      ],
      taxes: [
        {
          name: 'IVA',
          rate: 0.21,
          amount: 1680
        }
      ],
      subtotal: 8000,
      totalTaxes: 1680,
      total: 9680,
      notes: 'Pago vencido - Contactar con cliente'
    },
    {
      id: '5',
      invoiceNumber: 'INV-2024-005',
      description: 'Mantenimiento y Soporte - Q1',
      amount: 5000,
      currency: 'USD',
      status: 'draft',
      dueDate: '2024-05-01',
      createdDate: '2024-04-01',
      client: {
        name: 'TechCorp Solutions',
        email: 'billing@techcorp.com'
      },
      items: [
        {
          description: 'Soporte técnico mensual',
          quantity: 3,
          unitPrice: 1500,
          total: 4500
        },
        {
          description: 'Actualizaciones menores',
          quantity: 5,
          unitPrice: 100,
          total: 500
        }
      ],
      taxes: [
        {
          name: 'IVA',
          rate: 0.21,
          amount: 1050
        }
      ],
      subtotal: 5000,
      totalTaxes: 1050,
      total: 6050
    }
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');


  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'paid': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'overdue': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'cancelled': return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
      case 'draft': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    }
  };

  const getStatusText = (status: Payment['status']) => {
    switch (status) {
      case 'paid': return 'Pagado';
      case 'pending': return 'Pendiente';
      case 'overdue': return 'Vencido';
      case 'cancelled': return 'Cancelado';
      case 'draft': return 'Borrador';
      default: return 'Desconocido';
    }
  };

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'draft': return <FileText className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPaymentMethodText = (method?: Payment['paymentMethod']) => {
    switch (method) {
      case 'credit_card': return 'Tarjeta de Crédito';
      case 'bank_transfer': return 'Transferencia Bancaria';
      case 'paypal': return 'PayPal';
      case 'check': return 'Cheque';
      default: return 'No especificado';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isOverdue = (dueDate: string, status: Payment['status']) => {
    return status === 'pending' && new Date(dueDate) < new Date();
  };

  const filteredPayments = payments.filter(payment => {
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.client.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Cálculos de estadísticas
  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((acc, p) => acc + p.total, 0);
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((acc, p) => acc + p.total, 0);
  const overdueAmount = payments.filter(p => p.status === 'overdue').reduce((acc, p) => acc + p.total, 0);
  const totalInvoices = payments.length;
  const paidInvoices = payments.filter(p => p.status === 'paid').length;
  const paymentRate = totalInvoices > 0 ? (paidInvoices / totalInvoices) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white/80 dark:bg-background/10 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ingresos Totales</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(totalRevenue, 'USD')}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-white/80 dark:bg-background/10 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">
                {formatCurrency(pendingAmount, 'USD')}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-white/80 dark:bg-background/10 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Vencidos</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(overdueAmount, 'USD')}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-white/80 dark:bg-background/10 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tasa de Pago</p>
              <p className="text-2xl font-bold text-blue-600">
                {paymentRate.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2">
            <Progress value={paymentRate} className="h-2" />
          </div>
        </Card>
      </div>

      {/* Filtros y acciones */}
      <Card className="bg-white/80 dark:bg-background/10 rounded-2xl">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar facturas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="paid">Pagados</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="overdue">Vencidos</SelectItem>
                  <SelectItem value="draft">Borradores</SelectItem>
                  <SelectItem value="cancelled">Cancelados</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Factura
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de pagos */}
      <Card className="bg-white/80 dark:bg-background/10 rounded-2xl">
        <CardHeader>
          <CardTitle>Facturas y Pagos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Factura</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Fecha Venc.</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id} className={isOverdue(payment.dueDate, payment.status) ? 'bg-red-50' : ''}>
                    <TableCell>
                      <div className="font-medium">{payment.invoiceNumber}</div>
                      <div className="text-sm text-gray-500">
                        Creada: {formatDate(payment.createdDate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{payment.client.name}</div>
                      <div className="text-sm text-gray-500">{payment.client.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={payment.description}>
                        {payment.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-2 ${isOverdue(payment.dueDate, payment.status) ? 'text-red-600' : ''}`}>
                        <Calendar className="h-4 w-4" />
                        {formatDate(payment.dueDate)}
                      </div>
                      {payment.paidDate && (
                        <div className="text-sm text-green-600">
                          Pagado: {formatDate(payment.paidDate)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(payment.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(payment.status)}
                          {getStatusText(payment.status)}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {getPaymentMethodText(payment.paymentMethod)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-medium">
                        {formatCurrency(payment.total, payment.currency)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Subtotal: {formatCurrency(payment.subtotal, payment.currency)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                        {payment.status === 'pending' && (
                          <Button size="sm">
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredPayments.length === 0 && (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay facturas</h3>
              <p className="text-gray-500">No se encontraron facturas que coincidan con los filtros.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumen financiero */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/80 dark:bg-background/10 rounded-2xl">
          <CardHeader>
            <CardTitle>Resumen por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { status: 'paid', label: 'Pagadas', count: payments.filter(p => p.status === 'paid').length, color: 'text-green-600' },
                { status: 'pending', label: 'Pendientes', count: payments.filter(p => p.status === 'pending').length, color: 'text-yellow-600' },
                { status: 'overdue', label: 'Vencidas', count: payments.filter(p => p.status === 'overdue').length, color: 'text-red-600' },
                { status: 'draft', label: 'Borradores', count: payments.filter(p => p.status === 'draft').length, color: 'text-blue-600' }
              ].map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.status as Payment['status'])}
                    <span>{item.label}</span>
                  </div>
                  <div className={`font-semibold ${item.color}`}>
                    {item.count} factura{item.count !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 dark:bg-background/10 rounded-2xl">
          <CardHeader>
            <CardTitle>Próximos Vencimientos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payments
                .filter(p => p.status === 'pending')
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .slice(0, 5)
                .map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{payment.invoiceNumber}</div>
                      <div className="text-sm text-gray-500">{payment.client.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatCurrency(payment.total, payment.currency)}
                      </div>
                      <div className={`text-sm ${isOverdue(payment.dueDate, payment.status) ? 'text-red-600' : 'text-gray-500'}`}>
                        {formatDate(payment.dueDate)}
                      </div>
                    </div>
                  </div>
                ))
              }
              
              {payments.filter(p => p.status === 'pending').length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No hay facturas pendientes
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}