"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { LogIn, ShoppingCart } from "lucide-react"

export function FloatingActionButtons() {
  const [loginHovered, setLoginHovered] = useState(false)
  const [cartHovered, setCartHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const router = useRouter()
  const pathname = usePathname()
  const isShopPage = pathname?.startsWith('/tienda')

  // Mostrar los botones después de un pequeño retraso para la animación inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Escuchar actualizaciones del contador del carrito
  useEffect(() => {
    const handleUpdateCartCount = (e: Event) => {
      const customEvent = e as CustomEvent;
      setCartCount(customEvent.detail?.count || 0);
    };

    window.addEventListener('updateCartCount', handleUpdateCartCount);
    return () => window.removeEventListener('updateCartCount', handleUpdateCartCount);
  }, []);

  const handleLoginClick = () => {
    router.push("/login")
  }

  const handleCartClick = () => {
    window.dispatchEvent(new CustomEvent('toggleCart'));
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-8 right-8 z-50 hidden md:block"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.6,
          }}
        >
          {/* Grid container - 2 botones del mismo tamaño */}
          <div className="grid grid-cols-2 gap-3">
            {/* Botón de Carrito - Solo visible en páginas de tienda */}
            {isShopPage && (
              <motion.button
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white/90 dark:bg-[#02505931] backdrop-blur-sm border border-[#08A696]/60 dark:border-[#08A696]/30 rounded-2xl text-[#08A696] dark:text-[#26FFDF] shadow-lg transition-all duration-300 hover:border-[#08A696] hover:bg-[#08A696]/10 dark:hover:bg-[#02505950] hover:shadow-xl hover:shadow-[#08A696]/10"
                style={{
                  boxShadow: cartHovered
                    ? "0 20px 40px rgba(8, 166, 150, 0.1), 0 10px 25px rgba(38, 255, 223, 0.1)"
                    : "0 6px 15px rgba(8, 166, 150, 0.05), 0 3px 8px rgba(38, 255, 223, 0.05)",
                }}
                layout
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setCartHovered(true)}
                onMouseLeave={() => setCartHovered(false)}
                onClick={handleCartClick}
              >
                <div className="relative">
                  <ShoppingCart className="w-4 h-4" />
                  {/* Badge contador */}
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-4 h-4 bg-[#08A696] dark:bg-[#26FFDF] text-white dark:text-background text-[10px] font-bold rounded-full flex items-center justify-center"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </div>
                <motion.span
                  initial={{ width: 0, opacity: 0 }}
                  animate={{
                    width: cartHovered ? "auto" : 0,
                    opacity: cartHovered ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden whitespace-nowrap text-sm"
                >
                  Carrito
                </motion.span>
              </motion.button>
            )}

            {/* Botón de Login */}
            <motion.button
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white/90 dark:bg-[#02505931] backdrop-blur-sm border border-[#08A696]/60 dark:border-[#08A696]/30 rounded-2xl text-[#08A696] dark:text-[#26FFDF] shadow-lg transition-all duration-300 hover:border-[#08A696] hover:bg-[#08A696]/10 dark:hover:bg-[#02505950] hover:shadow-xl hover:shadow-[#08A696]/10"
              style={{
                boxShadow: loginHovered
                  ? "0 20px 40px rgba(8, 166, 150, 0.1), 0 10px 25px rgba(38, 255, 223, 0.1)"
                  : "0 6px 15px rgba(8, 166, 150, 0.05), 0 3px 8px rgba(38, 255, 223, 0.05)",
              }}
              layout
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setLoginHovered(true)}
              onMouseLeave={() => setLoginHovered(false)}
              onClick={handleLoginClick}
            >
              <LogIn className="w-4 h-4" />
              <motion.span
                initial={{ width: 0, opacity: 0 }}
                animate={{
                  width: loginHovered ? "auto" : 0,
                  opacity: loginHovered ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden whitespace-nowrap text-sm"
              >
                Iniciar Sesión
              </motion.span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
