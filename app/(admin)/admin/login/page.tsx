"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { ShieldCheckIcon } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "loading") {return}
    if (session?.user) {
      router.push("/admin")
    } else {
      router.push("/login")
    }
  }, [session, status, router])

  return (
    // Pantalla de tránsito, no de contenido: no usa PanelPage a propósito.
    <div className="flex min-h-screen items-center justify-center bg-[#1e2123]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <ShieldCheckIcon className="mx-auto mb-4 h-12 w-12 animate-pulse text-[#08A696]" />
        <p className="font-mono text-xs uppercase tracking-wider text-white/45">Redirigiendo…</p>
      </motion.div>
    </div>
  )
}
