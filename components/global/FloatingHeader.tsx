"use client"

import { motion } from "framer-motion"
import NavBar from "./NavBar"

export default function FloatingHeader() {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-40 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="flex justify-center items-start pt-4 pointer-events-auto">
        <NavBar />
      </div>
    </motion.header>
  )
}