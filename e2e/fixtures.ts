import { test as base, type BrowserContext } from "@playwright/test"
import { seedSession, cleanupSession } from "./seed-session"

/**
 * `authedContext`: un contexto de navegador ya autenticado como el usuario
 * de prueba, inyectando la cookie de sesión de NextAuth.
 */
export const test = base.extend<{ authedContext: BrowserContext }>({
  authedContext: async ({ browser, baseURL }, use) => {
    const { sessionToken } = await seedSession()
    const context = await browser.newContext()
    const url = new URL(baseURL ?? "http://localhost:3000")
    await context.addCookies([
      {
        // En desarrollo (http) NextAuth v5 no antepone el prefijo __Secure-.
        name: url.protocol === "https:" ? "__Secure-authjs.session-token" : "authjs.session-token",
        value: sessionToken,
        domain: url.hostname,
        path: "/",
        httpOnly: true,
        secure: url.protocol === "https:",
        sameSite: "Lax",
      },
    ])
    await use(context)
    await context.close()
    await cleanupSession()
  },
})

export { expect } from "@playwright/test"
