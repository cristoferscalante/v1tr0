"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { ArrowRight, Check, Loader2 } from "lucide-react"
import { accentText, eyebrow, sectionTitle } from "@/components/home/shared/surface"
import type { ProyectoCarrusel } from "@/components/home/sections/proyectos/CarruselCurvo"

/**
 * Blogs & Investigación: cierre de la home, antes del footer.
 *
 * Dos columnas: a la izquierda el newsletter de V1TR0 (correo para avisar de la
 * investigación sobre IA, ciencia de datos y desarrollo que publicamos en el
 * blog); a la derecha un catálogo 3D de los artículos existentes, tarjetas como
 * papeles sobre un cilindro con el mismo efecto del carrusel de proyectos
 * (CarruselCurvo). Al soltar sobre una tarjeta se entra al artículo.
 *
 * Lenguaje visual sobrio del home: superficie plana translúcida, acento teal
 * solo en texto y foco, sin auras ni sombras de color.
 */

// El carrusel es WebGL: solo en el navegador.
const CarruselCurvo = dynamic(() => import("@/components/home/sections/proyectos/CarruselCurvo"), { ssr: false })

const TEMAS = ["Inteligencia Artificial", "Ciencia de Datos", "Desarrollo de Software"]

/** Reserva si /api/blog falla: artículos destacados con portada conocida. */
const FALLBACK: ProyectoCarrusel[] = [
  { title: "Programación con IA", image: "/imagenes/blog/no_es_magia.webp", href: "/blog/programacion-ia-revolucion" },
  { title: "Tecnologías Emergentes", image: "/imagenes/blog/emerge.webp", href: "/blog/tecnologias-emergentes-2024" },
  { title: "Desarrollo Web Moderno", image: "/imagenes/blog/moderno.webp", href: "/blog/desarrollo-web-moderno" },
]

interface BlogMeta {
  title: string
  coverImage: string | null
  slug: string
}

type Estado = "idle" | "loading" | "ok" | "error"

export default function BlogsInvestigacionSection() {
  const [email, setEmail] = useState("")
  const [website, setWebsite] = useState("") // honeypot
  const [estado, setEstado] = useState<Estado>("idle")
  const [mensaje, setMensaje] = useState("")
  const [posts, setPosts] = useState<ProyectoCarrusel[] | null>(null)

  // Catálogo de blogs para el carrusel.
  useEffect(() => {
    let cancelled = false
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data: { posts: BlogMeta[] }) => {
        if (cancelled) { return }
        const mapped = (data.posts ?? [])
          .filter((p) => p.coverImage)
          .map((p) => ({ title: p.title, image: p.coverImage as string, href: `/blog/${p.slug}` }))
        setPosts(mapped.length > 0 ? mapped : FALLBACK)
      })
      .catch(() => {
        if (!cancelled) { setPosts(FALLBACK) }
      })
    return () => { cancelled = true }
  }, [])

  const proyectos = useMemo(() => posts ?? FALLBACK, [posts])

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (estado === "loading") {
      return
    }
    setEstado("loading")
    setMensaje("")
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setEstado("error")
        setMensaje(data.error || "No pudimos registrar tu correo. Intenta de nuevo.")
        return
      }
      setEstado("ok")
      setEmail("")
    } catch {
      setEstado("error")
      setMensaje("Problema de conexión. Intenta de nuevo.")
    }
  }

  return (
    <section className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden px-4 py-20 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-2 lg:items-stretch"
      >
        {/* Columna izquierda: newsletter */}
        <div className="flex flex-col overflow-hidden rounded-[2rem] border border-white/[0.07] bg-white/[0.015] p-7 text-center backdrop-blur-sm transition-colors duration-300 hover:border-white/15 sm:rounded-[2.5rem] sm:p-10">
          <p className={eyebrow}>V1TR0 · Newsletter</p>
          <h2 className={`mt-3 ${sectionTitle}`}>
            Blogs <span className={accentText}>&amp;</span> Investigación
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-textMuted sm:text-base">
            Publicamos investigación sobre inteligencia artificial, ciencia de datos y
            desarrollo de software. Déjanos tu correo y te avisamos cuando salga en el blog.
          </p>

          {/* Temas que cubre el newsletter */}
          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {TEMAS.map((tema) => (
              <li
                key={tema}
                className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-[#26FFDF]/90"
              >
                {tema}
              </li>
            ))}
          </ul>

          {estado === "ok" ? (
            <div
              role="status"
              className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-[#08A696] dark:text-[#26FFDF]"
            >
              <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
              ¡Listo! Te avisaremos cuando publiquemos.
            </div>
          ) : (
            <form onSubmit={enviar} className="mt-8" noValidate>
              {/* Honeypot: invisible para humanos, delator de bots. */}
              <div style={{ display: "none" }} aria-hidden="true">
                <label>
                  No llenar
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </label>
              </div>

              <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
                <label htmlFor="newsletter-email" className="sr-only">
                  Correo electrónico
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (estado === "error") {
                      setEstado("idle")
                    }
                  }}
                  placeholder="tu@correo.com"
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-textPrimary placeholder:text-textMuted/60 transition-colors focus:border-[#26FFDF]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26FFDF]/60"
                />
                <button
                  type="submit"
                  disabled={estado === "loading"}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#08A696]/40 bg-[#c5ebe7] px-5 py-3 text-sm font-semibold text-[#08A696] transition-colors hover:border-[#08A696]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26FFDF]/60 disabled:opacity-60 dark:bg-[#0d5d5d]/60 dark:text-[#26FFDF] dark:hover:border-[#26FFDF]/60"
                >
                  {estado === "loading" ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  )}
                  Suscribirme
                </button>
              </div>

              {estado === "error" && (
                <p role="alert" className="mt-3 text-sm text-red-400">
                  {mensaje}
                </p>
              )}
            </form>
          )}

          <p className="mt-6 text-xs text-textMuted">
            ¿Quieres ver lo que ya hay?{" "}
            <Link href="/blog" className={`font-medium hover:underline ${accentText}`}>
              Ir al blog
            </Link>
          </p>
        </div>

        {/* Columna derecha: catálogo 3D de artículos */}
        <div className="relative flex min-h-[380px] flex-col overflow-hidden rounded-[2rem] border border-white/[0.07] bg-white/[0.015] p-5 backdrop-blur-sm transition-colors duration-300 hover:border-white/15 sm:rounded-[2.5rem] lg:min-h-0">
          <div className="pointer-events-none relative z-10 flex items-center justify-between px-1">
            <p className={eyebrow}>Catálogo</p>
            <span className="text-[10px] uppercase tracking-[0.18em] text-textMuted/70">arrastra para explorar</span>
          </div>
          {/* El carrusel llena el resto de la tarjeta */}
          <div className="relative mt-3 flex-1">
            <CarruselCurvo proyectos={proyectos} className="absolute inset-0 h-full w-full" />
          </div>
        </div>
      </motion.div>
    </section>
  )
}
