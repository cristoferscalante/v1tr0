'use client';

import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Mic, PhoneOff } from 'lucide-react';

interface JitsiMeetingProps {
  roomName: string;
  displayName: string;
  onMeetingEnd?: () => void;
  onRecordingStart?: () => void;
}

export function JitsiMeeting({
  roomName,
  displayName,
  onMeetingEnd,
  onRecordingStart
}: JitsiMeetingProps) {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<{ dispose: () => void } | null>(null);

  useEffect(() => {
    // En un entorno real, aquí cargaríamos la API de Jitsi
    // Por ahora, simulamos la funcionalidad
    // TODO: Inicializar reunión Jitsi con roomName y displayName
    
    // Copiar apiRef.current a variable local para usar en cleanup
    const currentApi = apiRef.current;

    return () => {
      // Cleanup usando la variable local
      if (currentApi) {
        currentApi.dispose();
      }
    };
  }, [roomName, displayName]);

  const handleEndMeeting = () => {
    if (apiRef.current) {
      apiRef.current.dispose();
    }
    onMeetingEnd?.();
  };

  const handleStartRecording = () => {
    // TODO: Implementar lógica de grabación
    onRecordingStart?.();
  };



  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Videoconferencia - {roomName}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Mic className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleStartRecording}
            >
              Grabar
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleEndMeeting}
            >
              <PhoneOff className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={jitsiContainerRef}
          className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center"
        >
          <div className="text-center">
            <Video className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Cargando videoconferencia...</p>
            <p className="text-sm text-gray-500 mt-2">
              Sala: {roomName} | Usuario: {displayName}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}