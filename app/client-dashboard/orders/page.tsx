'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Package, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Panel, PanelPage, Pill, SectionHeading } from '@/components/shared/panel-ui'

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

type Tone = 'default' | 'success' | 'warning' | 'danger' | 'muted'

const statusTone: Record<string, { tone: Tone; label: string }> = {
  pending: { tone: 'warning', label: 'Pendiente' },
  confirmed: { tone: 'default', label: 'Confirmado' },
  processing: { tone: 'default', label: 'Procesando' },
  shipped: { tone: 'success', label: 'Enviado' },
  delivered: { tone: 'success', label: 'Entregado' },
  cancelled: { tone: 'danger', label: 'Cancelado' },
}

const paymentTone: Record<string, { tone: Tone; label: string }> = {
  pending: { tone: 'warning', label: 'Pago pendiente' },
  paid: { tone: 'success', label: 'Pagado' },
  failed: { tone: 'danger', label: 'Pago fallido' },
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
        if (res.ok) {setOrders(await res.json())}
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#26FFDF]" />
      </div>
    )
  }

  return (
    <PanelPage>
      <SectionHeading
        badge="Tienda"
        title="Mis Compras"
        subtitle="Productos y servicios que has adquirido"
      />

      {orders.length === 0 ? (
        <Panel className="text-center py-16 px-6">
          <Package className="h-10 w-10 text-[#08A696]/50 mx-auto mb-3" />
          <p className="text-textSecondary">No tienes compras aún</p>
          <Link
            href="/tienda"
            className="inline-flex items-center mt-5 px-5 py-2.5 rounded-xl bg-[#08A696]/20 border border-[#08A696]/40 text-[#26FFDF] text-sm font-medium hover:bg-[#08A696]/30 hover:border-[#26FFDF] transition-all"
          >
            Ir a la tienda
          </Link>
        </Panel>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => {
            const s = statusTone[order.status] ?? { tone: 'muted' as Tone, label: order.status }
            const p = paymentTone[order.paymentStatus] ?? {
              tone: 'muted' as Tone,
              label: order.paymentStatus,
            }
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Panel className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-4 border-b border-[#08A696]/15">
                    <div className="min-w-0">
                      <p className="text-white font-semibold font-mono">{order.orderNumber}</p>
                      <p className="text-textSecondary text-xs mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <Pill tone={s.tone}>{s.label}</Pill>
                      <Pill tone={p.tone}>{p.label}</Pill>
                    </div>
                  </div>

                  <div className="space-y-2 py-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between gap-4 text-sm">
                        <span className="text-textSecondary min-w-0 truncate">
                          {item.productName} <span className="text-textSecondary/60">×{item.quantity}</span>
                        </span>
                        <span className="text-white shrink-0">
                          ${Number(item.totalPrice).toLocaleString('es-CO')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[#08A696]/15 flex justify-between items-center">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-xl font-bold text-[#26FFDF]">
                      ${Number(order.total).toLocaleString('es-CO')} {order.currency}
                    </span>
                  </div>
                </Panel>
              </motion.div>
            )
          })}
        </div>
      )}
    </PanelPage>
  )
}
