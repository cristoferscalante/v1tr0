import type { MetadataRoute } from "next"

import { siteConfig } from "@/config/site"

/** Rutas privadas: el panel, la API y la autenticación nunca se indexan. */
const privateRoutes = ["/api/", "/admin", "/client-dashboard", "/checkout", "/login", "/auth/"]

/**
 * Excepciones dentro de `/api/`.
 *
 * La API está cerrada al rastreo salvo la superficie hecha para agentes, que
 * solo lee y cotiza. La regla más específica gana sobre el `Disallow` general,
 * así que basta con nombrarla. Sin esta excepción el catálogo sería inútil:
 * existiría, pero ningún rastreador tendría permiso para mirarlo.
 */
const allowedRoutes = ["/", "/api/agent/"]

/**
 * Rastreadores de los motores de respuesta, declarados uno por uno.
 *
 * La regla `*` ya los cubriría, pero nombrarlos es deliberado por dos razones:
 *
 *  1. `Google-Extended` no rastrea nada; es la señal que decide si el
 *     contenido puede usarse en Gemini y en las AI Overviews. Sin una regla
 *     propia, un `Disallow` futuro sobre `*` nos sacaría de ahí sin que nadie
 *     se dé cuenta.
 *  2. Varios de estos agentes toman la regla más específica que encuentran y
 *     dejan de leer el resto del archivo. Con un bloque propio, cada uno ve
 *     exactamente el permiso que le corresponde.
 *
 * Aparecer en la respuesta de un asistente exige estar permitido aquí: lo que
 * el rastreador no puede leer, el modelo no puede citar.
 */
const answerEngineAgents = [
  "GPTBot", // OpenAI — entrenamiento
  "OAI-SearchBot", // OpenAI — búsqueda en ChatGPT
  "ChatGPT-User", // OpenAI — navegación a petición del usuario
  "ClaudeBot", // Anthropic — entrenamiento
  "Claude-User", // Anthropic — navegación a petición del usuario
  "Claude-SearchBot", // Anthropic — búsqueda
  "Google-Extended", // Google — Gemini y AI Overviews
  "PerplexityBot", // Perplexity — rastreo
  "Perplexity-User", // Perplexity — asistente
  "Amazonbot",
  "Applebot",
  "Applebot-Extended",
  "meta-externalagent",
  "Meta-ExternalAgent",
  "cohere-ai",
  "Bytespider",
  "YouBot",
  "DuckAssistBot",
  "MistralAI-User",
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: allowedRoutes, disallow: privateRoutes },
      ...answerEngineAgents.map((userAgent) => ({
        userAgent,
        allow: allowedRoutes,
        disallow: privateRoutes,
      })),
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  }
}
