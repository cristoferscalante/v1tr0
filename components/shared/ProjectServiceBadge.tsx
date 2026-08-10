"use client"

import { AnimatedIcon } from "@/components/home/sections/AnimatedIcon"
import { resolveProjectIconMeta } from "@/components/shared/service-type"

/**
 * El ícono Lucide de resolveProjectIconMeta no es serializable, así que no
 * puede pasar de un Server Component a AnimatedIcon directamente: hay que
 * resolverlo acá adentro, ya en el lado cliente.
 */
export default function ProjectServiceBadge({
  serviceType,
  icon,
  className,
}: {
  serviceType: string
  icon?: string | null
  className?: string
}) {
  const meta = resolveProjectIconMeta({ serviceType, icon })
  return (
    <span
      className={
        className ??
        "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#02505950] border border-[#08A696]/20 text-textSecondary"
      }
    >
      <AnimatedIcon kind={meta.kind} icon={meta.icon} active size={13} />
      {meta.label}
    </span>
  )
}
