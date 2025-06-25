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
          className="fixed top-8 right-8 z-50 hidden md:block"
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
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white shadow-lg"
            style={{
              background: "linear-gradient(135deg, rgba(242, 106, 27, 0.7), rgba(255, 140, 66, 0.7))",
              boxShadow: isHovered ? "0 10px 25px rgba(242, 106, 27, 0.3)" : "0 6px 15px rgba(242, 106, 27, 0.2)",
            }}
            whileHoverScale={1.05}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
          >
            <LogIn className="w-5 h-5" />
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
