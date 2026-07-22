"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

export default function ConfirmacionPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams?.get("order")
  const transactionId = searchParams?.get("transaction_id")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Verificando tu pago...")

  useEffect(() => {
    if (!orderId && !transactionId) {
      setStatus("error")
      setMessage("No se encontró información del pago")
      return
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}/verify${transactionId ? `?transaction_id=${transactionId}` : ""}`)
        if (res.ok) {
          setStatus("success")
          setMessage("¡Pago confirmado! Recibirás un correo con los detalles.")
        } else {
          setStatus("error")
          setMessage("El pago está pendiente. Te notificaremos cuando se confirme.")
        }
      } catch {
        setStatus("error")
        setMessage("Error al verificar el pago. Contacta a soporte.")
      }
    }

    const timer = setTimeout(verify, 2000)
    return () => clearTimeout(timer)
  }, [orderId, transactionId])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A1A1A] to-[#001F1F] p-4">
      <div className="bg-black/40 backdrop-blur-xl border border-[#08A696]/20 rounded-2xl p-8 max-w-md w-full text-center">
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
              className="px-6 py-3 bg-gradient-to-r from-[#08A696] to-[#26FFDF] text-black font-semibold rounded-xl"
            >
              Ir a mi dashboard
            </button>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Pago pendiente</h1>
            <p className="text-gray-400 mb-6">{message}</p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-[#08A696]/20 text-[#26FFDF] rounded-xl hover:bg-[#08A696]/30 transition-colors"
            >
              Volver al inicio
            </button>
          </>
        )}
      </div>
    </div>
  )
}
