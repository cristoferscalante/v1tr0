"use client"

import ServiciosHero from "@/components/servicios/ServiciosHero"
import ServicioSnapSection from "@/components/servicios/ServicioSnapSection"
import { servicesData } from "@/components/home/sections/ServicesTabSection"
import { useScrollSnapEnabled } from "@/hooks/use-device-detection"

export default function ServiciosPage() {
  const shouldEnableScrollSnap = useScrollSnapEnabled()

  return (
    <main
      className={`text-textPrimary overflow-x-hidden ${
        shouldEnableScrollSnap
          ? "snap-y snap-mandatory overflow-y-scroll h-screen scroll-smooth"
          : "overflow-y-auto"
      }`}
    >
      <div className={shouldEnableScrollSnap ? "snap-start" : ""}>
        <ServiciosHero />
      </div>
      {servicesData.map((service) => (
        <div key={service.id} className={shouldEnableScrollSnap ? "snap-start" : ""}>
          <ServicioSnapSection service={service} />
        </div>
      ))}
    </main>
  )
}
