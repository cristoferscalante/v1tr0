"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Eye, CreditCard, DollarSign } from "lucide-react"

export function ClientPayments() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")

  // Datos de ejemplo para los pagos
  const payments = [
    {
      id: "1",
      concept: "Pago Inicial",
      amount: 15000,
      currency: "USD",
      date: "15 Mar 2023",
      status: "paid",
      method: "Transferencia Bancaria",
      invoice: "INV-2023-001",
      description: "Pago inicial del 30% del proyecto",
    },
    {
      id: "2",
      concept: "Entrega de Diseños",
      amount: 10000,
      currency: "USD",
      date: "15 Abr 2023",
      status: "paid",
      method: "Transferencia Bancaria",
      invoice: "INV-2023-002",
      description: "Pago por la entrega de diseños aprobados",
    },
    {
      id: "3",
      concept: "Desarrollo Frontend",
      amount: 10000,
      currency: "USD",
      date: "15 Jun 2023",
      status: "pending",
      method: "Transferencia Bancaria",
      invoice: "INV-2023-003",
      description: "Pago por la entrega del desarrollo frontend",
    },
    {
      id: "4",
      concept: "Desarrollo Backend",
      amount: 10000,
      currency: "USD",
      date: "15 Ago 2023",
      status: "scheduled",
      method: "Transferencia Bancaria",
      invoice: "INV-2023-004",
      description: "Pago por la entrega del desarrollo backend",
    },
    {
      id: "5",
      concept: "Entrega Final",
      amount: 5000,
      currency: "USD",
      date: "15 Sep 2023",
      status: "scheduled",
      method: "Transferencia Bancaria",
      invoice: "INV-2023-005",
      description: "Pago final por la entrega del proyecto completo",
    },
  ]

  // Filtrar pagos según el término de búsqueda y el filtro
  const filteredPayments = payments.filter(
    (payment) =>
      (payment.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.invoice.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filter === "all" ||
        (filter === "paid" && payment.status === "paid") ||
        (filter === "pending" && payment.status === "pending") ||
        (filter === "scheduled" && payment.status === "scheduled")),
  )

  // Calcular totales
  const totalAmount = payments.reduce((acc, payment) => acc + payment.amount, 0)
  const paidAmount = payments
    .filter((payment) => payment.status === "paid")
    .reduce((acc, payment) => acc + payment.amount, 0)
  const pendingAmount = payments
    .filter((payment) => payment.status === "pending")
    .reduce((acc, payment) => acc + payment.amount, 0)
  const scheduledAmount = payments
    .filter((payment) => payment.status === "scheduled")
    .reduce((acc, payment) => acc + payment.amount, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border border-custom-2/20 bg-custom-1/10">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-textMuted">Total Proyecto</h4>
            <DollarSign className="h-5 w-5 text-highlight" />
          </div>
          <p className="text-2xl font-bold">${totalAmount.toLocaleString()}</p>
        </div>

        <div className="p-4 rounded-lg border border-custom-2/20 bg-custom-1/10">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-textMuted">Pagado</h4>
            <div className="h-5 w-5 rounded-full bg-green-500"></div>
          </div>
          <p className="text-2xl font-bold">${paidAmount.toLocaleString()}</p>
          <p className="text-xs text-textMuted">{((paidAmount / totalAmount) * 100).toFixed(0)}% del total</p>
        </div>

        <div className="p-4 rounded-lg border border-custom-2/20 bg-custom-1/10">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-textMuted">Pendiente</h4>
            <div className="h-5 w-5 rounded-full bg-highlight"></div>
          </div>
          <p className="text-2xl font-bold">${pendingAmount.toLocaleString()}</p>
          <p className="text-xs text-textMuted">{((pendingAmount / totalAmount) * 100).toFixed(0)}% del total</p>
        </div>

        <div className="p-4 rounded-lg border border-custom-2/20 bg-custom-1/10">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-textMuted">Programado</h4>
            <div className="h-5 w-5 rounded-full bg-gray-400"></div>
          </div>
          <p className="text-2xl font-bold">${scheduledAmount.toLocaleString()}</p>
          <p className="text-xs text-textMuted">{((scheduledAmount / totalAmount) * 100).toFixed(0)}% del total</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textMuted" />
          <Input
            type="search"
            placeholder="Buscar pagos..."
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
            variant={filter === "paid" ? "default" : "outline"}
            size="sm"
            className="rounded-none border-x-0"
            onClick={() => setFilter("paid")}
          >
            Pagados
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            size="sm"
            className="rounded-none border-r-0"
            onClick={() => setFilter("pending")}
          >
            Pendientes
          </Button>
          <Button
            variant={filter === "scheduled" ? "default" : "outline"}
            size="sm"
            className="rounded-l-none"
            onClick={() => setFilter("scheduled")}
          >
            Programados
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-custom-2/20">
              <th className="px-4 py-3 text-left text-sm font-medium text-textMuted">Concepto</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-textMuted">Importe</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-textMuted">Fecha</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-textMuted">Estado</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-textMuted">Método</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-textMuted">Factura</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-textMuted">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment.id} className="border-b border-custom-2/20 hover:bg-custom-1/20">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium">{payment.concept}</p>
                    <p className="text-xs text-textMuted">{payment.description}</p>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">
                  ${payment.amount.toLocaleString()} {payment.currency}
                </td>
                <td className="px-4 py-3">{payment.date}</td>
                <td className="px-4 py-3">
                  <Badge
                    className={
                      payment.status === "paid"
                        ? "bg-green-500 text-white"
                        : payment.status === "pending"
                          ? "bg-highlight text-white"
                          : "bg-gray-400 text-white"
                    }
                  >
                    {payment.status === "paid" ? "Pagado" : payment.status === "pending" ? "Pendiente" : "Programado"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-textMuted" />
                    <span>{payment.method}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{payment.invoice}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {payment.status === "paid" && (
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
