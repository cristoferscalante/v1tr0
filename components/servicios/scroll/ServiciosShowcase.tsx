"use client"

import { useRef } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { MiniWindow } from "@/components/home/sections/SubcategoryGalleryTile"
import { MOCKS, PageMock } from "@/components/servicios/ProjectMockups"
import { pad, publishedProjects, upcomingSubcategories } from "./data"

gsap.registerPlugin(ScrollTrigger, useGSAP)

/** Desfase vertical de cada tarjeta: arma la escalera irregular del recorrido. */
const OFFSETS = ["-6%", "9%", "-2%", "12%", "-8%", "5%"]

/** Tono del panel de cada proyecto: variaciones del verde de marca. */
const PANEL_TONES = ["#0c2a27", "#10201f", "#0a3330", "#132523", "#0d2d2a"]

/** Las tres maquetas del cierre del recorrido: lo que viene. */
const UPCOMING_PREVIEW = upcomingSubcategories.filter((sub) => ["dashboards", "bots", "mobile"].includes(sub.id))

const total = publishedProjects.length + 1

/**
 * Proyectos en imagen. En escritorio la sección se fija y el scroll vertical
 * mueve la pista en horizontal: cada captura llega girada en 3D y se
 * endereza al acercarse al centro. En móvil es una lista vertical.
 */
export default function ServiciosShowcase() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const counter = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const distance = () => (track.current ? track.current.scrollWidth - window.innerWidth : 0)

        const move = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${distance()}`,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (counter.current) {
                counter.current.textContent = pad(Math.min(total, Math.floor(self.progress * total) + 1))
              }
            },
          },
        })

        gsap.utils.toArray<HTMLElement>(".showcase-card").forEach((card) => {
          const shot = card.querySelector(".showcase-shot")
          gsap.fromTo(
            shot,
            { rotateY: -28, rotateX: 14, scale: 0.82 },
            {
              rotateY: -6,
              rotateX: 5,
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: card, containerAnimation: move, start: "left right", end: "center 55%", scrub: true },
            },
          )
          gsap.fromTo(
            card.querySelector(".showcase-meta"),
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: card, containerAnimation: move, start: "left 85%", end: "left 55%", scrub: true },
            },
          )
        })

        // El titular se queda atrás un poco más lento que la pista
        gsap.to(".showcase-heading", {
          xPercent: 18,
          opacity: 0.25,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${window.innerWidth * 0.8}`, scrub: true },
        })
      })

      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".showcase-card").forEach((card) => {
          gsap.from(card, {
            y: 60,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%" },
          })
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className="relative overflow-hidden border-t border-white/[0.06] bg-[#080c0c] lg:h-screen">
      {/* Barra superior: sección y contador */}
      <div className="pointer-events-none absolute inset-x-0 top-24 z-10 flex justify-between px-4 text-[11px] uppercase tracking-[0.2em] text-white/50 sm:px-6 lg:top-28 lg:px-10">
        <span>
          <span className="text-white/30">01</span>&nbsp;&nbsp;En producción
        </span>
        <span className="hidden tabular-nums lg:inline">
          <span ref={counter}>01</span> / {pad(total)}
        </span>
      </div>

      <div
        ref={track}
        className="flex flex-col gap-14 px-4 pt-40 pb-24 sm:px-6 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-[4vw] lg:px-[6vw] lg:pt-16 lg:pb-0"
      >
        {/* Titular: primer tramo de la pista */}
        <h2 className="showcase-heading shrink-0 lg:w-[44vw]">
          <span className="block text-[22vw] font-bold uppercase leading-[0.82] tracking-tighter text-white lg:text-[11vw]">
            Mira,
          </span>
          <span className="mt-2 block pl-[12vw] font-serif text-[13vw] italic leading-none text-[#26FFDF] lg:pl-[8vw] lg:text-[6.5vw]">
            antes de leer.
          </span>
          <span className="mt-8 block max-w-sm pl-[12vw] text-base font-normal leading-relaxed text-textMuted lg:pl-[8vw]">
            {pad(publishedProjects.length)} proyectos en producción. Cada uno diseñado, programado y publicado por nosotros, sin plantillas.
          </span>
        </h2>

        {publishedProjects.map((project, index) => (
          <a
            key={project.title}
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="showcase-card group block w-full shrink-0 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26FFDF]/60 sm:w-[80%] lg:w-[clamp(17rem,23vw,23rem)] lg:[transform:translateY(var(--offset))]"
            style={{ "--offset": OFFSETS[index % OFFSETS.length] } as React.CSSProperties}
          >
            <div
              className="relative aspect-[4/4.3] overflow-hidden [perspective:1100px]"
              style={{ backgroundColor: PANEL_TONES[index % PANEL_TONES.length] }}
            >
              <div className="showcase-shot absolute inset-x-[9%] top-[22%] aspect-[16/10] overflow-hidden rounded-md shadow-[0_30px_60px_-20px_rgba(0,0,0,0.85)] [transform:rotateY(-6deg)_rotateX(5deg)] [transform-style:preserve-3d]">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(min-width: 1024px) 23vw, 80vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
            <div className="showcase-meta mt-4 border-t border-white/10 pt-3">
              <div className="flex items-baseline gap-3">
                <span className="text-[10px] tabular-nums text-white/35">{pad(index + 1)}</span>
                <span className="text-2xl font-bold uppercase tracking-tight text-white transition-colors group-hover:text-[#26FFDF]">
                  {project.title}
                </span>
              </div>
              <p className="mt-1 pl-7 text-xs text-white/45">
                {project.subcategory} · {project.category}
              </p>
            </div>
          </a>
        ))}

        {/* Cierre de la pista: maquetas de lo que viene */}
        <a
          href="#capitulos"
          className="showcase-card group block w-full shrink-0 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26FFDF]/60 sm:w-[80%] lg:w-[clamp(17rem,23vw,23rem)]"
        >
          <div className="relative aspect-[4/4.3] overflow-hidden border border-dashed border-[#26FFDF]/20 [perspective:1100px]">
            <div className="showcase-shot absolute inset-0 [transform-style:preserve-3d]">
              {UPCOMING_PREVIEW.map((sub, i) => {
                const Mock = MOCKS[sub.id] ?? PageMock
                return (
                  <div
                    key={sub.id}
                    className="absolute aspect-[16/10] w-[62%]"
                    style={{ left: `${10 + i * 14}%`, top: `${14 + i * 22}%`, zIndex: i }}
                  >
                    <MiniWindow ghost={i !== UPCOMING_PREVIEW.length - 1}>
                      <div className="absolute inset-0 p-1.5">
                        <div className="relative h-full w-full">
                          <Mock />
                        </div>
                      </div>
                    </MiniWindow>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="showcase-meta mt-4 border-t border-white/10 pt-3">
            <div className="flex items-baseline gap-3">
              <span className="text-[10px] tabular-nums text-white/35">{pad(total)}</span>
              <span className="text-2xl font-bold uppercase tracking-tight text-white transition-colors group-hover:text-[#26FFDF]">
                Lo que viene
              </span>
            </div>
            <p className="mt-1 pl-7 text-xs text-white/45">
              {upcomingSubcategories.length} especialidades en desarrollo · ver cómo trabajamos ↓
            </p>
          </div>
        </a>
      </div>
    </section>
  )
}
