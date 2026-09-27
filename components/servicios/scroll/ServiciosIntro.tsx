"use client"

import { useRef } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { servicesData } from "@/components/home/sections/ServicesTabSection"
import { pad, publishedProjects, subcategoryCount } from "./data"

gsap.registerPlugin(ScrollTrigger, useGSAP)

/** Declaración que se ilumina palabra por palabra; las de `ACCENT` van en itálica de acento. */
const STATEMENT =
  "Somos un estudio de desarrollo de software. Diseñamos y programamos a medida lo que tu negocio necesita: productos web, sistemas para tus datos y automatizaciones que te devuelven tiempo."
const ACCENT = new Set(["software.", "medida", "tiempo."])

const MARQUEE = "Desarrollo de software a medida · "

const STATS = [
  { value: pad(publishedProjects.length), label: "proyectos en producción, diseñados y programados desde cero" },
  { value: pad(servicesData.length), label: "líneas de desarrollo: producto web, datos y automatización" },
  { value: pad(subcategoryCount), label: "especialidades para cubrir tu operación de punta a punta" },
]

/**
 * Apertura de /servicios: un titular gigante que se desliza con el scroll y
 * una declaración que pasa de apagada a encendida a medida que se lee.
 */
export default function ServiciosIntro() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".intro-word",
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: { trigger: ".intro-statement", start: "top 78%", end: "bottom 45%", scrub: true },
          },
        )
        gsap.to(".intro-marquee", {
          xPercent: -30,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        })
        gsap.from(".intro-stat", {
          y: 40,
          opacity: 0,
          stagger: 0.12,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".intro-stats", start: "top 85%" },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className="relative overflow-x-clip pt-28 pb-24 lg:pt-32 lg:pb-40">
      {/* Titular gigante y apagado que corre con el scroll */}
      <div aria-hidden="true" className="intro-marquee whitespace-nowrap text-[18vw] lg:text-[12vw] font-bold leading-none tracking-tighter text-white/[0.05] select-none">
        {MARQUEE.repeat(3)}
      </div>

      <div className="mx-auto mt-10 grid max-w-7xl gap-14 px-4 sm:px-6 lg:mt-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-20 lg:px-10">
        <aside className="intro-stats order-2 lg:order-1">
          {/* Escudo de V1TR0 como sello del estudio */}
          <div className="flex items-center gap-4">
            <Image
              src="/imagenes/logos/escudo-logo.png"
              alt="Escudo de V1TR0"
              width={551}
              height={634}
              className="h-14 w-auto drop-shadow-[0_0_18px_rgba(38,255,223,0.25)]"
            />
            <p className="font-serif text-lg italic text-textMuted">(Servicios)</p>
          </div>
          <dl className="mt-10">
            {STATS.map((stat) => (
              <div key={stat.label} className="intro-stat border-t border-white/10 py-7">
                <dt className="font-serif text-6xl italic leading-none text-white">{stat.value}</dt>
                <dd className="mt-3 max-w-[16rem] text-sm leading-relaxed text-textMuted">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </aside>

        <h1 className="intro-statement order-1 text-[2rem] font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:order-2 lg:text-[3.6rem]">
          {STATEMENT.split(" ").map((word, index) => (
            <span
              key={index}
              className={`intro-word inline-block mr-[0.25em] ${ACCENT.has(word) ? "font-serif italic font-normal text-[#26FFDF]" : ""}`}
            >
              {word}
            </span>
          ))}
        </h1>
      </div>
    </section>
  )
}
