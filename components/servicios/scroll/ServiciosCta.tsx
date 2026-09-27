"use client"

import { useRef, useState, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { servicesData } from "@/components/home/sections/ServicesTabSection"
import { HoverFrameSequence } from "@/components/home/sections/banner/HeroNavCards"

gsap.registerPlugin(ScrollTrigger, useGSAP)

const [, dataService, autoService] = servicesData

// Odiseo levanta la mano y aparece el </> sobre la palma (fotogramas de odiseo.mp4).
const odiseoFrames = Array.from(
  { length: 47 },
  (_, i) => `/imagenes/home/odiseo/odiseo-${String(i).padStart(2, "0")}.webp`,
)

/** Estatua fija: no flota ni reacciona al cursor. Avisa el hover para el gesto de Odiseo. */
function Statue({
  children,
  className,
  onHoverChange,
}: {
  children: ReactNode
  className: string
  onHoverChange?: (hovered: boolean) => void
}) {
  return (
    <div
      className={`cta-statue relative ${className}`}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
    >
      {children}
    </div>
  )
}

/**
 * Cierre del recorrido: la pregunta crece con el scroll y las tres estatuas
 * de V1TR0 suben a acompañarla y se quedan fijas. Odiseo levanta la mano al pasar el cursor
 * sobre él o sobre el botón, como invitación a empezar.
 */
export default function ServiciosCta() {
  const root = useRef<HTMLElement>(null)
  const [odiseoHovered, setOdiseoHovered] = useState(false)
  const [ctaHovered, setCtaHovered] = useState(false)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".cta-title",
          { scale: 0.7, opacity: 0.2 },
          { scale: 1, opacity: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "center center", scrub: true } },
        )
        gsap.from(".cta-statue", {
          yPercent: 35,
          opacity: 0,
          stagger: 0.12,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: ".cta-statues", start: "top 90%" },
        })
      })
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      className="relative z-10 flex min-h-screen flex-col items-center overflow-hidden border-t border-white/[0.06] bg-[#080c0c] px-4 pt-28 text-center"
    >
      {/* Halo tenue sobre el que se recortan las estatuas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-20%] left-1/2 h-[70%] w-[80%] -translate-x-1/2 rounded-full bg-[#26FFDF]/[0.06] blur-3xl"
      />

      {/* El escudo que abre la página también la cierra */}
      <Image
        src="/imagenes/logos/escudo-logo.png"
        alt=""
        width={551}
        height={634}
        className="relative mb-6 h-16 w-auto drop-shadow-[0_0_18px_rgba(38,255,223,0.25)]"
      />
      <p className="relative text-[11px] uppercase tracking-[0.2em] text-white/50">
        <span className="text-white/30">04</span>&nbsp;&nbsp;Tu proyecto
      </p>
      <h2 className="cta-title relative mt-8 text-[14vw] font-bold leading-[0.85] tracking-tighter text-white lg:text-[10vw]">
        ¿Empezamos<span className="font-serif font-normal italic text-[#26FFDF]">?</span>
      </h2>
      <p className="relative mt-8 max-w-md text-base leading-relaxed text-textMuted">
        Cuéntanos qué quieres construir. Te proponemos la solución técnica y el plan de trabajo, del primer boceto a la puesta en producción.
      </p>
      <Link
        href="/contratar-software"
        onMouseEnter={() => setCtaHovered(true)}
        onMouseLeave={() => setCtaHovered(false)}
        onFocus={() => setCtaHovered(true)}
        onBlur={() => setCtaHovered(false)}
        className="group relative z-20 mt-10 inline-flex items-center gap-3 rounded-full border border-white/15 px-7 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-white transition-colors hover:border-[#26FFDF]/60 hover:text-[#26FFDF] hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26FFDF]/60"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#26FFDF]" aria-hidden="true" />
        Iniciar un proyecto
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </Link>

      {/* Las tres estatuas, apoyadas en el borde inferior; Odiseo al centro */}
      <div
        className="cta-statues relative mt-auto flex w-full max-w-5xl items-end justify-center gap-2 pt-10 sm:gap-8"
        style={{
          maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
        }}
      >
        <Statue className="aspect-[2/3] h-[20vh] sm:h-[28vh] lg:h-[32vh]">
          <Image
            src={dataService!.imageSrc}
            alt={dataService!.imageAlt}
            fill
            sizes="(min-width: 1024px) 18rem, 30vw"
            className="object-contain object-bottom"
          />
        </Statue>
        <Statue className="aspect-[322/660] h-[26vh] sm:h-[36vh] lg:h-[42vh]" onHoverChange={setOdiseoHovered}>
          <HoverFrameSequence
            frames={odiseoFrames}
            active={odiseoHovered || ctaHovered}
            alt="Odiseo, la estatua de V1TR0, levanta la mano con el símbolo de código"
          />
        </Statue>
        <Statue className="aspect-[2/3] h-[20vh] sm:h-[28vh] lg:h-[32vh]">
          <Image
            src={autoService!.imageSrc}
            alt={autoService!.imageAlt}
            fill
            sizes="(min-width: 1024px) 18rem, 30vw"
            className="object-contain object-bottom"
          />
        </Statue>
      </div>
    </section>
  )
}
