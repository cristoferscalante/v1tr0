"use client"

import { forwardRef, useRef } from "react"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import {
  GitHubIcon,
  LinkedInIcon,
  EmailIcon,
  CodeIcon,
  PaletteIcon,
  LightbulbIcon,
  TikTokIcon,
} from "@/lib/icons"
import Link from "next/link"
import useSnapAnimations from '@/hooks/use-snap-animations'

const socialLinks = [
  { icon: <GitHubIcon className="w-6 h-6" />, href: "https://github.com/v1tr0tech" },
  { icon: <LinkedInIcon className="w-6 h-6" />, href: "https://www.linkedin.com/in/v1tr0/" },
  { icon: <TikTokIcon className="w-6 h-6" />, href: "https://www.tiktok.com/@v1tr0_tech" },
  { icon: <EmailIcon className="w-6 h-6" />, href: "mailto:vtr.techh@gmail.com" },
]

const footerSections = [
  {
    id: 1,
    icon: <CodeIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Desarrollo",
    content: "Creamos soluciones digitales a medida para impulsar tu negocio al siguiente nivel.",
    color: "from-custom-3 to-custom-4",
  },
  {
    id: 2,
    icon: <PaletteIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Diseño",
    content: "Diseñamos experiencias visuales únicas que cautivan a tu audiencia.",
    color: "from-custom-2 to-custom-3",
  },
  {
    id: 3,
    icon: <LightbulbIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Innovación",
    content: "Exploramos nuevas tecnologías para mantenerte a la vanguardia del mercado.",
    color: "from-custom-1 to-custom-2",
  },
]

interface FooterSectionProps {
  className?: string;
}

const FooterSection = forwardRef<HTMLDivElement, FooterSectionProps>((_, _ref) => {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const sectionRef = useRef<HTMLDivElement>(null)
  
  // Configurar animaciones de entrada para esta sección
  useSnapAnimations({
    sections: [sectionRef],
    duration: 0.8,
    enableCircularNavigation: false,
    singleAnimation: true,
    onSnapComplete: (index) => {
      console.log('Footer animation completed for section:', index);
    }
  })

  return (
    <div 
      ref={sectionRef}
      className={`w-full min-h-screen ${isDark ? "bg-[#02505931] backdrop-blur-sm" : "bg-[#e6f7f6] backdrop-blur-sm"} pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 font-sans overflow-hidden relative flex items-center justify-center`}
    >
      <div className="max-w-7xl mx-auto relative w-full">
        <div className="footer-header animate-element text-center mb-8 sm:mb-12 md:mb-16 relative z-10 px-2">
          <div className={`inline-block px-3 sm:px-4 py-2 rounded-2xl ${isDark ? "bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20" : "bg-[#e6f7f6] backdrop-blur-sm border border-[#08A696]/30"} text-xs sm:text-sm font-medium mb-3 sm:mb-4`}>
            <span className={`${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`}>
              V1TR0 Technologies
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-textPrimary mb-3 sm:mb-4">Impulsando tu Éxito Digital</h2>
          <div className={`w-16 sm:w-20 md:w-24 h-1 ${isDark ? "bg-gradient-to-r from-[#08A696] to-[#26FFDF]" : "bg-gradient-to-r from-[#08A696] to-[#1e7d7d]"} mx-auto mt-6 sm:mt-8 rounded-full`}></div>
        </div>

        <div className="footer-sections animate-element grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 relative z-10 mb-8 sm:mb-12 md:mb-16 px-2 sm:px-0">
          {footerSections.map((section) => (
            <div
              key={section.id}
              className={`relative overflow-hidden rounded-2xl ${isDark ? "bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20" : "bg-[#e6f7f6] backdrop-blur-sm border border-[#08A696]/30"} transition-all duration-300 group hover:border-[#08A696] hover:shadow-lg`}
            >
              <div className="relative p-3 sm:p-4 md:p-5 h-full flex flex-col">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className={`p-1.5 sm:p-2 rounded-xl ${isDark ? "bg-[#02505950] border border-[#08A696]/20" : "bg-[#c5ebe7] border border-[#08A696]/30"} group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`}>
                      {section.icon}
                    </div>
                  </div>
                  <h3 className={`text-base sm:text-lg md:text-xl font-semibold ${isDark ? "text-[#26FFDF] group-hover:text-[#26FFDF]" : "text-[#08A696] group-hover:text-[#08A696]"} transition-colors duration-300`}>
                    {section.title}
                  </h3>
                </div>
                <p className="text-textMuted text-xs sm:text-sm">{section.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="footer-bottom animate-element flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8 pt-6 sm:pt-8 mt-4 sm:mt-6 px-2 sm:px-0">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
            <p className="text-textMuted text-sm sm:text-base">&copy; {new Date().getFullYear()} V1TR0</p>
            <span className={`hidden sm:block ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`}>•</span>
            <nav className="flex gap-3 sm:gap-4">
              <Link href="/terminos" prefetch={false} className={`text-textMuted text-sm sm:text-base ${isDark ? "hover:text-[#26FFDF]" : "hover:text-[#08A696]"} transition-colors duration-300`}>
                Términos
              </Link>
              <Link href="/privacidad" prefetch={false} className={`text-textMuted text-sm sm:text-base ${isDark ? "hover:text-[#26FFDF]" : "hover:text-[#08A696]"} transition-colors duration-300`}>
                Privacidad
              </Link>
              <Link href="/cookies" prefetch={false} className={`text-textMuted text-sm sm:text-base ${isDark ? "hover:text-[#26FFDF]" : "hover:text-[#08A696]"} transition-colors duration-300`}>
                Cookies
              </Link>
            </nav>
          </div>
          <div className="flex gap-4 sm:gap-6">
            {socialLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors duration-300 p-2 rounded-2xl ${isDark ? "hover:bg-[#02505950] text-[#26FFDF] hover:text-[#26FFDF]" : "hover:bg-[#c5ebe7] text-[#08A696] hover:text-[#08A696]"}`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6">
                  {link.icon}
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
})

FooterSection.displayName = "FooterSection"

export default FooterSection