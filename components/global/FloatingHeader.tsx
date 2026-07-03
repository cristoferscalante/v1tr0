"use client"

import { motion } from "framer-motion"
import NavBar from "./NavBar"

interface FloatingHeaderProps {
  isTiendaPage?: boolean
}

export default function FloatingHeader({ isTiendaPage = false }: FloatingHeaderProps) {
  return (
    <motion.header
      className="fixed left-0 right-0 z-40 pointer-events-none"
      style={{ top: isTiendaPage ? '44px' : '0px' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="flex justify-center items-start pt-4 px-4 sm:px-6 lg:px-8 pointer-events-auto w-full">
        <NavBar />
      </div>
    </motion.header>
  )
}