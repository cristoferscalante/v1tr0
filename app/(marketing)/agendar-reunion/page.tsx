'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftIcon, CalendarIcon, ClockIcon, CheckIcon, XMarkIcon, UserIcon, PhoneIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import BackgroundAnimation from '@/components/home/BackgroundAnimation'

interface TimeSlot {
  time: string
  available: boolean
  occupied: boolean
  passed: boolean
}

interface DaySchedule {
  date: string
  dayName: string
  dayNumber: number
  month: string
  slots: TimeSlot[]
  hasAvailableSlots: boolean
}

interface AvailabilityResponse {
  success: boolean
  availability: DaySchedule[]
  totalDays: number
  busyEventsCount: number
  lastUpdated: string
  error?: string
  fallback?: boolean
}

export default function AgendarReunionPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [schedule, setSchedule] = useState<DaySchedule[]>([])
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(true)
  const [scheduleError, setScheduleError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  
  // Cache para optimizar consultas repetitivas
  const [scheduleCache, setScheduleCache] = useState<{[key: string]: {data: DaySchedule[], timestamp: number}}>({})

  // Función para cargar la disponibilidad desde la API local
  const loadAvailability = async () => {
    try {
      setIsLoadingSchedule(true)
      setScheduleError(null)
      console.log('🚀 DEBUG: Iniciando carga optimizada de disponibilidad...')
      
      // Generar 10 días laborales desde hoy
      const businessDays = generateBusinessDays(10)
      const scheduleData: DaySchedule[] = []
      
      console.log('📊 DEBUG: Días laborales a consultar:', businessDays.length)
      
      // Verificar caché (válido por 2 minutos)
      const dates = businessDays.map(day => day.date)
      const cacheKey = dates.join(',')
      const now = Date.now()
      const cacheValidTime = 2 * 60 * 1000 // 2 minutos
      
      if (scheduleCache[cacheKey] && (now - scheduleCache[cacheKey].timestamp) < cacheValidTime) {
        console.log('📦 Usando datos del caché')
        setSchedule(scheduleCache[cacheKey].data)
        setLastUpdated(new Date(scheduleCache[cacheKey].timestamp).toISOString())
        return
      }
      
      // Obtener todas las fechas en una sola llamada a la API
      const apiUrl = `/api/meetings?action=available-slots&dates=${encodeURIComponent(JSON.stringify(dates))}`
      
      console.log('📡 API URL optimizada:', apiUrl)
      console.log('📅 Fechas a consultar:', dates)
      
      const response = await fetch(apiUrl)
      const data = await response.json()
      
      console.log('✅ Respuesta en lote:', data)
      
      if (data.success && data.batchResults) {
        // Procesar cada día con sus horarios disponibles
        for (const day of businessDays) {
          const availableSlots = data.batchResults[day.date] || []
          
          if (day.dayName === 'lunes') {
            console.log('🎯 RESPUESTA PARA LUNES:', {
              fecha: day.date,
              slotsDisponibles: availableSlots.length,
              slots: availableSlots
            })
          }
          
          // Solo horarios de tarde (2 PM a 6 PM)
          const allWorkingHours = ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30']
          
          const slots: TimeSlot[] = allWorkingHours.map(time => {
            const isAvailable = availableSlots.includes(time)
            const isOccupied = !isAvailable && !isPastTime(day.date, time)
            const hasPassed = isPastTime(day.date, time)
            
            return {
              time,
              available: isAvailable,
              occupied: isOccupied,
              passed: hasPassed
            }
          })
          
          scheduleData.push({
            ...day,
            slots,
            hasAvailableSlots: slots.some(slot => slot.available)
          })
        }
      } else {
        console.error('❌ Error en respuesta en lote:', data.error)
        setScheduleError('Error al cargar disponibilidad. Intenta recargar la página.')
      }
      
      console.log('📋 Datos de horarios finales generados:', scheduleData.length)
      console.log('🎯 Lunes en horarios:', scheduleData.filter(day => day.dayName === 'lunes'))
      
      // Guardar en caché
      setScheduleCache(prev => ({
        ...prev,
        [cacheKey]: {
          data: scheduleData,
          timestamp: now
        }
      }))
      
      setSchedule(scheduleData)
      setLastUpdated(new Date().toISOString())
      
    } catch (error) {
      console.error('❌ Error cargando disponibilidad:', error)
      setScheduleError('Error al cargar disponibilidad. Intenta recargar la página.')
    } finally {
      setIsLoadingSchedule(false)
    }
  }
  
  // Función auxiliar para generar días laborales
  const generateBusinessDays = (count: number) => {
    const days = []
    const today = new Date()
    let currentDate = new Date(today)
    
    console.log('🔍 DEBUG: Generando días laborales desde:', today.toDateString())
    
    while (days.length < count) {
      const dayOfWeek = currentDate.getDay()
      const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
      const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
      
      console.log(`📅 Evaluando fecha: ${currentDate.toDateString()} - ${dayNames[dayOfWeek]} (dayOfWeek: ${dayOfWeek})`)
      
      // Saltar fines de semana (0 = domingo, 6 = sábado)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const dateStr = currentDate.toISOString().split('T')[0]
        
        days.push({
          date: dateStr,
          dayName: dayNames[dayOfWeek],
          dayNumber: currentDate.getDate(),
          month: monthNames[currentDate.getMonth()]
        })
        
        console.log(`✅ DÍA INCLUIDO: ${dayNames[dayOfWeek]} - ${currentDate.toDateString()}`)
        
        if (dayOfWeek === 1) {
          console.log('🎯 LUNES DETECTADO Y AGREGADO CORRECTAMENTE!')
        }
      } else {
        console.log(`❌ DÍA EXCLUIDO (fin de semana): ${dayNames[dayOfWeek]}`)
      }
      
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    console.log('📋 Días laborales generados:', days.map(d => `${d.date} (${d.dayName})`));
    
    return days
  }
  
  // Función auxiliar para verificar si un horario ya pasó
  const isPastTime = (date: string, time: string): boolean => {
    const now = new Date()
    const targetDateTime = new Date(`${date}T${time}:00`)
    // Buffer de 30 minutos
    targetDateTime.setMinutes(targetDateTime.getMinutes() - 30)
    return targetDateTime <= now
  }

  // Cargar disponibilidad al montar el componente
  useEffect(() => {
    loadAvailability()
  }, [])

  // Recargar disponibilidad cada 2 minutos para mantener sincronización
  useEffect(() => {
    const interval = setInterval(() => {
      loadAvailability()
    }, 120000) // 2 minutos

    return () => clearInterval(interval)
  }, [])

  // Función para manejar la selección de horario
  const handleTimeSelection = (date: string, time: string) => {
    // Verificar que el horario esté disponible
    const daySchedule = schedule.find(day => day.date === date)
    if (!daySchedule) return
    
    const slot = daySchedule.slots.find(s => s.time === time)
    if (!slot || !slot.available) {
      console.log('Horario no disponible:', { date, time, slot })
      return
    }
    
    setSelectedDate(date)
    setSelectedTime(time)
    setShowModal(true)
  }

  // Función para cerrar el modal
  const closeModal = () => {
    setShowModal(false)
    setEmail('')
    setName('')
    setPhone('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedTime || !email || !name) return

    setIsSubmitting(true)
    
    try {
      // Usar la API que incluye envío de correos
      const response = await fetch('/api/schedule-meeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate,
          time: selectedTime,
          name: name,
          email: email,
          phone: phone
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al agendar reunión')
      }

      setIsSuccess(true)
      setShowModal(false)
      
      // Recargar disponibilidad después de agendar
      setTimeout(() => {
        loadAvailability()
      }, 1000)
      
    } catch (error) {
      console.error('Error al agendar reunión:', error)
      alert(`Error al agendar la reunión: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animación de fondo */}
        <BackgroundAnimation />

        <div className="relative z-10 container mx-auto px-4 pt-24 pb-16 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-[#08A696]/20 p-8 max-w-md w-full text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 bg-gradient-to-br from-[#08A696] to-[#26FFDF] rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckIcon className="w-8 h-8 text-white" />
            </motion.div>
            
            <h1 className="text-2xl font-bold text-[#26FFDF] mb-4">¡Reunión Agendada!</h1>
            <p className="text-[#26FFDF]/70 mb-6">
              Tu reunión ha sido agendada exitosamente para el {selectedDate} a las {selectedTime}.
              Recibirás un correo de confirmación en breve.
            </p>
            
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#08A696] to-[#26FFDF] text-white rounded-xl font-semibold hover:scale-105 transition-transform duration-300"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Volver al inicio
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animación de fondo */}
      <BackgroundAnimation />

      <div className="relative z-10 container mx-auto px-4 pt-40 pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center text-[#26FFDF] hover:text-[#08A696] transition-colors duration-300"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Volver
          </Link>
          
          <h1 className="text-3xl font-bold text-[#26FFDF] text-center flex-1">
            Agendar Reunión
          </h1>
          
          <div className="w-20" /> {/* Spacer */}
        </motion.div>

        {/* Contenido principal */}
        <div className="max-w-4xl mx-auto">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl border border-[#08A696]/20 bg-[#02505931] backdrop-blur-sm p-6 mb-8"
            >
            <div className="flex items-center mb-4">
              <CalendarIcon className="w-6 h-6 text-[#26FFDF] mr-3" />
              <h2 className="text-xl font-semibold text-[#26FFDF]">Selecciona fecha y hora</h2>
            </div>
            
            <div className="flex items-center justify-between text-[#26FFDF]/70 mb-6">
              <div className="flex items-center">
                <ClockIcon className="w-5 h-5 mr-2" />
                <span>Horarios disponibles: Lunes a Viernes, 2:00 PM - 6:00 PM</span>
              </div>
              
              {lastUpdated && (
                <div className="text-xs text-[#26FFDF]/50">
                  Actualizado: {new Date(lastUpdated).toLocaleTimeString('es-ES', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              )}
            </div>

            {/* Estado de carga */}
            {isLoadingSchedule && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#26FFDF]"></div>
                <span className="ml-3 text-[#26FFDF]/70">Cargando disponibilidad...</span>
              </div>
            )}

            {/* Error de carga */}
            {scheduleError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-4">
                <p className="text-red-400 text-sm">{scheduleError}</p>
                <button
                  onClick={loadAvailability}
                  className="mt-2 text-[#26FFDF] hover:text-[#08A696] text-sm underline"
                >
                  Reintentar
                </button>
              </div>
            )}

            {/* Calendario - 10 días laborales */}
            {!isLoadingSchedule && schedule.length > 0 && (
              <div className="grid gap-4">
                {schedule.map((day, dayIndex) => (
                  <motion.div
                    key={day.date}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: dayIndex * 0.05 }}
                    className={`border rounded-2xl p-4 bg-[#02505931] backdrop-blur-sm ${
                      day.hasAvailableSlots 
                        ? 'border-[#08A696]/20' 
                        : 'border-[#08A696]/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[#26FFDF] font-semibold capitalize">
                        {day.dayName}
                      </h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#26FFDF]">{day.dayNumber}</div>
                        <div className="text-xs text-[#26FFDF]/60 capitalize">{day.month}</div>
                      </div>
                    </div>
                    
                    {!day.hasAvailableSlots ? (
                      <div className="text-center py-4 text-[#26FFDF]/50">
                        No hay horarios disponibles
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                        {day.slots.map((slot) => {
                          const isDisabled = !slot.available
                          const isOccupied = slot.occupied
                          const hasPassed = slot.passed
                          
                          return (
                            <button
                              key={slot.time}
                              onClick={() => {
                                if (slot.available) {
                                  handleTimeSelection(day.date, slot.time)
                                }
                              }}
                              disabled={isDisabled}
                              className={`
                                px-2 py-2 rounded-lg text-xs font-medium transition-all duration-300
                                ${slot.available
                                  ? 'bg-[#08A696]/20 text-[#26FFDF] hover:bg-[#08A696]/40 hover:scale-105 cursor-pointer'
                                  : isOccupied
                                  ? 'bg-red-500/20 text-red-400 cursor-not-allowed'
                                  : hasPassed
                                  ? 'bg-[#02505915] text-[#26FFDF]/30 cursor-not-allowed'
                                  : 'bg-[#02505915] text-[#26FFDF]/30 cursor-not-allowed'
                                }
                              `}
                              title={
                                isOccupied ? 'Horario ocupado' : 
                                hasPassed ? 'Horario pasado' : 
                                slot.available ? 'Disponible' : 'No disponible'
                              }
                            >
                              {slot.time}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Modal de confirmación */}
          <AnimatePresence>
            {showModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/90 backdrop-blur-sm"
                onClick={closeModal}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header del modal */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-[#26FFDF]">
                      Confirmar reunión
                    </h3>
                    <button
                      onClick={closeModal}
                      className="text-[#26FFDF]/60 hover:text-[#26FFDF] transition-colors p-1"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>
                  
                  {/* Información de la cita */}
                  <div className="mb-6 p-4 bg-[#08A696]/10 rounded-2xl border border-[#08A696]/20">
                    <p className="text-[#26FFDF] text-sm mb-2">
                      <strong>Fecha:</strong> {selectedDate && new Date(selectedDate).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-[#26FFDF] text-sm">
                      <strong>Hora:</strong> {selectedTime && (() => {
                        console.log('selectedTime value:', selectedTime);
                        const [hours, minutes] = selectedTime.split(':');
                        const date = new Date();
                        date.setHours(parseInt(hours), parseInt(minutes));
                        return date.toLocaleTimeString('es-ES', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        });
                      })()}
                    </p>
                  </div>

                  {/* Formulario expandido */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Campo de nombre */}
                    <div>
                      <label className="block text-[#26FFDF] text-sm font-medium mb-2">
                        <UserIcon className="w-4 h-4 inline mr-2" />
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-[#02505931] border border-[#08A696]/20 rounded-xl text-[#26FFDF] placeholder-[#26FFDF]/50 focus:outline-none focus:border-[#26FFDF] focus:ring-2 focus:ring-[#26FFDF]/20 transition-all"
                        placeholder="Tu nombre completo"
                      />
                    </div>

                    {/* Campo de teléfono */}
                    <div>
                      <label className="block text-[#26FFDF] text-sm font-medium mb-2">
                        <PhoneIcon className="w-4 h-4 inline mr-2" />
                        Teléfono / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-[#02505931] border border-[#08A696]/20 rounded-xl text-[#26FFDF] placeholder-[#26FFDF]/50 focus:outline-none focus:border-[#26FFDF] focus:ring-2 focus:ring-[#26FFDF]/20 transition-all"
                        placeholder="+1 234 567 8900"
                      />
                    </div>

                    {/* Campo de email */}
                    <div>
                      <label className="block text-[#26FFDF] text-sm font-medium mb-2">
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-[#02505931] border border-[#08A696]/20 rounded-xl text-[#26FFDF] placeholder-[#26FFDF]/50 focus:outline-none focus:border-[#26FFDF] focus:ring-2 focus:ring-[#26FFDF]/20 transition-all"
                        placeholder="tu@email.com"
                      />
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="flex-1 bg-[#02505931] border border-[#08A696]/20 text-[#26FFDF] font-semibold py-3 px-6 rounded-xl hover:bg-[#08A696]/10 transition-all duration-300"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-gradient-to-r from-[#08A696] to-[#26FFDF] text-white font-semibold py-3 px-6 rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {isSubmitting ? 'Agendando...' : 'Confirmar'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}