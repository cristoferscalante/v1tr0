"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

interface ScrollContextType {
  isHorizontalScrollActive: boolean
  setHorizontalScrollActive: (active: boolean) => void
  horizontalScrollPosition: number
  setHorizontalScrollPosition: (position: number) => void
  canScrollVertically: boolean
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined)

export function ScrollProvider({ children }: { children: ReactNode }) {
  const [isHorizontalScrollActive, setHorizontalScrollActive] = useState(false)
  const [horizontalScrollPosition, setHorizontalScrollPosition] = useState(0)
  
  // Solo permitir scroll vertical si:
  // 1. No estamos en scroll horizontal activo, O
  // 2. Estamos en la última sección horizontal (posición 2) - todas las secciones han sido vistas
  const canScrollVertically = !isHorizontalScrollActive || 
    horizontalScrollPosition === 2

  return (
    <ScrollContext.Provider value={{
      isHorizontalScrollActive,
      setHorizontalScrollActive,
      horizontalScrollPosition,
      setHorizontalScrollPosition,
      canScrollVertically
    }}>
      {children}
    </ScrollContext.Provider>
  )
}

export function useScrollContext() {
  const context = useContext(ScrollContext)
  if (context === undefined) {
    throw new Error('useScrollContext must be used within a ScrollProvider')
  }
  return context
}