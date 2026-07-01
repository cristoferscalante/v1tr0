"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/use-auth"
import { CartProvider } from "@/lib/context/CartContext"
import { Toaster } from "sonner"
import type { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="v1tr0-theme">
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AuthProvider>
      <Toaster 
        position="top-right"
        expand={true}
        richColors
        closeButton
      />
    </ThemeProvider>
  )
}
