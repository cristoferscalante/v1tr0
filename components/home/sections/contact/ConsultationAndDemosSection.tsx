'use client'

import { useRef } from 'react'
import OptionsSelector from '@/components/home/OptionsSelector'
import useSnapAnimations from '@/hooks/use-snap-animations'

interface ConsultationAndDemosSectionProps {
  setIsUnifiedModalOpen: (isOpen: boolean) => void
}

export default function ConsultationAndDemosSection({ setIsUnifiedModalOpen }: ConsultationAndDemosSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  
  // Configurar animaciones de entrada para esta sección
  useSnapAnimations({
    sections: [sectionRef],
    duration: 0.8,
    enableCircularNavigation: false,
    singleAnimation: true,
    onSnapComplete: (index) => {
      console.log('Consultation section animation completed for section:', index);
    }
  })

  return (
    <section ref={sectionRef} className="w-full py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Componente OptionsSelector reemplazando la sección anterior */}
        <div className="options-selector-container animate-element">
          <OptionsSelector setIsUnifiedModalOpen={setIsUnifiedModalOpen} />
        </div>
      </div>
    </section>
  )
}