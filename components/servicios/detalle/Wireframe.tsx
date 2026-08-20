import type React from "react"

import type { WireframeKind } from "@/lib/data/servicios/tipos"

/**
 * Miniaturas esquemáticas de cada zona de la web.
 *
 * Son SVG planos: bloques grises para el contenido y el turquesa reservado
 * para la pieza que dirige la mirada (el CTA, el botón activo, el acento).
 * Mismo principio que la tienda: el gris sostiene, el color señala.
 */

const BLOCK = "fill-[#08A696]/20 dark:fill-[#3f4347]"
const BLOCK_SOFT = "fill-[#08A696]/12 dark:fill-[#2e3134]"
const ACCENT = "fill-[#08A696] dark:fill-[#26FFDF]"
const ACCENT_LINE = "stroke-[#08A696] dark:stroke-[#26FFDF]"
const FRAME = "stroke-[#08A696]/30 dark:stroke-[#4a4e52]"

function Navbar() {
  return (
    <>
      <rect x="4" y="4" width="64" height="40" rx="6" className={`fill-none ${FRAME}`} strokeWidth="1.5" />
      <rect x="10" y="12" width="8" height="8" rx="2" className={ACCENT} />
      <rect x="22" y="14" width="14" height="4" rx="2" className={BLOCK} />
      <rect x="40" y="14" width="10" height="4" rx="2" className={BLOCK} />
      <rect x="54" y="12" width="8" height="8" rx="2" className={`fill-none ${ACCENT_LINE}`} strokeWidth="1.5" />
      <rect x="10" y="28" width="52" height="8" rx="4" className={BLOCK_SOFT} />
    </>
  )
}

function Hero() {
  return (
    <>
      <rect x="4" y="4" width="64" height="40" rx="6" className={`fill-none ${FRAME}`} strokeWidth="1.5" />
      <rect x="10" y="11" width="26" height="5" rx="2.5" className={BLOCK} />
      <rect x="10" y="20" width="18" height="4" rx="2" className={BLOCK_SOFT} />
      <rect x="10" y="30" width="20" height="8" rx="4" className={ACCENT} />
      <rect x="40" y="11" width="22" height="27" rx="4" className={BLOCK_SOFT} />
    </>
  )
}

function Grid() {
  return (
    <>
      <rect x="4" y="4" width="64" height="40" rx="6" className={`fill-none ${FRAME}`} strokeWidth="1.5" />
      <rect x="10" y="10" width="14" height="5" rx="2.5" className={ACCENT} />
      <rect x="27" y="10" width="12" height="5" rx="2.5" className={BLOCK_SOFT} />
      <rect x="42" y="10" width="12" height="5" rx="2.5" className={BLOCK_SOFT} />
      <rect x="10" y="20" width="16" height="18" rx="3" className={BLOCK} />
      <rect x="29" y="20" width="16" height="18" rx="3" className={BLOCK} />
      <rect x="48" y="20" width="14" height="18" rx="3" className={BLOCK} />
    </>
  )
}

function Detail() {
  return (
    <>
      <rect x="4" y="4" width="64" height="40" rx="6" className={`fill-none ${FRAME}`} strokeWidth="1.5" />
      <rect x="10" y="11" width="24" height="27" rx="3" className={BLOCK} />
      <rect x="39" y="11" width="23" height="5" rx="2.5" className={BLOCK_SOFT} />
      <rect x="39" y="20" width="14" height="4" rx="2" className={BLOCK_SOFT} />
      <circle cx="42" cy="30" r="3" className={ACCENT} />
      <circle cx="51" cy="30" r="3" className={BLOCK} />
      <circle cx="60" cy="30" r="3" className={BLOCK} />
    </>
  )
}

function Cart() {
  return (
    <>
      <rect x="4" y="4" width="64" height="40" rx="6" className={`fill-none ${FRAME}`} strokeWidth="1.5" />
      <rect x="10" y="12" width="24" height="24" rx="3" className={BLOCK_SOFT} />
      <rect x="38" y="4" width="30" height="40" rx="6" className={BLOCK} />
      <rect x="43" y="12" width="20" height="4" rx="2" className={BLOCK_SOFT} />
      <rect x="43" y="20" width="14" height="4" rx="2" className={BLOCK_SOFT} />
      <rect x="43" y="30" width="20" height="7" rx="3.5" className={ACCENT} />
    </>
  )
}

function Checkout() {
  return (
    <>
      <rect x="4" y="4" width="64" height="40" rx="6" className={`fill-none ${FRAME}`} strokeWidth="1.5" />
      <rect x="10" y="11" width="24" height="4" rx="2" className={BLOCK} />
      <rect x="10" y="19" width="24" height="4" rx="2" className={BLOCK} />
      <rect x="10" y="27" width="16" height="4" rx="2" className={BLOCK} />
      <rect x="40" y="11" width="22" height="14" rx="3" className={BLOCK_SOFT} />
      <rect x="40" y="29" width="22" height="8" rx="4" className={ACCENT} />
    </>
  )
}

function Admin() {
  return (
    <>
      <rect x="4" y="4" width="64" height="40" rx="6" className={`fill-none ${FRAME}`} strokeWidth="1.5" />
      <rect x="4" y="4" width="18" height="40" rx="6" className={BLOCK_SOFT} />
      <rect x="8" y="12" width="10" height="3" rx="1.5" className={ACCENT} />
      <rect x="8" y="19" width="10" height="3" rx="1.5" className={BLOCK} />
      <rect x="8" y="26" width="10" height="3" rx="1.5" className={BLOCK} />
      <rect x="27" y="12" width="35" height="6" rx="2" className={BLOCK} />
      <rect x="27" y="22" width="35" height="6" rx="2" className={BLOCK} />
      <rect x="27" y="32" width="20" height="6" rx="3" className={ACCENT} />
    </>
  )
}

/** Formulario de contacto: campos apilados y un botón que resalta. */
function Form() {
  return (
    <>
      <rect x="4" y="4" width="64" height="40" rx="6" className={`fill-none ${FRAME}`} strokeWidth="1.5" />
      <rect x="14" y="11" width="20" height="4" rx="2" className={BLOCK_SOFT} />
      <rect x="14" y="19" width="44" height="6" rx="3" className={BLOCK} />
      <rect x="14" y="28" width="44" height="6" rx="3" className={BLOCK} />
      <rect x="14" y="37" width="24" height="5" rx="2.5" className={ACCENT} />
    </>
  )
}

/** Prueba social: fila de credenciales con la primera destacada. */
function Proof() {
  return (
    <>
      <rect x="4" y="4" width="64" height="40" rx="6" className={`fill-none ${FRAME}`} strokeWidth="1.5" />
      <rect x="10" y="10" width="20" height="4" rx="2" className={BLOCK_SOFT} />
      <rect x="10" y="19" width="16" height="19" rx="3" className={`fill-none ${ACCENT_LINE}`} strokeWidth="1.5" />
      <rect x="29" y="19" width="16" height="19" rx="3" className={BLOCK} />
      <rect x="48" y="19" width="14" height="19" rx="3" className={BLOCK} />
    </>
  )
}

/** Proceso por etapas: hitos unidos por una línea. */
function Story() {
  return (
    <>
      <rect x="4" y="4" width="64" height="40" rx="6" className={`fill-none ${FRAME}`} strokeWidth="1.5" />
      <line x1="13" y1="24" x2="59" y2="24" className={FRAME} strokeWidth="1.5" />
      <circle cx="14" cy="24" r="4" className={ACCENT} />
      <circle cx="30" cy="24" r="4" className={BLOCK} />
      <circle cx="45" cy="24" r="4" className={BLOCK} />
      <circle cx="59" cy="24" r="4" className={BLOCK} />
      <rect x="10" y="33" width="16" height="3" rx="1.5" className={BLOCK_SOFT} />
      <rect x="41" y="33" width="16" height="3" rx="1.5" className={BLOCK_SOFT} />
    </>
  )
}

const SHAPES: Record<WireframeKind, () => React.ReactElement> = {
  navbar: Navbar,
  hero: Hero,
  grid: Grid,
  detail: Detail,
  cart: Cart,
  checkout: Checkout,
  admin: Admin,
  form: Form,
  proof: Proof,
  story: Story,
}

export function Wireframe({ kind, className = "" }: { kind: WireframeKind; className?: string }) {
  const Shape = SHAPES[kind]
  return (
    <svg
      viewBox="0 0 72 48"
      role="presentation"
      aria-hidden="true"
      className={`h-full w-full ${className}`}
    >
      <Shape />
    </svg>
  )
}
