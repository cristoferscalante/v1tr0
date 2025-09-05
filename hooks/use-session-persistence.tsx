"use client"

import { supabase } from '@/lib/supabase/client'

export function useSessionPersistence() {
  const saveSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session && typeof window !== 'undefined') {
        localStorage.setItem('supabase.auth.token', JSON.stringify(session))
        console.warn('[SESSION] Sesión guardada en localStorage')
      }
    } catch (error) {
      console.error('[SESSION] Error guardando sesión:', error)
    }
  }

  const loadSession = async () => {
    try {
      if (typeof window !== 'undefined') {
        const savedSession = localStorage.getItem('supabase.auth.token')
        if (savedSession) {
          const session = JSON.parse(savedSession)
          console.warn('[SESSION] Sesión encontrada en localStorage')
          return session
        }
      }
    } catch (error) {
      console.error('[SESSION] Error cargando sesión:', error)
    }
    return null
  }

  const clearSession = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('supabase.auth.token')
        console.warn('[SESSION] Sesión eliminada de localStorage')
      }
    } catch (error) {
      console.error('[SESSION] Error eliminando sesión:', error)
    }
  }

  return {
    saveSession,
    loadSession,
    clearSession
  }
}
