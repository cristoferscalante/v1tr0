import Image from "next/image"

interface CardBannerProps {
  icon: string // Ruta del archivo SVG
  title: string
  onClick: () => void // Función para manejar el clic
}

export default function CardBanner({ icon, title, onClick }: CardBannerProps) {
  return (
    <button
      onClick={onClick}
      className="relative group w-full text-left focus:outline-none focus:ring-2 focus:ring-[#08A696] focus:ring-opacity-50"
      aria-label={title}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08a6961e] to-[#26ffde23] rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-200"></div>
      <div className="relative bg-[#02505931] p-6 rounded-lg border border-[#08A696]/20 flex flex-row items-center justify-center transition duration-200 group-hover:border-[#08A696] group-hover:bg-[#02505950]">
        <div className="w-1/3 flex items-center justify-center mx-auto">
          <Image src={icon || "/placeholder.svg"} alt="" height={60} width={60} />
        </div>
        <h3 className="w-2/3 text-[#26FFDF] font-medium">{title}</h3>
      </div>
    </button>
  )
}


