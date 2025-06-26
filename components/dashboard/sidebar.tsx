"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  HelpCircle,
  Briefcase,
  ClipboardList,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

interface SidebarItemProps {
  href: string
  icon: React.ReactNode
  title: string
  isActive?: boolean
  isExpanded?: boolean
  hasChildren?: boolean
  onClick?: (e: React.MouseEvent) => void
}

function SidebarItem({ href, icon, title, isActive, isExpanded, hasChildren, onClick }: SidebarItemProps) {
  if (hasChildren) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm transition-all cursor-pointer border",
          isActive 
            ? "bg-[#02505931] backdrop-blur-sm border-[#08A696]/30 text-[#26FFDF]" 
            : "text-textMuted hover:bg-[#02505931] hover:backdrop-blur-sm hover:border-[#08A696]/20 hover:text-[#26FFDF] border-transparent",
        )}
        onClick={onClick}
        role="button"
        aria-expanded={isExpanded}
      >
        {icon}
        <span>{title}</span>
        <span className="ml-auto">
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </span>
      </div>
    )
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm transition-all border",
        isActive 
          ? "bg-[#02505931] backdrop-blur-sm border-[#08A696]/30 text-[#26FFDF]" 
          : "text-textMuted hover:bg-[#02505931] hover:backdrop-blur-sm hover:border-[#08A696]/20 hover:text-[#26FFDF] border-transparent",
      )}
    >
      {icon}
      <span>{title}</span>
    </Link>
  )
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    projects: false,
  })

  const toggleExpanded = (key: string, e: React.MouseEvent) => {
    e.preventDefault()
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-[#08A696]/20 bg-[#02505931] backdrop-blur-sm">
      <div className="flex-1 overflow-auto py-4 px-3">
        <nav className="grid gap-2">
          <SidebarItem
            href="/dashboard"
            icon={<LayoutDashboard className="h-4 w-4" />}
            title="Dashboard"
            isActive={pathname === "/dashboard"}
          />

          <SidebarItem
            href="#"
            icon={<Briefcase className="h-4 w-4" />}
            title="Proyectos"
            isActive={pathname.startsWith("/dashboard/projects")}
            isExpanded={expandedItems.projects}
            hasChildren
            onClick={(e) => toggleExpanded("projects", e)}
          />

          {expandedItems.projects && (
            <div className="ml-6 grid gap-1">
              <SidebarItem
                href="/dashboard/projects"
                icon={<Briefcase className="h-4 w-4" />}
                title="Todos los Proyectos"
                isActive={pathname === "/dashboard/projects"}
              />
            </div>
          )}

          <SidebarItem
            href="/dashboard/clients"
            icon={<Users className="h-4 w-4" />}
            title="Clientes"
            isActive={pathname === "/dashboard/clients"}
          />

          <SidebarItem
            href="/dashboard/tasks"
            icon={<ClipboardList className="h-4 w-4" />}
            title="Tareas"
            isActive={pathname === "/dashboard/tasks"}
          />

          <SidebarItem
            href="/dashboard/calendar"
            icon={<Calendar className="h-4 w-4" />}
            title="Calendario"
            isActive={pathname === "/dashboard/calendar"}
          />

          <SidebarItem
            href="/dashboard/team"
            icon={<Users className="h-4 w-4" />}
            title="Equipo"
            isActive={pathname === "/dashboard/team"}
          />
        </nav>
      </div>

      <div className="mt-auto border-t border-[#08A696]/20 py-4 px-3">
        <nav className="grid gap-2">
          <SidebarItem
            href="/dashboard/settings"
            icon={<Settings className="h-4 w-4" />}
            title="Configuración"
            isActive={pathname === "/dashboard/settings"}
          />
          <SidebarItem
            href="/dashboard/help"
            icon={<HelpCircle className="h-4 w-4" />}
            title="Ayuda"
            isActive={pathname === "/dashboard/help"}
          />
        </nav>
      </div>
    </aside>
  )
}
