import { defineConfig, devices } from "@playwright/test"
import { readFileSync } from "node:fs"

/**
 * Next carga .env.local por su cuenta, pero el proceso de Playwright no.
 * El seed y el teardown hablan con la base directamente, así que necesitan
 * DATABASE_URL en el entorno.
 */
for (const file of [".env.local", ".env"]) {
  try {
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line)
      if (!match) {continue}
      const [, key, rawValue] = match
      if (!key || process.env[key]) {continue}
      process.env[key] = rawValue!.trim().replace(/^["']|["']$/g, "")
    }
  } catch {
    // El archivo puede no existir (CI usa variables reales del entorno).
  }
}

const PORT = process.env.E2E_PORT ?? "3000"
const BASE_URL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`

export default defineConfig({
  testDir: "./e2e",
  /**
   * Salida fuera del árbol del proyecto.
   *
   * Con la carpeta por defecto (./test-results), cada screenshot y traza que
   * escribe Playwright dispara el watcher del dev server de Next, que
   * recompila en mitad de la corrida y llega a servir manifiestos a medio
   * escribir (500 en páginas y "Unexpected end of JSON input").
   */
  outputDir: process.env.E2E_OUTPUT_DIR ?? "/tmp/v1tr0-e2e-results",
  // El flujo de compra toca una base compartida: en serie para que el
  // carrito de un test no pise al del siguiente.
  workers: 1,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  globalSetup: "./e2e/global-setup.ts",
  globalTeardown: "./e2e/global-teardown.ts",
  // El dev server de Next compila bajo demanda: la primera visita a una ruta
  // puede tardar bastante más que un build ya calentado.
  timeout: 90_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "mobile", use: { ...devices["Pixel 7"] } },
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
  ],
  /**
   * Por defecto se asume que ya hay un servidor escuchando en BASE_URL.
   *
   * No se arranca uno automáticamente: si el puerto está ocupado, Next levanta
   * otro proceso en un puerto distinto que comparte el directorio .next con el
   * primero, y ambos se sobrescriben los manifiestos (errores de
   * "Cannot find module" y páginas que dejan de hidratar).
   *
   * Para que Playwright lo levante él mismo: E2E_START_SERVER=1.
   */
  ...(process.env.E2E_START_SERVER
    ? {
        webServer: {
          command: "npm run dev",
          url: BASE_URL,
          reuseExistingServer: false,
          timeout: 180_000,
        },
      }
    : {}),
})
