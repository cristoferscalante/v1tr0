'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Video, 
  MessageSquare, 
  FileAudio, 
  ArrowLeft,
  Settings
} from 'lucide-react';
import { JitsiMeeting } from '@/components/dashboard/jitsi-meeting';
import { AIChat } from '@/components/dashboard/ai-chat';
import AudioTranscription from '@/components/dashboard/audio-transcription';
import { meetingsApi, transcriptionsApi, Meeting, Transcription } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';
import { useWebSocket } from '@/hooks/use-websocket';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function MeetingPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { socket, joinRoom, leaveRoom } = useWebSocket();
  const { toast } = useToast();
  
  const meetingId = parseInt(params?.id as string);
  
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('meeting');
  const [inMeeting, setInMeeting] = useState(false);

  const loadMeetingData = useCallback(async () => {
    try {
      setLoading(true);
      const [meetingResponse, transcriptionsResponse] = await Promise.all([
        meetingsApi.getById(meetingId),
        transcriptionsApi.getByMeeting(meetingId),
      ]);
      
      setMeeting(meetingResponse.data);
      setTranscriptions(transcriptionsResponse.data);
    } catch (error) {
      console.error('Error loading meeting data:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar la información de la reunión',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [meetingId, toast]);

  useEffect(() => {
    if (meetingId) {
      loadMeetingData();
    }
  }, [meetingId, loadMeetingData, toast]);

  const loadTranscriptions = useCallback(async () => {
    try {
      const response = await transcriptionsApi.getByMeeting(meetingId);
      setTranscriptions(response.data);
    } catch (error) {
      console.error('Error loading transcriptions:', error);
    }
  }, [meetingId]);

  useEffect(() => {
    if (meeting && socket) {
      // Unirse a la sala de la reunión
      joinRoom(`meeting_${meeting.id}`);
      
      // Escuchar eventos de la reunión
      socket.on('user_joined_meeting', (data) => {
        toast({
          title: 'Usuario se unió',
          description: `${data.user_name} se unió a la reunión`,
        });
      });

      socket.on('user_left_meeting', (data) => {
        toast({
          title: 'Usuario salió',
          description: `${data.user_name} salió de la reunión`,
        });
      });

      socket.on('transcription_ready', () => {
        toast({
          title: 'Transcripción lista',
          description: 'La transcripción ha sido procesada exitosamente',
        });
        loadTranscriptions();
      });

      return () => {
        leaveRoom(`meeting_${meeting.id}`);
        socket.off('user_joined_meeting');
        socket.off('user_left_meeting');
        socket.off('transcription_ready');
      };
    }
    return undefined;
  }, [meeting, socket, joinRoom, leaveRoom, loadTranscriptions, toast]);

  const joinMeeting = async () => {
    if (!meeting) {
      return;
    }

    try {
      await meetingsApi.join(meeting.id);
      setInMeeting(true);
      setActiveTab('meeting');
      
      toast({
        title: 'Te uniste a la reunión',
        description: 'La videoconferencia se está cargando...',
      });
    } catch (error) {
      console.error('Error joining meeting:', error);
      toast({
        title: 'Error',
        description: 'No se pudo unir a la reunión',
        variant: 'destructive',
      });
    }
  };

  const leaveMeeting = async () => {
    if (!meeting) {
      return;
    }

    try {
      await meetingsApi.leave(meeting.id);
      setInMeeting(false);
      
      toast({
        title: 'Saliste de la reunión',
        description: 'Has abandonado la videoconferencia',
      });
    } catch (error) {
      console.error('Error leaving meeting:', error);
    }
  };

  const handleMeetingEnd = () => {
    leaveMeeting();
    setActiveTab('transcriptions');
  };

  const handleRecordingStart = () => {
    toast({
      title: 'Grabación iniciada',
      description: 'La reunión se está grabando. Se generará una transcripción automáticamente.',
    });
  };



  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-lg">Reunión no encontrada</p>
            <Button
              onClick={() => router.back()}
              className="mt-4"
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: 'outline',
      active: 'default',
      completed: 'secondary',
    } as const;

    const labels = {
      scheduled: 'Programada',
      active: 'Activa',
      completed: 'Completada',
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.back()}
            variant="outline"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold">{meeting.title}</h1>
            <p className="text-muted-foreground">
              Reunión #{meeting.id} • {' '}
              {formatDistanceToNow(new Date(meeting.start_time), {
                addSuffix: true,
                locale: es,
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {getStatusBadge(meeting.status)}
          
          {!inMeeting && meeting.status !== 'completed' && (
            <Button onClick={joinMeeting} className="gap-2">
              <Video className="h-4 w-4" />
              Unirse a la reunión
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="meeting" className="gap-2">
            <Video className="h-4 w-4" />
            Reunión
          </TabsTrigger>
          <TabsTrigger value="transcriptions" className="gap-2">
            <FileAudio className="h-4 w-4" />
            Transcripciones
          </TabsTrigger>
          <TabsTrigger value="chat" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat IA
          </TabsTrigger>
          <TabsTrigger value="info" className="gap-2">
            <Settings className="h-4 w-4" />
            Información
          </TabsTrigger>
        </TabsList>

        <TabsContent value="meeting" className="space-y-4">
          {inMeeting && user ? (
            <JitsiMeeting
              roomName={meeting.room_id}
              displayName={user.name || user.email}
              onMeetingEnd={handleMeetingEnd}
              onRecordingStart={handleRecordingStart}
            />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Video className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">
                  {meeting.status === 'completed'
                    ? 'Reunión completada'
                    : 'No estás en la reunión'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {meeting.status === 'completed'
                    ? 'Esta reunión ya ha finalizado. Puedes revisar las transcripciones y usar el chat con IA.'
                    : 'Haz clic en "Unirse a la reunión" para comenzar la videoconferencia.'}
                </p>
                {meeting.status !== 'completed' && (
                  <Button onClick={joinMeeting} className="gap-2">
                    <Video className="h-4 w-4" />
                    Unirse a la reunión
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="transcriptions">
          <AudioTranscription
            transcriptions={transcriptions}
          />
        </TabsContent>

        <TabsContent value="chat">
          <AIChat meetingId={meeting.id} />
        </TabsContent>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información de la reunión</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    ID de la reunión
                  </label>
                  <p>{meeting.id}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Sala
                  </label>
                  <p className="font-mono text-sm">{meeting.room_id}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Fecha de inicio
                  </label>
                  <p>{new Date(meeting.start_time).toLocaleString('es-ES', { timeZone: 'America/Bogota' })}</p>
                </div>
                
                {meeting.end_time && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Fecha de fin
                    </label>
                    <p>{new Date(meeting.end_time).toLocaleString('es-ES', { timeZone: 'America/Bogota' })}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Estado
                  </label>
                  <div className="mt-1">
                    {getStatusBadge(meeting.status)}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Transcripciones
                  </label>
                  <p>{transcriptions.length} archivo(s)</p>
                </div>
              </div>

              {meeting.recording_url && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Grabación
                  </label>
                  <div className="mt-1">
                    <Button variant="outline" size="sm" asChild>
                      <a href={meeting.recording_url} target="_blank" rel="noopener noreferrer">
                        Ver grabación
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
