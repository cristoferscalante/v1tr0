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
    if (status === "loading") return
    if (session?.user) {
      router.push("/admin")
    } else {
      router.push("/login")
    }
  }, [session, status, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A1A1A] to-[#001F1F]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <ShieldCheckIcon className="w-16 h-16 text-[#26FFDF] mx-auto mb-4 animate-pulse" />
        <p className="text-[#26FFDF] text-lg">Redirigiendo...</p>
      </motion.div>
    </div>
  )
}
