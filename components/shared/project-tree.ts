/** Tercer nivel: pasos previos que hay que resolver antes de dar por
 *  hecha una subtarea (ej. "Levantar información", "Requerimientos",
 *  "Inventariar", "Estandarizar"). Varios pasos pueden converger en la
 *  misma subtarea, igual que en un árbol de habilidades. */
export interface PipelineStep {
  id: string
  name: string
  icon?: string | null
  completed: boolean | null
}

export interface PipelineSubtask {
  id: string
  name: string
  completed: boolean | null
  steps?: PipelineStep[]
}

export interface PipelineTask {
  id: string
  name: string
  icon: string | null
  completed: boolean | null
  subtasks?: PipelineSubtask[]
}

export interface PipelinePhase {
  id: string
  name: string
  track: string
  order: number
  tasks: PipelineTask[]
}

export interface FeedItem {
  id: string
  title: string
  status: string
  severity?: string
}

export const TRACK_LABELS: Record<string, string> = {
  planning: "Planeación",
  development: "Desarrollo",
  quality: "Calidad y entrega",
  maintenance: "Mantenimiento",
}

// Un color por camino, reutilizando la misma paleta que ya usa el resto de
// la app para estos 4 caminos "conocidos" (statusConfig en la página de
// detalle). Un camino no listado acá (el admin puede crear los que quiera,
// track es texto libre) cae en la paleta de respaldo de abajo.
export const TRACK_COLORS: Record<string, string> = {
  planning: "#F2C94C",
  development: "#26FFDF",
  quality: "#B794F6",
  maintenance: "#FB923C",
}

// Paleta de respaldo para caminos personalizados: se elige un color estable
// por nombre de camino (mismo texto → mismo color siempre) en vez de uno
// aleatorio en cada render.
const FALLBACK_TRACK_PALETTE = [
  "#FF6B9D", "#60A5FA", "#4ADE80", "#EAB308", "#F87171", "#38BDF8", "#C084FC", "#FB7185",
]

function hashTrackName(track: string): number {
  let hash = 0
  for (let i = 0; i < track.length; i++) {
    hash = (hash * 31 + track.charCodeAt(i)) >>> 0
  }
  return hash
}

export function trackColor(track: string): string {
  if (TRACK_COLORS[track]) {return TRACK_COLORS[track]}
  return FALLBACK_TRACK_PALETTE[hashTrackName(track) % FALLBACK_TRACK_PALETTE.length]!
}

export function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "")
  const value = parseInt(clean, 16)
  const r = (value >> 16) & 255
  const g = (value >> 8) & 255
  const b = value & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export interface ResolvedTask {
  task: PipelineTask
  track: string
  phaseId: string
  unlocked: boolean
  isCurrent: boolean
}

/**
 * Un solo frente de avance para todo el proyecto (no uno por rama): se
 * aplana el orden fase→tarea de todos los caminos y solo la primera tarea
 * sin completar de esa secuencia global queda "actual". Todo lo posterior
 * queda con candado hasta que le toque, sin importar en qué rama esté.
 * Compartido entre el ProjectPipeline compacto y el TaskTreeBoard interactivo.
 */
export function resolveGlobalUnlock(phases: PipelinePhase[]): ResolvedTask[] {
  const flat = [...phases]
    .sort((a, b) => a.order - b.order)
    .flatMap((phase) =>
      phase.tasks.map((task) => ({
        task,
        track: phase.track,
        phaseId: phase.id,
      })),
    )

  const currentIdx = flat.findIndex((t) => !t.task.completed)

  return flat.map((entry, i) => ({
    task: entry.task,
    track: entry.track,
    phaseId: entry.phaseId,
    unlocked: Boolean(entry.task.completed) || i === currentIdx,
    isCurrent: i === currentIdx,
  }))
}

// ─── Grafo para el tablero interactivo (React Flow) ───

export type BoardNodeData =
  | { kind: "root"; label: string }
  | { kind: "head"; label: string; track: string; count: number; phaseId: string }
  | { kind: "task"; task: PipelineTask; unlocked: boolean; isCurrent: boolean; track: string }
  | { kind: "subtask"; subtask: PipelineSubtask; unlocked: boolean; track: string }
  | { kind: "step"; step: PipelineStep; unlocked: boolean; track: string }
  | { kind: "hub"; label: string; feedType: FeedType; count: number }
  | { kind: "item"; feedType: FeedType; item: FeedItem }
  | { kind: "add"; feedType: FeedType; label: string }
  | { kind: "add-task"; track: string; phaseId: string }
  | { kind: "add-subtask"; taskId: string; track: string }

export type FeedType = "suggestions" | "bugs" | "meetings"

export interface BoardEdge {
  id: string
  source: string
  target: string
  track?: string
  /** El root tiene dos anclas de salida: "top" hacia el árbol de consultas
   *  (arriba) y "bottom" hacia los 4 caminos (abajo). Las subtareas/pasos
   *  también tienen anclas propias por lado — "left"/"right" para
   *  encadenarse horizontalmente entre hermanos, "top"/"bottom" para
   *  conectar con la tarea de arriba/abajo — así cada arista sale recta
   *  hacia su lado en vez de zigzaguear. */
  sourceHandle?: string | undefined
  targetHandle?: string | undefined
}

/** Tamaño único de píldora para el nodo raíz (nombre del proyecto) y los 4
 *  caminos (Planeación/Desarrollo/Calidad y entrega/Mantenimiento) — todas
 *  estandarizadas al mismo tamaño en vez de variar según el texto; el texto
 *  se envuelve/recorta adentro si hace falta. */
export const PILL_SIZE = { width: 168, height: 64 }

const TASK_SIZE = { width: 60, height: 60 }
const SUBTASK_SIZE = { width: 44, height: 44 }
const STEP_SIZE = { width: 44, height: 44 }
const HUB_SIZE = { width: 64, height: 64 }
const ITEM_SIZE = { width: 52, height: 52 }

// Separación horizontal entre las "costillas" (subtareas/pasos) que
// cuelgan al costado de su tarea, en vez de seguir hacia abajo.
const SIDE_GAP = 62

const FEED_META: Record<FeedType, { label: string; addLabel: string }> = {
  suggestions: { label: "Sugerencias", addLabel: "Nueva sugerencia" },
  bugs: { label: "Reporte de fallos", addLabel: "Reportar fallo" },
  meetings: { label: "Reuniones", addLabel: "Agendar reunión" },
}

/** A qué grupo pertenece un nodo para el layout: la raíz vive sola y
 *  centrada arriba; los 4 caminos forman una fila horizontal debajo de
 *  ella con sus tareas creciendo en columna hacia abajo; los nodos de
 *  consulta del usuario (sugerencias/fallos/reuniones) forman su propia
 *  fila horizontal, organizada aparte, debajo de la columna de tareas más
 *  larga. */
export interface BoardNode {
  id: string
  data: BoardNodeData
  width: number
  height: number
  group: "root" | "track" | "hub"
  col: number
  row: number
  /** Corrimiento horizontal extra dentro de la columna — solo lo usan los
   *  pasos (tercer nivel) que se abren en abanico antes de converger en su
   *  subtarea. */
  xOffset?: number
}

export function buildProjectGraph(input: {
  projectName: string
  phases: PipelinePhase[]
  feeds: Record<FeedType, FeedItem[]>
  interactive: boolean
  /** Modo admin: agrega nodos "+" (add-task/add-subtask) dentro del propio
   *  árbol, mismo patrón que los "add" de sugerencias/fallos/reuniones. El
   *  cliente nunca pasa esto, así que su grafo queda idéntico. */
  editableTasks?: boolean
}): { nodes: BoardNode[]; edges: BoardEdge[] } {
  const nodes: BoardNode[] = [
    { id: "root", data: { kind: "root", label: input.projectName }, ...PILL_SIZE, group: "root", col: 0, row: 0 },
  ]
  const edges: BoardEdge[] = []

  const resolved = resolveGlobalUnlock(input.phases)
  const byTrack: Record<string, ResolvedTask[]> = {}
  for (const entry of resolved) {
    byTrack[entry.track] = [...(byTrack[entry.track] ?? []), entry]
  }

  // Los caminos son texto libre (el admin crea los que quiera, no solo los
  // 4 predefinidos), así que las columnas se ordenan por la fase más
  // temprana de cada camino en vez de un enum fijo — el primer camino
  // creado queda más a la izquierda.
  const trackAppearance = new Map<string, number>()
  ;[...input.phases]
    .sort((a, b) => a.order - b.order)
    .forEach((phase, i) => {
      if (!trackAppearance.has(phase.track)) {trackAppearance.set(phase.track, i)}
    })
  // En modo admin, un camino recién creado (fase sin tareas aún) también
  // debe aparecer — con su encabezado y un solo nodo "+" — para poder
  // arrancarlo desde el propio árbol. En modo lectura se sigue ocultando.
  const trackCandidates = input.editableTasks
    ? new Set([...Object.keys(byTrack), ...input.phases.map((p) => p.track)])
    : new Set(Object.keys(byTrack))
  const activeTracks = Array.from(trackCandidates)
    .filter((track) => (byTrack[track]?.length ?? 0) > 0 || input.editableTasks)
    .sort((a, b) => (trackAppearance.get(a) ?? 0) - (trackAppearance.get(b) ?? 0))

  activeTracks.forEach((track, col) => {
    const tasks = byTrack[track] ?? []
    // "La" fase de este camino para acciones dentro del árbol (editar el
    // encabezado, agregar la siguiente tarea): la de la última tarea si ya
    // hay alguna, si no la primera fase que declaró ese camino.
    const trackPhaseId = tasks[tasks.length - 1]?.phaseId ?? input.phases.find((p) => p.track === track)?.id ?? ""
    const headId = `head-${track}`
    nodes.push({ id: headId, data: { kind: "head", label: TRACK_LABELS[track] ?? track, track, count: tasks.length, phaseId: trackPhaseId }, ...PILL_SIZE, group: "track", col, row: 1 })
    edges.push({ id: `e-root-${headId}`, source: "root", target: headId, track, sourceHandle: "bottom" })

    // Dos columnas combinadas por camino: las tareas grandes forman la
    // columna vertical principal (una fila por tarea, sin importar cuántas
    // subtareas tenga cada una); las subtareas/pasos de cada tarea se abren
    // en una fila horizontal propia, justo debajo de su tarea y centrada
    // en torno a ella (simétrica, no en cascada hacia un solo lado).
    let prev = headId
    let prevIsRib = false
    let row = 2
    for (const entry of tasks) {
      const taskRow = row
      nodes.push({
        id: entry.task.id,
        data: { kind: "task", task: entry.task, unlocked: entry.unlocked, isCurrent: entry.isCurrent, track },
        ...TASK_SIZE,
        group: "track",
        col,
        row: taskRow,
      })
      edges.push({
        id: `e-${prev}-${entry.task.id}`,
        source: prev,
        target: entry.task.id,
        track,
        sourceHandle: prevIsRib ? "bottom" : undefined,
      })
      prev = entry.task.id
      prevIsRib = false
      row += 1

      // Se aplana la cadena de subtareas/pasos de esta tarea en una sola
      // lista horizontal para poder centrarla como bloque, en vez de
      // acumularla hacia un lado. No gatilla el desbloqueo global, solo
      // hereda el estado (revelada siempre, activa/desactivada) de su
      // tarea padre.
      const ribItems: { id: string; size: { width: number; height: number }; data: BoardNodeData }[] = []
      for (const sub of entry.task.subtasks ?? []) {
        const steps = sub.steps ?? []
        if (steps.length > 0) {
          for (const step of steps) {
            ribItems.push({
              id: `step-${step.id}`,
              size: STEP_SIZE,
              data: { kind: "step", step, unlocked: entry.unlocked, track },
            })
          }
        } else {
          ribItems.push({
            id: `sub-${sub.id}`,
            size: SUBTASK_SIZE,
            data: { kind: "subtask", subtask: sub, unlocked: entry.unlocked, track },
          })
        }
      }
      if (input.editableTasks) {
        ribItems.push({
          id: `add-sub-${entry.task.id}`,
          size: SUBTASK_SIZE,
          data: { kind: "add-subtask", taskId: entry.task.id, track },
        })
      }

      // Si la tarea tiene subtareas/pasos, son la condición para activar
      // la siguiente tarea grande: la cadena queda literalmente entre las
      // dos, conectada arriba con esta tarea y abajo con la próxima (en
      // vez de una línea directa entre ambas que las ignore).
      if (ribItems.length > 0) {
        const ribRow = row
        let prevSub: string = entry.task.id
        ribItems.forEach((item, i) => {
          nodes.push({
            id: item.id,
            data: item.data,
            ...item.size,
            group: "track",
            col,
            row: ribRow,
            xOffset: (i - (ribItems.length - 1) / 2) * SIDE_GAP,
          })
          const isFirst = i === 0
          edges.push({
            id: `e-${prevSub}-${item.id}`,
            source: prevSub,
            target: item.id,
            track,
            // Primer eslabón: baja recto desde la tarea (ancla "top" del
            // ítem). Resto de la cadena: horizontal entre hermanos
            // ("right" → "left"), para que no zigzaguee.
            sourceHandle: isFirst ? undefined : "right",
            targetHandle: isFirst ? "top" : "left",
          })
          prevSub = item.id
        })
        row += 1
        prev = prevSub
        prevIsRib = true
      }
    }

    if (input.editableTasks) {
      const addTaskId = `add-task-${track}`
      nodes.push({ id: addTaskId, data: { kind: "add-task", track, phaseId: trackPhaseId }, ...ITEM_SIZE, group: "track", col, row })
      edges.push({ id: `e-${prev}-${addTaskId}`, source: prev, target: addTaskId, track, sourceHandle: prevIsRib ? "bottom" : undefined })
    }
  })

  // Árbol aparte para los nodos de consulta del usuario: nace del mismo
  // root pero el layout lo dibuja arriba del título (el título queda en el
  // centro y los 4 caminos abajo), así sus líneas nunca cruzan por encima
  // de las columnas de tareas.
  const hubRow = 1

  ;(Object.keys(FEED_META) as FeedType[]).forEach((feedType, col) => {
    const items = input.feeds[feedType] ?? []
    const meta = FEED_META[feedType]
    const hubId = `hub-${feedType}`
    nodes.push({ id: hubId, data: { kind: "hub", label: meta.label, feedType, count: items.length }, ...HUB_SIZE, group: "hub", col, row: hubRow })
    edges.push({ id: `e-root-${hubId}`, source: "root", target: hubId, sourceHandle: "top" })

    let prev = hubId
    let row = hubRow + 1
    for (const item of items) {
      const nodeId = `${feedType}-${item.id}`
      nodes.push({ id: nodeId, data: { kind: "item", feedType, item }, ...ITEM_SIZE, group: "hub", col, row })
      edges.push({ id: `e-${prev}-${nodeId}`, source: prev, target: nodeId })
      prev = nodeId
      row += 1
    }

    if (input.interactive) {
      const addId = `add-${feedType}`
      nodes.push({ id: addId, data: { kind: "add", feedType, label: meta.addLabel }, ...ITEM_SIZE, group: "hub", col, row })
      edges.push({ id: `e-${prev}-${addId}`, source: prev, target: addId })
    }
  })

  return { nodes, edges }
}

const COL_GAP_TRACK = 220
const COL_GAP_HUB = 220
const ROOT_GAP = 150
const ROW_GAP = 116

/** Layout manual, de arriba a abajo: los nodos de consulta del usuario
 *  (sugerencias/fallos/reuniones) forman su propia fila horizontal
 *  centrada arriba de todo, creciendo hacia arriba; el título del proyecto
 *  queda en el centro, entre ambos grupos; y los 4 caminos forman la fila
 *  horizontal de abajo, cada uno creciendo en columna vertical hacia abajo
 *  con sus tareas. Ningún grupo cruza por encima del otro. */
export function layoutProjectTree(nodes: BoardNode[]) {
  const trackCols = new Set(nodes.filter((n) => n.group === "track").map((n) => n.col))
  const hubCols = new Set(nodes.filter((n) => n.group === "hub").map((n) => n.col))
  const trackCount = Math.max(trackCols.size, 1)
  const hubCount = Math.max(hubCols.size, 1)

  return nodes.map((n) => {
    if (n.group === "root") {
      return { ...n, x: 0, y: 0 }
    }
    if (n.group === "hub") {
      const x = (n.col - (hubCount - 1) / 2) * COL_GAP_HUB
      const y = -(ROOT_GAP + (n.row - 1) * ROW_GAP)
      return { ...n, x, y }
    }
    const x = (n.col - (trackCount - 1) / 2) * COL_GAP_TRACK + (n.xOffset ?? 0)
    const y = ROOT_GAP + (n.row - 1) * ROW_GAP
    return { ...n, x, y }
  })
}
