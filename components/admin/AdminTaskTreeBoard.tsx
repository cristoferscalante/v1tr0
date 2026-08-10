"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
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
import { ArrowLeft, Pencil, Plus, Trash2, Loader2, Check, X, Sparkles } from "lucide-react"
import { AnimatedIcon } from "@/components/home/sections/AnimatedIcon"
import { TASK_ICONS, taskIcon } from "@/components/shared/task-icons"
import {
  buildProjectGraph,
  layoutProjectTree,
  PILL_SIZE,
  trackColor,
  hexToRgba,
  TRACK_LABELS,
  type PipelinePhase,
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
import { Label } from "@/components/ui/label"
import PhaseEditDialog from "@/components/admin/PhaseEditDialog"

interface TeamMember {
  id: string
  name: string | null
  email: string | null
}

interface AdminSubtask {
  id: string
  name: string
  completed: boolean | null
}

interface AdminTask {
  id: string
  name: string
  icon: string | null
  completed: boolean | null
  assignedTo: string | null
  subtasks: AdminSubtask[]
}

interface AdminPhase {
  id: string
  name: string
  description: string | null
  track: string
  status: string
  order: number
  startDate: string | Date | null
  endDate: string | Date | null
  tasks: AdminTask[]
}

const selectClass =
  "w-full bg-black/40 border border-[#08A696]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#26FFDF] transition-colors"

const inputClass = "bg-black/40 border-[#08A696]/20 text-white placeholder:text-white/30 focus-visible:ring-[#26FFDF]/50"

/** Mismo tooltip que usa el tablero del cliente, para que el hover se vea y
 *  se sienta igual — la única diferencia admin es que el click abre edición
 *  en vez de solo fijar el tooltip. */
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

/** Nodo raíz: solo el nombre del proyecto, igual que en la vista del cliente. */
function RootNode({ data }: NodeProps<Node<Extract<BoardNodeData, { kind: "root" }>>>) {
  return (
    <div
      style={PILL_SIZE}
      className="relative flex items-center justify-center text-center px-4 rounded-xl bg-gradient-to-br from-[#08A696]/40 to-[#26FFDF]/20 border-2 border-[#26FFDF]/60 shadow-[0_0_20px_-4px_rgba(38,255,223,0.5)] before:content-[''] before:absolute before:inset-[-7px] before:rounded-[18px] before:border before:border-[#26FFDF]/15"
    >
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: "none" }} />
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

function HeadNode({
  data,
  onEdit,
}: NodeProps<Node<Extract<BoardNodeData, { kind: "head" }>>> & { onEdit: (phaseId: string) => void }) {
  const color = trackColor(data.track)
  return (
    <div style={PILL_SIZE} className="relative flex flex-col items-center justify-center text-center">
      <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: "none" }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: "none" }} />
      <button
        type="button"
        onClick={() => data.phaseId && onEdit(data.phaseId)}
        title="Editar fase"
        className="nodrag nopan pointer-events-auto group/head flex flex-col items-center justify-center rounded-xl px-2 py-1 transition-colors hover:bg-white/5 cursor-pointer"
      >
        <span className="flex items-center gap-1.5 text-base font-extrabold uppercase tracking-wide leading-tight drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]" style={{ color }}>
          {data.label}
          <Pencil className="w-3 h-3 opacity-0 group-hover/head:opacity-70 transition-opacity" />
        </span>
        <span className="mt-1 text-6xl font-black tabular-nums leading-none" style={{ color: hexToRgba(color, 0.85) }}>
          {data.count}
        </span>
      </button>
    </div>
  )
}

function TaskNode({
  data,
  onEdit,
}: NodeProps<Node<Extract<BoardNodeData, { kind: "task" }>>> & { onEdit: (taskId: string) => void }) {
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
        onClick={() => onEdit(data.task.id)}
        className="nodrag nopan pointer-events-auto group/node relative flex items-center justify-center w-[60px] h-[60px] rounded-full border transition-all duration-300 cursor-pointer"
        style={{
          background: data.isCurrent ? hexToRgba(color, 0.32) : data.task.completed ? hexToRgba(color, 0.22) : "rgba(0,0,0,0.4)",
          borderColor: lit ? hexToRgba(color, data.isCurrent ? 0.9 : 0.6) : "rgba(255,255,255,0.12)",
          boxShadow: data.isCurrent ? `0 0 10px -1px ${hexToRgba(color, 0.6)}` : undefined,
        }}
      >
        <span aria-hidden className="absolute inset-[-6px] rounded-full border pointer-events-none" style={{ borderColor: hexToRgba(color, lit ? 0.3 : 0.12) }} />
        <AnimatedIcon kind={meta.kind} icon={meta.icon} active={lit} size={22} className={lit ? "" : "text-white/35"} style={{ color: lit ? color : undefined }} />
        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-black/80 border border-white/15 opacity-40 group-hover/node:opacity-100 group-hover/node:border-[#26FFDF]/60 transition-opacity">
          <Pencil className="w-2.5 h-2.5 text-white/70 group-hover/node:text-[#26FFDF]" />
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <Tooltip>
            <p className="text-[11px] uppercase tracking-wider" style={{ color: hexToRgba(color, 0.85) }}>{TRACK_LABELS[data.track] ?? data.track}</p>
            <p className="text-sm font-semibold text-white text-center">{data.task.name}</p>
          </Tooltip>
        )}
      </AnimatePresence>
    </div>
  )
}

function SubtaskNode({
  data,
  onEdit,
}: NodeProps<Node<Extract<BoardNodeData, { kind: "subtask" }>>> & { onEdit: (subtaskId: string) => void }) {
  const [open, setOpen] = useState(false)
  const done = Boolean(data.subtask.completed)
  const color = trackColor(data.track)
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
        onClick={() => onEdit(data.subtask.id)}
        className="nodrag nopan pointer-events-auto group/node relative flex items-center justify-center w-11 h-11 rounded-full border transition-all duration-300 cursor-pointer"
        style={{
          background: done ? hexToRgba(color, 0.28) : "rgba(0,0,0,0.35)",
          borderColor: hexToRgba(color, done ? 0.9 : 0.45),
        }}
      >
        <span aria-hidden className="absolute inset-[-5px] rounded-full border pointer-events-none" style={{ borderColor: hexToRgba(color, done ? 0.22 : 0.1) }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: done ? color : hexToRgba(color, 0.7) }} />
        <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-black/80 border border-white/15 opacity-40 group-hover/node:opacity-100 group-hover/node:border-[#26FFDF]/60 transition-opacity">
          <Pencil className="w-2 h-2 text-white/70 group-hover/node:text-[#26FFDF]" />
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <Tooltip tone="muted">
            <p className="text-[11px] uppercase tracking-wider text-[#26FFDF]/60">Subtarea</p>
            <p className="text-sm font-semibold text-white text-center">{data.subtask.name}</p>
          </Tooltip>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Mismo patrón visual que el "+" de sugerencias/fallos/reuniones del
 *  tablero del cliente: círculo punteado teal con un ícono de más. */
function AddTaskNode({
  data,
  onAdd,
}: NodeProps<Node<Extract<BoardNodeData, { kind: "add-task" }>>> & { onAdd: (phaseId: string) => void }) {
  return (
    <div className="relative pointer-events-auto">
      <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: "none" }} />
      <button
        type="button"
        onClick={() => onAdd(data.phaseId)}
        title="Agregar tarea"
        className="nodrag nopan pointer-events-auto flex items-center justify-center w-[52px] h-[52px] rounded-full border border-dashed border-[#26FFDF]/40 text-[#26FFDF]/70 hover:border-[#26FFDF] hover:text-[#26FFDF] transition-colors cursor-pointer"
      >
        <Plus className="w-[22px] h-[22px]" />
      </button>
    </div>
  )
}

function AddSubtaskNode({
  data,
  onAdd,
}: NodeProps<Node<Extract<BoardNodeData, { kind: "add-subtask" }>>> & { onAdd: (taskId: string) => void }) {
  return (
    <div className="relative pointer-events-auto">
      <Handle id="left" type="target" position={Position.Left} style={{ opacity: 0, pointerEvents: "none" }} />
      <Handle id="top" type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: "none" }} />
      <button
        type="button"
        onClick={() => onAdd(data.taskId)}
        title="Agregar subtarea"
        className="nodrag nopan pointer-events-auto flex items-center justify-center w-11 h-11 rounded-full border border-dashed border-[#26FFDF]/40 text-[#26FFDF]/70 hover:border-[#26FFDF] hover:text-[#26FFDF] transition-colors cursor-pointer"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  )
}

export default function AdminTaskTreeBoard({
  projectId,
  projectName,
  phases,
  progress,
  statusLabel,
  clientLabel,
  clientHref,
}: {
  projectId: string
  projectName: string
  phases: AdminPhase[]
  progress: number
  statusLabel?: string
  clientLabel?: string
  clientHref?: string
}) {
  const router = useRouter()
  const [team, setTeam] = useState<TeamMember[]>([])
  const [creating, setCreating] = useState(false)
  const [createForm, setCreateForm] = useState({ phaseId: phases[0]?.id ?? "", name: "", icon: "planning", assignedTo: "" })
  const [saving, setSaving] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null)
  const [addSubtaskTaskId, setAddSubtaskTaskId] = useState<string | null>(null)
  const [phaseDialog, setPhaseDialog] = useState<{ mode: "create" } | { mode: "edit"; phaseId: string } | null>(null)

  const existingTracks = useMemo(() => Array.from(new Set(phases.map((ph) => ph.track))), [phases])

  useEffect(() => {
    fetch("/api/admin/clients?role=team&pageSize=100")
      .then((res) => res.json())
      .then((data) => setTeam(data.clients ?? []))
      .catch(() => setTeam([]))
  }, [])

  // Mapas de contexto: la tarea/subtarea que llega desde el grafo no trae su
  // fase/tarea padre (project-tree.ts es genérico), así que se reconstruyen
  // acá para armar las URLs de la API admin.
  const { taskById, phaseByTask, taskBySubtask } = useMemo(() => {
    const taskById = new Map<string, AdminTask>()
    const phaseByTask = new Map<string, string>()
    const taskBySubtask = new Map<string, string>()
    for (const ph of phases) {
      for (const t of ph.tasks) {
        taskById.set(t.id, t)
        phaseByTask.set(t.id, ph.id)
        for (const s of t.subtasks) {
          taskBySubtask.set(s.id, t.id)
        }
      }
    }
    return { taskById, phaseByTask, taskBySubtask }
  }, [phases])

  const pipelinePhases: PipelinePhase[] = useMemo(
    () =>
      phases.map((ph) => ({
        id: ph.id,
        name: ph.name,
        track: ph.track,
        order: ph.order,
        tasks: ph.tasks.map((t) => ({
          id: t.id,
          name: t.name,
          icon: t.icon,
          completed: t.completed,
          subtasks: t.subtasks.map((s) => ({ id: s.id, name: s.name, completed: s.completed })),
        })),
      })),
    [phases],
  )

  const { nodes: computedNodes, edges } = useMemo(() => {
    const graph = buildProjectGraph({
      projectName,
      phases: pipelinePhases,
      feeds: { suggestions: [], bugs: [], meetings: [] },
      interactive: false,
      editableTasks: true,
    })
    // Sin panel de consultas del cliente en la vista admin: se filtran los
    // nodos "hub"/"item" (siempre se crean 3 hubs vacíos aunque no haya feeds).
    const trackNodes = graph.nodes.filter((n) => n.group !== "hub")
    const trackIds = new Set(trackNodes.map((n) => n.id))
    const trackEdges = graph.edges.filter((e) => trackIds.has(e.source) && trackIds.has(e.target))

    const positioned = layoutProjectTree(trackNodes)
    const rfNodes: Node[] = positioned.map((n) => ({
      id: n.id,
      type: n.data.kind,
      position: { x: n.x - n.width / 2, y: n.y - n.height / 2 },
      data: n.data as unknown as Record<string, unknown>,
      draggable: true,
      connectable: false,
    }))
    const dataById = new Map(graph.nodes.map((n) => [n.id, n.data]))
    const rfEdges: Edge[] = trackEdges.map((e) => {
      const isSubtaskEdge = e.source.startsWith("sub-") || e.target.startsWith("sub-")
      const color = e.track ? trackColor(e.track) : "#08A696"
      const targetData = dataById.get(e.target)
      const isLocked = (targetData?.kind === "task" || targetData?.kind === "subtask") && !targetData.unlocked
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
  }, [projectName, JSON.stringify(pipelinePhases)])

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

  const handleOpenCreateTask = (phaseId: string) => {
    setCreateForm((prev) => ({ ...prev, phaseId: phaseId || prev.phaseId }))
    setCreating(true)
  }

  const handleEditPhase = (phaseId: string) => {
    setPhaseDialog({ mode: "edit", phaseId })
  }

  const nodeTypes = useMemo(
    () => ({
      root: RootNode,
      head: (props: NodeProps<Node<Extract<BoardNodeData, { kind: "head" }>>>) => (
        <HeadNode {...props} onEdit={handleEditPhase} />
      ),
      task: (props: NodeProps<Node<Extract<BoardNodeData, { kind: "task" }>>>) => (
        <TaskNode {...props} onEdit={setEditingTaskId} />
      ),
      subtask: (props: NodeProps<Node<Extract<BoardNodeData, { kind: "subtask" }>>>) => (
        <SubtaskNode {...props} onEdit={setEditingSubtaskId} />
      ),
      "add-task": (props: NodeProps<Node<Extract<BoardNodeData, { kind: "add-task" }>>>) => (
        <AddTaskNode {...props} onAdd={handleOpenCreateTask} />
      ),
      "add-subtask": (props: NodeProps<Node<Extract<BoardNodeData, { kind: "add-subtask" }>>>) => (
        <AddSubtaskNode {...props} onAdd={setAddSubtaskTaskId} />
      ),
    }),

    [],
  )

  const handleCreateTask = async () => {
    if (!createForm.phaseId) {
      toast.error("Selecciona una fase")
      return
    }
    if (!createForm.name.trim()) {
      toast.error("Falta el nombre de la tarea")
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/phases/${createForm.phaseId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: createForm.name, icon: createForm.icon, assignedTo: createForm.assignedTo || null }),
      })
      if (!res.ok) {throw new Error("create failed")}
      toast.success("Tarea creada")
      setCreateForm({ phaseId: createForm.phaseId, name: "", icon: "planning", assignedTo: "" })
      setCreating(false)
      router.refresh()
    } catch {
      toast.error("No se pudo crear la tarea")
    } finally {
      setSaving(false)
    }
  }

  const editingTask = editingTaskId ? taskById.get(editingTaskId) ?? null : null
  const editingTaskPhaseId = editingTaskId ? phaseByTask.get(editingTaskId) ?? null : null
  const editingSubtaskTaskId = editingSubtaskId ? taskBySubtask.get(editingSubtaskId) ?? null : null
  const editingSubtaskTask = editingSubtaskTaskId ? taskById.get(editingSubtaskTaskId) ?? null : null
  const editingSubtask = editingSubtaskTask?.subtasks.find((s) => s.id === editingSubtaskId) ?? null
  const editingSubtaskPhaseId = editingSubtaskTaskId ? phaseByTask.get(editingSubtaskTaskId) ?? null : null
  const addSubtaskPhaseId = addSubtaskTaskId ? phaseByTask.get(addSubtaskTaskId) ?? null : null
  const phaseDialogTarget =
    phaseDialog?.mode === "edit" ? phases.find((ph) => ph.id === phaseDialog.phaseId) : undefined

  return (
    <div className="ttb-board relative h-[calc(100vh-6rem)] w-full flex flex-col overflow-hidden border border-white/10 bg-[#0d1210]/55 backdrop-blur-xl">
      <style jsx global>{`
        .ttb-board .react-flow__node:hover { z-index: 1000 !important; }
        .ttb-board .ttb-edge-live path { animation: ttb-energy-flow 0.9s linear infinite; }
        .ttb-board .ttb-edge-dead path { animation: none; }
        @keyframes ttb-energy-flow { to { stroke-dashoffset: -18; } }
      `}</style>

      {/* Toda la navegación/gestión del proyecto vive dentro de este mismo
          panel: la barra superior (nombre, cliente, estado y volver) flota
          dentro del propio canvas, no aparte. */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between gap-3 px-3.5 py-2 bg-[#0d1210]/70 backdrop-blur-md border-b border-white/5 pointer-events-none">
        <span className="flex items-baseline gap-2 min-w-0">
          <span className="text-sm font-semibold text-white/85 truncate">{projectName}</span>
          {clientLabel && clientHref && (
            <Link href={clientHref} className="pointer-events-auto shrink-0 text-xs text-textSecondary hover:text-[#26FFDF] no-underline hover:no-underline transition-colors truncate">
              {clientLabel}
            </Link>
          )}
        </span>
        <span className="flex items-center gap-2 shrink-0">
          {statusLabel && <span className="text-xs font-semibold tracking-wide text-[#26FFDF]">{statusLabel}</span>}
          {/* Píldora: solo la flecha en reposo, el texto se revela con el
              cursor encima. Mismo lenguaje visual que el botón de WhatsApp
              flotante y el botón principal del login (rounded-2xl,
              bg-[#02505931], borde y glow teal). */}
          <Link
            href="/admin/proyectos"
            className="group/back pointer-events-auto relative flex items-center pl-1.5 pr-1.5 py-1 rounded-2xl bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 text-[#26FFDF] no-underline hover:no-underline shadow-lg transition-all duration-300 hover:border-[#08A696] hover:bg-[#02505950] hover:shadow-xl hover:shadow-[#08A696]/10"
          >
            <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
            <span className="overflow-hidden whitespace-nowrap max-w-0 opacity-0 group-hover/back:max-w-[8rem] group-hover/back:opacity-100 group-hover/back:ml-1.5 transition-all duration-300 text-xs">
              Volver a proyectos
            </span>
          </Link>
        </span>
      </div>

      <div className="relative flex-1 min-h-0">
        {nodes.length <= 1 ? (
          <div className="h-full flex flex-col items-center justify-center gap-3">
            <p className="text-textSecondary text-sm">No hay fases definidas aún</p>
            <Button size="sm" onClick={() => setPhaseDialog({ mode: "create" })} className="bg-[#08A696] hover:bg-[#08A696]/80">
              <Plus className="h-3.5 w-3.5 mr-1" /> Agregar fase
            </Button>
          </div>
        ) : (
          <>
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

            <button
              type="button"
              onClick={() => setPhaseDialog({ mode: "create" })}
              className="absolute bottom-14 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 text-[#26FFDF] text-xs font-medium shadow-lg transition-all duration-300 hover:border-[#08A696] hover:bg-[#02505950] hover:shadow-xl hover:shadow-[#08A696]/10"
            >
              <Plus className="h-3.5 w-3.5" /> Fase
            </button>

            <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2 px-2.5 py-1.5 rounded-2xl bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 shadow-lg pointer-events-none">
              <div className="w-14 h-1 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#08A696] to-[#26FFDF] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs font-bold text-[#26FFDF] tabular-nums">{progress}%</span>
            </div>
          </>
        )}
      </div>

      {/* Crear / editar fase */}
      {phaseDialog && (
        <PhaseEditDialog
          key={phaseDialog.mode === "edit" ? phaseDialog.phaseId : "new-phase"}
          projectId={projectId}
          phase={phaseDialogTarget}
          existingTracks={existingTracks}
          open
          onOpenChange={(v) => !v && setPhaseDialog(null)}
        />
      )}

      {/* Crear tarea */}
      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent className="bg-black border-[#08A696]/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Nueva tarea</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newTaskPhase">Fase</Label>
              <select
                id="newTaskPhase"
                value={createForm.phaseId}
                onChange={(e) => setCreateForm({ ...createForm, phaseId: e.target.value })}
                className={selectClass}
              >
                {phases.map((ph) => (
                  <option key={ph.id} value={ph.id}>
                    {ph.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="newTaskName">Nombre</Label>
              <Input
                id="newTaskName"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                placeholder="Ej: Pasarela de pago"
                className={inputClass}
              />
            </div>
            <div>
              <Label htmlFor="newTaskAssignee">Asignar a</Label>
              <select
                id="newTaskAssignee"
                value={createForm.assignedTo}
                onChange={(e) => setCreateForm({ ...createForm, assignedTo: e.target.value })}
                className={selectClass}
              >
                <option value="">Sin asignar</option>
                {team.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name ?? m.email}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Ícono</Label>
              <div className="grid grid-cols-8 gap-1.5 max-h-40 overflow-y-auto p-1">
                {TASK_ICONS.map((entry) => {
                  const isSelected = createForm.icon === entry.key
                  return (
                    <button
                      key={entry.key}
                      type="button"
                      title={entry.label}
                      onClick={() => setCreateForm({ ...createForm, icon: entry.key })}
                      className={`flex items-center justify-center aspect-square rounded-lg border transition-all ${
                        isSelected ? "bg-[#0d5d5d]/70 border-[#26FFDF]" : "bg-gray-900/50 border-gray-700 hover:border-[#08A696]/60"
                      }`}
                    >
                      <AnimatedIcon kind={entry.kind} icon={entry.icon} active={isSelected} size={14} className={isSelected ? "text-[#26FFDF]" : "text-gray-400"} />
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateTask} disabled={saving} className="bg-[#08A696] hover:bg-[#08A696]/80">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Crear tarea
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Agregar subtarea */}
      {addSubtaskTaskId && addSubtaskPhaseId && (
        <AddSubtaskDialog
          key={addSubtaskTaskId}
          projectId={projectId}
          phaseId={addSubtaskPhaseId}
          taskId={addSubtaskTaskId}
          onClose={() => setAddSubtaskTaskId(null)}
          onChanged={() => router.refresh()}
        />
      )}

      {/* Editar tarea */}
      {editingTask && editingTaskPhaseId && (
        <TaskEditDialog
          key={editingTask.id}
          projectId={projectId}
          phaseId={editingTaskPhaseId}
          task={editingTask}
          team={team}
          onClose={() => setEditingTaskId(null)}
          onChanged={() => router.refresh()}
        />
      )}

      {/* Editar subtarea */}
      {editingSubtask && editingSubtaskTaskId && editingSubtaskPhaseId && (
        <SubtaskEditDialog
          key={editingSubtask.id}
          projectId={projectId}
          phaseId={editingSubtaskPhaseId}
          taskId={editingSubtaskTaskId}
          subtask={editingSubtask}
          onClose={() => setEditingSubtaskId(null)}
          onChanged={() => router.refresh()}
        />
      )}
    </div>
  )
}

function AddSubtaskDialog({
  projectId,
  phaseId,
  taskId,
  onClose,
  onChanged,
}: {
  projectId: string
  phaseId: string
  taskId: string
  onClose: () => void
  onChanged: () => void
}) {
  const [name, setName] = useState("")
  const [saving, setSaving] = useState(false)

  const subtasksUrl = `/api/admin/projects/${projectId}/phases/${phaseId}/tasks/${taskId}/subtasks`

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Falta el nombre de la subtarea")
      return
    }
    setSaving(true)
    try {
      const res = await fetch(subtasksUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      })
      if (!res.ok) {throw new Error("create failed")}
      toast.success("Subtarea creada")
      onChanged()
      onClose()
    } catch {
      toast.error("No se pudo agregar la subtarea")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-black border-[#08A696]/20 max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-white">Nueva subtarea</DialogTitle>
        </DialogHeader>
        <div>
          <Label htmlFor="newSubtaskName">Nombre</Label>
          <Input
            id="newSubtaskName"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") {handleCreate()} }}
            placeholder="Ej: Diseñar UI del carrito"
            className={inputClass}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleCreate} disabled={saving} className="bg-[#08A696] hover:bg-[#08A696]/80">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Crear subtarea
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function TaskEditDialog({
  projectId,
  phaseId,
  task,
  team,
  onClose,
  onChanged,
}: {
  projectId: string
  phaseId: string
  task: AdminTask
  team: TeamMember[]
  onClose: () => void
  onChanged: () => void
}) {
  const [name, setName] = useState(task.name)
  const [assignedTo, setAssignedTo] = useState(task.assignedTo ?? "")
  const [completed, setCompleted] = useState(Boolean(task.completed))
  const [saving, setSaving] = useState(false)
  const [subtaskDraft, setSubtaskDraft] = useState("")
  const [addingSubtask, setAddingSubtask] = useState(false)

  const taskUrl = `/api/admin/projects/${projectId}/phases/${phaseId}/tasks/${task.id}`
  const subtasksUrl = `${taskUrl}/subtasks`

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(taskUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, assignedTo: assignedTo || null, completed }),
      })
      if (!res.ok) {throw new Error("save failed")}
      toast.success("Tarea actualizada")
      onChanged()
      onClose()
    } catch {
      toast.error("No se pudo guardar la tarea")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(taskUrl, { method: "DELETE" })
      if (!res.ok) {throw new Error("delete failed")}
      toast.success("Tarea eliminada")
      onChanged()
      onClose()
    } catch {
      toast.error("No se pudo eliminar la tarea")
    }
  }

  const handleToggleSubtask = async (subtask: AdminSubtask) => {
    try {
      const res = await fetch(`${subtasksUrl}/${subtask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !subtask.completed }),
      })
      if (!res.ok) {throw new Error("toggle failed")}
      onChanged()
    } catch {
      toast.error("No se pudo actualizar la subtarea")
    }
  }

  const handleDeleteSubtask = async (subtaskId: string) => {
    try {
      const res = await fetch(`${subtasksUrl}/${subtaskId}`, { method: "DELETE" })
      if (!res.ok) {throw new Error("delete failed")}
      onChanged()
    } catch {
      toast.error("No se pudo eliminar la subtarea")
    }
  }

  const handleCreateSubtask = async () => {
    if (!subtaskDraft.trim()) {return}
    try {
      const res = await fetch(subtasksUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: subtaskDraft.trim() }),
      })
      if (!res.ok) {throw new Error("create failed")}
      setSubtaskDraft("")
      setAddingSubtask(false)
      onChanged()
    } catch {
      toast.error("No se pudo agregar la subtarea")
    }
  }

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-black border-[#08A696]/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Editar tarea</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="taskEditName">Nombre</Label>
            <Input id="taskEditName" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <Label htmlFor="taskEditAssignee">Asignar a</Label>
            <select id="taskEditAssignee" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className={selectClass}>
              <option value="">Sin asignar</option>
              {team.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name ?? m.email}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-textSecondary cursor-pointer">
            <input type="checkbox" checked={completed} onChange={(e) => setCompleted(e.target.checked)} className="accent-[#26FFDF]" />
            Completada
          </label>

          <div>
            <Label>Subtareas</Label>
            <div className="mt-1.5 space-y-1 rounded-lg border border-white/10 p-2">
              {task.subtasks.length === 0 && !addingSubtask && (
                <p className="text-textSecondary/50 text-xs px-1 py-1">Sin subtareas</p>
              )}
              {task.subtasks.map((s) => (
                <div key={s.id} className="flex items-center gap-2 text-xs px-1 py-1 rounded-md hover:bg-white/5 group/sub">
                  <button
                    type="button"
                    onClick={() => handleToggleSubtask(s)}
                    className={`shrink-0 w-4 h-4 rounded-full border flex items-center justify-center ${
                      s.completed ? "bg-[#08A696]/30 border-[#26FFDF]" : "bg-black/30 border-white/15"
                    }`}
                  >
                    {s.completed && <Check className="h-2.5 w-2.5 text-[#26FFDF]" />}
                  </button>
                  <span className={`flex-1 truncate ${s.completed ? "text-[#26FFDF] line-through" : "text-textSecondary"}`}>{s.name}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteSubtask(s.id)}
                    className="shrink-0 opacity-0 group-hover/sub:opacity-100 text-[#FF6B6B]/70 hover:text-[#FF6B6B] transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {addingSubtask ? (
                <div className="flex items-center gap-1.5 px-1 pt-1">
                  <Input
                    autoFocus
                    value={subtaskDraft}
                    onChange={(e) => setSubtaskDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {handleCreateSubtask()}
                      if (e.key === "Escape") { setAddingSubtask(false); setSubtaskDraft("") }
                    }}
                    placeholder="Ej: Diseñar UI del carrito"
                    className={`h-7 text-xs px-1.5 ${inputClass}`}
                  />
                  <button type="button" onClick={handleCreateSubtask} className="shrink-0 text-[#26FFDF]">
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => { setAddingSubtask(false); setSubtaskDraft("") }} className="shrink-0 text-textSecondary/60">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setAddingSubtask(true)}
                  className="flex items-center gap-1 text-[10px] text-textSecondary/60 hover:text-[#26FFDF] px-1 py-1 transition-colors"
                >
                  <Plus className="h-3 w-3" /> Agregar subtarea
                </button>
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <Button type="button" variant="ghost" onClick={handleDelete} className="text-[#FF6B6B] hover:bg-[#FF6B6B]/10 hover:text-[#FF6B6B]">
            <Trash2 className="h-4 w-4 mr-2" /> Eliminar tarea
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-[#08A696] hover:bg-[#08A696]/80">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function SubtaskEditDialog({
  projectId,
  phaseId,
  taskId,
  subtask,
  onClose,
  onChanged,
}: {
  projectId: string
  phaseId: string
  taskId: string
  subtask: AdminSubtask
  onClose: () => void
  onChanged: () => void
}) {
  const [name, setName] = useState(subtask.name)
  const [completed, setCompleted] = useState(Boolean(subtask.completed))
  const [saving, setSaving] = useState(false)

  const subtaskUrl = `/api/admin/projects/${projectId}/phases/${phaseId}/tasks/${taskId}/subtasks/${subtask.id}`

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(subtaskUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, completed }),
      })
      if (!res.ok) {throw new Error("save failed")}
      toast.success("Subtarea actualizada")
      onChanged()
      onClose()
    } catch {
      toast.error("No se pudo guardar la subtarea")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(subtaskUrl, { method: "DELETE" })
      if (!res.ok) {throw new Error("delete failed")}
      toast.success("Subtarea eliminada")
      onChanged()
      onClose()
    } catch {
      toast.error("No se pudo eliminar la subtarea")
    }
  }

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-black border-[#08A696]/20 max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-white">Editar subtarea</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="subtaskEditName">Nombre</Label>
            <Input id="subtaskEditName" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>
          <label className="flex items-center gap-2 text-sm text-textSecondary cursor-pointer">
            <input type="checkbox" checked={completed} onChange={(e) => setCompleted(e.target.checked)} className="accent-[#26FFDF]" />
            Completada
          </label>
        </div>
        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <Button type="button" variant="ghost" onClick={handleDelete} className="text-[#FF6B6B] hover:bg-[#FF6B6B]/10 hover:text-[#FF6B6B]">
            <Trash2 className="h-4 w-4 mr-2" /> Eliminar
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-[#08A696] hover:bg-[#08A696]/80">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
