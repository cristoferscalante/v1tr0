"use client"

import { forwardRef, useRef } from "react"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { GitHubIcon } from "@/lib/icons"
import Image from "next/image"
import Link from "next/link"
import useSnapAnimations from '@/hooks/use-snap-animations'
import { usePathname } from "next/navigation"
import { siteConfig } from "@/config/site"
import { ubicacionPages } from "@/lib/data/ubicaciones"

import {
  LinkedInIcon,
  EmailIcon,
  TikTokIcon,
} from "@/lib/icons"

/**
 * Pie de página del sitio.
 *
 * Es un mapa del sitio, no un espacio publicitario. Antes vivían aquí tres
 * tarjetas decorativas ("Desarrollo", "Diseño", "Innovación") que ocupaban un
 * tercio del alto y no enlazaban a ninguna parte: en un pie, cada bloque que
 * no es un enlace es autoridad interna que se deja de repartir a las páginas
 * que sí interesa posicionar.
 *
 * Todos los datos salen de `config/site.ts`. Eso no es preferencia de estilo:
 * la ficha de contacto de aquí abajo y el `LocalBusiness` de los datos
 * estructurados tienen que decir exactamente lo mismo, porque Google contrasta
 * uno contra otro. Con una sola fuente, no pueden discrepar.
 */

const socialLinks = [
  { icon: <GitHubIcon className="w-5 h-5" />, href: siteConfig.social.github, label: "GitHub V1TR0" },
  { icon: <LinkedInIcon className="w-5 h-5" />, href: siteConfig.social.linkedin, label: "LinkedIn V1TR0" },
  { icon: <TikTokIcon className="w-5 h-5" />, href: siteConfig.social.tiktok, label: "TikTok V1TR0" },
  { icon: <EmailIcon className="w-5 h-5" />, href: `mailto:${siteConfig.company.email}`, label: "Enviar correo a V1TR0" },
]

/** Columna de servicios: las rutas por las que entra un cliente que ya decidió. */
const serviciosLinks = [
  { href: "/contratar-software", label: "Contratar software" },
  { href: "/hardware-iot", label: "Hardware e IoT" },
  { href: "/servicios/ecommerce", label: "Comercio electrónico" },
  { href: "/servicios/landing-pages", label: "Landing pages" },
  { href: "/tienda", label: "Tienda" },
]

/** Columna de empresa: lo que se consulta antes de decidir. */
const empresaLinks = [
  { href: "/about", label: "Nosotros" },
  { href: "/portfolio", label: "Portafolio" },
  { href: "/blog", label: "Blog" },
  { href: "/servicios", label: "Todos los servicios" },
]

const legalLinks = [
  { href: "/terminos", label: "Términos" },
  { href: "/privacidad", label: "Privacidad" },
  { href: "/cookies", label: "Cookies" },
]

interface FooterSectionProps {
  className?: string;
}

const FooterSection = forwardRef<HTMLDivElement, FooterSectionProps>(() => {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  // La tienda usa su propio sistema de superficies (ver .shop-* en globals.css)
  const pathname = usePathname()
  const isShop = pathname?.startsWith("/tienda") ?? false
  const sectionRef = useRef<HTMLDivElement>(null)

  useSnapAnimations({
    sections: ['.footer-section'],
    duration: 0.8,
    enableCircularNavigation: false,
    singleAnimation: true,
    onSnapComplete: () => {
      // Footer animation completed
    }
  })

  const tituloColumna = `text-xs font-semibold uppercase tracking-wider mb-4 ${
    isDark ? "text-[#26FFDF]/70" : "text-[#085c54]/80"
  }`

  const enlaceColumna =
    "text-sm text-[#04423c] dark:text-[#b2fff6] transition-colors duration-200 hover:text-[#08A696] dark:hover:text-[#26FFDF]"

  return (
    <footer
      ref={sectionRef}
      role="contentinfo"
      /*
        Altura natural, no `min-h-screen`.
        Con alto de pantalla forzado y contenido centrado verticalmente, todo
        lo que excede el viewport se recorta por arriba y por abajo a la vez
        —los legales desaparecían en pantallas cortas—. Un pie debe medir lo
        que mide su contenido.
      */
      className={`footer-section w-full ${
        isShop
          ? (isDark ? "bg-[#1e2123]" : "bg-[#e6f7f6] backdrop-blur-sm")
          : (isDark ? "bg-[#02505931] backdrop-blur-sm" : "bg-[#e6f7f6] backdrop-blur-sm")
      } pt-16 sm:pt-20 pb-24 sm:pb-12 px-4 sm:px-6 font-sans relative`}
      aria-label="Pie de página V1TR0"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="footer-header animate-element text-center mb-12 sm:mb-14 relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#04423c] dark:text-[#26FFDF]">
            Impulsando tu Éxito Digital
          </h2>
          <div
            className={`w-16 sm:w-20 h-1 ${
              isDark
                ? "bg-gradient-to-r from-[#08A696] to-[#26FFDF]"
                : "bg-gradient-to-r from-[#08A696] to-[#1e7d7d]"
            } mx-auto mt-5 rounded-full`}
          />
        </div>

        {/*
          Cuatro columnas en escritorio, dos en tableta, una en celular.
          La de marca va primera porque es la que carga la ficha NAP: si el
          espacio obliga a apilar, el dato de contacto queda arriba.
        */}
        <div className="footer-grid animate-element relative z-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <address className="not-italic">
            {/*
              El isotipo tiene dos versiones: la de modo claro lleva el trazo
              en verde oscuro para que contraste sobre fondo blanco. Va marcado
              como decorativo porque la razón social lo acompaña justo debajo.
            */}
            <Image
              src={isDark ? "/imagenes/logos/v1tr0-logo.svg" : "/imagenes/logos/Imagotipo%20%20modo%20claro5.svg"}
              alt=""
              aria-hidden="true"
              width={56}
              height={48}
              className="mb-4 h-12 w-auto"
              priority={false}
            />
            <p className="text-lg font-bold text-[#04423c] dark:text-[#26FFDF]">{siteConfig.company.legalName}</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#04423c]/80 dark:text-[#b2fff6]/80">
              Software a medida, hardware e IoT desde {siteConfig.company.address.city}, {siteConfig.company.address.region}.
            </p>
            <div className="mt-5 space-y-1.5 text-sm text-[#04423c] dark:text-[#b2fff6]">
              <p>{siteConfig.company.address.street}</p>
              <p>
                {siteConfig.company.address.city}, {siteConfig.company.address.region}, {siteConfig.company.address.country}
              </p>
              <p>
                <a
                  href={`tel:${siteConfig.company.phoneE164}`}
                  className="font-semibold text-[#085c54] transition-colors hover:text-[#08A696] dark:text-[#26FFDF] dark:hover:text-[#b2fff6]"
                >
                  {siteConfig.company.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${siteConfig.company.email}`} className={enlaceColumna}>
                  {siteConfig.company.email}
                </a>
              </p>
              <p className="text-[#04423c]/60 dark:text-[#b2fff6]/60">Lunes a viernes, 8:00 a 18:00</p>
            </div>
          </address>

          <nav aria-label="Servicios">
            <h3 className={tituloColumna}>Servicios</h3>
            <ul className="space-y-2.5">
              {serviciosLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} prefetch={false} className={enlaceColumna}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Cobertura">
            <h3 className={tituloColumna}>Cobertura</h3>
            {/*
              Sin estos enlaces las páginas por ubicación serían huérfanas:
              alcanzables solo desde el sitemap, sin autoridad interna que las
              respalde. El pie las conecta con todas las páginas del sitio.
            */}
            <ul className="space-y-2.5">
              {ubicacionPages.map((page) => (
                <li key={page.slug}>
                  <Link href={`/${page.slug}`} prefetch={false} className={enlaceColumna}>
                    Software en {page.lugar}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Empresa">
            <h3 className={tituloColumna}>Empresa</h3>
            <ul className="space-y-2.5">
              {empresaLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} prefetch={false} className={enlaceColumna}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div
          /*
            El sangrado izquierdo en escritorio y el respiro inferior en móvil
            dejan libre la esquina donde vive el botón flotante de WhatsApp,
            que es `fixed` y por tanto se monta sobre lo que quede al final del
            scroll: sin esto, tapaba el aviso de copyright.
          */
          className={`footer-bottom animate-element relative z-10 mt-12 flex flex-col items-center gap-6 border-t pt-8 sm:mt-14 md:flex-row md:justify-between md:pl-20 ${
            isDark ? "border-[#08A696]/20" : "border-[#08A696]/30"
          }`}
        >
          <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:gap-5 sm:text-left">
            <p className="text-sm font-medium text-[#04423c] dark:text-[#b2fff6]">
              &copy; {new Date().getFullYear()} {siteConfig.name}
            </p>
            <nav className="flex gap-4" aria-label="Navegación legal">
              {legalLinks.map((link) => (
                <Link key={link.href} href={link.href} prefetch={false} className={enlaceColumna}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex gap-3" aria-label="Redes sociales">
            {socialLinks.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                aria-label={link.label}
                className="flex items-center justify-center rounded-xl border border-[#08A696]/60 bg-white/70 p-2.5 text-[#085c54] transition-colors duration-300 hover:border-[#08A696] hover:bg-[#08A696]/10 dark:border-[#08A696]/40 dark:bg-[#08A696]/15 dark:text-[#26FFDF] dark:hover:border-[#26FFDF] dark:hover:bg-[#08A696]/30"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
})

FooterSection.displayName = "FooterSection"

export default FooterSection
