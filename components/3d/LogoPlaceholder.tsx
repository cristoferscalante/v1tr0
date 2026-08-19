/**
 * Sustituto estático del logo 3D para dispositivos táctiles.
 *
 * Vive en su propio archivo, sin ninguna dependencia de three/@react-three,
 * para poder renderizarse desde el call-site sin arrastrar el chunk 3D
 * (~650 KB). La guarda equivalente dentro de VtrLogoPerfect3D se mantiene como
 * red de seguridad, pero para entonces el chunk ya se habría descargado.
 */
export default function LogoPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center w-full h-full ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 rounded-2xl blur-xl bg-[#08A696]/20 scale-110" />
        <div className="relative w-28 h-28 rounded-2xl border border-[#08A696]/40 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <svg className="w-14 h-14 text-[#26FFDF]" fill="none" viewBox="0 0 100 100" aria-hidden="true">
            <polygon points="50,8 92,29 92,71 50,92 8,71 8,29" fill="none" stroke="currentColor" strokeWidth="3" />
            <text x="50" y="62" textAnchor="middle" fill="currentColor" fontSize="22" fontWeight="700" fontFamily="monospace">V1</text>
          </svg>
        </div>
      </div>
    </div>
  )
}
