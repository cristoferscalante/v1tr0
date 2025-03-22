"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Github, Linkedin, Mail, ChevronUp, Code, Palette, Lightbulb } from "lucide-react"
import LogoTiktok from "@/public/home/svg/logo-tiktok.svg"
import Link from "next/link"
import Image from "next/image"



const socialLinks = [
  { icon: <Github className="w-6 h-6 text-custom-2" />, href: "https://github.com/v1tro-code" },
  { icon: <Linkedin className="w-6 h-6 text-custom-2" />, href: "https://www.linkedin.com/company/v1tr0/" },
  { icon: (
    <div className="relative w-6 h-6 text-custom-2">
      <Image 
        src={LogoTiktok}
        alt="TikTok"
        fill
        className="object-cover"
      />
    </div>
  ), href: "https://www.tiktok.com/@v1tr0_tech" },
  { icon: <Mail className="w-6 h-6 text-custom-2" />, href: "mailto:vtr.techh@gmail.com" },
]

const footerSections = [
  {
    id: 1,
    icon: <Code className="w-8 h-8" />,
    title: "Desarrollo",
    content: "Creamos soluciones digitales a medida para impulsar tu negocio al siguiente nivel.",
    color: "from-custom-3 to-custom-4",
  },
  {
    id: 2,
    icon: <Palette className="w-8 h-8" />,
    title: "Diseño",
    content: "Diseñamos experiencias visuales únicas que cautivan a tu audiencia.",
    color: "from-custom-2 to-custom-3",
  },
  {
    id: 3,
    icon: <Lightbulb className="w-8 h-8" />,
    title: "Innovación",
    content: "Exploramos nuevas tecnologías para mantenerte a la vanguardia del mercado.",
    color: "from-custom-1 to-custom-2",
  },
]

export default function ModernFooter() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  return (
    <footer className="bg-background py-20 px-4 font-alexandria overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 relative z-10"
        >
          <h2 className="text-4xl font-bold text-textPrimary mb-4">Impulsando tu Éxito Digital</h2>
          <p className="text-textMuted text-xl max-w-2xl mx-auto">
            Descubre cómo nuestros servicios pueden transformar tu presencia en línea
          </p>
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
              className="relative overflow-hidden rounded-2xl bg-custom-1 border border-custom-2 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
              />
              <div className="relative p-6 h-full flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-full bg-custom-2 text-highlight group-hover:scale-110 transition-transform duration-300">
                    {section.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-textPrimary group-hover:text-highlight transition-colors duration-300">
                    {section.title}
                  </h3>
                </div>
                <p className="text-textMuted">{section.content}</p>
                <ChevronUp
                  className={`w-6 h-6 text-highlight mt-4 self-end transition-transform duration-300 ${expandedId === section.id ? "rotate-180" : ""}`}
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
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
              onClick={() => setExpandedId(null)}
            >
              <motion.div
                className="bg-custom-1 rounded-3xl p-8 w-full max-w-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {footerSections.find((section) => section.id === expandedId) && (
                  <div>
                    <div className="flex items-center gap-6 mb-6">
                      <div className="p-4 rounded-2xl bg-custom-2 text-highlight">
                        {footerSections.find((section) => section.id === expandedId)?.icon}
                      </div>
                      <h3 className="text-3xl font-bold text-textPrimary">
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
          className="flex flex-col md:flex-row justify-between items-center gap-8 pt-8 border-t border-custom-2"
        >
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-textMuted">&copy; {new Date().getFullYear()} V1TR0</p>
            <nav className="flex gap-4">
              <Link href="/terminos" className="text-textMuted hover:text-highlight transition-colors duration-300">
                Términos
              </Link>
              <Link href="/privacidad" className="text-textMuted hover:text-highlight transition-colors duration-300">
                Privacidad
              </Link>
            </nav>
          </div>
          <div className="flex gap-4">
            {socialLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-textMuted hover:text-highlight transition-colors duration-300"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-custom-3 rounded-full filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-custom-4 rounded-full filter blur-3xl opacity-20 animate-pulse" />
      </div>
    </footer>
  )
}
