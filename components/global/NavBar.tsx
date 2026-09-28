"use client"

import { type ReactNode, type FC, useState, useEffect } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { X, LogIn } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  // El overlay se monta en <body> con un portal: dentro de FloatingHeader (z-40)
  // quedaba atrapado en su stacking context y la barra de promo de la tienda
  // (z-60) y el carrito flotante (z-75) se dibujaban encima.
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
    <motion.nav
      // Al scrollear se separa del fondo con un filo fino, no con un halo
      className={`relative bg-backgroundSecondary/85 backdrop-blur-xl text-textPrimary rounded-full border transition-all duration-300 ease-in-out max-w-7xl mx-auto ${
        scrolled ? "border-white/[0.08]" : "border-transparent"
      }`}
    >
      <div
        className="px-4 sm:px-6 lg:px-10 relative mx-auto rounded-full"
      >
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6 lg:gap-10 h-16">
          {/* Logo/Brand - Columna izquierda */}
          <div className="flex-shrink-0">
            <Link href="/" prefetch={false} className="flex items-center">
              <Image 
                src="/imagenes/logos/v1tr0-logo.svg"
                alt="V1TR0 Logo" 
                width={scrolled ? 44 : 58}
                height={scrolled ? 44 : 58}
                className={`${scrolled ? 'h-11' : 'h-14'} w-auto filter brightness-110 hover:brightness-125 hover:scale-110 transition-all duration-300 ease-in-out cursor-pointer`} 
              />
            </Link>
          </div>

          {/* Desktop Menu - Columna central */}
          <nav className="hidden md:flex items-center justify-center">
            <div className="flex items-center gap-1 lg:gap-2">
              <NavLink href="/about">V1TR0</NavLink>
              <NavLink href="/tienda">Tienda</NavLink>
              <NavLink href="/blog">Blog</NavLink>
              <NavLink href="/servicios">Servicios</NavLink>
            </div>
          </nav>

          {/* Login Button (Desktop) & Mobile Menu Button - Columna derecha */}
          <div className="flex items-center justify-end gap-2">
            {/* Login Button - Desktop Only */}
            <Link
              href="/login"
              className="group hidden lg:flex items-center gap-2.5 rounded-full border border-white/15 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-white/80 whitespace-nowrap transition-colors duration-300 hover:border-white/35 hover:text-white focus:outline-none focus-visible:border-[#26FFDF]"
            >
              <LogIn className="h-3.5 w-3.5 text-[#26FFDF]" />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 text-[#26FFDF] hover:text-white focus:outline-none transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-6 w-6"
              >
                <line x1="4" x2="20" y1="6" y2="6" rx="2" ry="2"></line>
                <line x1="4" x2="20" y1="12" y2="12" rx="2" ry="2"></line>
                <line x1="4" x2="20" y1="18" y2="18" rx="2" ry="2"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>


    </motion.nav>
    
    {/* Mobile menu - Overlay mejorado con animaciones */}
    {isOpen && mounted && createPortal(
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 w-full h-full bg-gradient-to-br from-background via-background/98 to-[#02505920] backdrop-blur-xl z-[9999] overflow-y-auto md:hidden"
      >
        <div className="flex flex-col min-h-full">
          {/* Header del menú con logo y botón cerrar */}
          <div className="flex items-center justify-between p-6 border-b border-[#08A696]/20">
            <Link href="/" onClick={() => setIsOpen(false)}>
              <Image 
                src="/imagenes/logos/v1tr0-logo.svg"
                alt="V1TR0 Logo" 
                width={48}
                height={48}
                className="h-12 w-auto filter brightness-110 hover:brightness-125 transition-all duration-300" 
              />
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors duration-300 hover:border-white/35 hover:text-white focus:outline-none focus-visible:border-[#26FFDF]"
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Contenido del menú */}
          <div className="flex-grow px-6 py-8 space-y-2">
            {/* Enlaces principales */}
            <nav className="space-y-2">
              <MobileNavLink href="/" onClick={() => setIsOpen(false)}>
                Inicio
              </MobileNavLink>
              <MobileNavLink href="/about" onClick={() => setIsOpen(false)}>
                V1TR0
              </MobileNavLink>
              <MobileNavLink href="/tienda" onClick={() => setIsOpen(false)}>
                Tienda
              </MobileNavLink>
              <MobileNavLink href="/blog" onClick={() => setIsOpen(false)}>
                Blog
              </MobileNavLink>
            </nav>

            {/* Sección de Servicios */}
            <div className="pt-6">
              <div className="mb-3 px-4">
                <Link
                  href="/servicios"
                  onClick={() => setIsOpen(false)}
                  className="text-[#26FFDF] font-bold text-sm uppercase tracking-wider flex items-center gap-2"
                >
                  <div className="w-1 h-4 bg-[#08A696] rounded-full"></div>
                  Servicios
                </Link>
              </div>
              <nav className="space-y-2">
                <MobileNavLink
                  href="/contratar-software"
                  onClick={() => setIsOpen(false)}
                  isService
                >
                  Contratar software
                </MobileNavLink>
                <MobileNavLink
                  href="/hardware-iot"
                  onClick={() => setIsOpen(false)}
                  isService
                >
                  Hardware e IoT
                </MobileNavLink>
                <MobileNavLink 
                  href="/servicios-referentes/dev" 
                  onClick={() => setIsOpen(false)} 
                  isService
                >
                  Desarrollo de Software
                </MobileNavLink>
                <MobileNavLink 
                  href="/servicios-referentes/pm" 
                  onClick={() => setIsOpen(false)} 
                  isService
                >
                  Automatización de tareas
                </MobileNavLink>
                <MobileNavLink 
                  href="/servicios-referentes/new" 
                  onClick={() => setIsOpen(false)} 
                  isService
                >
                  Sistemas de Información
                </MobileNavLink>
              </nav>
            </div>
          </div>

          {/* Footer del menú con botón de login */}
          <div className="p-6 border-t border-[#08A696]/20 bg-gradient-to-t from-[#02505920] to-transparent">
            <Link
              href="/login"
              className="group flex w-full items-center gap-3 rounded-full border border-white/15 px-6 py-4 font-mono text-[11px] uppercase tracking-[0.22em] text-white/80 transition-colors duration-300 hover:border-white/35 hover:text-white focus:outline-none focus-visible:border-[#26FFDF]"
              onClick={() => setIsOpen(false)}
            >
              <LogIn className="h-4 w-4 text-[#26FFDF]" />
              <span>Iniciar sesión</span>
              <span aria-hidden="true" className="ml-auto transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </motion.div>,
      document.body
    )}
  </>
  )
}

// NavLink
const NavLink: FC<{ href: string; children: ReactNode }> = ({ href, children }) => {
  return (
    <Link
      href={href}
      prefetch={false}
      className="text-[#26FFDF] hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-300"
    >
      {children}
    </Link>
  )
}

// MobileNavLink - Componente rediseñado
const MobileNavLink: FC<{ href: string; children: ReactNode; onClick?: () => void; isService?: boolean }> = ({
  href,
  children,
  onClick,
  isService = false,
}) => {
  return (
    <Link
      href={href}
      prefetch={false}
      className={`
        group relative flex items-center gap-3 w-full px-4 py-3.5 rounded-xl 
        transition-all duration-300 overflow-hidden
        ${isService 
          ? "text-white/80 hover:text-white bg-transparent hover:bg-[#08A696]/10 pl-8" 
          : "text-[#26FFDF] hover:text-white bg-transparent hover:bg-[#08A696]/20 font-semibold"
        }
      `}
      {...(onClick && { onClick })}
    >
      {/* Indicador de hover */}
      <div className={`
        absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-gradient-to-b from-[#08A696] to-[#26FFDF] rounded-r-full
        transition-all duration-300 group-hover:h-3/4
      `}></div>
      
      {/* Icono de flecha para servicios */}
      {isService && (
        <svg 
          className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
      
      <span className={isService ? "text-sm" : "text-base"}>{children}</span>

    </Link>
  )
}
