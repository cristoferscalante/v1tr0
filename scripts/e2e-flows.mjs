/**
 * Pruebas funcionales de la gestión de tareas: mover en el tablero, cambiar
 * estado y responsable, comentar, gestionar equipo y notificaciones.
 *
 * Cada prueba deja la base como la encontró. Comprueba también las reglas de
 * autorización, que es donde un fallo silencioso duele más.
 *
 *   node scripts/e2e-flows.mjs
 */
import { config } from "dotenv"
import { randomUUID } from "node:crypto"

config({ path: ".env.local" })
config({ path: ".env" })

const { neon } = await import("@neondatabase/serverless")
const sql = neon(process.env.DATABASE_URL)
const BASE = process.env.SMOKE_URL ?? "http://localhost:3000"

let ok = 0
let fallos = 0
const detalles = []

function comprobar(nombre, condicion, detalle = "") {
  if (condicion) {
    ok++
    console.log(`  ✓ ${nombre}`)
  } else {
    fallos++
    console.log(`  ✗ ${nombre}${detalle ? "  ← " + detalle : ""}`)
    detalles.push(nombre)
  }
}

async function crearSesion(id, role) {
  const token = randomUUID()
  await sql`delete from sessions where user_id = ${id}`
  await sql`delete from profiles where id = ${id}`
  await sql`delete from users where id = ${id}`
  await sql`insert into users (id, name, email, email_verified) values (${id}, ${id}, ${id + "@flows.local"}, now())`
  await sql`insert into profiles (id, email, name, role) values (${id}, ${id + "@flows.local"}, ${id}, ${role})`
  await sql`insert into sessions (session_token, user_id, expires) values (${token}, ${id}, ${new Date(Date.now() + 3600000)})`
  return `authjs.session-token=${token}`
}

async function borrarSesion(id) {
  await sql`delete from sessions where user_id = ${id}`
  await sql`delete from profiles where id = ${id}`
  await sql`delete from users where id = ${id}`
}

const api = (ruta, cookie, opts = {}) =>
  fetch(BASE + ruta, {
    ...opts,
    headers: { cookie, "Content-Type": "application/json", ...(opts.headers ?? {}) },
  })

async function main() {
  const ADMIN = "flows-admin"
  const CLIENTE = "flows-cliente"
  const INTRUSO = "flows-intruso"

  const cAdmin = await crearSesion(ADMIN, "admin")
  const cCliente = await crearSesion(CLIENTE, "client")
  const cIntruso = await crearSesion(INTRUSO, "client")

  const proy = (await sql`select id, name, client_id from projects where name like '[PRUEBA]%' order by created_at limit 1`)[0]
  const clienteOriginal = proy.client_id
  await sql`update projects set client_id = ${CLIENTE} where id = ${proy.id}`

  const tarea = (await sql`
    select t.id, t.status, t.priority, t.assigned_to, t.phase_id
      from phase_tasks t join project_phases p on p.id = t.phase_id
     where p.project_id = ${proy.id} limit 1`)[0]
  const original = { ...tarea }

  console.log(`\nFlujos sobre "${proy.name}"\n`)

  // --- 1. Cambiar estado y que se sincronice el espejo `completed` ----------
  console.log("Estado de tarea")
  let r = await api(`/api/admin/projects/${proy.id}/phases/${tarea.phase_id}/tasks/${tarea.id}`, cAdmin, {
    method: "PATCH",
    body: JSON.stringify({ status: "done" }),
  })
  let fila = (await sql`select status, completed, completed_at from phase_tasks where id = ${tarea.id}`)[0]
  comprobar("PATCH status=done responde 200", r.status === 200, `dio ${r.status}`)
  comprobar("`completed` se sincroniza a true", fila.completed === true)
  comprobar("`completed_at` queda con fecha", fila.completed_at !== null)

  r = await api(`/api/admin/projects/${proy.id}/phases/${tarea.phase_id}/tasks/${tarea.id}`, cAdmin, {
    method: "PATCH",
    body: JSON.stringify({ status: "todo" }),
  })
  fila = (await sql`select status, completed, completed_at from phase_tasks where id = ${tarea.id}`)[0]
  comprobar("volver a todo pone `completed` en false", fila.completed === false)
  comprobar("y limpia `completed_at`", fila.completed_at === null)

  // El árbol del cliente todavía manda el booleano: debe seguir funcionando
  r = await api(`/api/admin/projects/${proy.id}/phases/${tarea.phase_id}/tasks/${tarea.id}`, cAdmin, {
    method: "PATCH",
    body: JSON.stringify({ completed: true }),
  })
  fila = (await sql`select status, completed from phase_tasks where id = ${tarea.id}`)[0]
  comprobar("mandar `completed` (vía árbol) deriva status=done", fila.status === "done" && fila.completed === true)

  // --- 2. Validación de entrada -------------------------------------------
  console.log("\nValidación")
  r = await api(`/api/admin/projects/${proy.id}/phases/${tarea.phase_id}/tasks/${tarea.id}`, cAdmin, {
    method: "PATCH", body: JSON.stringify({ status: "inventado" }),
  })
  comprobar("estado inválido → 400", r.status === 400, `dio ${r.status}`)
  r = await api(`/api/admin/projects/${proy.id}/phases/${tarea.phase_id}/tasks/${tarea.id}`, cAdmin, {
    method: "PATCH", body: JSON.stringify({ priority: "altísima" }),
  })
  comprobar("prioridad inválida → 400", r.status === 400, `dio ${r.status}`)

  // --- 3. Bitácora --------------------------------------------------------
  console.log("\nBitácora")
  const antes = (await sql`select count(*)::int c from activity_log where project_id = ${proy.id}`)[0].c
  await api(`/api/admin/projects/${proy.id}/phases/${tarea.phase_id}/tasks/${tarea.id}`, cAdmin, {
    method: "PATCH", body: JSON.stringify({ status: "blocked" }),
  })
  const despues = (await sql`select count(*)::int c from activity_log where project_id = ${proy.id}`)[0].c
  comprobar("un cambio de estado deja entrada en la bitácora", despues > antes, `${antes} → ${despues}`)

  const ultima = (await sql`select action, meta, visible_to_client from activity_log where project_id=${proy.id} order by created_at desc limit 1`)[0]
  comprobar("la entrada guarda el `from`/`to` del cambio", ultima.meta?.from !== undefined && ultima.meta?.to === "blocked")
  comprobar("y es visible para el cliente", ultima.visible_to_client === true)

  // --- 4. Reordenamiento del tablero --------------------------------------
  console.log("\nTablero")
  const delProyecto = await sql`
    select t.id, t.phase_id, t.status, t."order" from phase_tasks t join project_phases p on p.id=t.phase_id
     where p.project_id = ${proy.id} order by t."order" limit 3`
  // Se guarda el estado previo: mover tarjetas y no devolverlas degradaba los
  // datos de demostración a cada corrida (la columna Bloqueada se vaciaba).
  const antesDelTablero = delProyecto.map((t) => ({ ...t }))
  r = await api(`/api/admin/projects/${proy.id}/tasks/reorder`, cAdmin, {
    method: "PATCH",
    body: JSON.stringify({
      moves: delProyecto.map((t, i) => ({ taskId: t.id, phaseId: t.phase_id, status: "in_progress", order: i })),
    }),
  })
  comprobar("reorder responde 200", r.status === 200, `dio ${r.status}`)
  const ordenes = await sql`select "order" from phase_tasks where id = any(${delProyecto.map((t) => t.id)}) order by "order"`
  comprobar("los `order` quedan sin empates", new Set(ordenes.map((o) => o.order)).size === ordenes.length)

  r = await api(`/api/admin/projects/${proy.id}/tasks/reorder`, cAdmin, {
    method: "PATCH", body: JSON.stringify({ moves: [] }),
  })
  comprobar("reorder vacío → 400", r.status === 400, `dio ${r.status}`)

  // Tarea de OTRO proyecto: debe rechazarse
  const ajena = (await sql`
    select t.id, t.phase_id from phase_tasks t join project_phases p on p.id=t.phase_id
     where p.project_id <> ${proy.id} limit 1`)[0]
  if (ajena) {
    r = await api(`/api/admin/projects/${proy.id}/tasks/reorder`, cAdmin, {
      method: "PATCH",
      body: JSON.stringify({ moves: [{ taskId: ajena.id, phaseId: ajena.phase_id, status: "todo", order: 0 }] }),
    })
    comprobar("mover una tarea de otro proyecto → 403", r.status === 403, `dio ${r.status}`)
  }

  // --- 5. Comentarios y notas internas ------------------------------------
  console.log("\nComentarios")
  r = await api(`/api/tasks/${tarea.id}/comments`, cAdmin, {
    method: "POST", body: JSON.stringify({ body: "Comentario público de prueba" }),
  })
  comprobar("el equipo puede comentar", r.status === 201, `dio ${r.status}`)

  r = await api(`/api/tasks/${tarea.id}/comments`, cAdmin, {
    method: "POST", body: JSON.stringify({ body: "Nota interna de prueba", visibleToClient: false }),
  })
  comprobar("el equipo puede dejar nota interna", r.status === 201, `dio ${r.status}`)

  const vistaEquipo = await (await api(`/api/tasks/${tarea.id}/comments`, cAdmin)).json()
  const vistaCliente = await (await api(`/api/tasks/${tarea.id}/comments`, cCliente)).json()
  comprobar("el equipo ve la nota interna", vistaEquipo.some((c) => c.visibleToClient === false))
  comprobar("el cliente NO recibe notas internas", vistaCliente.every((c) => c.visibleToClient === true))

  r = await api(`/api/tasks/${tarea.id}/comments`, cCliente, {
    method: "POST", body: JSON.stringify({ body: "Del cliente", visibleToClient: false }),
  })
  const delCliente = await r.json()
  comprobar("un comentario del cliente nunca queda interno", delCliente.visibleToClient === true)

  r = await api(`/api/tasks/${tarea.id}/comments`, cAdmin, { method: "POST", body: JSON.stringify({ body: "   " }) })
  comprobar("comentario vacío → 400", r.status === 400, `dio ${r.status}`)

  r = await api(`/api/tasks/${tarea.id}/comments`, cIntruso)
  comprobar("un cliente ajeno no accede al hilo → 403", r.status === 403, `dio ${r.status}`)

  // --- 6. Equipo -----------------------------------------------------------
  console.log("\nEquipo")
  const miembro = (await sql`select id from profiles where role in ('admin','team') and id not like 'flows-%' limit 1`)[0]
  r = await api(`/api/admin/projects/${proy.id}/members`, cAdmin, {
    method: "POST", body: JSON.stringify({ profileId: CLIENTE, role: "developer" }),
  })
  comprobar("no se puede sumar un cliente al equipo → 400", r.status === 400, `dio ${r.status}`)

  if (miembro) {
    await sql`delete from project_members where project_id=${proy.id} and profile_id=${miembro.id}`
    r = await api(`/api/admin/projects/${proy.id}/members`, cAdmin, {
      method: "POST", body: JSON.stringify({ profileId: miembro.id, role: "developer" }),
    })
    const creado = await r.json()
    comprobar("se agrega personal interno", r.status === 201, `dio ${r.status}`)

    r = await api(`/api/admin/projects/${proy.id}/members`, cAdmin, {
      method: "POST", body: JSON.stringify({ profileId: miembro.id }),
    })
    comprobar("agregar dos veces → 409", r.status === 409, `dio ${r.status}`)

    // Al quitarlo, sus tareas de ESTE proyecto deben quedar libres
    await sql`update phase_tasks set assigned_to=${miembro.id} where id=${tarea.id}`
    r = await api(`/api/admin/projects/${proy.id}/members/${creado.id}`, cAdmin, { method: "DELETE" })
    const tras = (await sql`select assigned_to from phase_tasks where id=${tarea.id}`)[0]
    comprobar("quitar del equipo libera sus tareas", r.status === 200 && tras.assigned_to === null)
  }

  // --- 7. Notificaciones ---------------------------------------------------
  console.log("\nNotificaciones")
  await sql`insert into notifications (profile_id, project_id, title) values (${ADMIN}, ${proy.id}, 'Prueba')`
  let bandeja = await (await api("/api/notifications", cAdmin)).json()
  comprobar("la bandeja cuenta las no leídas", bandeja.unread >= 1, `unread=${bandeja.unread}`)
  const noLeida = bandeja.items.find((i) => !i.readAt)
  r = await api(`/api/notifications/${noLeida.id}`, cAdmin, { method: "PATCH" })
  comprobar("marcar una como leída", r.status === 200, `dio ${r.status}`)
  r = await api(`/api/notifications/${noLeida.id}`, cCliente, { method: "PATCH" })
  comprobar("no se puede marcar la notificación de otro → 404", r.status === 404, `dio ${r.status}`)
  await api("/api/notifications/read-all", cAdmin, { method: "POST" })
  bandeja = await (await api("/api/notifications", cAdmin)).json()
  comprobar("marcar todas deja el contador en 0", bandeja.unread === 0, `unread=${bandeja.unread}`)

  // --- 8. Aislamiento entre clientes ---------------------------------------
  console.log("\nAislamiento")
  r = await api(`/api/projects/${proy.id}/details`, cIntruso)
  comprobar("cliente ajeno no ve el proyecto → 404", r.status === 404, `dio ${r.status}`)
  r = await api(`/api/projects/${proy.id}/activity`, cIntruso)
  comprobar("ni su bitácora → 404", r.status === 404, `dio ${r.status}`)
  r = await api(`/api/admin/team`, cCliente)
  comprobar("un cliente no accede a rutas de admin → 403", r.status === 403, `dio ${r.status}`)

  // --- Restaurar -----------------------------------------------------------
  await sql`delete from task_comments where author_id in (${ADMIN}, ${CLIENTE})`
  await sql`delete from notifications where profile_id in (${ADMIN}, ${CLIENTE})`
  await sql`delete from activity_log where actor_id in (${ADMIN}, ${CLIENTE})`
  await sql`update phase_tasks set status=${original.status}, priority=${original.priority},
             assigned_to=${original.assigned_to}, completed=${original.status === "done"}
             where id=${original.id}`
  for (const t of antesDelTablero) {
    await sql`update phase_tasks set status=${t.status}, "order"=${t.order},
               completed=${t.status === "done"} where id=${t.id}`
  }
  await sql`update projects set client_id=${clienteOriginal} where id=${proy.id}`
  for (const u of [ADMIN, CLIENTE, INTRUSO]) {await borrarSesion(u)}

  console.log(`\n${ok} pasaron, ${fallos} fallaron`)
  if (fallos) {console.log("Fallos: " + detalles.join(", "))}
  process.exit(fallos ? 1 : 0)
}

main().catch(async (e) => {
  console.error("\nError en las pruebas:", e.message)
  for (const u of ["flows-admin", "flows-cliente", "flows-intruso"]) {await borrarSesion(u).catch(() => {})}
  process.exit(1)
})
