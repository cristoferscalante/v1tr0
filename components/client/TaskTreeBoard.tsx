"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Handle,
  Position,
  useNodesState,
  type NodeProps,
  type Node,
  type Edge,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { AnimatePresence, motion } from "framer-motion"
import { toast } from "sonner"
import {
  Lock,
  Lightbulb,
  Bug,
  CalendarPlus,
  Plus,
  Send,
  Loader2,
  Sparkles,
  type LucideIcon,
} from "lucide-react"
import { AnimatedIcon } from "@/components/home/sections/AnimatedIcon"
import { taskIcon } from "@/components/shared/task-icons"
import {
  buildProjectGraph,
  layoutProjectTree,
  PILL_SIZE,
  trackColor,
  hexToRgba,
  TRACK_LABELS,
  type PipelinePhase,
  type FeedItem,
  type FeedType,
  type BoardNodeData,
} from "@/components/shared/project-tree"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const FEED_ICON: Record<FeedType, LucideIcon> = {
  suggestions: Lightbulb,
  bugs: Bug,
  meetings: CalendarPlus,
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente",
  approved: "Aprobada",
  rejected: "Rechazada",
  open: "Abierto",
  in_progress: "En progreso",
  resolved: "Resuelto",
}

function Tooltip({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "muted" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15 }}
      className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 z-30 w-max max-w-[230px] px-3 py-2 rounded-lg border backdrop-blur-sm shadow-xl pointer-events-none ${
        tone === "muted" ? "bg-black/90 border-white/10" : "bg-black/90 border-[#26FFDF]/20"
      }`}
    >
      {children}
    </motion.div>
  )
}

/** Nodo raíz: el nombre del proyecto, siempre solo y centrado en el medio
 *  del árbol — rectangular (esquinas apenas redondeadas) en vez de
 *  píldora, para distinguirlo de un vistazo de los 4 caminos. Tiene dos
 *  anclas de salida: una hacia arriba (árbol de consultas) y otra hacia
 *  abajo (los 4 caminos), para que cada rama salga en línea recta hacia su
 *  lado sin cruzar por encima del propio título. */
function RootNode({ data }: NodeProps<Node<Extract<BoardNodeData, { kind: "root" }>>>) {
  return (
    <div
      style={PILL_SIZE}
      className="relative flex items-center justify-center text-center px-4 rounded-xl bg-gradient-to-br from-[#08A696]/40 to-[#26FFDF]/20 border-2 border-[#26FFDF]/60 shadow-[0_0_20px_-4px_rgba(38,255,223,0.5)] before:content-[''] before:absolute before:inset-[-7px] before:rounded-[18px] before:border before:border-[#26FFDF]/15"
    >
      <Handle id="top" type="source" position={Position.Top} style={{ opacity: 0, pointerEvents: "none" }} />
      <Handle id="bottom" type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: "none" }} />
      {/* Insignia animada en loop: marca el título como el centro vivo del
          árbol. Vive fuera de la tarjeta (no encima del texto), colgada del
          borde superior, girando sin parar. */}
      <motion.div
        className="absolute -top-9 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-black/70 border border-[#26FFDF]/50 flex items-center justify-center backdrop-blur-sm"
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles className="w-3.5 h-3.5 text-[#26FFDF]" />
      </motion.div>
      <span className="text-sm font-bold text-[#26FFDF] text-center leading-tight line-clamp-3">{data.label}</span>
    </div>
  )
}

/** Nombre del camino (Planeación / Desarrollo / Calidad y entrega /
 *  Mantenimiento), estilo árbol de habilidades: texto plano en mayúsculas
 *  con el color propio del camino, sin píldora ni fondo — igual que en el
 *  ejemplo de referencia, donde el nombre y el conteo de tareas viven como
 *  etiqueta suelta, no dentro de un botón. */
function HeadNode({ data }: NodeProps<Node<Extract<BoardNodeData, { kind: "head" }>>>) {
  const color = trackColor(data.track)
  return (
    <div style={PILL_SIZE} className="relative pointer-events-none flex flex-col items-center justify-center text-center">
      <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: "none" }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: "none" }} />
      <span
        className="text-base font-extrabold uppercase tracking-wide leading-tight drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]"
        style={{ color }}
      >
        {data.label}
      </span>
      <span className="mt-1 text-6xl font-black tabular-nums leading-none" style={{ color: hexToRgba(color, 0.85) }}>
        {data.count}
      </span>
    </div>
  )
}

function TaskNode({ data }: NodeProps<Node<Extract<BoardNodeData, { kind: "task" }>>>) {
  const [open, setOpen] = useState(false)
  const meta = taskIcon(data.task.icon)
  const color = trackColor(data.track)
  const lit = data.isCurrent || Boolean(data.task.completed)
  return (
    <div className="relative pointer-events-auto">
      <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: "none" }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: "none" }} />
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        className="nodrag nopan pointer-events-auto relative flex items-center justify-center w-[60px] h-[60px] rounded-full border transition-all duration-300 cursor-pointer"
        style={{
          background: data.isCurrent ? hexToRgba(color, 0.32) : data.task.completed ? hexToRgba(color, 0.22) : "rgba(0,0,0,0.4)",
          borderColor: lit ? hexToRgba(color, data.isCurrent ? 0.9 : 0.6) : "rgba(255,255,255,0.12)",
          boxShadow: data.isCurrent
            ? `0 0 10px -1px ${hexToRgba(color, 0.6)}`
            : data.task.completed
            ? `0 0 6px -2px ${hexToRgba(color, 0.4)}`
            : undefined,
        }}
      >
        {/* Anillo exterior estático: mismo lenguaje visual en todos los
            nodos circulares del árbol (tarea/subtarea/hub/ítem), para que
            se lean como una sola familia de formas. */}
        <span
          aria-hidden
          className="absolute inset-[-6px] rounded-full border pointer-events-none"
          style={{ borderColor: hexToRgba(color, lit ? 0.3 : 0.12) }}
        />
        {data.isCurrent && (
          <motion.span
            className="absolute inset-0 rounded-full border"
            style={{ borderColor: hexToRgba(color, 0.6) }}
            animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        {/* El ícono real de la tarea siempre se ve — solo cambia cuánto
            "se alumbra": completada/actual brilla, pendiente queda tenue. */}
        <AnimatedIcon
          kind={meta.kind}
          icon={meta.icon}
          active={lit}
          size={22}
          className={lit ? "" : "text-white/35"}
          style={{ color: lit ? color : undefined }}
        />
        {!data.unlocked && (
          <span className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-black/70 border border-white/10">
            <Lock className="w-2.5 h-2.5 text-white/40" />
          </span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <Tooltip>
            <p className="text-[11px] uppercase tracking-wider" style={{ color: hexToRgba(color, 0.85) }}>{TRACK_LABELS[data.track] ?? data.track}</p>
            <p className="text-sm font-semibold text-white text-center">{data.task.name}</p>
            {!data.unlocked && (
              <p className="text-[11px] text-textSecondary text-center mt-0.5">Pendiente · se activa al completar la anterior</p>
            )}
          </Tooltip>
        )}
      </AnimatePresence>
    </div>
  )
}

function SubtaskNode({ data }: NodeProps<Node<Extract<BoardNodeData, { kind: "subtask" }>>>) {
  const [open, setOpen] = useState(false)
  const done = Boolean(data.subtask.completed)
  const color = trackColor(data.track)
  return (
    <div className="relative pointer-events-auto">
      {/* Cuatro anclas: arriba/abajo conectan con la tarea vecina de esa
          columna, izquierda/derecha encadenan con el hermano de al lado
          — así cada tramo sale recto en su dirección, sin zigzaguear. */}
      <Handle id="top" type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: "none" }} />
      <Handle id="bottom" type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: "none" }} />
      <Handle id="left" type="target" position={Position.Left} style={{ opacity: 0, pointerEvents: "none" }} />
      <Handle id="right" type="source" position={Position.Right} style={{ opacity: 0, pointerEvents: "none" }} />
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        className="nodrag nopan pointer-events-auto relative flex items-center justify-center w-11 h-11 rounded-full border transition-all duration-300 cursor-pointer"
        style={{
          background: done ? hexToRgba(color, 0.28) : "rgba(0,0,0,0.35)",
          borderColor: data.unlocked ? hexToRgba(color, done ? 0.9 : 0.45) : "rgba(255,255,255,0.12)",
          opacity: data.unlocked ? 1 : 0.5,
        }}
      >
        <span
          aria-hidden
          className="absolute inset-[-5px] rounded-full border pointer-events-none"
          style={{ borderColor: hexToRgba(color, done ? 0.22 : 0.1) }}
        />
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: done ? color : data.unlocked ? hexToRgba(color, 0.7) : "rgba(255,255,255,0.3)" }}
        />
      </button>
      <AnimatePresence>
        {open && (
          <Tooltip tone="muted">
            <p className="text-[11px] uppercase tracking-wider text-[#26FFDF]/60">Subtarea</p>
            <p className="text-sm font-semibold text-white text-center">{data.subtask.name}</p>
            {!data.unlocked && (
              <p className="text-[11px] text-textSecondary text-center mt-0.5">Pendiente · se activa con su tarea</p>
            )}
          </Tooltip>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Tercer nivel: pasos previos a una subtarea (levantar información,
 *  requerimientos, inventariar, estandarizar…). Círculo más chico que el
 *  de la subtarea, con su nombre siempre visible afuera — no hace falta
 *  pasar el cursor para leerlo, ya que suelen ir varios juntos en abanico.
 *  Mismo color del camino, para que se lea como parte de la misma rama. */
function StepNode({ data }: NodeProps<Node<Extract<BoardNodeData, { kind: "step" }>>>) {
  const [open, setOpen] = useState(false)
  const done = Boolean(data.step.completed)
  const meta = taskIcon(data.step.icon)
  const color = trackColor(data.track)
  const lit = done || data.unlocked
  return (
    <div className="relative pointer-events-auto">
      <Handle id="top" type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: "none" }} />
      <Handle id="bottom" type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: "none" }} />
      <Handle id="left" type="target" position={Position.Left} style={{ opacity: 0, pointerEvents: "none" }} />
      <Handle id="right" type="source" position={Position.Right} style={{ opacity: 0, pointerEvents: "none" }} />
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        className="nodrag nopan pointer-events-auto relative flex items-center justify-center w-11 h-11 rounded-full border transition-all duration-300 cursor-pointer"
        style={{
          background: done ? hexToRgba(color, 0.28) : "rgba(0,0,0,0.4)",
          borderColor: data.unlocked ? hexToRgba(color, done ? 0.85 : 0.5) : "rgba(255,255,255,0.12)",
          opacity: data.unlocked ? 1 : 0.5,
        }}
      >
        <span
          aria-hidden
          className="absolute inset-[-5px] rounded-full border pointer-events-none"
          style={{ borderColor: hexToRgba(color, done ? 0.2 : 0.1) }}
        />
        <AnimatedIcon
          kind={meta.kind}
          icon={meta.icon}
          active={lit}
          size={18}
          className={lit ? "" : "text-white/35"}
          style={{ color: lit ? color : undefined }}
        />
      </button>
      <AnimatePresence>
        {open && (
          <Tooltip tone="muted">
            <p className="text-[11px] uppercase tracking-wider" style={{ color: hexToRgba(color, 0.7) }}>Paso previo</p>
            <p className="text-sm font-semibold text-white text-center">{data.step.name}</p>
            {!data.unlocked && (
              <p className="text-[11px] text-textSecondary text-center mt-0.5">Pendiente · se activa con su subtarea</p>
            )}
          </Tooltip>
        )}
      </AnimatePresence>
    </div>
  )
}

function HubNode({ data }: NodeProps<Node<Extract<BoardNodeData, { kind: "hub" }>>>) {
  const [open, setOpen] = useState(false)
  const Icon = FEED_ICON[data.feedType]
  return (
    <div className="relative pointer-events-auto">
      {/* Esta rama crece hacia arriba (el árbol de consultas queda sobre
          el título), así que las anclas van invertidas: recibe desde
          abajo y encadena el siguiente nodo hacia arriba. */}
      <Handle type="target" position={Position.Bottom} style={{ opacity: 0, pointerEvents: "none" }} />
      <Handle type="source" position={Position.Top} style={{ opacity: 0, pointerEvents: "none" }} />
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="nodrag nopan pointer-events-auto relative flex items-center justify-center w-16 h-16 rounded-full bg-black/30 border border-[#26FFDF]/20 cursor-pointer"
      >
        <span aria-hidden className="absolute inset-[-6px] rounded-full border border-[#26FFDF]/12 pointer-events-none" />
        <Icon className="w-6 h-6 text-[#26FFDF]/80" />
        {data.count > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#08A696] text-[11px] font-bold text-black flex items-center justify-center">
            {data.count}
          </span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <Tooltip tone="muted">
            <p className="text-sm font-semibold text-white text-center">{data.label}</p>
          </Tooltip>
        )}
      </AnimatePresence>
    </div>
  )
}

function ItemNode({ data }: NodeProps<Node<Extract<BoardNodeData, { kind: "item" }>>>) {
  const [open, setOpen] = useState(false)
  const Icon = FEED_ICON[data.feedType]
  // Fallos sin resolver y reuniones aún no confirmadas quedan en rojo, para
  // que salte a la vista lo que el usuario está esperando que se atienda.
  const isPending =
    (data.feedType === "bugs" && data.item.status !== "resolved") ||
    (data.feedType === "meetings" && data.item.status === "pending")
  return (
    <div className="relative pointer-events-auto">
      <Handle type="target" position={Position.Bottom} style={{ opacity: 0, pointerEvents: "none" }} />
      <Handle type="source" position={Position.Top} style={{ opacity: 0, pointerEvents: "none" }} />
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        className={`nodrag nopan pointer-events-auto relative flex items-center justify-center w-[52px] h-[52px] rounded-full border cursor-pointer transition-colors ${
          isPending ? "bg-red-500/10 border-red-400/50 text-red-400" : "bg-black/30 border-white/10 text-[#b2fff6]/80"
        }`}
      >
        <span
          aria-hidden
          className={`absolute inset-[-5px] rounded-full border pointer-events-none ${isPending ? "border-red-400/20" : "border-white/8"}`}
        />
        <Icon className="w-[22px] h-[22px]" />
      </button>
      <AnimatePresence>
        {open && (
          <Tooltip tone="muted">
            <p className="text-sm font-semibold text-white text-center">{data.item.title}</p>
            <p className={`text-[11px] text-center mt-0.5 ${isPending ? "text-red-400" : "text-textSecondary"}`}>
              {STATUS_LABEL[data.item.status] ?? data.item.status}
              {data.item.severity ? ` · ${data.item.severity}` : ""}
            </p>
          </Tooltip>
        )}
      </AnimatePresence>
    </div>
  )
}

function AddNode({ data, onAdd }: NodeProps<Node<Extract<BoardNodeData, { kind: "add" }>>> & { onAdd: (feedType: FeedType) => void }) {
  return (
    <div className="relative pointer-events-auto">
      <Handle type="target" position={Position.Bottom} style={{ opacity: 0, pointerEvents: "none" }} />
      <button
        type="button"
        onClick={() => onAdd(data.feedType)}
        title={data.label}
        className="nodrag nopan pointer-events-auto flex items-center justify-center w-[52px] h-[52px] rounded-full border border-dashed border-[#26FFDF]/40 text-[#26FFDF]/70 hover:border-[#26FFDF] hover:text-[#26FFDF] transition-colors cursor-pointer"
      >
        <Plus className="w-[22px] h-[22px]" />
      </button>
    </div>
  )
}

interface AddFormState {
  feedType: FeedType
  title: string
  description: string
  severity: string
  preferredDate: string
}

const FEED_TITLES: Record<FeedType, string> = {
  suggestions: "Nueva sugerencia",
  bugs: "Reportar un fallo",
  meetings: "Agendar reunión",
}

/** Se monta con `key={initial.feedType}` desde el padre, así cada apertura
 *  arranca con estado propio en vez de arrastrar el formulario anterior. */
function AddItemDialog({
  initial,
  onClose,
  onSubmit,
  saving,
}: {
  initial: AddFormState
  onClose: () => void
  onSubmit: (form: AddFormState) => void
  saving: boolean
}) {
  const [form, setForm] = useState<AddFormState>(initial)

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-[#0A1A1A] border-[#08A696]/30">
        <DialogHeader>
          <DialogTitle className="text-white">{FEED_TITLES[form.feedType]}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="itemTitle">{form.feedType === "meetings" ? "Motivo" : "Título"}</Label>
            <Input
              id="itemTitle"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              autoFocus
              className="bg-black/40 border-[#08A696]/20 text-white placeholder:text-white/30 focus-visible:ring-[#26FFDF]/50"
            />
          </div>
          <div>
            <Label htmlFor="itemDesc">Descripción {form.feedType !== "bugs" && "(opcional)"}</Label>
            <Textarea
              id="itemDesc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="bg-black/40 border-[#08A696]/20 text-white placeholder:text-white/30 focus-visible:ring-[#26FFDF]/50"
            />
          </div>
          {form.feedType === "bugs" && (
            <div>
              <Label htmlFor="itemSeverity">Severidad</Label>
              <select
                id="itemSeverity"
                value={form.severity}
                onChange={(e) => setForm({ ...form, severity: e.target.value })}
                className="w-full bg-black/40 border border-[#08A696]/20 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="critical">Crítica</option>
              </select>
            </div>
          )}
          {form.feedType === "meetings" && (
            <div>
              <Label htmlFor="itemDate">Fecha preferida</Label>
              <input
                id="itemDate"
                type="datetime-local"
                value={form.preferredDate}
                onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                className="w-full bg-black/40 border border-[#08A696]/20 rounded-lg px-3 py-2 text-white text-sm [color-scheme:dark]"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={() => onSubmit(form)}
            disabled={saving || !form.title.trim()}
            className="bg-[#08A696] hover:bg-[#08A696]/80"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
            Enviar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Solo para los proyectos "[PRUEBA] …" (demo/QA, no datos reales de un
// cliente): muestra un ejemplo del tercer nivel (pasos previos que
// convergen en una subtarea) en la primera subtarea que encuentre, aunque
// la base de datos todavía no tenga esa profundidad cargada. No toca nada
// si el proyecto no es de prueba.
const DEMO_STEP_NAMES = ["Levantar información", "Requerimientos", "Inventariar", "Estandarizar"]

function withDemoSteps(phases: PipelinePhase[], projectName: string): PipelinePhase[] {
  if (!projectName.includes("[PRUEBA]")) {return phases}

  let injected = false
  return phases.map((phase) => ({
    ...phase,
    tasks: phase.tasks.map((task) => {
      if (injected) {return task}
      const subtasks =
        task.subtasks && task.subtasks.length > 0
          ? task.subtasks
          : [{ id: `demo-sub-${task.id}`, name: "Preparación", completed: false }]
      const [first, ...rest] = subtasks
      if (!first) {return task}
      injected = true
      return {
        ...task,
        subtasks: [
          {
            ...first,
            steps: DEMO_STEP_NAMES.map((name, i) => ({
              id: `demo-step-${task.id}-${i}`,
              name,
              completed: i < 2,
            })),
          },
          ...rest,
        ],
      }
    }),
  }))
}

export default function TaskTreeBoard({
  projectId,
  projectName,
  phases,
  feeds,
  progress,
  statusLabel,
  statusColorClass,
  onChanged,
}: {
  projectId: string
  projectName: string
  phases: PipelinePhase[]
  feeds: Record<FeedType, FeedItem[]>
  progress: number
  statusLabel?: string
  statusColorClass?: string
  onChanged: () => void
}) {
  const [addState, setAddState] = useState<AddFormState | null>(null)
  const [saving, setSaving] = useState(false)

  const { nodes: computedNodes, edges } = useMemo(() => {
    const graph = buildProjectGraph({ projectName, phases: withDemoSteps(phases, projectName), feeds, interactive: true })
    const positioned = layoutProjectTree(graph.nodes)

    const rfNodes: Node[] = positioned.map((n) => ({
      id: n.id,
      type: n.data.kind,
      position: { x: n.x - n.width / 2, y: n.y - n.height / 2 },
      data: n.data as unknown as Record<string, unknown>,
      draggable: true,
      connectable: false,
    }))
    const dataById = new Map(graph.nodes.map((n) => [n.id, n.data]))
    const rfEdges: Edge[] = graph.edges.map((e) => {
      const isSubtaskEdge = e.source.startsWith("sub-") || e.target.startsWith("sub-")
      const color = e.track ? trackColor(e.track) : "#08A696"
      // Una arista está "muerta" (bloqueada, sin energía) solo cuando lleva
      // a una tarea/subtarea que todavía no se desbloquea; el resto de la
      // red (root↔caminos, consultas) siempre está activa.
      const targetData = dataById.get(e.target)
      const isLocked =
        (targetData?.kind === "task" || targetData?.kind === "subtask") && !targetData.unlocked
      return {
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle ?? null,
        targetHandle: e.targetHandle ?? null,
        type: "straight",
        className: isLocked ? "ttb-edge-dead" : "ttb-edge-live",
        style: {
          stroke: isLocked ? "#ffffff" : color,
          strokeOpacity: isLocked ? 0.12 : e.track ? (isSubtaskEdge ? 0.4 : 0.65) : 0.4,
          strokeWidth: isSubtaskEdge ? 1 : 1.5,
          strokeDasharray: isLocked ? "2 4" : isSubtaskEdge ? "3 3" : "5 4",
        },
      }
    })
    return { nodes: rfNodes, edges: rfEdges }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectName, JSON.stringify(phases), JSON.stringify(feeds)])

  // Estado local de posiciones: el usuario puede arrastrar los nodos y
  // reorganizarlos libremente. Cuando llegan datos nuevos (nueva tarea,
  // sugerencia, etc.) se preserva la posición ya movida de cada nodo
  // existente; solo los nodos nuevos usan la posición calculada por dagre.
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(computedNodes)

  useEffect(() => {
    setNodes((current) => {
      const currentById = new Map(current.map((n) => [n.id, n]))
      return computedNodes.map((n) => {
        const prev = currentById.get(n.id)
        return prev ? { ...n, position: prev.position } : n
      })
    })
  }, [computedNodes, setNodes])

  const handleAdd = (feedType: FeedType) => {
    setAddState({ feedType, title: "", description: "", severity: "medium", preferredDate: "" })
  }

  const handleSubmit = async (form: AddFormState) => {
    if (!form.title.trim()) {return}
    setSaving(true)
    try {
      const endpoints: Record<FeedType, { url: string; body: Record<string, unknown> }> = {
        suggestions: {
          url: `/api/projects/${projectId}/suggestions`,
          body: { title: form.title, description: form.description || form.title },
        },
        bugs: {
          url: `/api/projects/${projectId}/bugs`,
          body: { title: form.title, description: form.description, severity: form.severity },
        },
        meetings: {
          url: `/api/meetings`,
          body: { projectId, title: form.title, description: form.description, preferredDate: form.preferredDate || null },
        },
      }
      const { url, body } = endpoints[form.feedType]
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) {throw new Error("failed")}
      toast.success("Enviado")
      setAddState(null)
      onChanged()
    } catch {
      toast.error("No se pudo enviar")
    } finally {
      setSaving(false)
    }
  }

  const nodeTypes = useMemo(
    () => ({
      root: RootNode,
      head: HeadNode,
      task: TaskNode,
      subtask: SubtaskNode,
      step: StepNode,
      hub: HubNode,
      item: ItemNode,
      add: (props: NodeProps<Node<Extract<BoardNodeData, { kind: "add" }>>>) => <AddNode {...props} onAdd={handleAdd} />,
    }),
     
    [],
  )

  if (nodes.length <= 1) {
    return <p className="text-textSecondary text-sm text-center py-8">Sin actividad registrada aún</p>
  }

  return (
    <div className="ttb-board relative h-full min-h-[420px] w-full overflow-hidden border border-white/10 bg-[#0d1210]/55 backdrop-blur-xl">
      {/* React Flow no asigna z-index propio a cada nodo, así que el orden de
          pintado sigue el orden del array (los nodos de ramas posteriores
          quedan por encima). Sin esto, el tooltip de un nodo puede quedar
          debajo de los nodos de la siguiente columna. Al pasar el cursor,
          ese nodo (con su tooltip) sube por encima de todos los demás. */}
      <style jsx global>{`
        .ttb-board .react-flow__node:hover {
          z-index: 1000 !important;
        }
        /* Energía recorriendo la red: las ramas activas/desbloqueadas
           llevan un flujo animado de guiones viajando hacia el nodo; las
           bloqueadas quedan estáticas y apagadas (sin animación). */
        .ttb-board .ttb-edge-live path {
          animation: ttb-energy-flow 0.9s linear infinite;
        }
        .ttb-board .ttb-edge-dead path {
          animation: none;
        }
        @keyframes ttb-energy-flow {
          to {
            stroke-dashoffset: -18;
          }
        }
      `}</style>
      {/* Header delgado y sutil, dentro del tablero. */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between gap-3 px-3.5 py-2 bg-[#0d1210]/70 backdrop-blur-md border-b border-white/5 pointer-events-none">
        <span className="text-sm font-semibold text-white/85 truncate">{projectName}</span>
        {statusLabel && (
          <span className={`shrink-0 text-xs font-semibold tracking-wide ${statusColorClass ?? "text-[#26FFDF]"}`}>
            {statusLabel}
          </span>
        )}
      </div>

      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: { top: "10%", right: "8%", bottom: "10%", left: "8%" } }}
          minZoom={0.3}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
          nodesDraggable
          nodesConnectable={false}
          elementsSelectable={false}
        >
          <Background variant={BackgroundVariant.Dots} gap={18} size={1} color="#ffffff12" />
        </ReactFlow>
      </ReactFlowProvider>

      {/* Progreso flotante, chiquito, dentro del propio tablero. */}
      <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-black/70 border border-[#08A696]/25 backdrop-blur-sm pointer-events-none">
        <div className="w-14 h-1 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#08A696] to-[#26FFDF] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs font-bold text-[#26FFDF] tabular-nums">{progress}%</span>
      </div>

      {addState && (
        <AddItemDialog
          key={addState.feedType}
          initial={addState}
          onClose={() => setAddState(null)}
          onSubmit={handleSubmit}
          saving={saving}
        />
      )}
    </div>
  )
}
