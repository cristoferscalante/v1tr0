"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, X } from "lucide-react"

interface FloatingCartTabProps {
  onToggle: (isOpen: boolean) => void;
  cartCount: number;
  isCartOpen?: boolean;
}

export function FloatingCartTab({ onToggle, cartCount, isCartOpen: externalIsOpen }: FloatingCartTabProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [drawerOffset, setDrawerOffset] = useState(480)
  const onToggleRef = useRef(onToggle)
  onToggleRef.current = onToggle

  // Actualizar offset según tamaño de ventana
  useEffect(() => {
    const updateOffset = () => {
      setDrawerOffset(window.innerWidth < 768 ? window.innerWidth : 480);
    };
    
    updateOffset();
    window.addEventListener('resize', updateOffset);
    return () => window.removeEventListener('resize', updateOffset);
  }, []);

  // Mostrar el botón después de un pequeño retraso para la animación inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Sincronizar con el estado externo del carrito
  useEffect(() => {
    if (externalIsOpen !== undefined) {
      setIsOpen(externalIsOpen);
    }
  }, [externalIsOpen]);

  // Escuchar evento para cerrar desde el CartDrawer
  useEffect(() => {
    const handleToggleCart = () => {
      setIsOpen((prev) => !prev);
    };

    window.addEventListener('toggleCart', handleToggleCart);
    return () => window.removeEventListener('toggleCart', handleToggleCart);
  }, []);

  // Notificar cambios al padre
  useEffect(() => {
    onToggleRef.current(isOpen);
  }, [isOpen]);

  // Resetear el hover cuando se cierra el carrito
  useEffect(() => {
    if (!isOpen) {
      setIsHovered(false);
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-1/2 -translate-y-1/2 z-[75]"
          initial={{ right: -200 }}
          animate={{ 
            right: isOpen ? drawerOffset : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.4,
          }}
        >
          {/* Tab horizontal que se pega al borde del drawer */}
          <motion.button
            className="relative flex items-center justify-center bg-white/90 dark:bg-[#02505931] backdrop-blur-sm border-2 border-r-0 border-[#08A696]/60 dark:border-[#08A696]/30 rounded-l-2xl text-[#08A696] dark:text-[#26FFDF] shadow-xl transition-all duration-300 hover:border-[#08A696] hover:bg-[#08A696]/10 dark:hover:bg-[#02505950] overflow-hidden"
            style={{
              paddingTop: "0.75rem",
              paddingBottom: "0.75rem",
              paddingLeft: isHovered && !isOpen ? "1.25rem" : "0.75rem",
              paddingRight: isHovered && !isOpen ? "1.25rem" : "0.75rem",
              minWidth: "3rem",
              height: "3rem",
              boxShadow: "0 10px 40px rgba(8, 166, 150, 0.15), 0 5px 20px rgba(38, 255, 223, 0.1)",
            }}
            whileHover={{ scale: 1.05, x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            layout
          >
            {/* Icono animado */}
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="relative flex-shrink-0"
            >
              {isOpen ? (
                <X className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                  {/* Badge contador */}
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-[#08A696] dark:bg-[#26FFDF] text-white dark:text-background text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-950"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </>
              )}
            </motion.div>

            {/* Texto horizontal - solo visible en hover cuando está cerrado y en desktop */}
            <motion.span
              className="hidden md:block text-sm font-bold tracking-wider uppercase whitespace-nowrap"
              animate={{ 
                opacity: isOpen ? 0 : (isHovered ? 1 : 0),
                width: isOpen ? 0 : (isHovered ? "auto" : 0),
                marginLeft: isOpen ? 0 : (isHovered ? "0.75rem" : 0)
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ display: isOpen || !isHovered ? "none" : "block" }}
            >
              Carrito
            </motion.span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
