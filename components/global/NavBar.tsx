"use client"

import { type ReactNode, type FC, useState, useEffect } from "react"
import Link from "next/link"
import { X, LogIn } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

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
      className={`relative bg-backgroundSecondary/85 backdrop-blur-xl text-textPrimary rounded-full transition-all duration-300 ease-in-out max-w-7xl mx-auto`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div
        className="px-4 sm:px-6 lg:px-10 relative mx-auto"
        style={{
          borderRadius: "9999px",
          boxShadow: scrolled
            ? "0 4px 8px rgba(38, 255, 223, 0.20)"
            : "none",
        }}
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
              <div className="relative group">
                <button className="text-[#26FFDF] hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-300 whitespace-nowrap">
                  Servicios
                </button>
                <div className="absolute left-0 mt-2 w-56 bg-white/70 dark:bg-[#02505950] backdrop-blur-sm border border-[#08A696]/80 dark:border-[#08A696]/50 rounded-2xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="py-2">
                    <SubNavLink href="/servicios-referentes/dev">Desarrollo de Software</SubNavLink>
                    <SubNavLink href="/servicios-referentes/pm">Automatización de tareas</SubNavLink>
                    <SubNavLink href="/servicios-referentes/new">Sistemas de Información</SubNavLink>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Login Button (Desktop) & Mobile Menu Button - Columna derecha */}
          <div className="flex items-center justify-end gap-2">
            {/* Login Button - Desktop Only */}
            <Link
              href="/login"
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:border-[#08A696] hover:bg-[#02505950] text-[#26FFDF] hover:text-white shadow-md hover:shadow-lg hover:shadow-[#08A696]/10 whitespace-nowrap"
            >
              <LogIn className="w-4 h-4" />
              <span className="text-sm font-medium">Login</span>
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
    {isOpen && (
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
              className="p-2.5 rounded-xl bg-[#02505931] border border-[#08A696]/30 text-[#26FFDF] hover:text-white hover:border-[#08A696] hover:bg-[#02505950] focus:outline-none transition-all duration-300"
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
                <h3 className="text-[#26FFDF] font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                  <div className="w-1 h-4 bg-[#08A696] rounded-full"></div>
                  Servicios
                </h3>
              </div>
              <nav className="space-y-2">
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
            <div className="relative group inline-flex w-full">
              {/* Gradiente de fondo con blur */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08a6961e] to-[#26ffde23] rounded-2xl blur opacity-40 group-hover:opacity-60 transition-all duration-300" />
              
              {/* Botón principal */}
              <Link
                href="/login"
                className="relative flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl transition-all duration-300 group-hover:border-[#08A696] group-hover:bg-[#02505950] text-[#26FFDF] font-semibold shadow-lg group-hover:shadow-xl group-hover:shadow-[#08A696]/10 transform group-hover:scale-[1.02]"
                onClick={() => setIsOpen(false)}
              >
                <LogIn className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                <span className="transition-colors duration-300">Iniciar Sesión</span>
                <span className="ml-auto inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
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

// SubNavLink
const SubNavLink: FC<{ href: string; children: ReactNode }> = ({ href, children }) => {
  const baseClasses =
    "block px-4 py-3 text-sm transition-colors duration-300 rounded-xl mx-2 first:mt-0 last:mb-0"

  return (
    <Link
      href={href}
      prefetch={false}
      className={`${baseClasses} text-[#26FFDF] hover:text-white hover:bg-[#08A696]/20`}
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
      
      {/* Efecto de brillo en hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
    </Link>
  )
}
