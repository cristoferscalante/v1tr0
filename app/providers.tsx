"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/use-auth"
import { Toaster } from "sonner"
import type { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="v1tr0-theme">
      <AuthProvider>
        {children}
        <Toaster 
          position="top-right"
          expand={true}
          richColors
          closeButton
        />
      </AuthProvider>
    </ThemeProvider>
  )
}
