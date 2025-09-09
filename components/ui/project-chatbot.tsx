'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Minimize2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
  type?: 'text' | 'suggestion'
}

interface ProjectChatbotProps {
  projectData: {
    id: string
    name: string
    status: string
    progress: number
    tasks: Array<{status: string}>
    stage: string
  }
  className?: string
}

const botResponses = {
  greeting: [
    "¡Hola! Soy tu asistente de proyecto. ¿En qué puedo ayudarte hoy?",
    "¡Bienvenido! Estoy aquí para resolver tus dudas sobre el proyecto.",
    "¡Hola! ¿Tienes alguna pregunta sobre el progreso de tu proyecto?"
  ],
  progress: [
    "El proyecto tiene un progreso del {progress}% y se encuentra en la etapa de {stage}.",
    "Actualmente el proyecto está {progress}% completado en la fase de {stage}.",
    "Tu proyecto va muy bien, llevamos {progress}% de avance en {stage}."
  ],
  tasks: [
    "Tienes {taskCount} tareas en total. {pendingTasks} están pendientes y {completedTasks} completadas.",
    "El estado de las tareas es: {completedTasks} completadas, {inProgressTasks} en progreso, {pendingTasks} pendientes.",
    "De {taskCount} tareas totales, has completado {completedTasks}. ¡Excelente progreso!"
  ],
  timeline: [
    "El proyecto está programado para completarse según el cronograma establecido.",
    "Basándome en el progreso actual, el proyecto va según lo planificado.",
    "El timeline del proyecto se está cumpliendo adecuadamente."
  ],
  help: [
    "Puedo ayudarte con información sobre el progreso, tareas, cronograma y estado general del proyecto.",
    "Estoy aquí para resolver dudas sobre el avance, tareas pendientes, y cualquier aspecto del proyecto.",
    "Pregúntame sobre el estado del proyecto, tareas específicas, o cualquier duda que tengas."
  ],
  default: [
    "Interesante pregunta. Basándome en los datos del proyecto, te recomiendo revisar el dashboard para más detalles.",
    "Esa es una buena consulta. ¿Te gustaría que revise algún aspecto específico del proyecto?",
    "Entiendo tu consulta. ¿Hay algo específico sobre las tareas o el progreso que te preocupe?"
  ]
}

const suggestions = [
  "¿Cuál es el progreso del proyecto?",
  "¿Cuántas tareas están pendientes?",
  "¿En qué etapa estamos?",
  "¿Hay tareas vencidas?",
  "¿Cuándo se completará el proyecto?"
]

export function ProjectChatbot({ projectData, className }: ProjectChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: botResponses.greeting[Math.floor(Math.random() * botResponses.greeting.length)] || "¡Hola! Soy tu asistente de proyecto.",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const getTaskStats = () => {
    const tasks = projectData.tasks || []
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      pending: tasks.filter(t => t.status === 'pending').length,
      blocked: tasks.filter(t => t.status === 'blocked').length
    }
  }

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    const taskStats = getTaskStats()
    
    if (message.includes('progreso') || message.includes('avance') || message.includes('porcentaje')) {
      const response = botResponses.progress[Math.floor(Math.random() * botResponses.progress.length)] || "El proyecto tiene un progreso del {progress}% y se encuentra en la etapa de {stage}."
      return response
        .replace('{progress}', projectData.progress?.toString() || '0')
        .replace('{stage}', projectData.stage || 'planificación')
    }
    
    if (message.includes('tarea') || message.includes('pendiente') || message.includes('completada')) {
      const response = botResponses.tasks[Math.floor(Math.random() * botResponses.tasks.length)] || "Tienes {taskCount} tareas en total. {pendingTasks} están pendientes y {completedTasks} completadas."
      return response
        .replace('{taskCount}', taskStats.total.toString())
        .replace('{pendingTasks}', taskStats.pending.toString())
        .replace('{completedTasks}', taskStats.completed.toString())
        .replace('{inProgressTasks}', taskStats.inProgress.toString())
    }
    
    if (message.includes('etapa') || message.includes('fase') || message.includes('donde estamos')) {
      return `Actualmente el proyecto se encuentra en la etapa de ${projectData.stage || 'planificación'}. El progreso general es del ${projectData.progress || 0}%.`
    }
    
    if (message.includes('cronograma') || message.includes('timeline') || message.includes('tiempo')) {
      return botResponses.timeline[Math.floor(Math.random() * botResponses.timeline.length)] || "El proyecto está programado para completarse según el cronograma establecido."
    }
    
    if (message.includes('ayuda') || message.includes('help') || message.includes('que puedes hacer')) {
      return botResponses.help[Math.floor(Math.random() * botResponses.help.length)] || "Puedo ayudarte con información sobre el progreso, tareas, cronograma y estado general del proyecto."
    }
    
    if (message.includes('hola') || message.includes('hello') || message.includes('hi')) {
      return botResponses.greeting[Math.floor(Math.random() * botResponses.greeting.length)] || "¡Hola! Soy tu asistente de proyecto."
    }
    
    return botResponses.default[Math.floor(Math.random() * botResponses.default.length)] || "Interesante pregunta. ¿Te gustaría que revise algún aspecto específico del proyecto?"
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) {
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simular delay de respuesta del bot
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 2000) // 1-3 segundos de delay
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (isMinimized) {
    return (
      <div className={cn("fixed bottom-4 right-4 z-50", className)}>
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-[#26FFDF]/20 hover:bg-[#26FFDF]/30 text-[#26FFDF] border border-[#26FFDF]/30 backdrop-blur-sm rounded-full h-12 w-12 p-0"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("fixed bottom-4 right-4 z-50 w-80 sm:w-96", className)}>
      <Card className="border-slate-700 backdrop-blur-sm shadow-2xl rounded-2xl" style={{backgroundColor: '#0f0f0f'}}>
        <CardHeader className="pb-3 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-[#26FFDF]/20 p-2 rounded-full">
                <Bot className="h-4 w-4 text-[#26FFDF]" />
              </div>
              <div>
                <CardTitle className="text-sm text-white">Asistente IA</CardTitle>
                <p className="text-xs text-slate-400">Siempre disponible para ayudarte</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="h-8 w-8 p-0 text-slate-400 hover:text-white"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Messages Area */}
          <ScrollArea className="h-80 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start space-x-2",
                    message.sender === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.sender === 'bot' && (
                    <div className="bg-[#26FFDF]/20 p-1.5 rounded-full flex-shrink-0">
                      <Bot className="h-3 w-3 text-[#26FFDF]" />
                    </div>
                  )}
                  
                  <div
                    className={cn(
                      "max-w-[80%] p-3 rounded-2xl text-sm",
                      message.sender === 'user'
                        ? "bg-[#26FFDF]/20 text-[#26FFDF] ml-auto"
                        : "bg-slate-700/50 text-white"
                    )}
                  >
                    {message.content}
                    <div className="text-xs opacity-60 mt-1">
                      {message.timestamp.toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  
                  {message.sender === 'user' && (
                    <div className="bg-slate-600 p-1.5 rounded-full flex-shrink-0">
                      <User className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start space-x-2">
                  <div className="bg-[#26FFDF]/20 p-1.5 rounded-full flex-shrink-0">
                    <Bot className="h-3 w-3 text-[#26FFDF]" />
                  </div>
                  <div className="bg-slate-700/50 text-white p-3 rounded-2xl text-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-slate-400 mb-2">Preguntas sugeridas:</p>
              <div className="flex flex-wrap gap-1">
                {suggestions.slice(0, 3).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs h-7 bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-600/50 hover:text-white"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu pregunta..."
                className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-[#26FFDF]/50 focus:ring-[#26FFDF]/20"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-[#26FFDF]/20 hover:bg-[#26FFDF]/30 text-[#26FFDF] border border-[#26FFDF]/30 h-10 w-10 p-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProjectChatbot