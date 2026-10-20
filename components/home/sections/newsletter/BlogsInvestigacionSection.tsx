"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Check, Loader2 } from "lucide-react"
import { accentText, eyebrow, sectionTitle } from "@/components/home/shared/surface"

/**
 * Blogs & Investigación: cierre de la home, antes del footer.
 *
 * Captura correos para el newsletter de V1TR0, que publicará investigación
 * sobre IA, ciencia de datos y desarrollo de software en el blog. El formulario
 * envía a /api/newsletter; sin backend de email configurado, la suscripción se
 * acepta igual para que la experiencia no se corte.
 *
 * Lenguaje visual sobrio del home: superficie plana translúcida, acento teal
 * solo en texto y foco, sin auras ni sombras de color. Las animaciones respetan
 * reduced-motion.
 */

const TEMAS = ["Inteligencia Artificial", "Ciencia de Datos", "Desarrollo de Software"]

type Estado = "idle" | "loading" | "ok" | "error"

export default function BlogsInvestigacionSection() {
  const [email, setEmail] = useState("")
  const [website, setWebsite] = useState("") // honeypot
  const [estado, setEstado] = useState<Estado>("idle")
  const [mensaje, setMensaje] = useState("")

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
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/[0.07] bg-white/[0.015] p-7 text-center backdrop-blur-sm transition-colors duration-300 hover:border-white/15 sm:rounded-[2.5rem] sm:p-10"
      >
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
            {/* Honeypot: invisible para humanos, delator de bots. display:none
                para que nunca se vea ni ocupe espacio. */}
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
      </motion.div>
    </section>
  )
}
