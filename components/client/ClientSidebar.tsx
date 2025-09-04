"use client"

import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Home, User, Briefcase, MessageSquare, LogOut } from "lucide-react"
import Image from "next/image"

export default function ClientSidebar() {
  return (
    <Sidebar className="bg-[#e6f7f6]/80 backdrop-blur-md border-r border-[#08A696]/30">
      <SidebarHeader className="p-4 bg-[#c5ebe7]/50 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <Image src="/abstract-geometric-logo.png" alt="V1tr0 Logo" width={40} height={40} className="rounded-xl" />
          <span className="font-bold text-lg text-[#08A696]">V1tr0 Panel</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard">
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/profile">
                <User className="w-5 h-5" />
                <span>Perfil</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/projects">
                <Briefcase className="w-5 h-5" />
                <span>Proyectos</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/profile/chat">
                <MessageSquare className="w-5 h-5" />
                <span>Chat IA</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 bg-[#c5ebe7]/50 rounded-b-2xl">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/login">
                <LogOut className="w-5 h-5" />
                <span>Cerrar Sesión</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarTrigger className="absolute top-4 right-4 md:hidden" />
    </Sidebar>
  )
}
