"use client"

import { useState, useEffect } from 'react'

interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  screenWidth: number
  screenHeight: number
  isTouchDevice: boolean
  devicePixelRatio: number
}

/**
 * Hook personalizado para detectar tipos de dispositivos de manera más precisa
 * 
 * Lógica de detección:
 * - Mobile: < 768px width
 * - Tablet: 768px - 1199px width OR touch device with width < 1200px
 * - Desktop: >= 1200px width AND no touch capabilities
 * 
 * Casos especiales:
 * - Tablets de 12 pulgadas (iPad Pro, Surface Pro): Generalmente 1366x1024 o superior
 * - Se consideran tablets si tienen capacidades táctiles, incluso con resolución alta
 */
export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: 1920,
    screenHeight: 1080,
    isTouchDevice: false,
    devicePixelRatio: 1
  })

  useEffect(() => {
    const detectDevice = () => {
      if (typeof window === 'undefined') return

      const width = window.innerWidth
      const height = window.innerHeight
      const pixelRatio = window.devicePixelRatio || 1
      
      // Detectar capacidades táctiles
      const isTouchDevice = (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore - Para compatibilidad con navegadores antiguos
        navigator.msMaxTouchPoints > 0
      )

      // Detectar orientación para tablets
      const isLandscapeTablet = width > height && width >= 1024 && width < 1400 && isTouchDevice
      const isPortraitTablet = height > width && height >= 1024 && height < 1400 && isTouchDevice
      
      // Lógica de clasificación mejorada
      let isMobile = false
      let isTablet = false
      let isDesktop = false

      if (width < 768) {
        // Definitivamente móvil
        isMobile = true
      } else if (
        // Tablets: rango de 768px a 1199px
        (width >= 768 && width < 1200) ||
        // O dispositivos táctiles con resolución media-alta (tablets de 12")
        (isTouchDevice && width >= 1200 && width < 1600) ||
        // O tablets en orientación específica
        isLandscapeTablet || isPortraitTablet
      ) {
        isTablet = true
      } else {
        // Desktop: >= 1200px sin touch, o >= 1600px con/sin touch
        isDesktop = true
      }

      // Casos especiales para tablets grandes (iPad Pro 12.9", Surface Pro)
      if (isTouchDevice && width >= 1366 && width <= 1440 && height >= 1024) {
        isTablet = true
        isDesktop = false
      }

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        screenWidth: width,
        screenHeight: height,
        isTouchDevice,
        devicePixelRatio: pixelRatio
      })
    }

    // Detectar al montar
    detectDevice()

    // Detectar en resize con debounce
    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(detectDevice, 150)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', detectDevice)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', detectDevice)
      clearTimeout(timeoutId)
    }
  }, [])

  return deviceInfo
}

/**
 * Hook simplificado que solo retorna si debe aplicarse scroll snap
 * 
 * Regla: Solo aplicar scroll snap en dispositivos desktop (no móviles ni tablets)
 */
export function useScrollSnapEnabled(): boolean {
  const { isDesktop } = useDeviceDetection()
  return isDesktop
}

/**
 * Hook para detectar si es un dispositivo móvil (para compatibilidad con código existente)
 */
export function useIsMobile(): boolean {
  const { isMobile } = useDeviceDetection()
  return isMobile
}

/**
 * Hook para detectar si es una tablet
 */
export function useIsTablet(): boolean {
  const { isTablet } = useDeviceDetection()
  return isTablet
}