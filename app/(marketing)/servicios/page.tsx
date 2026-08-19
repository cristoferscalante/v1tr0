"use client"

import ServiciosHero from "@/components/servicios/ServiciosHero"
import ServicioSnapSection from "@/components/servicios/ServicioSnapSection"
import { servicesData } from "@/components/home/sections/ServicesTabSection"
import { useScrollSnapEnabled, useDeviceDetection } from "@/hooks/use-device-detection"

export default function ServiciosPage() {
  const snapEnabled = useScrollSnapEnabled()
  const { isReady } = useDeviceDetection()
  // Hasta que la detección resuelva se asume "sin snap" para no secuestrar el scroll táctil
  const shouldEnableScrollSnap = isReady && snapEnabled

  return (
    <main
      className={`text-textPrimary overflow-x-hidden ${
        shouldEnableScrollSnap
          ? "md:snap-y md:snap-mandatory overflow-y-scroll h-[100dvh] md:h-screen scroll-smooth"
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
