"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2, XCircle, Loader2, Clock } from "lucide-react"

export default function ConfirmacionPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams?.get("order")
  const transactionId = searchParams?.get("transaction_id")
  const [status, setStatus] = useState<"loading" | "success" | "pending" | "failed" | "error">("loading")
  const [message, setMessage] = useState("Verificando tu pago...")

  useEffect(() => {
    if (!orderId && !transactionId) {
      setStatus("error")
      setMessage("No se encontró información del pago")
      return
    }

    // La respuesta 200 solo dice que la consulta salió bien; el estado real
    // del pago viene en el cuerpo. Confiar en res.ok mostraba "¡Pago exitoso!"
    // también para pagos pendientes y rechazados.
    const verify = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}/verify${transactionId ? `?transaction_id=${transactionId}` : ""}`)
        if (!res.ok) {
          setStatus("error")
          setMessage(
            res.status === 401
              ? "Inicia sesión para ver el estado de tu pedido."
              : "No pudimos consultar tu pedido. Contacta a soporte."
          )
          return
        }

        const data = await res.json()
        if (data.status === "paid") {
          setStatus("success")
          setMessage("¡Pago confirmado! Recibirás un correo con los detalles.")
          return
        }

        setStatus(data.status === "failed" ? "failed" : "pending")
        setMessage(
          data.status === "failed"
            ? "El pago fue rechazado. Puedes intentarlo de nuevo con otro medio de pago."
            : "El pago está pendiente. Te notificaremos apenas se confirme."
        )
      } catch {
        setStatus("error")
        setMessage("Error al verificar el pago. Contacta a soporte.")
      }
    }

    // Wompi puede tardar un momento en propagar el estado tras el redirect,
    // así que se reintenta un par de veces antes de darlo por pendiente.
    let cancelled = false
    let attempts = 0
    const tick = async () => {
      if (cancelled) {return}
      await verify()
      attempts += 1
      if (!cancelled && attempts < 3) {
        timer = setTimeout(tick, 3000)
      }
    }
    let timer = setTimeout(tick, 1500)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [orderId, transactionId])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A1A1A] to-[#001F1F] p-4">
      <div className="bg-black/40 backdrop-blur-xl border border-[#08A696]/20 rounded-2xl p-5 sm:p-8 max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <Loader2 className="h-16 w-16 text-[#26FFDF] mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold text-white mb-2">Verificando pago</h1>
            <p className="text-gray-400">{message}</p>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle2 className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">¡Pago exitoso!</h1>
            <p className="text-gray-400 mb-6">{message}</p>
            <button
              onClick={() => router.push("/client-dashboard")}
              className="w-full sm:w-auto min-h-[44px] px-6 py-3 bg-gradient-to-r from-[#08A696] to-[#26FFDF] text-black font-semibold rounded-xl"
            >
              Ir a mi dashboard
            </button>
          </>
        )}
        {status === "pending" && (
          <>
            <Clock className="h-16 w-16 text-amber-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Pago pendiente</h1>
            <p className="text-gray-400 mb-6">{message}</p>
            <button
              onClick={() => router.push("/client-dashboard/orders")}
              className="w-full sm:w-auto min-h-[44px] px-6 py-3 bg-[#08A696]/20 text-[#26FFDF] rounded-xl hover:bg-[#08A696]/30 transition-colors"
            >
              Ver mis pedidos
            </button>
          </>
        )}
        {(status === "failed" || status === "error") && (
          <>
            <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">
              {status === "failed" ? "Pago rechazado" : "No pudimos verificar el pago"}
            </h1>
            <p className="text-gray-400 mb-6">{message}</p>
            <button
              onClick={() => router.push("/tienda")}
              className="w-full sm:w-auto min-h-[44px] px-6 py-3 bg-[#08A696]/20 text-[#26FFDF] rounded-xl hover:bg-[#08A696]/30 transition-colors"
            >
              Volver a la tienda
            </button>
          </>
        )}
      </div>
    </div>
  )
}
