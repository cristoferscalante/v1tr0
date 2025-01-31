'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import LogoVitroSvg from '@/public/nav/svg/logo-vitro.svg'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4">
      <nav className={`bg-[rgba(12,12,12,0.85)] backdrop-blur-xl max-w-[1400px] text-white rounded-full transition-all duration-300 ease-in-out ${scrolled ? 'shadow-lg' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-[#26FFDF] font-bold text-xl">
                <Image                
                  src={LogoVitroSvg}
                  alt="Logo"
                  width={40}
                  height={40}                
                />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                
                <Link
                  href="/about"
                  className="text-[#26FFDF] hover:text-[#08A696] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sobre V1TR0
                </Link>
                <Link
                  href="/blog"
                  className="text-[#26FFDF] hover:text-[#08A696] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Blog
                </Link>
                <div className="relative group">
                  <button className="text-[#26FFDF] hover:text-[#08A696] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Servicios
                  </button>
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-[#025159] ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      <Link
                        href="/services/dev"
                        className="block px-4 py-2 text-sm text-[#26FFDF] hover:bg-[#08A696] hover:text-white"
                      >
                        Desarrollo
                      </Link>
                      <Link
                        href="/services/pm"
                        className="block px-4 py-2 text-sm text-[#26FFDF] hover:bg-[#08A696] hover:text-white"
                      >
                        Gestión de Proyectos
                      </Link>
                      <Link
                        href="/services/data"
                        className="block px-4 py-2 text-sm text-[#26FFDF] hover:bg-[#08A696] hover:text-white"
                      >
                        Análisis de Datos
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Login Button */}
            <div className="hidden md:block ml-6" >
              <button className="bg-[#F26A1B] hover:bg-[#FF2C10] text-white px-4 py-2 rounded-full text-sm font-medium transition-colors transform hover:scale-105">
                Login
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-[#26FFDF] hover:text-[#08A696] focus:outline-none"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-[#025159] rounded-b-2xl">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block text-[#26FFDF] hover:bg-[#08A696] hover:text-white px-3 py-2 rounded-md text-base font-medium"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="block text-[#26FFDF] hover:bg-[#08A696] hover:text-white px-3 py-2 rounded-md text-base font-medium"
              >
                Sobre Nosotros
              </Link>
              <Link
                href="/blog"
                className="block text-[#26FFDF] hover:bg-[#08A696] hover:text-white px-3 py-2 rounded-md text-base font-medium"
              >
                Blog
              </Link>
              <Link
                href="/services/dev"
                className="block text-[#26FFDF] hover:bg-[#08A696] hover:text-white px-3 py-2 rounded-md text-base font-medium pl-6"
              >
                Desarrollo
              </Link>
              <Link
                href="/services/pm"
                className="block text-[#26FFDF] hover:bg-[#08A696] hover:text-white px-3 py-2 rounded-md text-base font-medium pl-6"
              >
                Gestión de Proyectos
              </Link>
              <Link
                href="/services/data"
                className="block text-[#26FFDF] hover:bg-[#08A696] hover:text-white px-3 py-2 rounded-md text-base font-medium pl-6"
              >
                Análisis de Datos
              </Link>
              <button className="w-full text-left bg-[#F26A1B] hover:bg-[#FF2C10] text-white px-3 py-2 rounded-md text-base font-medium mt-4">
                Login
              </button>
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}

