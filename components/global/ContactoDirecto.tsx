import { Mail, Send } from "lucide-react"
import { CORREO, correoLink, telegramLink } from "@/lib/contacto"

interface ContactoDirectoProps {
  /** Lo que le interesa a la persona: va en el mensaje de Telegram y en el asunto del correo. */
  interes: string
  titulo?: string
  descripcion?: string
  className?: string
}

/** Bloque de contacto directo: Telegram con el mensaje ya escrito y correo con el asunto listo. */
export default function ContactoDirecto({
  interes,
  titulo = "¿Te interesa? Hablemos",
  descripcion = "Escríbenos por Telegram con el mensaje ya listo o mándanos un correo. Respondemos en horario laboral.",
  className = "",
}: ContactoDirectoProps) {
  return (
    <section
      aria-label="Contacto directo"
      className={`relative overflow-hidden rounded-2xl border border-[#26FFDF]/25 bg-gradient-to-br from-[#0B302D] via-[#062B2D] to-[#030707] p-6 shadow-lg shadow-black/30 md:p-8 ${className}`}
    >
      {/* Isotipo de marca como fondo sutil */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/imagenes/logos/v1tr0-isotipo-linea.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -bottom-10 hidden h-56 w-56 opacity-[0.08] md:block"
      />
      <span className="mb-2 inline-block rounded-full border border-[#26FFDF]/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#26FFDF]/80">
        Contacto directo · V1TR0
      </span>
      <h2 className="m-0 text-xl font-bold text-[#26FFDF] md:text-2xl">{titulo}</h2>
      <p className="mt-2 mb-5 text-sm leading-relaxed text-[#b9c9c8] md:text-base">{descripcion}</p>
      <div className="relative flex flex-col gap-3 sm:flex-row">
        <a
          href={telegramLink(interes)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#229ED9] px-5 py-3 text-sm font-semibold text-white no-underline transition-colors hover:bg-[#1c8cc2]"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          Escribir por Telegram
        </a>
        <a
          href={correoLink(interes)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#26FFDF]/40 px-5 py-3 text-sm font-semibold text-[#26FFDF] no-underline transition-colors hover:bg-[#26FFDF]/10"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          {CORREO}
        </a>
      </div>
    </section>
  )
}
