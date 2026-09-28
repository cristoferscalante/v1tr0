"use client"

import type React from "react"
import FooterSection from "@/components/global/FooterSection"
import FloatingHeader from "@/components/global/FloatingHeader"
import { TopBar } from "@/components/shop/TopBar"
import { usePathname } from "next/navigation"
import { SoundProvider } from "@/components/global/sound/SoundProvider"
import SoundToggle from "@/components/global/sound/SoundToggle"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isServicesNewPage = pathname === '/servicios-referentes/new'
  const isAboutPage = pathname === '/about'
  const isHomePage = pathname === '/'
  const isTiendaPage = pathname?.startsWith('/tienda') || false

  return (
    <SoundProvider>
      {isTiendaPage && <TopBar />}
      <FloatingHeader isTiendaPage={isTiendaPage} />
      <main className="min-h-screen">{children}</main>
      {!isServicesNewPage && !isAboutPage && !isHomePage && <FooterSection />}
      <SoundToggle />
    </SoundProvider>
  )
}
