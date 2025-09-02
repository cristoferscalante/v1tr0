"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { LogIn } from "lucide-react"

export function FloatingLoginButton() {
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  // Mostrar el botón después de un pequeño retraso para la animación inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleClick = () => {
    router.push("/login")
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-8 right-24 z-50 hidden md:block"
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.6,
          }}
        >
          <motion.button
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl text-[#26FFDF] shadow-lg transition-all duration-300 hover:border-[#08A696] hover:bg-[#02505950] hover:shadow-xl hover:shadow-[#08A696]/10"
            style={{
              boxShadow: isHovered
                ? "0 20px 40px rgba(8, 166, 150, 0.1), 0 10px 25px rgba(38, 255, 223, 0.1)"
                : "0 6px 15px rgba(8, 166, 150, 0.05), 0 3px 8px rgba(38, 255, 223, 0.05)",
            }}

            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
          >
            <LogIn className="w-4 h-4" />
            <motion.span
              initial={{ width: 0, opacity: 0 }}
              animate={{
                width: isHovered ? "auto" : 0,
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden whitespace-nowrap"
            >
              Iniciar Sesión
            </motion.span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
