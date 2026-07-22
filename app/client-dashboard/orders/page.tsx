'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Package, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface OrderItem {
  id: string
  productName: string
  quantity: number
  unitPrice: string
  totalPrice: string
}

interface Order {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  total: string
  currency: string
  createdAt: string
  items: OrderItem[]
}

const statusBadge: Record<string, { color: string; label: string }> = {
  pending: { color: 'bg-[#FFB800]/20 text-[#FFB800] border-[#FFB800]/30', label: 'Pendiente' },
  confirmed: { color: 'bg-[#08A696]/20 text-[#26FFDF] border-[#08A696]/30', label: 'Confirmado' },
  processing: { color: 'bg-[#08A696]/30 text-[#26FFDF] border-[#08A696]/40', label: 'Procesando' },
  shipped: { color: 'bg-[#00D084]/20 text-[#00D084] border-[#00D084]/30', label: 'Enviado' },
  delivered: { color: 'bg-[#00D084]/30 text-[#00D084] border-[#00D084]/40', label: 'Entregado' },
  cancelled: { color: 'bg-[#FF6B6B]/20 text-[#FF6B6B] border-[#FF6B6B]/30', label: 'Cancelado' },
}

const paymentBadge: Record<string, { color: string; label: string }> = {
  pending: { color: 'bg-[#FFB800]/20 text-[#FFB800] border-[#FFB800]/30', label: 'Pendiente' },
  paid: { color: 'bg-[#00D084]/20 text-[#00D084] border-[#00D084]/30', label: 'Pagado' },
  failed: { color: 'bg-[#FF6B6B]/20 text-[#FF6B6B] border-[#FF6B6B]/30', label: 'Fallido' },
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/client-orders')
        if (res.ok) setOrders(await res.json())
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen p-6 font-bricolage flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#26FFDF]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 font-bricolage">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center space-x-4 mb-8 p-6 rounded-2xl bg-background/10 backdrop-blur-sm border border-[#08A696]/20"
      >
        <Link href="/client-dashboard">
          <Button variant="outline" size="sm" className="border-[#08A696]/30 text-textPrimary hover:bg-[#08A696]/10">
            <ArrowLeft className="h-4 w-4 mr-2" /> Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-textPrimary bg-gradient-to-r from-[#08A696] to-[#26FFDF] bg-clip-text text-transparent">Mis Compras</h1>
          <p className="text-textSecondary text-sm">Productos y servicios adquiridos</p>
        </div>
      </motion.div>

      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 rounded-2xl bg-background/10 backdrop-blur-sm border border-[#08A696]/20"
        >
          <Package className="h-12 w-12 mx-auto mb-4 text-textSecondary" />
          <div className="text-textSecondary mb-2">No tienes compras aún</div>
          <Link href="/tienda">
            <Button className="mt-4 bg-gradient-to-r from-[#08A696] to-[#26FFDF] text-black font-semibold">
              Ir a la tienda
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const sb = statusBadge[order.status] ?? { color: 'bg-gray-500/20 text-gray-400', label: order.status }
            const pb = paymentBadge[order.paymentStatus] ?? { color: 'bg-gray-500/20 text-gray-400', label: order.paymentStatus }
            return (
              <Card key={order.id} className="bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-textPrimary text-lg">{order.orderNumber}</CardTitle>
                    <p className="text-textSecondary text-xs">
                      {new Date(order.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${sb.color} text-xs backdrop-blur-sm`}>{sb.label}</Badge>
                    <Badge className={`${pb.color} text-xs backdrop-blur-sm`}>{pb.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm text-textSecondary">
                        <span>{item.productName} x{item.quantity}</span>
                        <span>${Number(item.totalPrice).toLocaleString()} COP</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#08A696]/20 flex justify-between items-center">
                    <span className="text-textPrimary font-bold">Total</span>
                    <span className="text-xl font-bold text-[#26FFDF]">
                      ${Number(order.total).toLocaleString()} {order.currency}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
