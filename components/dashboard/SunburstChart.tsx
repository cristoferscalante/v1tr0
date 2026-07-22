'use client'

import { useMemo } from 'react'

interface SunburstSlice {
  name: string
  value: number
  color: string
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function arcPath(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startDeg: number,
  endDeg: number,
) {
  if (endDeg - startDeg >= 360) {
    const outer = polarToCartesian(cx, cy, outerR, 179.9)
    return [
      `M ${cx} ${cy - outerR}`,
      `A ${outerR} ${outerR} 0 1 1 ${outer.x} ${outer.y}`,
      `A ${outerR} ${outerR} 0 1 1 ${cx} ${cy - outerR}`,
      `Z`,
    ].join(' ')
  }

  const startOuter = polarToCartesian(cx, cy, outerR, startDeg)
  const endOuter = polarToCartesian(cx, cy, outerR, endDeg)
  const startInner = polarToCartesian(cx, cy, innerR, endDeg)
  const endInner = polarToCartesian(cx, cy, innerR, startDeg)
  const largeArc = endDeg - startDeg > 180 ? 1 : 0

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y}`,
    `L ${startInner.x} ${startInner.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${endInner.x} ${endInner.y}`,
    `Z`,
  ].join(' ')
}

interface Props {
  data: SunburstSlice[]
  size?: number
}

export default function SunburstChart({ data, size = 260 }: Props) {
  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data])
  const cx = size / 2
  const cy = size / 2

  const rings = useMemo(() => {
    if (total === 0) return null
    const r1 = size * 0.2
    const r2 = size * 0.36
    const r3 = size * 0.49

    const segments = data.filter((d) => d.value > 0)
    if (segments.length === 0) return null

    const anglePerUnit = 360 / total

    const outer = segments.map((d, i) => {
      const start = segments.slice(0, i).reduce((s, seg) => s + seg.value * anglePerUnit, 0)
      const end = start + d.value * anglePerUnit
      return { ...d, start, end, path: arcPath(cx, cy, r2, r3, start, end) }
    })

    return { innerR: r1, midR: r2, outerR: r3, outer }
  }, [data, total, size, cx, cy])

  if (!rings) {
    return (
      <div className="flex items-center justify-center" style={{ height: size }}>
        <p className="text-textSecondary text-xs">Sin datos</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Inner circle - total */}
        <circle cx={cx} cy={cy} r={rings.innerR} fill="#08A69630" stroke="#08A69650" strokeWidth={1} />
        <text x={cx} y={cy - 3} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={700}>
          {total}
        </text>
        <text x={cx} y={cy + 11} textAnchor="middle" fill="#a0a0a0" fontSize={8}>
          total
        </text>

        {/* Middle ring - empty spacer */}
        <circle cx={cx} cy={cy} r={rings.midR} fill="none" stroke="#08A69615" strokeWidth={0.5} strokeDasharray="2 2" />

        {/* Outer ring - segments */}
        {rings.outer.map((seg) => (
          <g key={seg.name}>
            <path d={seg.path} fill={seg.color} fillOpacity={0.25} stroke={seg.color} strokeWidth={1.5} />
            {(seg.end - seg.start) > 15 && (
              (() => {
                const midAngle = (seg.start + seg.end) / 2
                const labelR = (rings.midR + rings.outerR) / 2
                const pos = polarToCartesian(cx, cy, labelR, midAngle)
                return (
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#fff"
                    fontSize={10}
                    fontWeight={600}
                  >
                    {seg.value}
                  </text>
                )
              })()
            )}
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3 justify-center">
        {data.map((m) => (
          <div key={m.name} className="flex items-center gap-1.5 text-xs text-textSecondary">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: m.color, opacity: 0.6 }} />
            {m.name} <span className="text-white font-semibold">{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
