"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Instagram, Facebook, Twitter, ChevronLeft, ChevronRight, Tag, Truck, Sparkles } from "lucide-react"
import Link from "next/link"

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/v1tro", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com/v1tro", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com/v1tro", label: "Twitter" },
]

const promotions = [
  { icon: Tag, text: "20% de descuento en tu primera compra - Código: PRIMERA20" },
  { icon: Truck, text: "Envío gratis en compras mayores a $50,000 COP" },
  { icon: Sparkles, text: "Nuevos productos IoT disponibles - Explora el catálogo" },
]

export function TopBar() {
  const [currentPromo, setCurrentPromo] = useState(0)

  const nextPromo = () => {
    setCurrentPromo((prev) => (prev + 1) % promotions.length)
  }

  const prevPromo = () => {
    setCurrentPromo((prev) => (prev - 1 + promotions.length) % promotions.length)
  }

  const currentPromotion = promotions[currentPromo]
  const CurrentIcon = currentPromotion?.icon || Tag

  return (
    <div className="w-full bg-[#e6f7f6] dark:bg-[#02505931] backdrop-blur-sm py-2.5 px-4 fixed top-0 left-0 right-0 z-[60] shadow-lg border-b border-[#08A696]/60 dark:border-[#08A696]/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Social Icons - Left */}
        <div className="hidden md:flex items-center gap-2">
          {socialLinks.map((social) => {
            const Icon = social.icon
            return (
              <div key={social.label} className="relative group">
                {/* Gradiente de fondo con blur - igual que footer */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08a6961e] to-[#26ffde23] rounded-2xl blur opacity-0 group-hover:opacity-40 transition-all duration-300" />
                <Link
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex items-center justify-center w-8 h-8 bg-white/70 dark:bg-[#08A696]/20 backdrop-blur-sm border border-[#08A696]/80 dark:border-[#08A696]/50 rounded-2xl text-[#085c54] dark:text-[#26FFDF] transition-all duration-300 hover:border-[#08A696] dark:hover:border-[#26FFDF] hover:bg-[#08A696]/10 dark:hover:bg-[#08A696]/30 hover:shadow-lg hover:shadow-[#08A696]/20 dark:hover:shadow-[#26FFDF]/20 transform hover:scale-110"
                  aria-label={social.label}
                >
                  <Icon className="w-4 h-4" />
                </Link>
              </div>
            )
          })}
        </div>

        {/* Promotion Carousel - Center */}
        <div className="flex-1 flex items-center justify-center gap-2 min-w-0">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08a6961e] to-[#26ffde23] rounded-xl blur opacity-0 group-hover:opacity-40 transition-all duration-300" />
            <button
              onClick={prevPromo}
              className="relative w-7 h-7 flex items-center justify-center bg-white/70 dark:bg-[#08A696]/20 backdrop-blur-sm border border-[#08A696]/80 dark:border-[#08A696]/50 rounded-xl text-[#085c54] dark:text-[#26FFDF] transition-all duration-300 hover:border-[#08A696] dark:hover:border-[#26FFDF] hover:bg-[#08A696]/10 dark:hover:bg-[#08A696]/30 hover:shadow-md hover:shadow-[#08A696]/20 dark:hover:shadow-[#26FFDF]/20 transform hover:scale-110 flex-shrink-0"
              aria-label="Promoción anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPromo}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center gap-2 px-2"
              >
                <CurrentIcon className="w-4 h-4 flex-shrink-0 text-[#26FFDF]" />
                <p className="text-sm md:text-base font-semibold text-center whitespace-nowrap overflow-hidden text-ellipsis">
                  {currentPromotion?.text || ""}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08a6961e] to-[#26ffde23] rounded-xl blur opacity-0 group-hover:opacity-40 transition-all duration-300" />
            <button
              onClick={nextPromo}
              className="relative w-7 h-7 flex items-center justify-center bg-white/70 dark:bg-[#08A696]/20 backdrop-blur-sm border border-[#08A696]/80 dark:border-[#08A696]/50 rounded-xl text-[#085c54] dark:text-[#26FFDF] transition-all duration-300 hover:border-[#08A696] dark:hover:border-[#26FFDF] hover:bg-[#08A696]/10 dark:hover:bg-[#08A696]/30 hover:shadow-md hover:shadow-[#08A696]/20 dark:hover:shadow-[#26FFDF]/20 transform hover:scale-110 flex-shrink-0"
              aria-label="Siguiente promoción"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Empty space for balance - Right */}
        <div className="hidden md:block w-[104px]" />
      </div>
    </div>
  )
}
