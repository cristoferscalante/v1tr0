'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff } from 'lucide-react';

interface JitsiMeetingProps {
  roomId: string;
  displayName: string;
  onMeetingEnd?: () => void;
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
}

export function JitsiMeeting({
  roomId,
  displayName,
  onMeetingEnd,
  onRecordingStart,
  onRecordingStop,
}: JitsiMeetingProps) {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const [api, setApi] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (!jitsiContainerRef.current) return;

    const loadJitsi = async () => {
      try {
        // Cargar Jitsi Meet API desde CDN
        if (!window.JitsiMeetExternalAPI) {
          const script = document.createElement('script');
          script.src = 'https://8x8.vc/external_api.js';
          script.async = true;
          document.head.appendChild(script);

          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
          });
        }

        // Configuración de Jitsi
        const domain = 'meet.jit.si';
        const options = {
          roomName: roomId,
          width: '100%',
          height: 500,
          parentNode: jitsiContainerRef.current,
          userInfo: {
            displayName: displayName,
          },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            enableWelcomePage: false,
            enableClosePage: false,
            prejoinPageEnabled: false,
            disableInviteFunctions: true,
          },
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
              'microphone',
              'camera',
              'closedcaptions',
              'desktop',
              'fullscreen',
              'fodeviceselection',
              'hangup',
              'profile',
              'recording',
              'settings',
              'videoquality',
              'filmstrip',
              'feedback',
              'stats',
              'shortcuts',
              'tileview',
              'videobackgroundblur',
              'download',
              'help',
              'mute-everyone',
            ],
            SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile'],
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
          },
        };

        const jitsiApi = new window.JitsiMeetExternalAPI(domain, options);
        setApi(jitsiApi);

        // Event listeners
        jitsiApi.addEventListeners({
          readyToClose: () => {
            if (onMeetingEnd) {
              onMeetingEnd();
            }
          },
          audioMuteStatusChanged: ({ muted }: { muted: boolean }) => {
            setIsMuted(muted);
          },
          videoMuteStatusChanged: ({ muted }: { muted: boolean }) => {
            setIsVideoOff(muted);
          },
          recordingStatusChanged: ({ on }: { on: boolean }) => {
            setIsRecording(on);
            if (on && onRecordingStart) {
              onRecordingStart();
            } else if (!on && onRecordingStop) {
              onRecordingStop();
            }
          },
        });

        setIsLoading(false);
      } catch (err) {
        console.error('Error loading Jitsi:', err);
        setError('Error al cargar la videoconferencia');
        setIsLoading(false);
      }
    };

    loadJitsi();

    return () => {
      if (api) {
        api.dispose();
      }
    };
  }, [roomId, displayName]);

  const toggleMute = () => {
    if (api) {
      api.executeCommand('toggleAudio');
    }
  };

  const toggleVideo = () => {
    if (api) {
      api.executeCommand('toggleVideo');
    }
  };

  const startRecording = () => {
    if (api) {
      api.executeCommand('startRecording', {
        mode: 'file',
      });
    }
  };

  const stopRecording = () => {
    if (api) {
      api.executeCommand('stopRecording');
    }
  };

  const hangUp = () => {
    if (api) {
      api.executeCommand('hangup');
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Videoconferencia - {roomId}</CardTitle>
            <div className="flex gap-2">
              {isRecording && (
                <Badge variant="destructive" className="animate-pulse">
                  Grabando
                </Badge>
              )}
              <Badge variant={isMuted ? 'destructive' : 'default'}>
                {isMuted ? 'Silenciado' : 'Audio activo'}
              </Badge>
              <Badge variant={isVideoOff ? 'destructive' : 'default'}>
                {isVideoOff ? 'Video off' : 'Video activo'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              <div
                ref={jitsiContainerRef}
                className="w-full rounded-lg overflow-hidden"
              />
              
              {/* Controles adicionales */}
              <div className="flex justify-center gap-2 mt-4">
                <Button
                  variant={isMuted ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={toggleMute}
                >
                  {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  {isMuted ? 'Activar micrófono' : 'Silenciar'}
                </Button>
                
                <Button
                  variant={isVideoOff ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={toggleVideo}
                >
                  {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                  {isVideoOff ? 'Activar video' : 'Desactivar video'}
                </Button>
                
                <Button
                  variant={isRecording ? 'destructive' : 'secondary'}
                  size="sm"
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  {isRecording ? 'Detener grabación' : 'Iniciar grabación'}
                </Button>
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={hangUp}
                >
                  <PhoneOff className="h-4 w-4" />
                  Finalizar llamada
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Extensión del tipo Window para TypeScript
declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}
