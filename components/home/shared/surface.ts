/**
 * Lenguaje visual compartido del home.
 *
 * Tomado del hero (tarjetas de Servicios / Tienda / Blog): superficies planas
 * y translúcidas, borde teal muy tenue y hover que sube la tarjeta.
 * Sin auras, sin blur-glow y sin sombras de color: el brillo se reserva para
 * las ilustraciones, nunca para los contenedores.
 */

/** Panel o tarjeta base. */
export const surface =
  "rounded-3xl border backdrop-blur-sm transition-all duration-300 bg-white/60 border-[#08A696]/20 dark:bg-[#02505920] dark:border-[#08A696]/15"

/** Añadir a `surface` cuando la tarjeta es interactiva. */
export const surfaceInteractive =
  "hover:-translate-y-1 hover:border-[#08A696]/60 hover:bg-[#c5ebe7] dark:hover:border-[#26FFDF]/60 dark:hover:bg-[#02505950] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26FFDF]/60"

/** Superficie secundaria: piezas dentro de un panel (fichas, miniaturas). */
export const surfaceInner =
  "rounded-xl border backdrop-blur-sm transition-all duration-300 bg-white/50 border-[#08A696]/20 dark:bg-black/20 dark:border-[#0d3d3d]/60"

/** Estado activo de una ficha o pestaña. */
export const surfaceInnerActive =
  "rounded-xl border backdrop-blur-sm transition-all duration-300 bg-[#c5ebe7] border-[#08A696]/50 text-[#08A696] dark:bg-[#0d5d5d]/60 dark:border-[#26FFDF]/40 dark:text-[#26FFDF]"

/** Botón / chip pulsable en reposo. */
export const pill =
  "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-300 bg-white/50 border-[#08A696]/20 text-[#08A696] hover:border-[#08A696]/50 dark:bg-black/20 dark:border-[#0d3d3d]/60 dark:text-textMuted dark:hover:text-textPrimary dark:hover:border-[#26FFDF]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26FFDF]/60"

/** Botón / chip pulsable seleccionado. */
export const pillActive =
  "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-all duration-300 bg-[#c5ebe7] border-[#08A696]/50 text-[#08A696] dark:bg-[#0d5d5d]/60 dark:border-[#26FFDF]/40 dark:text-[#26FFDF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26FFDF]/60"

/** Color de titular de acento. */
export const accentText = "text-[#08A696] dark:text-[#26FFDF]"

/** Eyebrow: la etiqueta pequeña en mayúsculas sobre los títulos. */
export const eyebrow =
  "text-[10px] uppercase tracking-[0.22em] text-[#08A696]/80 dark:text-[#26FFDF]/80"

/** Titular de sección: mismo tamaño en todo el home. */
export const sectionTitle =
  "text-2xl sm:text-3xl md:text-4xl font-bold text-textPrimary leading-tight"
