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
    
    {/* Mobile menu - Overlay independiente que cubre toda la pantalla */}
    {isOpen && (
      <div className="fixed inset-0 w-full h-full bg-background/95 backdrop-blur-md z-[9999] overflow-y-auto md:hidden">
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center p-2 text-[#26FFDF] hover:text-white focus:outline-none transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center flex-grow px-4 py-8 space-y-6">
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
            <div className="w-full max-w-xs border-t border-[#08A696]/20 pt-6 mt-6">
              <h3 className="text-[#26FFDF] font-bold text-lg mb-4 text-center">Servicios</h3>
              <div className="space-y-3">
                <MobileNavLink href="/servicios-referentes/dev" onClick={() => setIsOpen(false)} isService>
                  Desarrollo de Software
                </MobileNavLink>
                <MobileNavLink href="/servicios-referentes/pm" onClick={() => setIsOpen(false)} isService>
                  Automatización de tareas
                </MobileNavLink>
                <MobileNavLink href="/servicios-referentes/new" onClick={() => setIsOpen(false)} isService>
                  Sistemas de Información
                </MobileNavLink>
              </div>
            </div>
            <div className="pt-6">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl transition-all duration-300 transform scale-95 hover:scale-100 hover:border-[#08A696] hover:bg-[#02505950] text-white hover:text-white shadow-lg hover:shadow-xl hover:shadow-[#08A696]/10"
                onClick={() => setIsOpen(false)}
              >
                <LogIn className="w-5 h-5" />
                <span>Iniciar Sesión</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
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

// MobileNavLink
const MobileNavLink: FC<{ href: string; children: ReactNode; indent?: boolean; onClick?: () => void; isService?: boolean }> = ({
  href,
  children,
  indent = false,
  onClick,
  isService = false,
}) => {
  return (
    <Link
      href={href}
      prefetch={false}
      className={`block w-full text-center px-4 py-3 text-lg font-medium transition-all duration-300 rounded-xl ${isService ? "text-white hover:text-white/90 hover:bg-[#08A696]/10" : "text-[#26FFDF] hover:text-[#26FFDF]/90 hover:bg-[#08A696]/10"} ${indent ? "ml-4" : ""}`}
      {...(onClick && { onClick })}
    >
      {children}
    </Link>
  )
}
