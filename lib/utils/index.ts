/**
 * Utilidades centralizadas para el blog
 */

/**
 * Función universal para crear slugs consistentes a partir de texto
 * Maneja correctamente caracteres especiales y acentos del español
 */
export function slugify(text: string): string {
  if (!text) {
    return ""
  }

  return (
    text
      .toString()
      .toLowerCase()
      // Normaliza el texto para eliminar acentos y diacríticos
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      // Caracteres especiales del español
      .replace(/[áàäâãåą]/g, "a")
      .replace(/[éèëêę]/g, "e")
      .replace(/[íìïîį]/g, "i")
      .replace(/[óòöôõø]/g, "o")
      .replace(/[úùüûů]/g, "u")
      .replace(/[ñń]/g, "n")
      .replace(/[çć]/g, "c")
      .replace(/[ß]/g, "ss")
      .replace(/[ÿ]/g, "y")
      // Elimina todos los caracteres que no sean letras, números, guiones o espacios
      .replace(/[^a-z0-9\s-]/g, "")
      // Reemplaza espacios con guiones
      .replace(/[\s_]+/g, "-")
      // Elimina guiones duplicados
      .replace(/-+/g, "-")
      // Elimina guiones al inicio o final
      .replace(/^-+|-+$/g, "")
  )
}

/**
 * Busca un elemento por su ID o encuentra la mejor coincidencia por texto
 * @param searchId - ID a buscar
 * @param searchText - Texto a buscar como alternativa
 * @returns El elemento encontrado o null
 */
export function findElementByIdOrText(searchId: string, searchText: string): HTMLElement | null {
  if (typeof document === "undefined") {
    return null
  }

  // Intento 1: buscar por ID directamente
  const element = document.getElementById(searchId)
  if (element) {
    return element
  }

  // Intento 2: buscar todos los encabezados
  const headings = document.querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, h6")

  // Normalizar el texto de búsqueda
  const normalizedSearchText = searchText
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")

  // Buscar por contenido de texto exacto
  for (const heading of Array.from(headings)) {
    const headingText = heading.textContent?.trim() || ""
    const normalizedHeadingText = headingText
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")

    if (normalizedHeadingText === normalizedSearchText) {
      // Si encontramos el encabezado pero no tiene ID, asignarlo
      if (!heading.id) {
        heading.id = searchId
      }
      return heading
    }
  }

  // Intento 3: buscar por coincidencia parcial
  for (const heading of Array.from(headings)) {
    const headingText = heading.textContent?.trim() || ""
    const normalizedHeadingText = headingText
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")

    if (normalizedHeadingText.includes(normalizedSearchText) || normalizedSearchText.includes(normalizedHeadingText)) {
      // Si encontramos una coincidencia parcial
      if (!heading.id) {
        heading.id = searchId
      }
      return heading
    }
  }

  // No se encontró ningún elemento
  return null
}

/**
 * Función de utilidad para registrar todos los encabezados para depuración
 */
export function logAllHeadings() {
  if (typeof document === "undefined") {
    return
  }

  // Debug logs removed for production
}

/**
 * Calcula el tiempo de lectura estimado para un texto
 * @param text - Texto para calcular el tiempo de lectura
 * @returns Tiempo de lectura formateado
 */
export function calculateReadingTime(text: string): string {
  if (!text) {
    return "1 min read"
  }

  const wordsPerMinute = 200
  const wordCount = text.split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute))

  return `${minutes} min read`
}
