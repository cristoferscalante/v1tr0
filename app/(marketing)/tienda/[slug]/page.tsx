"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { PackagePromotion } from "@/components/shop/packages/PackagePromotion"
import type { FolioRecharge, Plan, Product } from "@/components/shop/packages/PackagePromotion"
import { posPlans, posProducts, folioRecharges } from "@/lib/data/posPackageData"
import { hardwarePlans, hardwareProducts } from "@/lib/data/hardwarePackageData"
import { iotPlans, iotProducts } from "@/lib/data/iotPackageData"

interface PackagePageProps {
  params: Promise<{
    slug: string
  }>
}

export default function PackagePage({ params }: PackagePageProps) {
  const { slug } = use(params)

  // Datos según el slug
  let title = ""
  let subtitle = ""
  let heroImage = ""
  let plans: Plan[] = []
  let products: Product[] = []
  let folios: FolioRecharge[] | undefined = undefined

  switch (slug) {
    case "sistema-pos-gestion-negocio":
      title = "Sistema POS para tu Negocio"
      subtitle = "Planes flexibles adaptados a tus necesidades, desde pruebas gratuitas hasta facturación electrónica completa"
      heroImage = "/imagenes/tienda/pos.png"
      plans = posPlans
      products = posProducts
      folios = folioRecharges
      break

    case "hardware-v1tr0-pro":
      title = "Hardware V1TR0 Profesional"
      subtitle = "Kits especializados para desarrollo IoT, ciberseguridad y proyectos avanzados"
      heroImage = "/imagenes/home/carrusel/desarrollo_web_end_backup.webp"
      plans = hardwarePlans
      products = hardwareProducts
      break

    case "sistemas-comunicacion-iot":
      title = "Sistemas de Comunicación IoT"
      subtitle = "Soluciones de conectividad de largo alcance con LoRa, WiFi y redes mesh"
      heroImage = "/imagenes/tienda/heltec-duo-con-efecto.png"
      plans = iotPlans
      products = iotProducts
      break

    default:
      notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* TopBar y Footer vienen del layout, no duplicarlos aquí */}
      
      {/* Package Promotion - El componente maneja su propio padding */}
      <PackagePromotion
        title={title}
        subtitle={subtitle}
        heroImage={heroImage}
        plans={plans}
        products={products}
        {...(folios && { folioRecharges: folios })}
      />
    </div>
  )
}
