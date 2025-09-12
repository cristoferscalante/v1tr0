"use client"

import { type ReactNode, type FC, useState, useEffect } from "react"
import Link from "next/link"
import { X, LogIn } from "lucide-react"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "@/components/theme-provider"
import { motion } from "framer-motion"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === "dark"

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
      className={`relative bg-backgroundSecondary/85 backdrop-blur-xl text-textPrimary rounded-full transition-all duration-300 ease-in-out w-fit`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div
        className="px-4 sm:px-6 lg:px-8 relative w-fit mx-auto"
        style={{
          borderRadius: "9999px",
          boxShadow: scrolled
            ? isDark
              ? "0 4px 8px rgba(38, 255, 223, 0.20)"
              : "0 4px 8px rgba(0, 0, 0, 0.08)"
            : "none",
        }}
      >
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image 
                src={isDark ? "/imagenes/logos/v1tr0-logo.svg" : "/imagenes/logos/Imagotipo  modo claro5.svg"} 
                alt="V1TR0 Logo" 
                width={isDark ? (scrolled ? 44 : 58) : (scrolled ? 35 : 45)} 
                height={isDark ? (scrolled ? 44 : 58) : (scrolled ? 35 : 45)} 
                className={`${isDark ? (scrolled ? 'h-11' : 'h-16') : (scrolled ? 'h-9' : 'h-11')} w-auto filter brightness-110 hover:brightness-125 hover:scale-110 transition-all duration-300 ease-in-out cursor-pointer`} 
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:justify-between md:flex-1">
            <div className="ml-10 flex items-center space-x-4">
              <NavLink href="/about">V1TR0</NavLink>
              <NavLink href="/blog">Blog</NavLink>
              <div className="relative group">
                <button className="text-highlight hover:text-highlight/90 px-3 py-2 text-sm font-medium transition-all duration-300 hover:glow-effect">
                  Servicios
                </button>
                <div className="absolute left-0 mt-2 w-56 bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 hover:border-[#08A696] hover:bg-[#02505950] hover:shadow-xl hover:shadow-[#08A696]/10">
                  <div className="py-2">
                    <SubNavLink href="/services/dev">Desarrollo de Software</SubNavLink>
                <SubNavLink href="/services/pm">Automatización de tareas</SubNavLink>
                <SubNavLink href="/services/new">Sistemas de Información</SubNavLink>
                  </div>
                </div>
              </div>
            </div>

            {/* Theme Toggle Button */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile menu button and theme toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 text-highlight hover:text-highlight/90 focus:outline-none transition-colors hover:glow-effect"
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
              className="inline-flex items-center justify-center p-2 text-highlight hover:text-highlight/90 focus:outline-none transition-colors hover:glow-effect"
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
            <MobileNavLink href="/blog" onClick={() => setIsOpen(false)}>
              Blog
            </MobileNavLink>
            <div className="w-full max-w-xs border-t border-[#08A696]/20 pt-6 mt-6">
              <h3 className={`${isDark ? "text-[#26FFDF]" : "text-[#08A696]"} font-bold text-lg mb-4 text-center`}>Servicios</h3>
              <div className="space-y-3">
                <MobileNavLink href="/services/dev" onClick={() => setIsOpen(false)} isService>
                  Desarrollo de Software
                </MobileNavLink>
                <MobileNavLink href="/services/pm" onClick={() => setIsOpen(false)} isService>
                  Automatización de tareas
                </MobileNavLink>
                <MobileNavLink href="/services/new" onClick={() => setIsOpen(false)} isService>
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
      className="text-highlight hover:text-highlight/90 px-3 py-2 text-sm font-medium transition-all duration-300 hover:glow-effect"
    >
      {children}
    </Link>
  )
}

// SubNavLink
const SubNavLink: FC<{ href: string; children: ReactNode }> = ({ href, children }) => {
  return (
    <Link
      href={href}
      className="block px-4 py-3 text-sm text-[#26FFDF] hover:text-[#26FFDF]/90 transition-all duration-300 hover:bg-[#08A696]/10 rounded-xl mx-2 first:mt-0 last:mb-0"
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
  const { theme } = useTheme()
  const isDark = theme === "dark"
  
  return (
    <Link
      href={href}
      className={`block w-full text-center px-4 py-3 text-lg font-medium transition-all duration-300 rounded-xl ${isService ? "text-white hover:text-white/90 hover:bg-[#08A696]/10" : (isDark ? "text-[#26FFDF] hover:text-[#26FFDF]/90 hover:bg-[#08A696]/10" : "text-[#08A696] hover:text-[#08A696]/90 hover:bg-[#08A696]/10")} ${indent ? "ml-4" : ""}`}
      {...(onClick && { onClick })}
    >
      {children}
    </Link>
  )
}
