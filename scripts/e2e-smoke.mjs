/**
 * Recorrido de humo sobre los paneles, con una sesión sembrada.
 *
 * El login es solo Google OAuth, así que la sesión se inserta directamente en
 * la base (mismo truco que `e2e/seed-session.ts`) y se borra al terminar.
 * Comprueba código HTTP y ausencia de errores de runtime en el HTML.
 *
 *   node scripts/e2e-smoke.mjs [rol]     rol: admin (por defecto) | client
 */
import { config } from "dotenv"
import { randomUUID } from "node:crypto"

config({ path: ".env.local" })
config({ path: ".env" })

const { neon } = await import("@neondatabase/serverless")
const sql = neon(process.env.DATABASE_URL)

const BASE = process.env.SMOKE_URL ?? "http://localhost:3000"
const rol = process.argv[2] === "client" ? "client" : "admin"
const UID = `smoke-${rol}`
const TOKEN = randomUUID()

const limpiar = async () => {
  await sql`delete from sessions where user_id = ${UID}`
  await sql`delete from profiles where id = ${UID}`
  await sql`delete from users where id = ${UID}`
}

async function main() {
  await limpiar()

  // Para el recorrido de cliente hace falta ser dueño de un proyecto.
  const proyecto = (await sql`select id, name, client_id from projects where name like '[PRUEBA]%' order by created_at limit 1`)[0]
  if (!proyecto) {throw new Error("No hay proyectos [PRUEBA]; corre antes scripts/seed-demo.mjs")}

  await sql`insert into users (id, name, email, email_verified) values (${UID}, ${"Smoke " + rol}, ${UID + "@v1tr0.local"}, now())`
  await sql`insert into profiles (id, email, name, role) values (${UID}, ${UID + "@v1tr0.local"}, ${"Smoke " + rol}, ${rol})`
  await sql`insert into sessions (session_token, user_id, expires) values (${TOKEN}, ${UID}, ${new Date(Date.now() + 3600000)})`

  const clienteOriginal = proyecto.client_id
  if (rol === "client") {
    await sql`update projects set client_id = ${UID} where id = ${proyecto.id}`
  }

  const rutas = rol === "admin"
    ? [
        ["/admin", "Dashboard"],
        ["/admin/clientes", "Clientes"],
        ["/admin/proyectos", "Proyectos (kanban)"],
        [`/admin/proyectos/${proyecto.id}`, "Detalle de proyecto"],
        ["/admin/mis-tareas", "Mis tareas"],
        ["/admin/reportes", "Reportes"],
        ["/admin/productos", "Productos"],
        ["/admin/paquetes", "Paquetes"],
        ["/admin/cotizaciones", "Cotizaciones"],
        ["/admin/pedidos", "Pedidos"],
        ["/admin/reuniones", "Reuniones"],
        ["/api/notifications", "API notificaciones"],
        ["/api/me/tasks", "API mis tareas"],
        ["/api/admin/team", "API equipo"],
        [`/api/admin/projects/${proyecto.id}/members`, "API miembros"],
        [`/api/admin/projects/${proyecto.id}/activity`, "API actividad"],
      ]
    : [
        ["/client-dashboard", "Portal"],
        ["/client-dashboard/projects", "Mis proyectos"],
        [`/client-dashboard/projects/${proyecto.id}`, "Detalle de proyecto"],
        ["/client-dashboard/orders", "Pedidos"],
        ["/client-dashboard/quotes", "Cotizaciones"],
        ["/client-dashboard/meetings", "Reuniones"],
        ["/client-dashboard/profile", "Perfil"],
        [`/api/projects/${proyecto.id}/details`, "API detalle"],
        [`/api/projects/${proyecto.id}/activity`, "API actividad"],
        ["/api/client-projects", "API proyectos"],
      ]

  const cookie = `authjs.session-token=${TOKEN}`
  let fallos = 0

  console.log(`\nRecorrido como ${rol} — ${BASE}\n`)
  for (const [ruta, etiqueta] of rutas) {
    const t0 = Date.now()
    let estado = "ERR"
    let problema = ""
    try {
      const res = await fetch(BASE + ruta, { headers: { cookie }, redirect: "manual" })
      estado = res.status
      const cuerpo = await res.text()
      if (/Failed query|Only plain objects|Unhandled Runtime|__NEXT_ERROR__/.test(cuerpo)) {
        problema = "error de runtime en el HTML"
      } else if (estado !== 200) {
        problema = `esperaba 200${res.headers.get("location") ? ` → ${res.headers.get("location")}` : ""}`
      }
    } catch (e) {
      problema = e.message
    }
    const ok = !problema
    if (!ok) {fallos++}
    console.log(`  ${ok ? "✓" : "✗"} ${String(estado).padEnd(4)} ${String(Date.now() - t0).padStart(5)}ms  ${etiqueta}${problema ? "  ← " + problema : ""}`)
  }

  if (rol === "client") {
    await sql`update projects set client_id = ${clienteOriginal} where id = ${proyecto.id}`
  }
  await limpiar()

  console.log(fallos ? `\n${fallos} fallo(s)\n` : "\nTodo en verde.\n")
  process.exit(fallos ? 1 : 0)
}

main().catch(async (e) => {
  await limpiar().catch(() => {})
  console.error("Falló el recorrido:", e.message)
  process.exit(1)
})
