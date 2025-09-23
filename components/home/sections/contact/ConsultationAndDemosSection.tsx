'use client'

import OptionsSelector from '@/components/home/OptionsSelector'

interface ConsultationAndDemosSectionProps {
  setIsUnifiedModalOpen: (isOpen: boolean) => void
}

export default function ConsultationAndDemosSection({ setIsUnifiedModalOpen }: ConsultationAndDemosSectionProps) {
  return (
    <section className="w-full py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Componente OptionsSelector reemplazando la sección anterior */}
        <OptionsSelector setIsUnifiedModalOpen={setIsUnifiedModalOpen} />
      </div>
    </section>
  )
}