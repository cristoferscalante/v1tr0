"use client"

import { ReactNode, FC, useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import LogoVitroSvg from "@/public/nav/svg/logo-vitro.svg"

interface NavLinkProps {
  href: string
  children: ReactNode
}

interface MobileNavLinkProps extends NavLinkProps {
  indent?: boolean
}

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
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4">
      <nav
        className={`bg-backgroundSecundary/85 backdrop-blur-xl max-w-[1400px] text-textPrimary rounded-full transition-all duration-300 ease-in-out ${
          scrolled ? "shadow-lg shadow-primary/20" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-textPrimary font-bold text-xl">
                <Image
                  style={{ color: "#ffffff" }}
                  src={LogoVitroSvg || "/placeholder.svg"}
                  alt="Logo"
                  width={40}
                  height={40}
                />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
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
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 text-highlight hover:text-highlight/90 focus:outline-none transition-colors hover:glow-effect"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-secondary rounded-b-2xl">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <MobileNavLink href="/">Home</MobileNavLink>
              <MobileNavLink href="/about">Sobre Nosotros</MobileNavLink>
              <MobileNavLink href="/blog">Blog</MobileNavLink>
              <MobileNavLink href="/services/dev" indent>
                Desarrollo
              </MobileNavLink>
              <MobileNavLink href="/services/pm" indent>
                Gestión de Proyectos
              </MobileNavLink>
              <MobileNavLink href="/services/data" indent>
                Análisis de Datos
              </MobileNavLink>
              <button className="w-full text-left bg-accent hover:bg-danger text-textPrimary px-3 py-2 rounded-md text-base font-medium mt-4 transition-colors">
                Login
              </button>
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}

// NavLink
const NavLink: FC<NavLinkProps> = ({ href, children }) => {
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
const SubNavLink: FC<NavLinkProps> = ({ href, children }) => {
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
const MobileNavLink: FC<MobileNavLinkProps> = ({ href, children, indent = false }) => {
  return (
    <Link
      href={href}
      className={`block text-highlight hover:text-highlight/90 px-3 py-2 text-base font-medium transition-all duration-300 hover:glow-effect ${
        indent ? "pl-6" : ""
      }`}
    >
      {children}
    </Link>
  )
}



