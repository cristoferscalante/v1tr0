"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  ChevronRight
} from "lucide-react"

interface NavItem {
  id: string
  icon: React.ReactNode
  label: string
  href: string
}

const navItems: NavItem[] = [
  {
    id: "dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    label: "Dashboard",
    href: "/admin"
  },
  {
    id: "productos",
    icon: <ShoppingBag className="w-5 h-5" />,
    label: "Productos",
    href: "/admin/productos"
  },
  {
    id: "paquetes",
    icon: <Package className="w-5 h-5" />,
    label: "Paquetes",
    href: "/admin/paquetes"
  }
]

export default function AdminSidebar() {
  const { theme } = useTheme()
  const { signOut, userProfile } = useAuth()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const isDark = theme === "dark"

  const handleSignOut = async () => {
    await signOut()
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl ${
          isDark
            ? "bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20 text-[#26FFDF]"
            : "bg-[#e6f7f6] backdrop-blur-sm border border-[#08A696]/60 text-[#04423c]"
        } transition-all duration-300 hover:border-[#08A696] hover:shadow-lg transform hover:scale-105`}
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay para móvil */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : "-100%"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed lg:static top-0 left-0 h-screen w-72 ${
          isDark
            ? "bg-[#02505931] backdrop-blur-sm border-r border-[#08A696]/20"
            : "bg-[#e6f7f6] backdrop-blur-sm border-r border-[#08A696]/60"
        } z-40 lg:z-0 flex flex-col lg:translate-x-0`}
      >
        {/* Logo/Header */}
        <div className="p-6 border-b border-[#08A696]/20">
          <div
            className={`inline-block px-4 py-2 rounded-2xl ${
              isDark
                ? "bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20"
                : "bg-[#e6f7f6] backdrop-blur-sm border border-[#08A696]/60"
            } transition-all duration-300`}
          >
            <h1
              className={`text-xl font-bold ${
                isDark ? "text-[#26FFDF]" : "text-[#04423c]"
              }`}
            >
              V1TR0 Admin
            </h1>
          </div>
          {userProfile && (
            <div className="mt-4">
              <p
                className={`text-sm font-medium ${
                  isDark ? "text-[#b2fff6]" : "text-[#04423c]"
                } opacity-90`}
              >
                {userProfile.name || userProfile.email}
              </p>
              <p
                className={`text-xs ${
                  isDark ? "text-[#26FFDF]" : "text-[#085c54]"
                } opacity-75`}
              >
                {userProfile.role}
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block"
              >
                <div className="relative group">
                  {/* Gradiente de fondo con blur - igual que en el footer */}
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-r from-[#08a6961e] to-[#26ffde23] rounded-xl blur opacity-0 ${
                      isActive ? "opacity-40" : "group-hover:opacity-40"
                    } transition-all duration-300`}
                  />
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? isDark
                          ? "bg-[#08A696]/30 border border-[#26FFDF] text-[#26FFDF] shadow-lg shadow-[#26FFDF]/20"
                          : "bg-white/70 border border-[#08A696] text-[#04423c] shadow-lg shadow-[#08A696]/20"
                        : isDark
                        ? "bg-[#08A696]/10 border border-[#08A696]/20 text-[#b2fff6] hover:border-[#08A696] hover:bg-[#08A696]/20 hover:shadow-lg"
                        : "bg-white/50 border border-[#08A696]/40 text-[#085c54] hover:border-[#08A696] hover:bg-white/70 hover:shadow-lg"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        isActive
                          ? isDark
                            ? "bg-[#02505950] border border-[#08A696]/40"
                            : "bg-[#c5ebe7] border border-[#08A696]/60"
                          : isDark
                          ? "bg-[#02505950] border border-[#08A696]/20"
                          : "bg-[#c5ebe7] border border-[#08A696]/40"
                      } transition-all duration-300 group-hover:scale-110`}
                    >
                      {item.icon}
                    </div>
                    <span className="flex-1 font-semibold">{item.label}</span>
                    {isActive && (
                      <ChevronRight className="w-5 h-5 animate-pulse" />
                    )}
                  </motion.div>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Separator */}
        <div
          className={`mx-4 h-px ${
            isDark ? "bg-[#08A696]/20" : "bg-[#08A696]/40"
          }`}
        />

        {/* Sign Out Button */}
        <div className="p-4">
          <div className="relative group">
            {/* Gradiente de fondo con blur */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08a6961e] to-[#26ffde23] rounded-xl blur opacity-0 group-hover:opacity-40 transition-all duration-300" />
            <motion.button
              onClick={handleSignOut}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isDark
                  ? "bg-[#08A696]/10 border border-[#08A696]/20 text-[#26FFDF] hover:border-[#08A696] hover:bg-[#08A696]/20 hover:shadow-lg hover:shadow-[#26FFDF]/20"
                  : "bg-white/50 border border-[#08A696]/40 text-[#085c54] hover:border-[#08A696] hover:bg-white/70 hover:shadow-lg hover:shadow-[#08A696]/20"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  isDark
                    ? "bg-[#02505950] border border-[#08A696]/20"
                    : "bg-[#c5ebe7] border border-[#08A696]/40"
                } transition-all duration-300 group-hover:scale-110`}
              >
                <LogOut className="w-5 h-5" />
              </div>
              <span className="font-semibold">Cerrar Sesión</span>
            </motion.button>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t ${
            isDark ? "border-[#08A696]/20" : "border-[#08A696]/40"
          }`}
        >
          <p
            className={`text-center text-xs ${
              isDark ? "text-[#b2fff6]" : "text-[#04423c]"
            } opacity-75`}
          >
            &copy; {new Date().getFullYear()} V1TR0
          </p>
          <div
            className={`w-16 h-1 ${
              isDark
                ? "bg-gradient-to-r from-[#08A696] to-[#26FFDF]"
                : "bg-gradient-to-r from-[#08A696] to-[#1e7d7d]"
            } mx-auto mt-2 rounded-full`}
          />
        </div>
      </motion.aside>
    </>
  )
}
