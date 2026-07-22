'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Send } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const questions = [
  {
    id: 'projectType',
    label: '¿Qué tipo de proyecto necesitas?',
    options: [
      'Desarrollo Web',
      'App Móvil',
      'Sistema IoT',
      'Ciberseguridad',
      'Consultoría TI',
      'Landing Page',
      'Tienda Online / E-commerce',
      'Otro',
    ],
  },
  {
    id: 'description',
    label: 'Cuéntanos sobre tu proyecto',
    placeholder: 'Describe brevemente qué necesitas, cuál es el problema a resolver y qué funcionalidades debe tener...',
  },
  {
    id: 'budget',
    label: '¿Tienes un presupuesto estimado? (COP)',
    options: [
      'Menos de $500.000 COP',
      '$500.000 - $2.000.000 COP',
      '$2.000.000 - $5.000.000 COP',
      '$5.000.000 - $10.000.000 COP',
      '$10.000.000 - $20.000.000 COP',
      'Más de $20.000.000 COP',
      'No estoy seguro',
    ],
  },
  {
    id: 'timeline',
    label: '¿Cuál es tu plazo ideal de entrega?',
    options: ['Urgente (1-2 semanas)', 'Corto plazo (1 mes)', 'Mediano plazo (2-3 meses)', 'Sin prisas (3+ meses)', 'Aún no lo sé'],
  },
  {
    id: 'techReqs',
    label: '¿Tienes requisitos técnicos específicos?',
    placeholder: 'Stack tecnológico deseado, integraciones necesarias, hosting, etc. (opcional)',
  },
]

interface Props {
  open: boolean
  onClose: () => void
}

export default function QuoteSurvey({ open, onClose }: Props) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [sending, setSending] = useState(false)
  const router = useRouter()

  const isLast = step === questions.length - 1

  const setAnswer = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  const next = () => {
    const q = questions[step]!
    const val = answers[q.id]
    if (!val || val.trim() === '') {
      toast.error('Responde esta pregunta antes de continuar')
      return
    }
    if (step < questions.length - 1) setStep(step + 1)
  }

  const prev = () => {
    if (step > 0) setStep(step - 1)
  }

  const submit = async () => {
    const q = questions[step]!
    const val = answers[q.id]
    if (!val || val.trim() === '') {
      toast.error('Responde esta pregunta antes de enviar')
      return
    }
    setSending(true)
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      })
      if (!res.ok) throw new Error('Error al enviar')
      toast.success('Cotización enviada con éxito', {
        description: 'Te contactaremos pronto con un presupuesto personalizado.',
      })
      setAnswers({})
      setStep(0)
      onClose()
      router.refresh()
    } catch {
      toast.error('Error al enviar la cotización. Intenta de nuevo.')
    } finally {
      setSending(false)
    }
  }

  const q = questions[step]!

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg bg-[#0A1A1A] border border-[#08A696]/30 rounded-2xl p-6 sm:p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Cotizar Proyecto</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Step indicator */}
            <div className="flex gap-1 mb-6">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    i <= step ? 'bg-[#26FFDF]' : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>

            <div className="min-h-[280px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-sm text-[#26FFDF] mb-2">
                    Pregunta {step + 1} de {questions.length}
                  </p>
                  <h3 className="text-lg font-semibold text-white mb-4">{q.label}</h3>

                  {'options' in q && q.options ? (
                    <div className="space-y-2">
                      {q.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setAnswer(q.id, opt)}
                          className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
                            answers[q.id] === opt
                              ? 'border-[#26FFDF] bg-[#26FFDF]/10 text-[#26FFDF]'
                              : 'border-gray-700 bg-gray-900/50 text-gray-300 hover:border-[#08A696]/50'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <textarea
                      value={answers[q.id] || ''}
                      onChange={(e) => setAnswer(q.id, e.target.value)}
                      placeholder={'placeholder' in q ? q.placeholder : ''}
                      rows={5}
                      className="w-full p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#08A696] resize-none"
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={prev}
                disabled={step === 0}
                className="flex items-center space-x-1 px-4 py-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Anterior</span>
              </button>

              {isLast ? (
                <button
                  onClick={submit}
                  disabled={sending}
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-[#08A696] to-[#26FFDF] text-black font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {sending ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Enviar</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={next}
                  className="flex items-center space-x-1 px-4 py-2 bg-[#08A696]/20 text-[#26FFDF] rounded-xl hover:bg-[#08A696]/30 transition-colors"
                >
                  <span>Siguiente</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
