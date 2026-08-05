import dagre from "dagre"

export interface PipelineSubtask {
  id: string
  name: string
  completed: boolean | null
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

const TRACK_ORDER = ["planning", "development", "quality", "maintenance"] as const

// Un color por camino, reutilizando la misma paleta que ya usa el resto de
// la app para estos mismos estados (statusConfig en la página de detalle).
export const TRACK_COLORS: Record<string, string> = {
  planning: "#F2C94C",
  development: "#26FFDF",
  quality: "#B794F6",
  maintenance: "#FB923C",
}

export function trackColor(track: string): string {
  return TRACK_COLORS[track] ?? TRACK_COLORS.development!
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
  unlocked: boolean
  isCurrent: boolean
}

/**
 * Un solo frente de avance para todo el proyecto (no uno por rama): se
 * aplana el orden fase→tarea de las 3 ramas y solo la primera tarea sin
 * completar de esa secuencia global queda "actual". Todo lo posterior
 * queda con candado hasta que le toque, sin importar en qué rama esté.
 * Compartido entre el ProjectPipeline compacto y el TaskTreeBoard interactivo.
 */
export function resolveGlobalUnlock(phases: PipelinePhase[]): ResolvedTask[] {
  const flat = [...phases]
    .sort((a, b) => a.order - b.order)
    .flatMap((phase) =>
      phase.tasks.map((task) => ({
        task,
        track: (TRACK_ORDER as readonly string[]).includes(phase.track) ? phase.track : "development",
      })),
    )

  const currentIdx = flat.findIndex((t) => !t.task.completed)

  return flat.map((entry, i) => ({
    task: entry.task,
    track: entry.track,
    unlocked: Boolean(entry.task.completed) || i === currentIdx,
    isCurrent: i === currentIdx,
  }))
}

// ─── Grafo para el tablero interactivo (React Flow) ───

export type BoardNodeData =
  | { kind: "root"; label: string }
  | { kind: "head"; label: string; track: string }
  | { kind: "task"; task: PipelineTask; unlocked: boolean; isCurrent: boolean; track: string }
  | { kind: "subtask"; subtask: PipelineSubtask; unlocked: boolean; track: string }
  | { kind: "hub"; label: string; feedType: FeedType; count: number }
  | { kind: "item"; feedType: FeedType; item: FeedItem }
  | { kind: "add"; feedType: FeedType; label: string }

export type FeedType = "suggestions" | "bugs" | "meetings"

export interface BoardNode {
  id: string
  data: BoardNodeData
  width: number
  height: number
}

export interface BoardEdge {
  id: string
  source: string
  target: string
  track?: string
}

/** Tamaño único de píldora para el nodo raíz (nombre del proyecto) y los 4
 *  caminos (Planeación/Desarrollo/Calidad y entrega/Mantenimiento) — todas
 *  estandarizadas al mismo tamaño en vez de variar según el texto; el texto
 *  se envuelve/recorta adentro si hace falta. Usado tanto para el layout de
 *  dagre como para el botón real en pantalla, así ambos coinciden. */
export const PILL_SIZE = { width: 132, height: 56 }

const FEED_META: Record<FeedType, { label: string; addLabel: string }> = {
  suggestions: { label: "Sugerencias", addLabel: "Nueva sugerencia" },
  bugs: { label: "Reporte de fallos", addLabel: "Reportar fallo" },
  meetings: { label: "Reuniones", addLabel: "Agendar reunión" },
}

export function buildProjectGraph(input: {
  projectName: string
  phases: PipelinePhase[]
  feeds: Record<FeedType, FeedItem[]>
  interactive: boolean
}): { nodes: BoardNode[]; edges: BoardEdge[] } {
  const nodes: BoardNode[] = [{ id: "root", data: { kind: "root", label: input.projectName }, ...PILL_SIZE }]
  const edges: BoardEdge[] = []

  const resolved = resolveGlobalUnlock(input.phases)
  const byTrack: Record<string, ResolvedTask[]> = { planning: [], development: [], quality: [], maintenance: [] }
  for (const entry of resolved) {
    byTrack[entry.track] = [...(byTrack[entry.track] ?? []), entry]
  }

  for (const track of TRACK_ORDER) {
    const tasks = byTrack[track] ?? []
    if (tasks.length === 0) {continue}
    const headId = `head-${track}`
    nodes.push({ id: headId, data: { kind: "head", label: TRACK_LABELS[track]!, track }, ...PILL_SIZE })
    edges.push({ id: `e-root-${headId}`, source: "root", target: headId, track })

    let prev = headId
    for (const entry of tasks) {
      nodes.push({
        id: entry.task.id,
        data: { kind: "task", task: entry.task, unlocked: entry.unlocked, isCurrent: entry.isCurrent, track },
        width: 48,
        height: 48,
      })
      edges.push({ id: `e-${prev}-${entry.task.id}`, source: prev, target: entry.task.id, track })
      prev = entry.task.id

      // El desglose de la tarea sigue haciendo crecer la misma rama hacia
      // arriba: no gatilla el desbloqueo global, solo hereda el estado
      // (revelada siempre, activa/desactivada) de su tarea padre.
      let prevSub = entry.task.id
      for (const sub of entry.task.subtasks ?? []) {
        const subId = `sub-${sub.id}`
        nodes.push({
          id: subId,
          data: { kind: "subtask", subtask: sub, unlocked: entry.unlocked, track },
          width: 34,
          height: 34,
        })
        edges.push({ id: `e-${prevSub}-${subId}`, source: prevSub, target: subId, track })
        prevSub = subId
      }
    }
  }

  for (const feedType of Object.keys(FEED_META) as FeedType[]) {
    const items = input.feeds[feedType] ?? []
    const meta = FEED_META[feedType]
    const hubId = `hub-${feedType}`
    nodes.push({ id: hubId, data: { kind: "hub", label: meta.label, feedType, count: items.length }, width: 50, height: 50 })
    edges.push({ id: `e-root-${hubId}`, source: "root", target: hubId })

    let prev = hubId
    for (const item of items) {
      const nodeId = `${feedType}-${item.id}`
      nodes.push({ id: nodeId, data: { kind: "item", feedType, item }, width: 42, height: 42 })
      edges.push({ id: `e-${prev}-${nodeId}`, source: prev, target: nodeId })
      prev = nodeId
    }

    if (input.interactive) {
      const addId = `add-${feedType}`
      nodes.push({ id: addId, data: { kind: "add", feedType, label: meta.addLabel }, width: 42, height: 42 })
      edges.push({ id: `e-${prev}-${addId}`, source: prev, target: addId })
    }
  }

  return { nodes, edges }
}

/** Calcula posiciones x/y con dagre (de izquierda a derecha): el proyecto
 *  nace a la izquierda y las 6 ramas (3 de tareas + 3 de feed) se apilan
 *  verticalmente y crecen hacia la derecha — aprovecha mejor un tablero
 *  ancho que el layout vertical original y deja más espacio por etapa. */
export function layoutWithDagre(nodes: BoardNode[], edges: BoardEdge[]) {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: "LR", nodesep: 34, ranksep: 92 })

  for (const node of nodes) {
    g.setNode(node.id, { width: node.width, height: node.height })
  }
  for (const edge of edges) {
    g.setEdge(edge.source, edge.target)
  }

  dagre.layout(g)

  return nodes.map((node) => {
    const pos = g.node(node.id)
    return { ...node, x: pos.x, y: pos.y }
  })
}
