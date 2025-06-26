"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Bell, Search, LogOut, User, Settings, HelpCircle, Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

export function DashboardHeader() {
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-[#08A696]/20 bg-[#02505931] backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-4">
          {isMobile && (
            <Button className="md:hidden bg-[#08A696]/10 hover:bg-[#08A696]/20 text-[#26FFDF] border-none p-2 h-8 w-8 rounded" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          )}

          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/v1tr0-logo.svg" alt="V1TR0 Logo" width={32} height={32} />
            <span className="hidden font-bold sm:inline-block text-[#26FFDF]">V1TR0</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textMuted" />
            <input
              type="search"
              placeholder="Buscar..."
              className="pl-10 h-9 w-64 rounded-2xl border border-[#08A696]/30 bg-[#02505931] backdrop-blur-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#08A696]/20 focus:border-[#08A696] text-[#26FFDF]"
            />
          </div>

          <Button className="relative bg-[#08A696]/10 hover:bg-[#08A696]/20 text-[#26FFDF] border-none p-2 h-9 w-9 rounded-xl">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#08A696]"></span>
          </Button>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="relative h-9 w-9 rounded-full bg-[#08A696]/10 hover:bg-[#08A696]/20 border border-[#08A696]/30 p-0">
                <Image
                  src="/diverse-professional-profiles.png"
                  alt="Avatar"
                  className="rounded-full object-cover"
                  fill
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Ayuda</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/login" className="flex items-center cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
