"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import {
  GitHubIcon,
  LinkedInIcon,
  EmailIcon,
  ExpandLessIcon,
  CodeIcon,
  PaletteIcon,
  LightbulbIcon,
  TikTokIcon,
} from "@/lib/icons"
import Link from "next/link"

const socialLinks = [
  { icon: <GitHubIcon className="w-6 h-6" />, href: "https://github.com/v1tr0tech" },
  { icon: <LinkedInIcon className="w-6 h-6" />, href: "https://www.linkedin.com/in/v1tr0/" },
  { icon: <TikTokIcon className="w-6 h-6" />, href: "https://www.tiktok.com/@v1tr0_tech" },
  { icon: <EmailIcon className="w-6 h-6" />, href: "mailto:vtr.techh@gmail.com" },
]

const footerSections = [
  {
    id: 1,
    icon: <CodeIcon className="w-8 h-8" />,
    title: "Desarrollo",
    content: "Creamos soluciones digitales a medida para impulsar tu negocio al siguiente nivel.",
    color: "from-custom-3 to-custom-4",
  },
  {
    id: 2,
    icon: <PaletteIcon className="w-8 h-8" />,
    title: "Diseño",
    content: "Diseñamos experiencias visuales únicas que cautivan a tu audiencia.",
    color: "from-custom-2 to-custom-3",
  },
  {
    id: 3,
    icon: <LightbulbIcon className="w-8 h-8" />,
    title: "Innovación",
    content: "Exploramos nuevas tecnologías para mantenerte a la vanguardia del mercado.",
    color: "from-custom-1 to-custom-2",
  },
]

export default function FooterSection() {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className={`w-full h-full ${isDark ? "bg-[#02505931] backdrop-blur-sm" : "bg-[#e6f7f6] backdrop-blur-sm"} py-20 px-4 font-sans overflow-hidden relative flex items-center justify-center`}>
      <div className="max-w-7xl mx-auto relative w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 relative z-10"
        >
          <div className={`inline-block px-4 py-2 rounded-2xl ${isDark ? "bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20" : "bg-[#e6f7f6] backdrop-blur-sm border border-[#08A696]/30"} text-sm font-medium mb-4`}>
            <span className={`${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`}>
              V1TR0 Technologies
            </span>
          </div>
          <h2 className="text-4xl font-bold text-textPrimary mb-4">Impulsando tu Éxito Digital</h2>
          <p className="text-textMuted text-xl max-w-2xl mx-auto">
            Descubre cómo nuestros servicios pueden transformar tu presencia en línea
          </p>
          <div className={`w-24 h-1 ${isDark ? "bg-gradient-to-r from-[#08A696] to-[#26FFDF]" : "bg-gradient-to-r from-[#08A696] to-[#1e7d7d]"} mx-auto mt-8 rounded-full`}></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 mb-16">
          {footerSections.map((section, index) => (
            <motion.div
              key={section.id}
              layoutId={`section-${section.id}`}
              onClick={() => setExpandedId(expandedId === section.id ? null : section.id)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-2xl ${isDark ? "bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20" : "bg-[#e6f7f6] backdrop-blur-sm border border-[#08A696]/30"} transition-all duration-300 cursor-pointer group hover:border-[#08A696]`}
            >
              <div className="relative p-6 h-full flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-2xl ${isDark ? "bg-[#02505950] border border-[#08A696]/20" : "bg-[#c5ebe7] border border-[#08A696]/30"} group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`}>
                      {section.icon}
                    </div>
                  </div>
                  <h3 className={`text-2xl font-semibold ${isDark ? "text-[#26FFDF] group-hover:text-[#26FFDF]" : "text-[#08A696] group-hover:text-[#08A696]"} transition-colors duration-300`}>
                    {section.title}
                  </h3>
                </div>
                <p className="text-textMuted">{section.content}</p>
                <ExpandLessIcon
                  className={`w-6 h-6 ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"} mt-4 self-end transition-transform duration-300 ${expandedId === section.id ? "rotate-180" : ""}`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {expandedId && (
            <motion.div
              layoutId={`section-${expandedId}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setExpandedId(null)}
            >
              <motion.div
                className={`${isDark ? "bg-[#02505950] backdrop-blur-md border border-[#08A696]/20" : "bg-[#e6f7f6] backdrop-blur-md border border-[#08A696]/30"} rounded-2xl p-8 w-full max-w-2xl`}
                onClick={(e) => e.stopPropagation()}
              >
                {footerSections.find((section) => section.id === expandedId) && (
                  <div>
                    <div className="flex items-center gap-6 mb-6">
                      <div className={`p-4 rounded-2xl ${isDark ? "bg-[#02505950] border border-[#08A696]/20" : "bg-[#c5ebe7] border border-[#08A696]/30"}`}>
                        <div className={`${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`}>
                          {footerSections.find((section) => section.id === expandedId)?.icon}
                        </div>
                      </div>
                      <h3 className={`text-3xl font-bold ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`}>
                        {footerSections.find((section) => section.id === expandedId)?.title}
                      </h3>
                    </div>
                    <p className="text-textMuted text-lg mb-6">
                      {footerSections.find((section) => section.id === expandedId)?.content}
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col md:flex-row justify-between items-center gap-8 pt-8 mt-12"
        >
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-textMuted">&copy; {new Date().getFullYear()} V1TR0</p>
            <span className={`hidden md:block ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`}>•</span>
            <nav className="flex gap-4">
              <Link href="/terminos" className={`text-textMuted ${isDark ? "hover:text-[#26FFDF]" : "hover:text-[#08A696]"} transition-colors duration-300`}>
                Términos
              </Link>
              <Link href="/privacidad" className={`text-textMuted ${isDark ? "hover:text-[#26FFDF]" : "hover:text-[#08A696]"} transition-colors duration-300`}>
                Privacidad
              </Link>
              <Link href="/cookies" className={`text-textMuted ${isDark ? "hover:text-[#26FFDF]" : "hover:text-[#08A696]"} transition-colors duration-300`}>
                Cookies
              </Link>
            </nav>
          </div>
          <div className="flex gap-6">
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
                {link.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}