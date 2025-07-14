'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Send, Bot, User, FileText, Clock } from 'lucide-react';
import { ChatMessage, aiApi } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface AIChatProps {
  projectId: number;
}

export function AIChat({ projectId }: AIChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatHistory();
  }, [projectId]);

  useEffect(() => {
    // Auto-scroll al final cuando hay nuevos mensajes
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      setLoadingHistory(true);
      const response = await aiApi.getChatHistory(projectId, 50);
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setIsLoading(true);

    try {
      const response = await aiApi.sendMessage(projectId, messageText);
      setMessages(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Opcional: mostrar toast de error
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessageTime = (date: string) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: es,
    });
  };

  const renderSources = (sources: any[]) => {
    if (!sources || sources.length === 0) return null;

    return (
      <div className="mt-2 space-y-1">
        <p className="text-xs text-muted-foreground">Fuentes consultadas:</p>
        {sources.map((source, index) => (
          <Badge key={index} variant="outline" className="text-xs mr-1">
            <FileText className="h-3 w-3 mr-1" />
            {source.type === 'transcription' ? 'Transcripción' : 'Resumen'}
            {source.similarity && (
              <span className="ml-1 text-muted-foreground">
                ({Math.round(source.similarity * 100)}%)
              </span>
            )}
          </Badge>
        ))}
      </div>
    );
  };

  if (loadingHistory) {
    return (
      <Card className="h-[600px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Chat con IA
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Chat con IA del Proyecto
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Pregunta sobre las reuniones, transcripciones y compromisos del proyecto
        </p>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Área de mensajes */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No hay mensajes aún</p>
              <p className="text-sm">Haz una pregunta sobre tu proyecto</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="space-y-3">
                  {/* Mensaje del usuario */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {message.user_name}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatMessageTime(message.created_at)}
                        </span>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-sm">{message.message}</p>
                      </div>
                    </div>
                  </div>

                  {/* Respuesta de la IA */}
                  {message.ai_response && (
                    <div className="flex gap-3 ml-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">IA Asistente</span>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-sm whitespace-pre-wrap">
                            {message.ai_response}
                          </p>
                          {renderSources(message.context_used || [])}
                        </div>
                      </div>
                    </div>
                  )}

                  <Separator className="my-2" />
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 ml-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                        <span className="text-sm text-muted-foreground">
                          La IA está pensando...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input para nuevos mensajes */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Pregunta sobre tu proyecto..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim() || isLoading}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Presiona Enter para enviar, Shift+Enter para nueva línea
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
