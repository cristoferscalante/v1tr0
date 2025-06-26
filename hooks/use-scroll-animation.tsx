"use client"

import { useEffect, useRef, useState, useCallback } from 'react'

interface UseScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const {
    threshold = 0.1,
    rootMargin = '0px 0px -80px 0px',
    triggerOnce = true
  } = options

  const handleIntersection = useCallback(([entry]: IntersectionObserverEntry[]) => {
    if (entry.isIntersecting) {
      setIsVisible(true)
      if (triggerOnce) {
        setHasTriggered(true)
        // Desconectar el observer para mejorar el rendimiento
        if (observerRef.current && elementRef.current) {
          observerRef.current.unobserve(elementRef.current)
        }
      }
    } else if (!triggerOnce && !hasTriggered) {
      setIsVisible(false)
    }
  }, [triggerOnce, hasTriggered])

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin
    })

    observerRef.current.observe(element)

    return () => {
      if (observerRef.current && element) {
        observerRef.current.unobserve(element)
      }
    }
  }, [threshold, rootMargin, handleIntersection])

  return { elementRef, isVisible }
}
