"use client"

import { type ReactNode, type FC, useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, LogIn } from "lucide-react"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "@/components/theme-provider"

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
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4">
      <nav
        className={`bg-backgroundSecondary/85 backdrop-blur-xl max-w-[1400px] text-textPrimary rounded-full transition-all duration-300 ease-in-out`}
      >
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
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
                  src="/v1tr0-logo.svg" 
                  alt="V1TR0 Logo" 
                  width={scrolled ? 44 : 58} 
                  height={scrolled ? 44 : 58} 
                  className={`${scrolled ? 'h-11' : 'h-16'} w-auto filter brightness-110 hover:brightness-125 transition-all duration-300`} 
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
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-backgroundSecondary ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      <SubNavLink href="/services/dev">Desarrollo</SubNavLink>
                      <SubNavLink href="/services/pm">Gestión de Proyectos</SubNavLink>
                      <SubNavLink href="/services/data">Análisis de Datos</SubNavLink>
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme Toggle Button and Login Button */}
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
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu - Overlay que cubre toda la pantalla */}
      {isOpen && (
        <div className="fixed inset-0 w-full h-full bg-background/95 backdrop-blur-md z-[100] overflow-y-auto md:hidden">
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
                Home
              </MobileNavLink>
              <MobileNavLink href="/about" onClick={() => setIsOpen(false)}>
                Sobre Nosotros
              </MobileNavLink>
              <MobileNavLink href="/blog" onClick={() => setIsOpen(false)}>
                Blog
              </MobileNavLink>
              <div className="w-full max-w-xs border-t border-custom-2/20 pt-4 mt-4">
                <h3 className="text-[#f26a1b] font-bold text-base mb-3 text-center">Servicios</h3>
                <MobileNavLink href="/services/dev" onClick={() => setIsOpen(false)}>
                  Desarrollo
                </MobileNavLink>
                <MobileNavLink href="/services/pm" onClick={() => setIsOpen(false)}>
                  Gestión de Proyectos
                </MobileNavLink>
                <MobileNavLink href="/services/data" onClick={() => setIsOpen(false)}>
                  Análisis de Datos
                </MobileNavLink>
              </div>

              {/* Botón de inicio de sesión para móvil */}
              <div className="w-full max-w-xs border-t border-custom-2/20 pt-4 mt-4">
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white shadow-lg mx-auto w-fit"
                  style={{
                    background: "linear-gradient(135deg, rgba(242, 106, 27, 0.7), rgba(255, 140, 66, 0.7))",
                    boxShadow: "0 6px 15px rgba(242, 106, 27, 0.2)",
                  }}
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
    </div>
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
      className="block px-4 py-2 text-sm text-highlight hover:text-highlight/90 transition-all duration-300 hover:glow-effect"
    >
      {children}
    </Link>
  )
}

// MobileNavLink
const MobileNavLink: FC<{ href: string; children: ReactNode; indent?: boolean; onClick?: () => void }> = ({
  href,
  children,
  indent = false,
  onClick,
}) => {
  return (
    <Link
      href={href}
      className="block text-highlight hover:text-highlight/90 px-6 py-3 text-xl font-medium transition-all duration-300 hover:glow-effect text-center w-full max-w-xs"
      onClick={onClick}
    >
      {children}
    </Link>
  )
}
