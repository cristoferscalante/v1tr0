/**
 * Siembra datos de demostración sobre los proyectos `[PRUEBA]`.
 *
 * Sirve para dos cosas: ver los paneles con contenido realista, y ejercitar
 * todos los estados visuales del tablero — que con la base recién migrada
 * quedaban invisibles porque todas las tareas eran `todo`/`done` en prioridad
 * `medium`, sin responsable, sin comentarios y sin bitácora.
 *
 *   node scripts/seed-demo.mjs          siembra (idempotente)
 *   node scripts/seed-demo.mjs --clean  borra solo lo sembrado
 *
 * Todo lo que crea lleva el prefijo DEMO_ en el id, así que el borrado es
 * exacto y no toca datos reales. Los proyectos y sus tareas ya existían: este
 * script solo les cambia estado, prioridad, responsable y fechas.
 */
import { config } from "dotenv"
import { randomUUID } from "node:crypto"

config({ path: ".env.local" })
config({ path: ".env" })

const { neon } = await import("@neondatabase/serverless")
const sql = neon(process.env.DATABASE_URL)

const PREFIJO = "demo-"

// --- Personas ---------------------------------------------------------------
const EQUIPO = [
  { id: `${PREFIJO}ana`,   name: "Ana Restrepo",   email: "ana@v1tr0.demo",   role: "team",  rol: "lead" },
  { id: `${PREFIJO}bruno`, name: "Bruno Castaño",  email: "bruno@v1tr0.demo", role: "team",  rol: "developer" },
  { id: `${PREFIJO}caro`,  name: "Carolina Nieto", email: "caro@v1tr0.demo",  role: "team",  rol: "designer" },
  { id: `${PREFIJO}dani`,  name: "Daniel Ortiz",   email: "dani@v1tr0.demo",  role: "team",  rol: "qa" },
]

const CLIENTES = [
  { id: `${PREFIJO}cli-panaderia`, name: "Panadería La Espiga", email: "espiga@cliente.demo" },
  { id: `${PREFIJO}cli-ferreteria`, name: "Ferretería El Tornillo", email: "tornillo@cliente.demo" },
]

async function limpiar() {
  // El orden importa: primero lo que referencia perfiles.
  await sql`delete from notifications  where profile_id like ${PREFIJO + "%"}`
  await sql`delete from task_comments  where author_id like ${PREFIJO + "%"}`
  await sql`delete from activity_log   where actor_id  like ${PREFIJO + "%"}`
  await sql`delete from project_members where profile_id like ${PREFIJO + "%"}`
  await sql`update phase_tasks set assigned_to = null where assigned_to like ${PREFIJO + "%"}`
  await sql`update projects set client_id = null where client_id like ${PREFIJO + "%"}`
  await sql`delete from profiles where id like ${PREFIJO + "%"}`
  await sql`delete from sessions where user_id like ${PREFIJO + "%"}`
  await sql`delete from users    where id like ${PREFIJO + "%"}`
}

async function main() {
  const limpiarSolo = process.argv.includes("--clean")

  await limpiar()
  if (limpiarSolo) {
    console.log("Datos de demostración eliminados.")
    return
  }

  // --- Perfiles -------------------------------------------------------------
  for (const p of [...EQUIPO, ...CLIENTES.map((c) => ({ ...c, role: "client" }))]) {
    await sql`insert into users (id, name, email, email_verified)
              values (${p.id}, ${p.name}, ${p.email}, now())`
    await sql`insert into profiles (id, email, name, role)
              values (${p.id}, ${p.email}, ${p.name}, ${p.role})`
  }
  console.log(`  ${EQUIPO.length} del equipo y ${CLIENTES.length} clientes`)

  const proyectos = await sql`select id, name, status from projects where name like '[PRUEBA]%' order by created_at`
  if (proyectos.length === 0) {
    console.log("  No hay proyectos [PRUEBA]; nada que enriquecer.")
    return
  }

  let totalTareas = 0
  let totalComentarios = 0
  let totalBitacora = 0

  for (const [i, proy] of proyectos.entries()) {
    // Cliente alterno entre los dos, para que ambos portales tengan contenido.
    const cliente = CLIENTES[i % CLIENTES.length]
    await sql`update projects set client_id = ${cliente.id} where id = ${proy.id}`

    // Equipo: el lead siempre, más 2 rotando, para que no todos los proyectos
    // se vean igual en la pestaña Equipo.
    const miembros = [EQUIPO[0], EQUIPO[1 + (i % 3)], EQUIPO[1 + ((i + 1) % 3)]]
    const unicos = [...new Map(miembros.map((m) => [m.id, m])).values()]
    for (const m of unicos) {
      await sql`insert into project_members (project_id, profile_id, role)
                values (${proy.id}, ${m.id}, ${m.rol})
                on conflict do nothing`
    }

    const tareas = await sql`
      select t.id, t.name, t.phase_id, p.name as phase_name
        from phase_tasks t
        join project_phases p on p.id = t.phase_id
       where p.project_id = ${proy.id}
       order by p."order", t."order"`

    // Reparto pensado para que el tablero muestre todos sus estados a la vez,
    // incluida una columna por encima de su límite WIP (el chip en acento).
    // El proyecto 0 se pasa a propósito: 4 en progreso contra un límite de 3.
    const seExcede = i === 0
    const plan = repartir(tareas.length, seExcede)

    for (const [j, t] of tareas.entries()) {
      const { status, priority, asignar, diasVence } = plan[j]
      const responsable = asignar ? unicos[j % unicos.length].id : null
      const vence = diasVence === null ? null : new Date(Date.now() + diasVence * 86400000)

      await sql`
        update phase_tasks
           set status = ${status},
               priority = ${priority},
               assigned_to = ${responsable},
               due_date = ${vence},
               completed = ${status === "done"},
               completed_at = ${status === "done" ? new Date() : null},
               updated_at = now()
         where id = ${t.id}`
      totalTareas++

      // Conversación solo en algunas: un hilo en cada tarea sería ruido. Lo
      // bloqueado siempre lleva hilo, porque es donde de verdad hace falta
      // explicar qué falta — y es lo que muestra la nota interna en pantalla.
      if (j % 5 === 0 || status === "blocked") {
        const autor = unicos[j % unicos.length]
        await sql`insert into task_comments (task_id, author_id, body, visible_to_client)
                  values (${t.id}, ${autor.id},
                          ${`Avanzo con "${t.name}". Dejo el detalle en el hilo.`}, true)`
        totalComentarios++
        if (status === "blocked") {
          await sql`insert into task_comments (task_id, author_id, body, visible_to_client)
                    values (${t.id}, ${EQUIPO[0].id},
                            'Nota interna: esperamos accesos del proveedor para desbloquear.', false)`
          totalComentarios++
        }
      }
    }

    // --- Bitácora: unas cuantas entradas escalonadas hacia atrás ------------
    const eventos = [
      { action: "project.created",      summary: `Se creó el proyecto ${proy.name}`,                visible: true,  dias: 30 },
      { action: "member.added",         summary: `${EQUIPO[0].name} entró al equipo como responsable`, visible: false, dias: 28 },
      { action: "phase.created",        summary: "Se planificaron las fases del proyecto",          visible: true,  dias: 27 },
      { action: "task.status_changed",  summary: "Wireframe pasó a Terminada",                      visible: true,  dias: 12 },
      { action: "task.assigned",        summary: `${EQUIPO[1].name} tomó Maquetación responsive`,   visible: false, dias: 8 },
      { action: "task.commented",       summary: `${EQUIPO[2].name} comentó en Diseño de sección hero`, visible: true, dias: 3 },
    ]
    for (const e of eventos) {
      await sql`insert into activity_log (project_id, actor_id, action, entity_type, entity_id, summary, visible_to_client, created_at)
                values (${proy.id}, ${EQUIPO[0].id}, ${e.action}, 'project', ${proy.id},
                        ${e.summary}, ${e.visible}, ${new Date(Date.now() - e.dias * 86400000)})`
      totalBitacora++
    }

    // --- Notificaciones: unas leídas y otras no, para ver el badge ----------
    await sql`insert into notifications (profile_id, project_id, title, body, href, read_at, created_at)
              values
                (${EQUIPO[0].id}, ${proy.id}, 'Te asignaron una tarea', ${proy.name},
                 ${`/admin/proyectos/${proy.id}`}, null, ${new Date(Date.now() - 3600000)}),
                (${cliente.id}, ${proy.id}, 'Avance en tu proyecto', ${`Hay novedades en ${proy.name}`},
                 ${`/client-dashboard/projects/${proy.id}`}, null, ${new Date(Date.now() - 7200000)}),
                (${EQUIPO[0].id}, ${proy.id}, 'Tarea terminada', ${proy.name},
                 ${`/admin/proyectos/${proy.id}`}, ${new Date()}, ${new Date(Date.now() - 172800000)})`
  }

  console.log(`  ${proyectos.length} proyectos enriquecidos`)
  console.log(`  ${totalTareas} tareas con estado, prioridad, responsable y fecha`)
  console.log(`  ${totalComentarios} comentarios · ${totalBitacora} entradas de bitácora`)
  console.log("\nListo. Para deshacer: node scripts/seed-demo.mjs --clean")
}

/**
 * Reparte n tareas entre los cuatro estados de forma estable (no aleatoria,
 * para que dos corridas den el mismo tablero) y con prioridades variadas.
 * `excederWip` fuerza 4 tareas en progreso contra el límite de 3, que es lo
 * que hace aparecer el chip en acento de la columna.
 */
function repartir(n, excederWip) {
  const enProgreso = Math.min(excederWip ? 4 : 2, n)
  const bloqueadas = Math.min(n - enProgreso, excederWip ? 1 : 2)
  const terminadas = Math.floor((n - enProgreso - bloqueadas) * 0.45)

  const prioridades = ["urgent", "high", "medium", "medium", "low", "high", "medium"]
  const plan = []
  for (let j = 0; j < n; j++) {
    let status = "todo"
    if (j < enProgreso) {status = "in_progress"}
    else if (j < enProgreso + bloqueadas) {status = "blocked"}
    else if (j >= n - terminadas) {status = "done"}

    plan.push({
      status,
      // Lo bloqueado y lo urgente se concentran arriba: es lo que debe saltar.
      priority: status === "blocked" ? "urgent" : prioridades[j % prioridades.length],
      // ~70% asignadas: quedan algunas libres para ver el filtro "Sin asignar".
      asignar: j % 10 < 7,
      // Una de cada seis vencida, para ejercitar el estado de atraso.
      diasVence: status === "done" ? null : j % 6 === 0 ? -2 : (j % 4) * 7 + 3,
    })
  }
  return plan
}

main().catch((e) => {
  console.error("Falló la siembra:", e.message)
  process.exit(1)
})
