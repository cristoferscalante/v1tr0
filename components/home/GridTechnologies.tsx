"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Code2, Database, Server, Smartphone, Terminal } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export default function ModernTechnologiesSection() {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const technologies = [
    {
      id: 1,
      icon: <Code2 className="w-8 h-8" />,
      name: "Frontend",
      description: "Interfaces modernas y responsivas",
      techs: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      color: "from-custom-3 to-custom-4",
    },
    {
      id: 2,
      icon: <Server className="w-8 h-8" />,
      name: "Backend",
      description: "Arquitecturas robustas",
      techs: ["Node.js", "Python"],
      color: "from-custom-2 to-custom-3",
    },
    {
      id: 3,
      icon: <Database className="w-8 h-8" />,
      name: "Bases de Datos",
      description: "Gestión eficiente de datos",
      techs: ["PostgreSQL", "MongoDB", "AWS", "Cloudflare"],
      color: "from-custom-1 to-custom-2",
    },
    {
      id: 4,
      icon: <Terminal className="w-8 h-8" />,
      name: "DevOps",
      description: "Automatización y despliegue continuo",
      techs: ["Docker", "AWS", "CI/CD", "Git"],
      color: "from-custom-2 to-custom-4",
    },
    {
      id: 5,
      icon: <Smartphone className="w-8 h-8" />,
      name: "Mobile",
      description: "Apps nativas y multiplataforma",
      techs: ["React Native", "iOS", "Android"],
      color: "from-custom-3 to-accent",
    },
    {
      id: 6,
      icon: <Smartphone className="w-8 h-8" />,
      name: "Ciencia de Datos",
      description: "Visualización y análisis de datos avanzado",
      techs: ["Next.js", "Python", "R", "Tableau", "Power BI"],
      color: "from-custom-3 to-accent",
    },
  ]

  return (
    <section className="w-[100hv] bg-custom-1/20 dark:bg-custom-1/80 py-20 px-4 font-sans overflow-hidden relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-15 dark:opacity-20"></div>
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 relative z-10"
        >
          <h2 className="text-5xl font-bold text-textPrimary mb-4">Nuestras Tecnologías</h2>
          <p className="text-textMuted text-xl max-w-2xl mx-auto">
            Dominamos las herramientas más potentes para crear soluciones digitales excepcionales
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.id}
              layoutId={`tech-${tech.id}`}
              onClick={() => setSelectedId(tech.id)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative overflow-hidden cursor-pointer group"
            >
              {/* Gradiente de fondo con blur - igual que CardBanner */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${isDark ? "from-[#08a6961e] to-[#26ffde23]" : "from-[#08a69630] to-[#08a69620]"} rounded-2xl blur opacity-30 group-hover:opacity-60 transition-all duration-300`} />
              
              {/* Card principal con backdrop blur */}
              <div className={`relative ${isDark ? "bg-[#02505931] backdrop-blur-sm" : "bg-[#e6f7f6] backdrop-blur-sm"} rounded-2xl border ${isDark ? "border-[#08A696]/20" : "border-[#08A696]/30"} shadow-lg group-hover:shadow-xl group-hover:shadow-[#08A696]/10 transition-all duration-300 transform scale-95 group-hover:scale-100 group-hover:border-[#08A696] ${isDark ? "group-hover:bg-[#02505950]" : "group-hover:bg-[#c5ebe7]"} h-full`}>
                
                {/* Gradiente de overlay para mantener compatibilidad con el diseño original */}
                {isDark && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl`}
                  />
                )}
                
                <div className="relative p-6 h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-xl ${isDark ? "bg-[#08A696]/10" : "bg-[#08A696]/5"} group-hover:bg-[#08A696]/20 transition-all duration-300 group-hover:scale-110`}>
                      <div className={`${isDark ? "text-[#26FFDF]" : "text-[#08A696]"} transition-transform duration-300 group-hover:rotate-3`}>
                        {tech.icon}
                      </div>
                    </div>
                    <h3 className={`text-2xl font-semibold transition-colors duration-300 ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`}>
                      {tech.name}
                    </h3>
                  </div>
                  <p className="text-textMuted mb-4 flex-grow">{tech.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {tech.techs.map((t) => (
                      <span 
                        key={t} 
                        className={`px-3 py-1 text-xs rounded-xl transition-all duration-300 ${isDark ? "text-[#26FFDF] bg-[#08A696]/10 group-hover:bg-[#08A696]/20" : "text-[#08A696] bg-[#08A696]/10 group-hover:bg-[#08A696]/20"}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedId && (
            <motion.div
              layoutId={`tech-${selectedId}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
              onClick={() => setSelectedId(null)}
            >
              <motion.div
                className="relative w-full max-w-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Gradiente de fondo con blur */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${isDark ? "from-[#08a6961e] to-[#26ffde23]" : "from-[#08a69630] to-[#08a69620]"} rounded-2xl blur opacity-60`} />
                
                {/* Modal principal */}
                <div className={`relative ${isDark ? "bg-[#02505950] backdrop-blur-md" : "bg-[#e6f7f6] backdrop-blur-md"} rounded-2xl border ${isDark ? "border-[#08A696]/30" : "border-[#08A696]/40"} shadow-2xl shadow-[#08A696]/20 p-8`}>
                  {technologies.find((tech) => tech.id === selectedId) && (
                    <div>
                      <div className="flex items-center gap-6 mb-6">
                        <div className={`p-4 rounded-2xl ${isDark ? "bg-[#08A696]/10" : "bg-[#08A696]/10"} transition-all duration-300`}>
                          <div className={`${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`}>
                            {technologies.find((tech) => tech.id === selectedId)?.icon}
                          </div>
                        </div>
                        <h3 className={`text-3xl font-bold ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`}>
                          {technologies.find((tech) => tech.id === selectedId)?.name}
                        </h3>
                      </div>
                      <p className="text-textMuted text-lg mb-6">
                        {technologies.find((tech) => tech.id === selectedId)?.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        {technologies
                          .find((tech) => tech.id === selectedId)
                          ?.techs.map((t) => (
                            <div
                              key={t}
                              className={`px-4 py-2 text-sm rounded-xl text-center transition-all duration-300 ${isDark ? "text-[#26FFDF] bg-[#08A696]/10 hover:bg-[#08A696]/20" : "text-[#08A696] bg-[#08A696]/10 hover:bg-[#08A696]/20"}`}
                            >
                              {t}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-custom-3 rounded-full filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-custom-4 rounded-full filter blur-3xl opacity-20 animate-pulse" />
      </div>
    </section>
  )
}
