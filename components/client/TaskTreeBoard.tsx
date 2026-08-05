"use client"

import { useMemo, useState } from "react"
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Handle,
  Position,
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
  type LucideIcon,
} from "lucide-react"
import { AnimatedIcon } from "@/components/home/sections/AnimatedIcon"
import { taskIcon } from "@/components/shared/task-icons"
import {
  buildProjectGraph,
  layoutWithDagre,
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

/** Píldora estandarizada: mismo tamaño para la raíz (nombre del proyecto) y
 *  para los 4 caminos — el texto se envuelve/recorta adentro en vez de que
 *  la píldora cambie de tamaño. */
function RootNode({ data }: NodeProps<Node<Extract<BoardNodeData, { kind: "root" }>>>) {
  return (
    <div
      style={PILL_SIZE}
      className="relative flex items-center justify-center text-center px-3 rounded-2xl bg-gradient-to-br from-[#08A696]/40 to-[#26FFDF]/20 border-2 border-[#26FFDF]/60 shadow-[0_0_20px_-4px_rgba(38,255,223,0.5)]"
    >
      <Handle type="source" position={Position.Right} style={{ opacity: 0, pointerEvents: "none" }} />
      <span className="text-xs font-bold text-[#26FFDF] text-center leading-tight line-clamp-3">{data.label}</span>
    </div>
  )
}

/** Píldora con el nombre completo del camino (Planeación / Desarrollo /
 *  Calidad y entrega / Mantenimiento) — mismo tamaño estandarizado que la
 *  raíz, texto envuelto a 2 líneas si hace falta, color propio por camino. */
function HeadNode({ data }: NodeProps<Node<Extract<BoardNodeData, { kind: "head" }>>>) {
  const [open, setOpen] = useState(false)
  const color = trackColor(data.track)
  return (
    <div className="relative pointer-events-auto">
      <Handle type="target" position={Position.Left} style={{ opacity: 0, pointerEvents: "none" }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0, pointerEvents: "none" }} />
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        style={{
          ...PILL_SIZE,
          background: hexToRgba(color, 0.16),
          borderColor: hexToRgba(color, 0.55),
          color,
        }}
        className="nodrag nopan pointer-events-auto flex items-center justify-center text-center px-3 rounded-2xl border text-xs font-bold leading-tight cursor-pointer"
      >
        {data.label}
      </button>
      <AnimatePresence>
        {open && (
          <Tooltip>
            <p className="text-sm font-semibold text-white text-center">{data.label}</p>
          </Tooltip>
        )}
      </AnimatePresence>
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
      <Handle type="target" position={Position.Left} style={{ opacity: 0, pointerEvents: "none" }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0, pointerEvents: "none" }} />
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        className="nodrag nopan pointer-events-auto relative flex items-center justify-center w-12 h-12 rounded-full border transition-all duration-300 cursor-pointer"
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
          size={16}
          className={lit ? "" : "text-white/35"}
          style={{ color: lit ? color : undefined }}
        />
        {!data.unlocked && (
          <span className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center w-3.5 h-3.5 rounded-full bg-black/70 border border-white/10">
            <Lock className="w-2 h-2 text-white/40" />
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
      <Handle type="target" position={Position.Left} style={{ opacity: 0, pointerEvents: "none" }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0, pointerEvents: "none" }} />
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        className="nodrag nopan pointer-events-auto flex items-center justify-center w-[34px] h-[34px] rounded-full border transition-all duration-300 cursor-pointer"
        style={{
          background: done ? hexToRgba(color, 0.28) : "rgba(0,0,0,0.35)",
          borderColor: data.unlocked ? hexToRgba(color, done ? 0.9 : 0.45) : "rgba(255,255,255,0.12)",
          opacity: data.unlocked ? 1 : 0.5,
        }}
      >
        <span
          className="w-2 h-2 rounded-full"
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

function HubNode({ data }: NodeProps<Node<Extract<BoardNodeData, { kind: "hub" }>>>) {
  const [open, setOpen] = useState(false)
  const Icon = FEED_ICON[data.feedType]
  return (
    <div className="relative pointer-events-auto">
      <Handle type="target" position={Position.Left} style={{ opacity: 0, pointerEvents: "none" }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0, pointerEvents: "none" }} />
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="nodrag nopan pointer-events-auto relative flex items-center justify-center w-[50px] h-[50px] rounded-full bg-black/30 border border-[#26FFDF]/20 cursor-pointer"
      >
        <Icon className="w-[18px] h-[18px] text-[#26FFDF]/80" />
        {data.count > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#08A696] text-[10px] font-bold text-black flex items-center justify-center">
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
      <Handle type="target" position={Position.Left} style={{ opacity: 0, pointerEvents: "none" }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0, pointerEvents: "none" }} />
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        className={`nodrag nopan pointer-events-auto flex items-center justify-center w-[42px] h-[42px] rounded-full border cursor-pointer transition-colors ${
          isPending ? "bg-red-500/10 border-red-400/50 text-red-400" : "bg-black/30 border-white/10 text-[#b2fff6]/80"
        }`}
      >
        <Icon className="w-[18px] h-[18px]" />
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
      <Handle type="target" position={Position.Left} style={{ opacity: 0, pointerEvents: "none" }} />
      <button
        type="button"
        onClick={() => onAdd(data.feedType)}
        title={data.label}
        className="nodrag nopan pointer-events-auto flex items-center justify-center w-[42px] h-[42px] rounded-full border border-dashed border-[#26FFDF]/40 text-[#26FFDF]/70 hover:border-[#26FFDF] hover:text-[#26FFDF] transition-colors cursor-pointer"
      >
        <Plus className="w-[18px] h-[18px]" />
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

  const { nodes, edges } = useMemo(() => {
    const graph = buildProjectGraph({ projectName, phases, feeds, interactive: true })
    const positioned = layoutWithDagre(graph.nodes, graph.edges)

    const rfNodes: Node[] = positioned.map((n) => ({
      id: n.id,
      type: n.data.kind,
      position: { x: n.x - n.width / 2, y: n.y - n.height / 2 },
      data: n.data as unknown as Record<string, unknown>,
      draggable: false,
      connectable: false,
    }))
    const rfEdges: Edge[] = graph.edges.map((e) => {
      const isSubtaskEdge = e.source.startsWith("sub-") || e.target.startsWith("sub-")
      const color = e.track ? trackColor(e.track) : "#08A696"
      return {
        id: e.id,
        source: e.source,
        target: e.target,
        type: "smoothstep",
        style: {
          stroke: color,
          strokeOpacity: e.track ? (isSubtaskEdge ? 0.3 : 0.55) : 0.35,
          strokeWidth: isSubtaskEdge ? 1 : 1.5,
          strokeDasharray: isSubtaskEdge ? "3 3" : undefined,
        },
      }
    })
    return { nodes: rfNodes, edges: rfEdges }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectName, JSON.stringify(phases), JSON.stringify(feeds)])

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
    <div className="ttb-board relative h-full min-h-[420px] w-full rounded-2xl overflow-hidden border border-white/10 bg-[#141517]">
      {/* React Flow no asigna z-index propio a cada nodo, así que el orden de
          pintado sigue el orden del array (los nodos de ramas posteriores
          quedan por encima). Sin esto, el tooltip de un nodo puede quedar
          debajo de los nodos de la siguiente columna. Al pasar el cursor,
          ese nodo (con su tooltip) sube por encima de todos los demás. */}
      <style jsx global>{`
        .ttb-board .react-flow__node:hover {
          z-index: 1000 !important;
        }
      `}</style>
      {/* Header delgado y sutil, dentro del tablero. */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between gap-3 px-3.5 py-2 bg-[#141517]/85 backdrop-blur-sm border-b border-white/5 pointer-events-none">
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
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: { top: "12%", right: "8%", bottom: "8%", left: "8%" } }}
          minZoom={0.3}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
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
