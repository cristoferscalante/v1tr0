"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  LayoutGrid,
  BarChart3,
  Cpu,
  ShoppingCart,
  FileText,
  Globe,
  Smartphone,
  BarChart as BarChartIcon,
  Database,
  TrendingUp,
  Brain,
  Bot,
  Workflow,
  Link as LinkIcon,
  Settings,
  ChevronDown,
  Check,
  Sparkles,
} from "lucide-react"
import { AnimatedIcon, type IconKind } from "@/components/home/sections/AnimatedIcon"

interface Leaf {
  id: string
  label: string
  icon: typeof ShoppingCart
  kind: IconKind
}

interface Category {
  id: string
  label: string
  icon: typeof ShoppingCart
  kind: IconKind
  children: Leaf[]
}

// Mismo catálogo de servicios que ofrece el home (ver ServicesTabSection),
// para que "qué tipo de proyecto necesitas" hable el mismo idioma que la
// página de Servicios en vez de una taxonomía inventada aparte.
const categories: Category[] = [
  {
    id: "desarrollo",
    label: "Software",
    icon: LayoutGrid,
    kind: "grid-ripple",
    children: [
      { id: "ecommerce", label: "E-Commerce", icon: ShoppingCart, kind: "cart-bounce" },
      { id: "landing", label: "Landing Pages", icon: FileText, kind: "type-blink" },
      { id: "webapp", label: "Web Apps", icon: Globe, kind: "globe-spin" },
      { id: "mobile", label: "Apps Móviles", icon: Smartphone, kind: "phone-tilt" },
    ],
  },
  {
    id: "sistemas",
    label: "Análisis de Datos",
    icon: BarChart3,
    kind: "bar-grow",
    children: [
      { id: "dashboards", label: "Dashboards", icon: BarChartIcon, kind: "bar-grow" },
      { id: "datamanagement", label: "Gestión de Datos", icon: Database, kind: "db-sync" },
      { id: "analytics", label: "Análisis", icon: TrendingUp, kind: "trend-rise" },
      { id: "bi", label: "Business Intelligence", icon: Brain, kind: "brain-think" },
    ],
  },
  {
    id: "automatizacion",
    label: "Automatización",
    icon: Cpu,
    kind: "chip-pulse",
    children: [
      { id: "bots", label: "Bots & IA", icon: Bot, kind: "bot-idle" },
      { id: "workflows", label: "Workflows", icon: Workflow, kind: "workflow-cycle" },
      { id: "integrations", label: "Integraciones", icon: LinkIcon, kind: "link-connect" },
      { id: "optimization", label: "Optimización", icon: Settings, kind: "gear-spin" },
    ],
  },
]

const otherOption: Leaf = { id: "other", label: "Otro", icon: Sparkles, kind: "trend-rise" }

export default function ProjectTypeTree({
  value,
  onChange,
}: {
  value: string | undefined
  onChange: (value: string) => void
}) {
  const initialExpanded = categories.find(
    (c) => c.label === value || c.children.some((leaf) => leaf.label === value),
  )?.id
  const [expandedId, setExpandedId] = useState<string | null>(initialExpanded ?? null)

  return (
    <div className="relative pl-1 max-h-[320px] overflow-y-auto pr-1">
      <div
        className="absolute left-[19px] top-3 bottom-3 w-px bg-gradient-to-b from-[#08A696]/50 via-[#08A696]/20 to-transparent"
        aria-hidden
      />
      <div className="space-y-1">
        {categories.map((category) => {
          const hasChildren = category.children.length > 0
          const isSelected = value === category.label
          const isExpanded = expandedId === category.id

          return (
            <div key={category.id}>
              <div className="relative flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onChange(category.label)}
                  className="relative flex items-center gap-3 flex-1 py-1.5 text-left group/node"
                >
                  <span
                    className={`relative shrink-0 flex items-center justify-center w-9 h-9 rounded-full border backdrop-blur-md transition-all duration-300 ${
                      isSelected
                        ? "bg-[#0d5d5d]/70 border-[#26FFDF]/70 shadow-[0_0_14px_-2px_rgba(38,255,223,0.55)]"
                        : "bg-black/30 border-[#26FFDF]/20 group-hover/node:border-[#26FFDF]/50"
                    }`}
                  >
                    {isSelected ? (
                      <Check className="w-4 h-4 text-[#26FFDF]" />
                    ) : (
                      <AnimatedIcon kind={category.kind} icon={category.icon} active={isExpanded} size={16} className="text-[#b2fff6]/80 group-hover/node:text-[#26FFDF]/80" />
                    )}
                  </span>
                  <span className={`text-sm font-medium ${isSelected ? "text-[#26FFDF]" : "text-[#e6f7f6]"}`}>
                    {category.label}
                  </span>
                </button>

                {hasChildren && (
                  <button
                    type="button"
                    onClick={() => setExpandedId((prev) => (prev === category.id ? null : category.id))}
                    aria-label={isExpanded ? `Ocultar opciones de ${category.label}` : `Ver opciones de ${category.label}`}
                    className="shrink-0 p-2 text-[#08A696]/70 hover:text-[#26FFDF] transition-colors"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                )}
              </div>

              <AnimatePresence initial={false}>
                {hasChildren && isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="ml-4 pl-5 border-l-2 border-[#08A696]/20 py-1 space-y-0.5">
                      {category.children.map((leaf) => {
                        const isLeafSelected = value === leaf.label
                        return (
                          <button
                            key={leaf.id}
                            type="button"
                            onClick={() => onChange(leaf.label)}
                            className="relative flex items-center gap-2.5 w-full py-1.5 pl-2 pr-2 -ml-[1px] rounded-lg text-left group/leaf"
                          >
                            <span className="absolute -left-5 top-1/2 -translate-y-1/2 w-4 h-px bg-[#08A696]/25" />
                            <span
                              className={`shrink-0 flex items-center justify-center w-6 h-6 rounded-full border backdrop-blur-md transition-colors duration-200 ${
                                isLeafSelected
                                  ? "bg-[#0d5d5d]/70 border-[#26FFDF]/70 text-[#26FFDF]"
                                  : "bg-black/30 border-[#26FFDF]/15 text-[#b2fff6]/70 group-hover/leaf:border-[#26FFDF]/50 group-hover/leaf:text-[#26FFDF]"
                              }`}
                            >
                              {isLeafSelected ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <AnimatedIcon kind={leaf.kind} icon={leaf.icon} active size={12} />
                              )}
                            </span>
                            <span className={`text-sm ${isLeafSelected ? "text-[#26FFDF] font-medium" : "text-[#e6f7f6]/85"}`}>
                              {leaf.label}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}

        {/* Comodín para lo que no encaje en el catálogo de servicios */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => onChange(otherOption.label)}
            className="relative flex items-center gap-3 w-full py-1.5 text-left group/node"
          >
            <span
              className={`relative shrink-0 flex items-center justify-center w-9 h-9 rounded-full border backdrop-blur-md transition-all duration-300 ${
                value === otherOption.label
                  ? "bg-[#0d5d5d]/70 border-[#26FFDF]/70 shadow-[0_0_14px_-2px_rgba(38,255,223,0.55)]"
                  : "bg-black/30 border-[#26FFDF]/20 group-hover/node:border-[#26FFDF]/50"
              }`}
            >
              {value === otherOption.label ? (
                <Check className="w-4 h-4 text-[#26FFDF]" />
              ) : (
                <otherOption.icon className="w-4 h-4 text-[#b2fff6]/80 group-hover/node:text-[#26FFDF]/80" />
              )}
            </span>
            <span className={`text-sm font-medium ${value === otherOption.label ? "text-[#26FFDF]" : "text-[#e6f7f6]"}`}>
              {otherOption.label}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
