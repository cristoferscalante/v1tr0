// Importamos todos los iconos necesarios de Lucide React
import {
  Home,
  User,
  Briefcase,
  MessageSquare,
  LogOut,
  Github,
  Linkedin,
  Mail,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Code,
  Palette,
  Lightbulb,
  BarChart,
  PieChart,
  TrendingUp,
  Calendar,
  CalendarDays,
  CheckSquare,
  Users,
  ArrowRight,
  Menu,
  X,
  Eye,
  EyeOff,
  Lock,
  Send,
  Bot,
  Paperclip,
  Trash,
  Pencil,
  Phone,
  MapPin,
  FileText,
  AlertTriangle,
  Activity,
  Group,
  ArrowUpRight,
  LineChart,
  Server,
  Database,
  Smartphone,
  Rocket,
  Zap,
  Layers,
  ExternalLink,
  BookOpen,
  Clock,
  UserCircle,
  ArrowLeft,
  HelpCircle,
  GitBranch,
  Target,
  Kanban,
  Settings,
  Shield,
  BrainCircuit,
  type LucideIcon,
} from "lucide-react"

// Importamos nuestro icono personalizado de TikTok
import { TikTokIcon as CustomTikTokIcon } from "@/components/icons/TikTokIcon"

// Iconos SVG simples para Instagram, Facebook, YouTube y Discord
export const InstagramSvgIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={props.width || 24} height={props.height || 24} viewBox="0 0 24 24" fill="none" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="6" fill="currentColor"/>
    <circle cx="12" cy="12" r="5" fill="#fff"/>
    <circle cx="17" cy="7" r="1.5" fill="#fff"/>
  </svg>
);
export const FacebookSvgIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={props.width || 24} height={props.height || 24} viewBox="0 0 24 24" fill="none" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="6" fill="currentColor"/>
    <path d="M15.5 8.5h-2V7.5c0-.414.336-.75.75-.75h1.25V5h-2.25A2.25 2.25 0 0 0 11 7.25v1.25H9.5V11H11v6h2.5v-6h1.5l.5-2.5z" fill="#fff"/>
  </svg>
);
export const YouTubeSvgIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={props.width || 24} height={props.height || 24} viewBox="0 0 24 24" fill="none" {...props}>
    <rect x="2" y="6" width="20" height="12" rx="4" fill="currentColor"/>
    <polygon points="10,9 16,12 10,15" fill="#fff"/>
  </svg>
);
export const DiscordSvgIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={props.width || 24} height={props.height || 24} viewBox="0 0 24 24" fill="none" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="6" fill="currentColor"/>
    <ellipse cx="9" cy="13" rx="1.5" ry="1" fill="#fff"/>
    <ellipse cx="15" cy="13" rx="1.5" ry="1" fill="#fff"/>
    <path d="M8 17c2 1 6 1 8 0" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Exportamos los iconos con los mismos nombres que se usaban antes
export const HomeIcon = Home
export const PersonIcon = User
export const WorkIcon = Briefcase
export const ChatIcon = MessageSquare
export const LogoutIcon = LogOut
export const GitHubIcon = Github
export const LinkedInIcon = Linkedin
export const EmailIcon = Mail
export const ExpandLessIcon = ChevronUp
export const CodeIcon = Code
export const PaletteIcon = Palette
export const LightbulbIcon = Lightbulb
export const BarChartIcon = BarChart
export const PieChartIcon = PieChart
export const TrendingUpIcon = TrendingUp
export const CalendarIcon = Calendar
export const CalendarTodayIcon = CalendarDays
export const CheckBoxIcon = CheckSquare
export const PeopleIcon = Users
export const ArrowRightIcon = ArrowRight // Aseguramos que ArrowRightIcon esté correctamente definido
export const ArrowRightAltIcon = ArrowRight // Este es un alias adicional que se estaba usando
export const MenuIcon = Menu
export const CloseIcon = X
export const VisibilityIcon = Eye
export const VisibilityOffIcon = EyeOff
export const LockIcon = Lock
export const SendIcon = Send
export const SmartToyIcon = Bot
export const AttachFileIcon = Paperclip
export const DeleteIcon = Trash
export const EditIcon = Pencil
export const PhoneIcon = Phone
export const LocationOnIcon = MapPin
export const TikTokIcon = CustomTikTokIcon // Ahora usamos nuestro icono personalizado
export const FileIcon = FileText
export const ErrorIcon = AlertTriangle
export const ActivityIcon = Activity
export const UsersIcon = Users
export const FileTextIcon = FileText
export const ArrowUpRightIcon = ArrowUpRight
export const LineChartIcon = LineChart
export const ServerIcon = Server
export const DatabaseIcon = Database
export const SmartphoneIcon = Smartphone
export const RocketIcon = Rocket
export const ZapIcon = Zap
export const LayersIcon = Layers
export const ExternalLinkIcon = ExternalLink
export const BookOpenIcon = BookOpen
export const ClockIcon = Clock
export const UserIcon = UserCircle
export const ArrowLeftIcon = ArrowLeft
export const FileQuestionIcon = HelpCircle
export const GitBranchIcon = GitBranch
export const TargetIcon = Target
export const KanbanIcon = Kanban
export const SettingsIcon = Settings
export const ChevronLeftIcon = ChevronLeft
export const ChevronRightIcon = ChevronRight
export const ShieldIcon = Shield
export const BrainCircuitIcon = BrainCircuit

// Exportamos también el tipo LucideIcon para facilitar el tipado
export type { LucideIcon }

// Exportamos todos los iconos directamente para permitir importaciones más flexibles
export {
  Home,
  User,
  Briefcase,
  MessageSquare,
  LogOut,
  Github,
  Linkedin,
  Mail,
  ChevronUp,
  Code,
  Palette,
  Lightbulb,
  BarChart,
  PieChart,
  TrendingUp,
  Calendar,
  CalendarDays,
  CheckSquare,
  Users,
  ArrowRight,
  Menu,
  X,
  Eye,
  EyeOff,
  Lock,
  Send,
  Bot,
  Paperclip,
  Trash,
  Pencil,
  Phone,
  MapPin,
  FileText,
  AlertTriangle,
  Activity,
  Group,
  ArrowUpRight,
  LineChart,
  Server,
  Database,
  Smartphone,
  Rocket,
  Zap,
  Layers,
  ExternalLink,
  BookOpen,
  Clock,
  UserCircle,
  ArrowLeft,
  HelpCircle,
  GitBranch,
  Target,
  Kanban,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  BrainCircuit,
  CustomTikTokIcon,
}
