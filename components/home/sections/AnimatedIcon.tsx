"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import type { CSSProperties } from "react"

export type IconKind =
  | "grid-ripple"
  | "bar-grow"
  | "chip-pulse"
  | "cart-bounce"
  | "type-blink"
  | "globe-spin"
  | "phone-tilt"
  | "db-sync"
  | "trend-rise"
  | "brain-think"
  | "bot-idle"
  | "workflow-cycle"
  | "link-connect"
  | "gear-spin"

interface AnimatedIconProps {
  kind: IconKind
  icon: LucideIcon
  active?: boolean
  size?: number
  className?: string
  style?: CSSProperties
}

const SPIN_KINDS = new Set<IconKind>(["globe-spin", "gear-spin", "workflow-cycle"])

export function AnimatedIcon({ kind, icon: Icon, active = false, size = 20, className = "", style }: AnimatedIconProps) {
  const loop = active ? Infinity : 0

  const iconAnimate = active
    ? kind === "globe-spin" || kind === "gear-spin" || kind === "workflow-cycle"
      ? { rotate: 360 }
      : kind === "phone-tilt"
      ? { rotate: [0, -8, 8, 0] }
      : kind === "bot-idle"
      ? { scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] }
      : kind === "trend-rise"
      ? { y: [0, -2, 0], x: [0, 1, 0] }
      : kind === "cart-bounce"
      ? { y: [0, -2, 0] }
      : { scale: [1, 1.05, 1] }
    : { rotate: 0, scale: 1, y: 0, x: 0 }

  const iconTransition = SPIN_KINDS.has(kind)
    ? { duration: kind === "gear-spin" ? 2.5 : 4, repeat: loop, ease: "linear" as const }
    : { duration: 1.6, repeat: loop, ease: "easeInOut" as const }

  return (
    <span
      className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size, ...style }}
    >
      {kind === "grid-ripple" && (
        <span className="absolute inset-0 grid grid-cols-2 gap-[2px] p-[1px] pointer-events-none">
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              className="rounded-[2px] bg-current"
              animate={active ? { opacity: [0.08, 0.3, 0.08] } : { opacity: 0.1 }}
              transition={{ duration: 1.6, repeat: loop, delay: i * 0.15, ease: "easeInOut" }}
            />
          ))}
        </span>
      )}

      {kind === "bar-grow" && (
        <span className="absolute inset-0 flex items-end justify-center gap-[2px] pointer-events-none">
          {[0.4, 0.75, 0.55].map((h, i) => (
            <motion.span
              key={i}
              className="w-[3px] rounded-sm bg-current opacity-25 origin-bottom"
              style={{ height: `${h * 100}%` }}
              animate={active ? { scaleY: [0.5, 1, 0.7, 1] } : { scaleY: 0.6 }}
              transition={{ duration: 1.4, repeat: loop, delay: i * 0.12, ease: "easeInOut" }}
            />
          ))}
        </span>
      )}

      {kind === "chip-pulse" && (
        <motion.span
          className="absolute inset-0 rounded-md border border-current pointer-events-none"
          animate={active ? { scale: [1, 1.35], opacity: [0.35, 0] } : { scale: 1, opacity: 0.2 }}
          transition={{ duration: 1.3, repeat: loop, ease: "easeOut" }}
        />
      )}

      {kind === "db-sync" && (
        <>
          <motion.span
            className="absolute inset-0 rounded-full border border-current pointer-events-none"
            animate={active ? { scale: [1, 1.5], opacity: [0.4, 0] } : { opacity: 0.15 }}
            transition={{ duration: 1.5, repeat: loop, ease: "easeOut" }}
          />
          <motion.span
            className="absolute inset-0 rounded-full border border-current pointer-events-none"
            animate={active ? { scale: [1, 1.5], opacity: [0.4, 0] } : { opacity: 0 }}
            transition={{ duration: 1.5, repeat: loop, delay: 0.5, ease: "easeOut" }}
          />
        </>
      )}

      {kind === "brain-think" && (
        <>
          <motion.span
            className="absolute -top-0.5 -right-0.5 w-1 h-1 rounded-full bg-current pointer-events-none"
            animate={active ? { opacity: [0, 1, 0], scale: [0.5, 1, 0.5] } : { opacity: 0.3 }}
            transition={{ duration: 1.2, repeat: loop, ease: "easeInOut" }}
          />
          <motion.span
            className="absolute -bottom-0.5 -left-0.5 w-1 h-1 rounded-full bg-current pointer-events-none"
            animate={active ? { opacity: [0, 1, 0], scale: [0.5, 1, 0.5] } : { opacity: 0.3 }}
            transition={{ duration: 1.2, repeat: loop, delay: 0.5, ease: "easeInOut" }}
          />
        </>
      )}

      {kind === "link-connect" && (
        <>
          <motion.span
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-current pointer-events-none"
            animate={active ? { x: [0, size * 0.22, 0], opacity: [0.8, 0.2, 0.8] } : { opacity: 0.3 }}
            transition={{ duration: 1.4, repeat: loop, ease: "easeInOut" }}
          />
          <motion.span
            className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-current pointer-events-none"
            animate={active ? { x: [0, -size * 0.22, 0], opacity: [0.8, 0.2, 0.8] } : { opacity: 0.3 }}
            transition={{ duration: 1.4, repeat: loop, ease: "easeInOut" }}
          />
        </>
      )}

      {kind === "cart-bounce" && (
        <motion.span
          className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-current pointer-events-none"
          animate={active ? { scale: [0, 1, 0], y: [2, -2, 2] } : { opacity: 0 }}
          transition={{ duration: 1.3, repeat: loop, ease: "easeInOut" }}
        />
      )}

      {kind === "type-blink" && (
        <motion.span
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[2px] h-1/3 bg-current pointer-events-none"
          animate={active ? { opacity: [1, 0, 1] } : { opacity: 0 }}
          transition={{ duration: 0.9, repeat: loop, ease: "linear" }}
        />
      )}

      <motion.span
        className="relative inline-flex items-center justify-center w-full h-full"
        animate={iconAnimate}
        transition={iconTransition}
      >
        <Icon className="w-full h-full" />
      </motion.span>
    </span>
  )
}
