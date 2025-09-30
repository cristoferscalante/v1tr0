"use client"

import { forwardRef, useRef } from "react"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { CodeIcon, PaletteIcon, LightbulbIcon, GitHubIcon } from "@/lib/icons"
import Link from "next/link"
import useSnapAnimations from '@/hooks/use-snap-animations'

import {
  LinkedInIcon,
  EmailIcon,
  TikTokIcon,
// ...existing code...
} from "@/lib/icons"

const socialLinks = [
  { icon: <GitHubIcon className="w-6 h-6" />, href: "https://github.com/v1tr0tech" },
  { icon: <LinkedInIcon className="w-6 h-6" />, href: "https://www.linkedin.com/company/v1tr0/?viewAsMember=true" },
  { icon: <TikTokIcon className="w-6 h-6" />, href: "https://www.tiktok.com/@v1tr0_tech" },
  { icon: <EmailIcon className="w-6 h-6" />, href: "mailto:vtr.techh@gmail.com" },
]

const footerSections = [
  {
    id: 1,
    icon: <CodeIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Desarrollo",
    content: "Creamos soluciones basadas en codigo para darle vida a infraestructuras digitales de vanguardia.",
    color: "from-custom-3 to-custom-4",
  },
  {
    id: 2,
    icon: <PaletteIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Diseño",
    content: "Diseñamos experiencias visuales que renuevan la experiencia de usuario, para optimizar la navegación & la gestión.",
    color: "from-custom-2 to-custom-3",
  },
  {
    id: 3,
    icon: <LightbulbIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Innovación",
    content: "Implementamos tecnologias de vanguardia para automatizar procesos & mejorar la eficiencia.",
    color: "from-custom-1 to-custom-2",
  },
]

interface FooterSectionProps {
  className?: string;
}

const FooterSection = forwardRef<HTMLDivElement, FooterSectionProps>(() => {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const sectionRef = useRef<HTMLDivElement>(null)
  
  // Configurar animaciones de entrada para esta sección
  useSnapAnimations({
    sections: ['.footer-section'],
    duration: 0.8,
    enableCircularNavigation: false,
    singleAnimation: true,
    onSnapComplete: () => {
      // Footer animation completed
    }
  })

  return (
    <footer
      ref={sectionRef}
      role="contentinfo"
  className={`footer-section w-full min-h-screen ${isDark ? "bg-[#02505931] backdrop-blur-sm" : "bg-[#e6f7f6] backdrop-blur-sm"} pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 font-sans relative flex items-center justify-center`}
      aria-label="Pie de página V1TR0"
    >
  <div className="max-w-7xl mx-auto w-full">
        <div className="footer-header animate-element text-center mb-8 sm:mb-12 md:mb-16 relative z-10 px-2">
          <div className={`inline-block px-3 sm:px-4 py-2 rounded-2xl ${isDark ? "bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20" : "bg-[#e6f7f6] backdrop-blur-sm border border-[#08A696]/60"} text-xs sm:text-sm font-semibold mb-3 sm:mb-4`}>
            <span className={`${isDark ? "text-[#26FFDF]" : "text-[#04423c]"}`}>
              V1TR0 Technologies
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-[#04423c] dark:text-[#26FFDF]">Impulsando tu Éxito Digital</h2>
          <div className={`w-16 sm:w-20 md:w-24 h-1 ${isDark ? "bg-gradient-to-r from-[#08A696] to-[#26FFDF]" : "bg-gradient-to-r from-[#08A696] to-[#1e7d7d]"} mx-auto mt-6 sm:mt-8 rounded-full`}></div>
        </div>

        <div className="footer-sections animate-element grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 relative z-10 mb-8 sm:mb-12 md:mb-16 px-2 sm:px-0">
          {footerSections.map((section) => (
            <div
              key={section.id}
              className={`overflow-hidden rounded-2xl ${isDark ? "bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20" : "bg-[#e6f7f6] backdrop-blur-sm border border-[#08A696]/60"} transition-all duration-300 group hover:border-[#08A696] hover:shadow-lg`}
            >
              <div className="p-3 sm:p-4 md:p-5 h-full flex flex-col min-h-[180px]">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className={`p-1.5 sm:p-2 rounded-xl ${isDark ? "bg-[#02505950] border border-[#08A696]/20" : "bg-[#c5ebe7] border border-[#08A696]/40"} group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`${isDark ? "text-[#26FFDF]" : "text-[#085c54]"}`}>
                      {section.icon}
                    </div>
                  </div>
                  <h3 className={`text-base sm:text-lg md:text-xl font-semibold ${isDark ? "text-[#26FFDF] group-hover:text-[#26FFDF]" : "text-[#085c54] group-hover:text-[#04423c]"} transition-colors duration-300`}>
                    {section.title}
                  </h3>
                </div>
                <p className="text-[#04423c] dark:text-[#b2fff6] text-xs sm:text-sm opacity-90 font-medium">{section.content}</p>
              </div>
            </div>
          ))}
        </div>

  <div className="footer-bottom animate-element flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8 pt-6 sm:pt-8 mt-4 sm:mt-6 px-2 sm:px-0 w-full">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left flex-shrink-0">
            <p className="text-[#04423c] dark:text-[#b2fff6] text-sm sm:text-base font-medium">&copy; {new Date().getFullYear()} V1TR0</p>
            <span className={`hidden sm:block ${isDark ? "text-[#26FFDF]" : "text-[#085c54]"}`}>•</span>
            <nav className="flex gap-3 sm:gap-4" aria-label="Navegación legal">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08a6961e] to-[#26ffde23] dark:from-[#08a6961e] dark:to-[#26ffde23] rounded-xl blur opacity-0 group-hover:opacity-40 transition-all duration-300" />
                <Link href="/terminos" prefetch={false} className={`relative px-3 py-2 text-sm sm:text-base bg-white/70 dark:bg-[#08A696]/20 backdrop-blur-sm border border-[#08A696]/80 dark:border-[#08A696]/50 rounded-xl text-[#085c54] dark:text-[#26FFDF] font-semibold transition-all duration-300 hover:border-[#08A696] dark:hover:border-[#26FFDF] hover:bg-[#08A696]/10 dark:hover:bg-[#08A696]/30 hover:shadow-md hover:shadow-[#08A696]/20 dark:hover:shadow-[#26FFDF]/20 transform hover:scale-105 block`}>
                  Términos
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08a6961e] to-[#26ffde23] dark:from-[#08a6961e] dark:to-[#26ffde23] rounded-xl blur opacity-0 group-hover:opacity-40 transition-all duration-300" />
                <Link href="/privacidad" prefetch={false} className={`relative px-3 py-2 text-sm sm:text-base bg-white/70 dark:bg-[#08A696]/20 backdrop-blur-sm border border-[#08A696]/80 dark:border-[#08A696]/50 rounded-xl text-[#085c54] dark:text-[#26FFDF] font-semibold transition-all duration-300 hover:border-[#08A696] dark:hover:border-[#26FFDF] hover:bg-[#08A696]/10 dark:hover:bg-[#08A696]/30 hover:shadow-md hover:shadow-[#08A696]/20 dark:hover:shadow-[#26FFDF]/20 transform hover:scale-105 block`}>
                  Privacidad
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08a6961e] to-[#26ffde23] dark:from-[#08a6961e] dark:to-[#26ffde23] rounded-xl blur opacity-0 group-hover:opacity-40 transition-all duration-300" />
                <Link href="/cookies" prefetch={false} className={`relative px-3 py-2 text-sm sm:text-base bg-white/70 dark:bg-[#08A696]/20 backdrop-blur-sm border border-[#08A696]/80 dark:border-[#08A696]/50 rounded-xl text-[#085c54] dark:text-[#26FFDF] font-semibold transition-all duration-300 hover:border-[#08A696] dark:hover:border-[#26FFDF] hover:bg-[#08A696]/10 dark:hover:bg-[#08A696]/30 hover:shadow-md hover:shadow-[#08A696]/20 dark:hover:shadow-[#26FFDF]/20 transform hover:scale-105 block`}>
                  Cookies
                </Link>
              </div>
            </nav>
          </div>
          <div className="flex gap-4 sm:gap-6" aria-label="Redes sociales">
            {socialLinks.map((link, index) => (
              <div key={index} className="relative group">
                {/* Gradiente de fondo con blur - similar al botón de login */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08a6961e] to-[#26ffde23] dark:from-[#08a6961e] dark:to-[#26ffde23] rounded-2xl blur opacity-0 group-hover:opacity-40 transition-all duration-300" />
                <motion.a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={
                    link.href.includes('github') ? 'GitHub V1TR0' :
                    link.href.includes('linkedin') ? 'LinkedIn V1TR0' :
                    link.href.includes('tiktok') ? 'TikTok V1TR0' :
                    link.href.includes('mailto') ? 'Enviar correo a V1TR0' :
                    'Red social V1TR0'
                  }
                  className={`relative flex items-center justify-center p-3 bg-white/70 dark:bg-[#08A696]/20 backdrop-blur-sm border border-[#08A696]/80 dark:border-[#08A696]/50 rounded-2xl text-[#085c54] dark:text-[#26FFDF] transition-all duration-300 hover:border-[#08A696] dark:hover:border-[#26FFDF] hover:bg-[#08A696]/10 dark:hover:bg-[#08A696]/30 hover:shadow-lg hover:shadow-[#08A696]/20 dark:hover:shadow-[#26FFDF]/20 transform hover:scale-110`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6">
                    {link.icon}
                  </div>
                </motion.a>
              </div>
            ))}
          </div>
        </div>
      </div>
  </footer>
  )
})

FooterSection.displayName = "FooterSection"

export default FooterSection