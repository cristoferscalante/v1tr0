"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { servicesData } from "@/components/home/sections/ServicesTabSection"
import { setIntroActive } from "@/lib/intro-store"
import {
  BlogIllustration,
  ProductDeckIllustration,
  WebDeckIllustration,
} from "@/components/home/sections/banner/HeroNavCards"

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Home móvil hecho para móvil: un solo recorrido contado con el scroll
 * (Lenis + GSAP ScrollTrigger). Cada tramo es un "beat" con su mensaje clave:
 *
 * 1. Hero fijado: el escudo se encoge y sube mientras el título entra.
 * 2. Manifiesto: las palabras se encienden una a una con el scroll.
 * 3. Lo que hacemos: tarjetas apiladas (sticky) que se hunden al llegar la siguiente.
 * 4. Proyectos: sección fijada que avanza en horizontal con el scroll vertical.
 *
 * Con reduced-motion no se registra ninguna animación: todo queda visible y quieto.
 */

const STATEMENT = "Diseñamos, programamos y mantenemos software para tu negocio o tu portafolio."

const BEATS = [
  {
    n: "01",
    title: "Desarrollo de software",
    message: "Diseñamos, programamos y mantenemos software para tu negocio o tu portafolio.",
    href: "/servicios",
    Ilustracion: WebDeckIllustration,
  },
  {
    n: "02",
    title: "Tienda",
    message: "Hardware, IoT y sistemas POS listos para vender.",
    href: "/tienda",
    Ilustracion: ProductDeckIllustration,
  },
  {
    n: "03",
    title: "Blog & Investigación",
    message: "Lo que aprendemos sobre IA, datos y software.",
    href: "/blog",
    Ilustracion: BlogIllustration,
  },
]

const publicados = servicesData.flatMap((s) => s.subcategories.flatMap((c) => c.examples.filter((e) => e.href)))
const SELECCION = ["Megudan", "Pet Gourmet", "Mister LYA", "V1TR0 POS", "Portafolio", "TecnoCrypter"]
const proyectos = SELECCION.flatMap((t) => {
  const p = publicados.find((x) => x.title === t)
  return p?.href ? [p] : []
})

const eyebrow = "text-[10px] uppercase tracking-[0.22em] text-[#26FFDF]/80"

export default function MobileHome() {
  const root = useRef<HTMLDivElement>(null)

  // Sin intro en móvil: el header y los botones flotantes entran de una vez
  // (en "/" esperan a que alguien diga que la intro terminó).
  useEffect(() => {
    setIntroActive(false)
  }, [])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // 1. Hero: se fija y el escudo cede el sitio al título
        gsap
          .timeline({ scrollTrigger: { trigger: ".mh-hero", start: "top top", end: "+=110%", pin: true, scrub: 0.6 } })
          .to(".mh-shield", { scale: 0.5, yPercent: -38, rotate: -6, ease: "none" }, 0)
          .from(".mh-line", { yPercent: 110, opacity: 0, stagger: 0.12, ease: "none" }, 0.05)
          .to(".mh-cue", { opacity: 0, ease: "none", duration: 0.2 }, 0)

        // 2. Manifiesto: palabra por palabra
        gsap.fromTo(
          ".mh-word",
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: { trigger: ".mh-statement", start: "top 78%", end: "bottom 50%", scrub: true },
          },
        )

        // 3. Tarjetas apiladas: cada una se hunde cuando llega la siguiente
        const cards = gsap.utils.toArray<HTMLElement>(".mh-card")
        cards.forEach((card, i) => {
          const next = cards[i + 1]
          if (!next) {
            return
          }
          // Solo se achica: sin oscurecer ni transparentar.
          gsap.to(card, {
            scale: 0.92,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top 25%", scrub: true },
          })
        })

        // 4. Proyectos: scroll vertical -> avance horizontal
        const track = root.current?.querySelector<HTMLElement>(".mh-track")
        if (track) {
          const distancia = () => Math.max(0, track.scrollWidth - window.innerWidth)
          gsap.to(track, {
            x: () => -distancia(),
            ease: "none",
            scrollTrigger: {
              trigger: ".mh-projects",
              start: "top top",
              end: () => `+=${distancia()}`,
              pin: true,
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          })
        }
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className="relative text-white">
      {/* 1. HERO */}
      <section className="mh-hero relative flex h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pt-16">
        <div className="mh-shield relative aspect-[551/634] h-[42svh]">
          <Image
            src="/imagenes/logos/escudo-logo-hero.png"
            alt="Escudo de V1TR0"
            fill
            priority
            sizes="70vw"
            className="object-contain"
          />
        </div>
        <h1 className="mt-4 w-full text-left text-[14vw] font-semibold leading-[0.92] tracking-[-0.045em]">
          <span className="sr-only">Desarrollo de software a medida para tu negocio. </span>
          <span aria-hidden="true" className="block overflow-hidden">
            <span className="mh-line block">Software</span>
          </span>
          <span aria-hidden="true" className="block overflow-hidden">
            <span className="mh-line block text-[#26FFDF]">a medida.</span>
          </span>
          <span aria-hidden="true" className="block overflow-hidden">
            <span className="mh-line block text-white/45">Para todos.</span>
          </span>
        </h1>
        <p className="mh-cue absolute bottom-[max(2rem,env(safe-area-inset-bottom))] text-[10px] uppercase tracking-[0.3em] text-white/40">
          Desliza ↓
        </p>
      </section>

      {/* 2. MANIFIESTO */}
      <section className="mh-statement px-5 py-[16vh]">
        <p className={eyebrow}>Quiénes somos</p>
        <p className="mt-5 text-[9.5vw] font-semibold leading-[1.06] tracking-[-0.03em]">
          {STATEMENT.split(" ").map((w, i) => (
            <span key={i} className="mh-word mr-[0.24em] inline-block">
              {w}
            </span>
          ))}
        </p>
      </section>

      {/* 3. LO QUE HACEMOS (tarjetas apiladas) */}
      <section className="px-4 pb-[8vh]">
        <p className={`${eyebrow} px-1 pb-5`}>Lo que hacemos</p>
        {BEATS.map((b) => (
          <Link
            key={b.href}
            href={b.href}
            // Misma altura para todas: al apilarse, ninguna asoma por debajo de la de delante.
            className="mh-card sticky top-[13svh] mb-[9vh] flex min-h-[66svh] flex-col origin-top overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#0b0f10] p-6 hover:no-underline"
          >
            <div className="flex items-baseline justify-between text-[11px] uppercase tracking-[0.22em] text-white/40">
              <span>{b.n}</span>
              <span className="text-[#26FFDF]">Ver →</span>
            </div>
            {/* La ilustración que acompaña a cada sección (mazo de webs,
                carrusel de productos, mazo de artículos), no la estatua */}
            <div className="relative mt-4 h-[26svh] w-full">
              <b.Ilustracion />
            </div>
            <h2 className="mt-4 text-[2rem] font-semibold leading-tight tracking-[-0.03em] text-[#26FFDF]">{b.title}</h2>
            <p className="mt-2 text-base leading-snug text-white/65">{b.message}</p>
          </Link>
        ))}
      </section>

      {/* 4. PROYECTOS (horizontal con scroll vertical) */}
      <section className="mh-projects relative h-[100svh] overflow-hidden">
        <div className="absolute inset-x-0 top-[14svh] px-5">
          <p className={eyebrow}>En producción</p>
          <h2 className="mt-2 text-[2.4rem] font-semibold leading-[0.98] tracking-[-0.03em]">Nuestros proyectos</h2>
        </div>
        <div className="mh-track absolute bottom-[12svh] left-0 flex gap-4 pl-5 pr-[12vw]">
          {proyectos.map((p) => (
            <a
              key={p.title}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-[78vw] shrink-0 hover:no-underline"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10">
                <Image src={p.image} alt={p.title} fill sizes="80vw" className="object-cover object-top" />
              </div>
              <p className="mt-3 text-lg font-semibold">{p.title}</p>
              <p className="text-xs text-white/45">{p.description}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
