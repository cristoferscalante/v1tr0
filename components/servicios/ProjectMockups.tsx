"use client"

const stroke = "#26FFDF"

// ============================================================================
// MAQUETAS
// Bocetos planos, un solo color de marca, para las subcategorías que todavía
// no tienen un proyecto publicado. Todas comparten viewBox 160×100.
// ============================================================================

function MockSvg({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 160 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
      {children}
    </svg>
  )
}

/** Web app: barra lateral, cabecera y tabla. */
function WebAppMock() {
  return (
    <MockSvg>
      <rect x="0" y="0" width="34" height="100" fill={stroke} fillOpacity="0.06" />
      {[14, 24, 34, 44].map((y, i) => (
        <rect key={y} x="7" y={y} width={i === 0 ? 20 : 16} height="4" rx="2" fill={stroke} fillOpacity={i === 0 ? 0.5 : 0.2} />
      ))}
      <rect x="42" y="10" width="60" height="6" rx="3" fill="white" fillOpacity="0.12" />
      <rect x="128" y="9" width="24" height="8" rx="4" fill={stroke} fillOpacity="0.35" />
      {[28, 40, 52, 64, 76].map((y, i) => (
        <g key={y}>
          <rect x="42" y={y} width="110" height="8" rx="2" fill="white" fillOpacity={i === 0 ? 0.08 : 0.04} />
          <circle cx="48" cy={y + 4} r="2" fill={stroke} fillOpacity="0.5" />
          <rect x="120" y={y + 2} width="16" height="4" rx="2" fill={stroke} fillOpacity={i % 2 ? 0.2 : 0.45} />
        </g>
      ))}
    </MockSvg>
  )
}

/** App móvil: dos teléfonos con tarjetas. */
function MobileMock() {
  return (
    <MockSvg>
      {[
        { x: 44, y: 8, o: 0.9 },
        { x: 86, y: 16, o: 0.5 },
      ].map(({ x, y, o }) => (
        <g key={x} opacity={o}>
          <rect x={x} y={y} width="34" height="72" rx="6" fill="#031414" stroke={stroke} strokeOpacity="0.45" />
          <rect x={x + 12} y={y + 3} width="10" height="2" rx="1" fill={stroke} fillOpacity="0.4" />
          <rect x={x + 4} y={y + 10} width="26" height="16" rx="3" fill={stroke} fillOpacity="0.18" />
          {[30, 40, 50].map((dy) => (
            <g key={dy}>
              <circle cx={x + 8} cy={y + dy + 3} r="3" fill={stroke} fillOpacity="0.3" />
              <rect x={x + 13} y={y + dy + 1} width="16" height="4" rx="2" fill="white" fillOpacity="0.12" />
            </g>
          ))}
          <rect x={x + 4} y={y + 63} width="26" height="5" rx="2.5" fill={stroke} fillOpacity="0.45" />
        </g>
      ))}
    </MockSvg>
  )
}

/** Dashboard: tres KPI y un gráfico de barras. */
function DashboardMock() {
  const bars = [22, 34, 28, 44, 38, 52, 46]
  return (
    <MockSvg>
      {[10, 58, 106].map((x, i) => (
        <g key={x}>
          <rect x={x} y="8" width="44" height="22" rx="4" fill={stroke} fillOpacity="0.08" stroke={stroke} strokeOpacity="0.2" />
          <rect x={x + 5} y="13" width="16" height="3" rx="1.5" fill="white" fillOpacity="0.15" />
          <rect x={x + 5} y="20" width={24 - i * 4} height="5" rx="2" fill={stroke} fillOpacity="0.5" />
        </g>
      ))}
      {bars.map((h, i) => (
        <rect key={i} x={14 + i * 20} y={92 - h} width="12" height={h} rx="2" fill={stroke} fillOpacity={i === bars.length - 2 ? 0.55 : 0.22} />
      ))}
    </MockSvg>
  )
}

/** Gestión de datos: tabla con encabezado y filas. */
function DataTableMock() {
  return (
    <MockSvg>
      <rect x="10" y="8" width="140" height="12" rx="3" fill={stroke} fillOpacity="0.2" />
      {[24, 36, 48, 60, 72, 84].map((y, r) => (
        <g key={y}>
          {[14, 50, 86, 122].map((x, c) => (
            <rect
              key={x}
              x={x}
              y={y + 2}
              width={c === 0 ? 26 : 22}
              height="5"
              rx="2"
              fill={c === 3 ? stroke : "white"}
              fillOpacity={c === 3 ? (r % 3 === 0 ? 0.5 : 0.2) : 0.1}
            />
          ))}
          <line x1="10" x2="150" y1={y + 10} y2={y + 10} stroke={stroke} strokeOpacity="0.08" />
        </g>
      ))}
    </MockSvg>
  )
}

/** Análisis: área bajo una curva con puntos. */
function AnalyticsMock() {
  const points = "10,78 32,64 54,70 76,46 98,52 120,30 150,20"
  return (
    <MockSvg>
      {[30, 50, 70, 90].map((y) => (
        <line key={y} x1="10" x2="150" y1={y} y2={y} stroke={stroke} strokeOpacity="0.07" />
      ))}
      <polygon points={`${points} 150,90 10,90`} fill={stroke} fillOpacity="0.1" />
      <polyline points={points} fill="none" stroke={stroke} strokeOpacity="0.7" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="150" cy="20" r="3" fill={stroke} />
      <rect x="112" y="6" width="30" height="9" rx="4.5" fill={stroke} fillOpacity="0.25" />
    </MockSvg>
  )
}

/** BI: dona y barras horizontales. */
function BiMock() {
  const c = 2 * Math.PI * 22
  return (
    <MockSvg>
      <circle cx="46" cy="50" r="22" fill="none" stroke={stroke} strokeOpacity="0.12" strokeWidth="10" />
      <circle
        cx="46"
        cy="50"
        r="22"
        fill="none"
        stroke={stroke}
        strokeOpacity="0.6"
        strokeWidth="10"
        strokeDasharray={`${c * 0.62} ${c}`}
        transform="rotate(-90 46 50)"
      />
      {[30, 44, 58, 72].map((y, i) => (
        <g key={y}>
          <rect x="86" y={y} width="10" height="4" rx="2" fill="white" fillOpacity="0.12" />
          <rect x="100" y={y} width={48 - i * 10} height="4" rx="2" fill={stroke} fillOpacity={0.55 - i * 0.1} />
        </g>
      ))}
    </MockSvg>
  )
}

/** Bots & IA: conversación con un asistente. */
function ChatMock() {
  return (
    <MockSvg>
      <rect x="14" y="10" width="72" height="16" rx="8" fill="white" fillOpacity="0.08" />
      <rect x="70" y="32" width="76" height="16" rx="8" fill={stroke} fillOpacity="0.3" />
      <rect x="14" y="54" width="90" height="16" rx="8" fill="white" fillOpacity="0.08" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={24 + i * 8} cy="84" r="2.5" fill={stroke} fillOpacity={0.3 + i * 0.2} />
      ))}
      <rect x="44" y="78" width="102" height="12" rx="6" fill="none" stroke={stroke} strokeOpacity="0.3" />
    </MockSvg>
  )
}

/** Workflows: nodos encadenados con una bifurcación. */
function FlowMock() {
  const nodes = [
    { x: 14, y: 42 },
    { x: 58, y: 42 },
    { x: 104, y: 20 },
    { x: 104, y: 64 },
  ]
  return (
    <MockSvg>
      <path d="M40 50 H58 M84 50 C94 50 94 28 104 28 M84 50 C94 50 94 72 104 72" fill="none" stroke={stroke} strokeOpacity="0.4" strokeDasharray="3 3" />
      {nodes.map(({ x, y }, i) => (
        <rect key={i} x={x} y={y} width="26" height="16" rx="4" fill={stroke} fillOpacity={i === 1 ? 0.35 : 0.14} stroke={stroke} strokeOpacity="0.4" />
      ))}
    </MockSvg>
  )
}

/** Integraciones: un núcleo conectado a varias apps. */
function IntegrationsMock() {
  const apps = [
    [30, 22],
    [130, 22],
    [30, 78],
    [130, 78],
    [80, 12],
    [80, 88],
  ] as const
  return (
    <MockSvg>
      {apps.map(([x, y]) => (
        <line key={`${x}-${y}`} x1="80" y1="50" x2={x} y2={y} stroke={stroke} strokeOpacity="0.3" strokeDasharray="2 3" />
      ))}
      {apps.map(([x, y]) => (
        <rect key={`n-${x}-${y}`} x={x - 7} y={y - 7} width="14" height="14" rx="4" fill="#031414" stroke={stroke} strokeOpacity="0.5" />
      ))}
      <circle cx="80" cy="50" r="12" fill={stroke} fillOpacity="0.3" stroke={stroke} strokeOpacity="0.7" />
    </MockSvg>
  )
}

/** Optimización: medidor semicircular y una línea de tendencia a la baja en costos. */
function GaugeMock() {
  const c = Math.PI * 30
  return (
    <MockSvg>
      <path d="M50 70 A30 30 0 0 1 110 70" fill="none" stroke={stroke} strokeOpacity="0.12" strokeWidth="8" />
      <path d="M50 70 A30 30 0 0 1 110 70" fill="none" stroke={stroke} strokeOpacity="0.6" strokeWidth="8" strokeDasharray={`${c * 0.78} ${c}`} />
      <line x1="80" y1="70" x2="100" y2="52" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <circle cx="80" cy="70" r="3" fill={stroke} />
      <rect x="62" y="80" width="36" height="6" rx="3" fill="white" fillOpacity="0.12" />
    </MockSvg>
  )
}

/** Página genérica, para una subcategoría sin maqueta propia. */
export function PageMock() {
  return (
    <MockSvg>
      <rect x="12" y="10" width="136" height="34" rx="4" fill={stroke} fillOpacity="0.1" />
      <rect x="12" y="52" width="96" height="6" rx="3" fill="white" fillOpacity="0.12" />
      <rect x="12" y="64" width="64" height="6" rx="3" fill="white" fillOpacity="0.08" />
      <rect x="12" y="78" width="30" height="10" rx="5" fill={stroke} fillOpacity="0.4" />
    </MockSvg>
  )
}

export const MOCKS: Record<string, () => React.JSX.Element> = {
  webapp: WebAppMock,
  mobile: MobileMock,
  dashboards: DashboardMock,
  datamanagement: DataTableMock,
  analytics: AnalyticsMock,
  bi: BiMock,
  bots: ChatMock,
  workflows: FlowMock,
  integrations: IntegrationsMock,
  optimization: GaugeMock,
}
