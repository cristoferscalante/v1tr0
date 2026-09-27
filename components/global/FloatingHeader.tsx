"use client"

import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import NavBar from "./NavBar"
import { useIntroActive } from "@/lib/intro-store"

interface FloatingHeaderProps {
  isTiendaPage?: boolean
}

export default function FloatingHeader({ isTiendaPage = false }: FloatingHeaderProps) {
  const introActive = useIntroActive(usePathname())

  return (
    // Vive arriba: entra desde el borde superior, y en el home espera a que
    // termine la intro para no competir con ella
    <motion.header
      className="fixed left-0 right-0 z-40 pointer-events-none"
      style={{ top: isTiendaPage ? '44px' : '0px' }}
      initial={{ opacity: 0, y: -90 }}
      animate={introActive ? { opacity: 0, y: -90 } : { opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: introActive ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex justify-center items-start pt-4 px-4 sm:px-6 lg:px-8 pointer-events-auto w-full">
        <NavBar />
      </div>
    </motion.header>
  )
}