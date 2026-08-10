import {
  Rocket,
  CalendarClock,
  ClipboardList,
  PenTool,
  Search,
  FileText,
  Palette,
  Sparkles,
  FileCheck,
  ListChecks,
  Layout,
  AppWindow,
  Server,
  Database,
  Lock,
  Link as LinkIcon,
  ShoppingCart,
  CreditCard,
  Package,
  Truck,
  LayoutGrid,
  FormInput,
  Mail,
  Bell,
  Image,
  Smartphone,
  Layers,
  Brain,
  Bot,
  Workflow,
  Globe,
  Gauge,
  Eye,
  BarChart3,
  FlaskConical,
  Bug,
  ShieldCheck,
  Activity,
  HardDrive,
  BookOpen,
  GraduationCap,
  LifeBuoy,
  Wrench,
  Flag,
  MessageSquare,
  type LucideIcon,
} from "lucide-react"
import type { IconKind } from "@/components/home/sections/AnimatedIcon"

export interface TaskIconEntry {
  key: string
  label: string
  icon: LucideIcon
  kind: IconKind
}

/**
 * Librería curada de íconos para tareas individuales (~40), elegida a mano
 * por el admin al crear cada tarea (ver AdminTaskTreeBoard). Reutiliza los
 * 14 "kind" de animación ya implementados en AnimatedIcon — no hay que
 * programar animaciones nuevas.
 */
export const TASK_ICONS: TaskIconEntry[] = [
  // Planeación
  { key: "kickoff", label: "Kickoff", icon: Rocket, kind: "trend-rise" },
  { key: "meeting", label: "Reunión", icon: CalendarClock, kind: "db-sync" },
  { key: "requirements", label: "Requisitos", icon: ClipboardList, kind: "type-blink" },
  { key: "wireframe", label: "Wireframe", icon: PenTool, kind: "grid-ripple" },
  { key: "research", label: "Investigación", icon: Search, kind: "bar-grow" },
  { key: "proposal", label: "Propuesta", icon: FileText, kind: "type-blink" },
  { key: "moodboard", label: "Moodboard", icon: Palette, kind: "chip-pulse" },
  { key: "branding", label: "Branding", icon: Sparkles, kind: "trend-rise" },
  { key: "contract", label: "Contrato aprobado", icon: FileCheck, kind: "type-blink" },
  { key: "planning", label: "Planeación", icon: ListChecks, kind: "grid-ripple" },

  // Desarrollo
  { key: "ui-design", label: "Diseño UI", icon: Layout, kind: "grid-ripple" },
  { key: "frontend", label: "Frontend", icon: AppWindow, kind: "workflow-cycle" },
  { key: "backend", label: "Backend", icon: Server, kind: "db-sync" },
  { key: "database", label: "Base de datos", icon: Database, kind: "db-sync" },
  { key: "auth", label: "Autenticación", icon: Lock, kind: "chip-pulse" },
  { key: "api", label: "Integración API", icon: LinkIcon, kind: "link-connect" },
  { key: "cart", label: "Carrito de compras", icon: ShoppingCart, kind: "cart-bounce" },
  { key: "payments", label: "Pasarela de pago", icon: CreditCard, kind: "chip-pulse" },
  { key: "inventory", label: "Inventario", icon: Package, kind: "gear-spin" },
  { key: "shipping", label: "Envíos", icon: Truck, kind: "phone-tilt" },
  { key: "catalog", label: "Catálogo", icon: LayoutGrid, kind: "grid-ripple" },
  { key: "forms", label: "Formularios", icon: FormInput, kind: "type-blink" },
  { key: "email", label: "Email", icon: Mail, kind: "chip-pulse" },
  { key: "notifications", label: "Notificaciones", icon: Bell, kind: "chip-pulse" },
  { key: "images", label: "Imágenes", icon: Image, kind: "grid-ripple" },
  { key: "mobile", label: "Adaptación móvil", icon: Smartphone, kind: "phone-tilt" },
  { key: "cms", label: "CMS / Contenido", icon: Layers, kind: "db-sync" },
  { key: "ai", label: "Inteligencia artificial", icon: Brain, kind: "brain-think" },
  { key: "automation", label: "Automatización", icon: Bot, kind: "bot-idle" },
  { key: "workflow", label: "Flujo de trabajo", icon: Workflow, kind: "workflow-cycle" },
  { key: "multilang", label: "Multi-idioma", icon: Globe, kind: "globe-spin" },
  { key: "performance", label: "Rendimiento", icon: Gauge, kind: "trend-rise" },
  { key: "seo", label: "SEO", icon: Search, kind: "bar-grow" },
  { key: "analytics", label: "Analítica", icon: BarChart3, kind: "bar-grow" },

  // Calidad y entrega
  { key: "testing", label: "Pruebas", icon: FlaskConical, kind: "gear-spin" },
  { key: "bugfix", label: "Corrección de errores", icon: Bug, kind: "gear-spin" },
  { key: "review", label: "Revisión", icon: Eye, kind: "chip-pulse" },
  { key: "security", label: "Auditoría de seguridad", icon: ShieldCheck, kind: "chip-pulse" },
  { key: "deployment", label: "Despliegue", icon: Rocket, kind: "globe-spin" },
  { key: "monitoring", label: "Monitoreo", icon: Activity, kind: "bar-grow" },
  { key: "backup", label: "Respaldo", icon: HardDrive, kind: "db-sync" },
  { key: "documentation", label: "Documentación", icon: BookOpen, kind: "type-blink" },
  { key: "training", label: "Capacitación", icon: GraduationCap, kind: "brain-think" },
  { key: "support", label: "Soporte", icon: LifeBuoy, kind: "chip-pulse" },
  { key: "maintenance", label: "Mantenimiento", icon: Wrench, kind: "gear-spin" },
  { key: "launch", label: "Lanzamiento", icon: Flag, kind: "trend-rise" },
  { key: "feedback", label: "Retroalimentación", icon: MessageSquare, kind: "type-blink" },
]

const TASK_ICON_MAP = new Map(TASK_ICONS.map((entry) => [entry.key, entry]))

/** Ícono genérico de respaldo cuando la tarea no tiene uno elegido. */
export const DEFAULT_TASK_ICON: TaskIconEntry = TASK_ICON_MAP.get("planning")!

export function taskIcon(key: string | null | undefined): TaskIconEntry {
  if (!key) {return DEFAULT_TASK_ICON}
  return TASK_ICON_MAP.get(key) ?? DEFAULT_TASK_ICON
}
