'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import { 
  Filter, 
  X,
  CheckCircle,
  Clock,
  Circle,
  XCircle,
  AlertTriangle,
  Minus,
  ChevronDown,
  Check
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TimelineFiltersProps {
  onFilterChange: (filters: FilterState) => void
  taskCounts: {
    total: number
    byStatus: Record<string, number>
    byPriority: Record<string, number>
    byStage: Record<string, number>
  }
}

export interface FilterState {
  status: string[]
  priority: string[]
  stage: string[]
  search: string
}

const statusConfig = {
  all: { label: 'Todos', icon: Minus, color: 'bg-slate-500/20 text-slate-400' },
  pending: { label: 'Pendiente', icon: Circle, color: 'bg-slate-500/20 text-slate-400' },
  in_progress: { label: 'En Progreso', icon: Clock, color: 'bg-blue-500/20 text-blue-400' },
  completed: { label: 'Completada', icon: CheckCircle, color: 'bg-green-500/20 text-green-400' },
  blocked: { label: 'Bloqueada', icon: XCircle, color: 'bg-red-500/20 text-red-400' }
}

const priorityConfig = {
  all: { label: 'Todas', icon: Minus, color: 'bg-slate-500/20 text-slate-400' },
  low: { label: 'Baja', icon: Circle, color: 'bg-slate-500/20 text-slate-400' },
  medium: { label: 'Media', icon: AlertTriangle, color: 'bg-yellow-500/20 text-yellow-400' },
  high: { label: 'Alta', icon: XCircle, color: 'bg-red-500/20 text-red-400' }
}

const stageConfig = {
  all: { label: 'Todas', icon: Minus, color: 'bg-slate-500/20 text-slate-400' },
  planning: { label: 'Planeación', icon: Circle, color: 'bg-blue-500/10 text-blue-300' },
  design: { label: 'Diseño', icon: Circle, color: 'bg-purple-500/10 text-purple-300' },
  development: { label: 'Desarrollo', icon: Circle, color: 'bg-orange-500/10 text-orange-300' },
  testing: { label: 'Testing', icon: CheckCircle, color: 'bg-yellow-500/10 text-yellow-300' },
  deployment: { label: 'Despliegue', icon: CheckCircle, color: 'bg-green-500/10 text-green-300' }
}

// Componente de selector múltiple personalizado
interface MultiSelectProps {
  label: string
  options: Array<{ key: string; label: string; icon?: React.ComponentType<{className?: string}>; count: number }>
  selectedValues: string[]
  onSelectionChange: (values: string[]) => void
  placeholder?: string
}

function MultiSelect({ label, options, selectedValues, onSelectionChange, placeholder }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  // Cerrar dropdown al hacer clic fuera
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.multi-select-container')) {
        setIsOpen(false)
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
    
    return () => {}
  }, [isOpen])
  
  const toggleOption = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value]
    onSelectionChange(newValues)
  }
  
  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return placeholder || `Seleccionar ${label.toLowerCase()}`
    }
    if (selectedValues.length === 1) {
      const option = options.find(opt => opt.key === selectedValues[0])
      return option?.label || selectedValues[0]
    }
    return `${selectedValues.length} seleccionados`
  }
  
  return (
    <div className="relative multi-select-container mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#0f0f0f] border border-[#26FFDF]/40 px-3 py-2 text-left text-sm text-white hover:bg-[#1a1a1a] hover:border-[#26FFDF]/60 transition-all duration-200 flex items-center justify-between shadow-sm rounded-lg"
      >
        <span className="truncate">{getDisplayText()}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform duration-200 text-[#26FFDF]", isOpen && "rotate-180")} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f0f0f] border border-[#26FFDF]/40 shadow-lg z-[60] max-h-48 overflow-y-auto rounded-lg">
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.key)
            const Icon = option.icon
            
            return (
              <button
                key={option.key}
                onClick={() => toggleOption(option.key)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-[#1a1a1a] transition-colors duration-150 flex items-center justify-between group"
              >
                <div className="flex items-center space-x-2">
                  {Icon && <Icon className="h-3 w-3 text-[#26FFDF]" />}
                  <span className={cn("text-white", isSelected && "font-semibold text-[#26FFDF]")}>
                    {option.label} ({option.count})
                  </span>
                </div>
                {isSelected && <Check className="h-3 w-3 text-[#26FFDF]" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function TimelineFilters({ onFilterChange, taskCounts }: TimelineFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    priority: [],
    stage: [],
    search: ''
  })
  const [isExpanded, setIsExpanded] = useState(false)

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }



  const clearAllFilters = () => {
    const clearedFilters = {
      status: [],
      priority: [],
      stage: [],
      search: ''
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const hasActiveFilters = filters.status.length > 0 || filters.priority.length > 0 || filters.stage.length > 0 || filters.search.length > 0
  const activeFilterCount = filters.status.length + filters.priority.length + filters.stage.length + (filters.search ? 1 : 0)

  return (
    <div className="bg-gradient-to-br from-white/8 to-background/10 border border-[#26FFDF]/30 p-4 backdrop-blur-sm shadow-lg shadow-[#26FFDF]/5 mb-6 relative z-10 rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Filter className="h-5 w-5 text-[#26FFDF]" />
          <h3 className="text-lg sm:text-xl font-semibold text-[#26FFDF]">Filtros</h3>
          {activeFilterCount > 0 && (
            <Badge className="bg-[#26FFDF] text-black font-semibold">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-[#26FFDF]/70 hover:text-[#26FFDF] hover:bg-[#26FFDF]/10"
            >
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#26FFDF]/70 hover:text-[#26FFDF] hover:bg-[#26FFDF]/10 md:hidden"
          >
            {isExpanded ? 'Ocultar' : 'Mostrar'}
          </Button>
        </div>
      </div>

      {/* Filters Content */}
      <div className={cn(
        "space-y-4 sm:space-y-6",
        "md:block", // Always show on desktop
        isExpanded ? "block" : "hidden md:block" // Toggle on mobile
      )}>
        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="bg-gradient-to-br from-white/12 to-white/6 border border-[#26FFDF]/30 p-3 text-center shadow-md hover:shadow-lg transition-all duration-200 hover:from-white/15 hover:to-white/8 rounded-xl">
            <div className="text-lg font-bold text-[#26FFDF]">{taskCounts.total}</div>
            <div className="text-xs text-white/85">Total</div>
          </div>
          <div className="bg-gradient-to-br from-white/12 to-white/6 border border-[#26FFDF]/30 p-3 text-center shadow-md hover:shadow-lg transition-all duration-200 hover:from-white/15 hover:to-white/8 rounded-xl">
            <div className="text-lg font-bold text-[#26FFDF]">{taskCounts.byStatus.in_progress || 0}</div>
            <div className="text-xs text-white/85">En Progreso</div>
          </div>
          <div className="bg-gradient-to-br from-white/12 to-white/6 border border-[#26FFDF]/30 p-3 text-center shadow-md hover:shadow-lg transition-all duration-200 hover:from-white/15 hover:to-white/8 rounded-xl">
            <div className="text-lg font-bold text-[#26FFDF]">{taskCounts.byStatus.completed || 0}</div>
            <div className="text-xs text-white/85">Completadas</div>
          </div>
          <div className="bg-gradient-to-br from-white/12 to-white/6 border border-[#26FFDF]/30 p-3 text-center shadow-md hover:shadow-lg transition-all duration-200 hover:from-white/15 hover:to-white/8 rounded-xl">
            <div className="text-lg font-bold text-[#26FFDF]">{taskCounts.byStatus.pending || 0}</div>
            <div className="text-xs text-white/85">Pendientes</div>
          </div>
        </div>

        {/* Filter Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
          {/* Status Filter */}
          <div className="space-y-2 relative z-20">
            <label className="text-sm font-medium text-white/90 block mb-1">Estado</label>
            <MultiSelect
              label="Estado"
              options={Object.entries(statusConfig).map(([key, config]) => ({
                key,
                label: config.label,
                icon: config.icon,
                count: taskCounts.byStatus[key] || 0
              })).filter(option => option.key !== 'all')}
              selectedValues={filters.status}
              onSelectionChange={(values) => updateFilters({ status: values })}
              placeholder="Seleccionar estados"
            />
          </div>

          {/* Priority Filter */}
          <div className="space-y-2 relative z-20">
            <label className="text-sm font-medium text-white/90 block mb-1">Prioridad</label>
            <MultiSelect
              label="Prioridad"
              options={Object.entries(priorityConfig).map(([key, config]) => ({
                key,
                label: config.label,
                icon: config.icon,
                count: taskCounts.byPriority[key] || 0
              })).filter(option => option.key !== 'all')}
              selectedValues={filters.priority}
              onSelectionChange={(values) => updateFilters({ priority: values })}
              placeholder="Seleccionar prioridades"
            />
          </div>

          {/* Stage Filter */}
          <div className="space-y-2 relative z-20">
            <label className="text-sm font-medium text-white/90 block mb-1">Etapa</label>
            <MultiSelect
              label="Etapa"
              options={Object.entries(stageConfig).map(([key, config]) => ({
                key,
                label: config.label,
                icon: config.icon,
                count: taskCounts.byStage[key] || 0
              })).filter(option => option.key !== 'all')}
              selectedValues={filters.stage}
              onSelectionChange={(values) => updateFilters({ stage: values })}
              placeholder="Seleccionar etapas"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimelineFilters