'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Home,
  FolderOpen,
  Users,
  Calendar,
  MessageSquare,
  BarChart3,
  Settings,
  FileText,
  CreditCard,
  Clock,
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Proyectos',
    icon: FolderOpen,
    badge: '12',
    children: [
      { title: 'Todos los proyectos', href: '/dashboard/projects', icon: FolderOpen },
      { title: 'Mis proyectos', href: '/dashboard/projects/mine', icon: FolderOpen },
      { title: 'Archivados', href: '/dashboard/projects/archived', icon: FolderOpen },
    ],
  },
  {
    title: 'Equipo',
    icon: Users,
    badge: '8',
    children: [
      { title: 'Miembros', href: '/dashboard/team/members', icon: Users },
      { title: 'Roles', href: '/dashboard/team/roles', icon: Users },
      { title: 'Invitaciones', href: '/dashboard/team/invitations', icon: Users, badge: '2' },
    ],
  },
  {
    title: 'Reuniones',
    href: '/dashboard/meetings',
    icon: Calendar,
    badge: '3',
  },
  {
    title: 'Mensajes',
    href: '/dashboard/messages',
    icon: MessageSquare,
    badge: '5',
  },
  {
    title: 'Reportes',
    icon: BarChart3,
    children: [
      { title: 'Análisis de proyectos', href: '/dashboard/reports/projects', icon: BarChart3 },
      { title: 'Productividad', href: '/dashboard/reports/productivity', icon: BarChart3 },
      { title: 'Tiempo', href: '/dashboard/reports/time', icon: Clock },
    ],
  },
  {
    title: 'Documentos',
    href: '/dashboard/documents',
    icon: FileText,
  },
  {
    title: 'Facturación',
    icon: CreditCard,
    children: [
      { title: 'Facturas', href: '/dashboard/billing/invoices', icon: CreditCard },
      { title: 'Pagos', href: '/dashboard/billing/payments', icon: CreditCard },
      { title: 'Suscripciones', href: '/dashboard/billing/subscriptions', icon: CreditCard },
    ],
  },
];

const quickActions = [
  { title: 'Nuevo Proyecto', icon: Plus, href: '/dashboard/projects/new' },
  { title: 'Buscar', icon: Search, href: '/dashboard/search' },
  { title: 'Filtros', icon: Filter, href: '/dashboard/filters' },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<string[]>(['Proyectos']);

  const toggleItem = (title: string) => {
    setOpenItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const isOpen = openItems.includes(item.title);
    const hasChildren = item.children && item.children.length > 0;
    const isActive = item.href ? pathname === item.href : false;

    if (hasChildren) {
      return (
        <Collapsible key={item.title} open={isOpen} onOpenChange={() => toggleItem(item.title)}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start gap-2 h-9',
                level > 0 && 'ml-4 w-[calc(100%-1rem)]',
                'hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1 text-left">{item.title}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
                  {item.badge}
                </Badge>
              )}
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
            {item.children?.map(child => renderNavItem(child, level + 1))}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <Button
        key={item.title}
        variant={isActive ? 'secondary' : 'ghost'}
        className={cn(
          'w-full justify-start gap-2 h-9',
          level > 0 && 'ml-4 w-[calc(100%-1rem)]',
          isActive && 'bg-accent text-accent-foreground',
          'hover:bg-accent hover:text-accent-foreground'
        )}
        asChild
      >
        <Link href={item.href || '#'}>
          <item.icon className="h-4 w-4" />
          <span className="flex-1 text-left">{item.title}</span>
          {item.badge && (
            <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
              {item.badge}
            </Badge>
          )}
        </Link>
      </Button>
    );
  };

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      {/* Acciones rápidas */}
      <div className="p-4 border-b">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Acciones Rápidas</h4>
          <div className="grid grid-cols-3 gap-1">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                variant="outline"
                size="sm"
                className="h-8 px-2"
                asChild
              >
                <Link href={action.href}>
                  <action.icon className="h-3 w-3" />
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Navegación principal */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2 px-2">Navegación</h4>
          {navigation.map(item => renderNavItem(item))}
        </div>
      </ScrollArea>

      {/* Configuración */}
      <div className="p-3 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 h-9"
          asChild
        >
          <Link href="/dashboard/settings">
            <Settings className="h-4 w-4" />
            <span>Configuración</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}