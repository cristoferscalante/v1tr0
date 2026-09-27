"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { servicesData } from "@/components/home/sections/ServicesTabSection"
import { MiniWindow } from "@/components/home/sections/SubcategoryGalleryTile"
import AnimatedV1tr0Logo from "@/components/about/AnimatedV1tr0Logo"
import { MOCKS, PageMock } from "@/components/servicios/ProjectMockups"
import { subcategoryPageSlugById } from "@/lib/data/servicios"
import { CHAPTER_INTRO, pad, type Service } from "./data"

gsap.registerPlugin(ScrollTrigger, useGSAP)

/** Fondo de cada capítulo: tres tonos oscuros para que se note cuál tapa a cuál. */
const TONES = ["#0b0f0f", "#06201e", "#0f1515"]

/**
 * Una especialidad de la categoría: su proyecto publicado (o una maqueta si
 * aún no hay), su nombre y lo que resuelve. Enlaza a su página si existe.
 */
function SubcategoryCard({ sub, index }: { sub: Service["subcategories"][number]; index: number }) {
  const example = sub.examples[0]
  const Mock = MOCKS[sub.id] ?? PageMock
  const slug = subcategoryPageSlugById[sub.id]
  const count = sub.examples.length

  const body = (
    <>
      <div className="relative aspect-[16/10]">
        <MiniWindow ghost={!example}>
          {example ? (
            <Image
              src={example.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 15rem, 45vw"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 p-1.5">
              <div className="relative h-full w-full">
                <Mock />
              </div>
            </div>
          )}
        </MiniWindow>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-[10px] tabular-nums text-white/35">{pad(index + 1)}</span>
        <span className="text-base font-semibold leading-tight text-white transition-colors group-hover:text-[#26FFDF]">
          {sub.name}
        </span>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-textMuted">{sub.description}</p>
      <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-[#26FFDF]/60">
        {count > 0 ? `${pad(count)} ${count === 1 ? "proyecto publicado" : "proyectos publicados"}` : "En maqueta"}
        {slug && <span className="text-white/40"> · ver detalle →</span>}
      </p>
    </>
  )

  return slug ? (
    <Link
      href={`/servicios/${slug}`}
      className="chapter-card group block hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26FFDF]/60"
    >
      {body}
    </Link>
  ) : (
    <div className="chapter-card group">{body}</div>
  )
}

/**
 * Un capítulo por categoría de servicio. En escritorio cada uno se queda fijo
 * a pantalla completa y el siguiente sube por encima; el de atrás se
 * oscurece. Una línea arriba marca cuánto falta para pasar al siguiente.
 */
export default function ServiciosChapters() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Titular de la sección: las letras suben desde una máscara
        gsap.from(".chapters-title-char", {
          yPercent: 110,
          stagger: 0.035,
          duration: 0.9,
          ease: "power4.out",
          scrollTrigger: { trigger: ".chapters-title", start: "top 80%" },
        })

        gsap.utils.toArray<HTMLElement>(".chapter").forEach((chapter) => {
          // Nombre de la categoría: cada palabra sube desde su máscara
          gsap.from(chapter.querySelectorAll(".chapter-word"), {
            yPercent: 110,
            stagger: 0.08,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: { trigger: chapter, start: "top 65%" },
          })
          gsap.from(chapter.querySelectorAll(".chapter-reveal, .chapter-card"), {
            y: 30,
            opacity: 0,
            stagger: 0.08,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: chapter, start: "top 55%" },
          })
        })
      })

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const chapters = gsap.utils.toArray<HTMLElement>(".chapter")
        chapters.forEach((chapter, index) => {
          // Progreso del capítulo mientras está fijo
          gsap.fromTo(
            chapter.querySelector(".chapter-progress"),
            { scaleX: 0 },
            { scaleX: 1, ease: "none", scrollTrigger: { trigger: chapter, start: "top top", end: "+=100%", scrub: true } },
          )
          // Cuando llega el siguiente, este se atenúa con un velo interno. Sin
          // escalar: al encogerse dejaba ver sus bordes como un marco negro.
          const next = chapters[index + 1]
          if (next) {
            gsap.fromTo(
              chapter.querySelector(".chapter-dim"),
              { opacity: 0 },
              {
                opacity: 0.6,
                ease: "none",
                scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true },
              },
            )
          }
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="capitulos" className="relative bg-[#080c0c]">
      {/* Encabezado de la sección */}
      <div className="mx-auto max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-10 lg:pt-36 lg:pb-24">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-start">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/50">
            <span className="text-white/30">02</span>&nbsp;&nbsp;Cómo lo construimos
          </p>
          <p className="max-w-md text-base leading-relaxed text-textMuted lg:text-lg">
            Tres líneas de desarrollo que se potencian: el software que construimos genera datos, y los datos muestran qué conviene automatizar.
          </p>
        </div>
        <h2 className="chapters-title mt-14 flex flex-wrap items-baseline gap-x-[3vw] lg:mt-20">
          <span className="flex items-center gap-[1.5vw]">
            <span className="font-serif text-[13vw] italic leading-none text-white/45 lg:text-[7vw]">Todo es</span>
            {/* Logo de V1TR0 dibujándose en código binario: el software, literal */}
            <span aria-hidden="true" className="pointer-events-none block h-[16vw] w-[16vw] lg:h-[8vw] lg:w-[8vw]">
              <AnimatedV1tr0Logo />
            </span>
          </span>
          <span className="flex overflow-hidden text-[18vw] font-bold uppercase leading-[0.85] tracking-tight text-white lg:text-[11.5vw]">
            {"Software".split("").map((char, i) => (
              <span key={i} className="chapters-title-char inline-block">
                {char}
              </span>
            ))}
          </span>
        </h2>
      </div>

      {servicesData.map((service, index) => (
        <article
          key={service.id}
          id={service.id}
          className="chapter relative lg:sticky lg:top-0 lg:h-screen"
          style={{ zIndex: index + 1 }}
        >
          <div
            className="chapter-inner relative flex h-full flex-col overflow-hidden border-t border-white/[0.08]"
            style={{ backgroundColor: TONES[index % TONES.length] }}
          >
            {/* Velo que oscurece el capítulo cuando el siguiente lo tapa */}
            <span aria-hidden="true" className="chapter-dim pointer-events-none absolute inset-0 z-10 bg-[#050808] opacity-0" />

            {/* Línea de progreso */}
            <span aria-hidden="true" className="chapter-progress absolute left-0 top-0 h-px w-full origin-left bg-[#26FFDF]/70" />

            <div className="mx-auto grid w-full max-w-7xl flex-1 gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[9rem_minmax(0,1fr)] lg:gap-12 lg:px-10 lg:py-0 lg:pt-28 lg:pb-14">
              {/* Número y línea */}
              <div className="lg:border-r lg:border-white/10">
                <p className="text-6xl font-bold leading-none tracking-tight text-white/90">{pad(index + 1)}</p>
                <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-white/45">{service.shortTitle}</p>
              </div>

              <div className="flex flex-col justify-center">
                {/* Categoría y qué resuelve */}
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end lg:gap-12">
                  {/* Flex en vez de líneas de texto: cada palabra es una caja con su
                      máscara y el acento de la Ó no abre hueco entre renglones.
                      La máscara recorta solo en vertical: nunca corta una palabra. */}
                  <h3 className="flex flex-wrap gap-x-[0.22em] text-[12vw] font-bold uppercase leading-[0.9] tracking-tighter text-white lg:text-[clamp(2.75rem,4vw,4rem)]">
                    {service.title.split(" ").map((word, i) => (
                      <span key={i} className="block pt-[0.1em] pb-[0.04em] [overflow-x:visible] [overflow-y:clip]">
                        <span className="chapter-word block">{word}</span>
                      </span>
                    ))}
                  </h3>
                  <p className="chapter-reveal max-w-md text-base leading-relaxed text-textMuted lg:text-lg">
                    {CHAPTER_INTRO[service.id]}
                  </p>
                </div>

                {/* Sus especialidades, explicadas una por una */}
                <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 border-t border-white/10 pt-8 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
                  {service.subcategories.map((sub, subIndex) => (
                    <SubcategoryCard key={sub.id} sub={sub} index={subIndex} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}
