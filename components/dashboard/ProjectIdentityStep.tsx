"use client"

import { AnimatedIcon } from "@/components/home/sections/AnimatedIcon"
import { SERVICE_TYPES, SERVICE_TYPE_META } from "@/components/shared/service-type"

interface Props {
  name: string
  icon: string
  onNameChange: (name: string) => void
  onIconChange: (icon: string) => void
}

export default function ProjectIdentityStep({ name, icon, onNameChange, onIconChange }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="projectName" className="text-sm text-gray-400 mb-2 block">
          Nombre del proyecto
        </label>
        <input
          id="projectName"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Ej: Tienda de accesorios, Portal de clientes..."
          className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#08A696]"
          autoFocus
        />
      </div>

      <div>
        <p className="text-sm text-gray-400 mb-2">Elige un ícono para identificarlo</p>
        <div className="grid grid-cols-4 gap-2">
          {SERVICE_TYPES.map((key) => {
            const meta = SERVICE_TYPE_META[key]
            const isSelected = icon === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => onIconChange(key)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 ${
                  isSelected
                    ? "border-[#26FFDF] bg-[#26FFDF]/10"
                    : "border-gray-700 bg-gray-900/50 hover:border-[#08A696]/50"
                }`}
              >
                <AnimatedIcon
                  kind={meta.kind}
                  icon={meta.icon}
                  active={isSelected}
                  size={22}
                  className={isSelected ? "text-[#26FFDF]" : "text-gray-400"}
                />
                <span className={`text-[10px] text-center leading-tight ${isSelected ? "text-[#26FFDF]" : "text-gray-500"}`}>
                  {meta.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
