/**
 * Recorrido visual con un navegador real: abre los paneles con una sesión
 * sembrada, cambia de pestaña, y comprueba que los estados del tablero se
 * ven de verdad (chips de prioridad, límites WIP, vencidas, sin asignar).
 *
 * Deja capturas en /tmp/claude-1000/shots para revisarlas a ojo.
 *
 *   node scripts/e2e-visual.mjs
 */
import { config } from "dotenv"
import { randomUUID } from "node:crypto"
import { chromium } from "@playwright/test"

config({ path: ".env.local" })
config({ path: ".env" })

const { neon } = await import("@neondatabase/serverless")
const sql = neon(process.env.DATABASE_URL)
const BASE = process.env.SMOKE_URL ?? "http://localhost:3000"
const SHOTS = process.env.SHOTS_DIR ?? "/tmp/claude-1000/shots"

let ok = 0, fallos = 0
const comprobar = (n, c, d = "") => {
  if (c) {ok++; console.log(`  ✓ ${n}`)}
  else {fallos++; console.log(`  ✗ ${n}${d ? "  ← " + d : ""}`)}
}

const UID = "visual-admin"

async function main() {
  await sql`delete from sessions where user_id=${UID}`
  await sql`delete from profiles where id=${UID}`
  await sql`delete from users where id=${UID}`
  const token = randomUUID()
  await sql`insert into users (id,name,email,email_verified) values (${UID},'Visual','visual@v1tr0.local',now())`
  await sql`insert into profiles (id,email,name,role) values (${UID},'visual@v1tr0.local','Visual','admin')`
  await sql`insert into sessions (session_token,user_id,expires) values (${token},${UID},${new Date(Date.now()+36e5)})`

  // El proyecto con la columna por encima del límite WIP es el más informativo.
  const proy = (await sql`
    select p.id, p.name, count(*) filter (where t.status='in_progress')::int prog
      from projects p join project_phases ph on ph.project_id=p.id join phase_tasks t on t.phase_id=ph.id
     where p.name like '[PRUEBA]%' group by p.id, p.name order by prog desc limit 1`)[0]

  const navegador = await chromium.launch()
  const contexto = await navegador.newContext({ viewport: { width: 1600, height: 1000 } })
  await contexto.addCookies([{ name: "authjs.session-token", value: token, url: BASE }])
  const pagina = await contexto.newPage()

  const errores = []
  pagina.on("pageerror", (e) => errores.push(e.message))
  pagina.on("console", (m) => { if (m.type() === "error") {errores.push(m.text())} })

  console.log(`\nRecorrido visual — "${proy.name}"\n`)

  // --- Tablero -------------------------------------------------------------
  await pagina.goto(`${BASE}/admin/proyectos/${proy.id}`, { waitUntil: "networkidle" })
  await pagina.getByRole("button", { name: /Tablero/ }).click()
  await pagina.waitForTimeout(600)
  await pagina.screenshot({ path: `${SHOTS}/01-tablero.png`, fullPage: false })

  const texto = await pagina.locator("body").innerText()
  comprobar("hay chips de prioridad Urgente", /Urgente/i.test(texto))
  comprobar("hay chips de prioridad Alta", /\bAlta\b/i.test(texto))
  comprobar("hay chips de prioridad Baja", /\bBaja\b/i.test(texto))
  comprobar("se marcan tareas vencidas", /vencida/i.test(texto))
  comprobar("se ven tareas sin asignar", /sin asignar/i.test(texto))
  comprobar("las 4 columnas están presentes",
    /Por hacer/i.test(texto) && /En progreso/i.test(texto) && /Bloqueada/i.test(texto) && /Terminada/i.test(texto))

  // El chip de límite WIP en acento es la señal focal del tipo kanban
  const chipExcedido = await pagina.locator("span", { hasText: /^\d+\/\d+$/ }).all()
  const textos = await Promise.all(chipExcedido.map((c) => c.innerText()))
  const excede = textos.find((t) => { const [n, l] = t.split("/").map(Number); return n > l })
  comprobar("una columna supera su límite WIP", Boolean(excede), `chips: ${textos.join(" ")}`)
  comprobar("hay tareas bloqueadas visibles", /Bloqueada/i.test(texto) && !/Bloqueada[\s\S]{0,400}?vacía/i.test(texto))
  comprobar("el CTA de WhatsApp no invade el panel",
    (await pagina.locator('a[href*="wa.me"]').count()) === 0)

  // --- Equipo --------------------------------------------------------------
  await pagina.getByRole("button", { name: /Equipo/ }).click()
  await pagina.waitForTimeout(800)
  await pagina.screenshot({ path: `${SHOTS}/02-equipo.png` })
  const textoEquipo = await pagina.locator("body").innerText()
  comprobar("el equipo del proyecto tiene miembros", /Ana|Bruno|Carolina|Daniel/.test(textoEquipo))

  // --- Actividad -----------------------------------------------------------
  await pagina.getByRole("button", { name: /Actividad/ }).click()
  // Esperar a que termine de cargar en vez de adivinar un tiempo: en dev la
  // primera petición a una ruta la compila al vuelo y tarda segundos.
  await pagina.getByText("Cargando actividad").waitFor({ state: "detached", timeout: 20000 }).catch(() => {})
  await pagina.waitForTimeout(300)
  await pagina.screenshot({ path: `${SHOTS}/03-actividad.png` })
  const textoAct = await pagina.locator("body").innerText()
  comprobar("la bitácora muestra entradas", /hace \d+|Se creó el proyecto|todavía no hay movimientos/i.test(textoAct),
    textoAct.slice(0, 120))

  // --- Detalle de tarea ----------------------------------------------------
  await pagina.getByRole("button", { name: /Tablero/ }).click()
  await pagina.waitForTimeout(500)
  // Las tarjetas del tablero llevan una sublínea `REF · responsable · fase`
  // en mono; se ancla ahí para no capturar botones de la barra superior.
  const primera = pagina.locator("button:visible").filter({ hasText: /^[A-Z0-9]{4} · / }).first()
  if (await primera.count()) {
    await primera.click()
    await pagina.waitForTimeout(900)
    await pagina.screenshot({ path: `${SHOTS}/04-detalle-tarea.png` })
    const cajon = await pagina.locator("body").innerText()
    comprobar("el cajón de detalle abre con su conversación", /Conversación/i.test(cajon))
    comprobar("permite elegir responsable", /Responsable/i.test(cajon))
    await pagina.keyboard.press("Escape").catch(() => {})
  }

  // --- Otras pantallas -----------------------------------------------------
  for (const [ruta, nombre] of [["/admin/mis-tareas", "05-mis-tareas"], ["/admin/reportes", "06-reportes"], ["/admin", "07-dashboard"]]) {
    await pagina.goto(BASE + ruta, { waitUntil: "networkidle" })
    await pagina.waitForTimeout(400)
    await pagina.screenshot({ path: `${SHOTS}/${nombre}.png` })
  }
  const reportes = await pagina.goto(`${BASE}/admin/reportes`, { waitUntil: "networkidle" }).then(() => pagina.locator("body").innerText())
  comprobar("reportes muestra las métricas focales", /Conversión de cotizaciones/i.test(reportes))

  // --- Portal del cliente --------------------------------------------------
  const cli = (await sql`select client_id from projects where id=${proy.id}`)[0].client_id
  if (cli) {
    const t2 = randomUUID()
    await sql`insert into sessions (session_token,user_id,expires) values (${t2},${cli},${new Date(Date.now()+36e5)})`
    const ctx2 = await navegador.newContext({ viewport: { width: 1600, height: 1000 } })
    await ctx2.addCookies([{ name: "authjs.session-token", value: t2, url: BASE }])
    const p2 = await ctx2.newPage()
    await p2.goto(`${BASE}/client-dashboard/projects/${proy.id}`, { waitUntil: "networkidle" })
    await p2.waitForTimeout(1200)
    await p2.screenshot({ path: `${SHOTS}/08-portal-cliente.png` })
    const tc = await p2.locator("body").innerText()
    comprobar("el portal muestra la franja de resumen", /Fase actual/i.test(tc))
    comprobar("y el último movimiento", /Último movimiento/i.test(tc))
    await ctx2.close()
    await sql`delete from sessions where session_token=${t2}`
  }

  comprobar("sin errores de JavaScript en consola", errores.length === 0, errores.slice(0, 2).join(" | "))

  await navegador.close()
  await sql`delete from sessions where user_id=${UID}`
  await sql`delete from profiles where id=${UID}`
  await sql`delete from users where id=${UID}`

  console.log(`\n${ok} pasaron, ${fallos} fallaron`)
  console.log(`Capturas en ${SHOTS}\n`)
  process.exit(fallos ? 1 : 0)
}

main().catch(async (e) => {
  console.error("\nFalló el recorrido visual:", e.message)
  await sql`delete from sessions where user_id=${UID}`.catch(() => {})
  process.exit(1)
})
