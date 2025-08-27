'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Upload, 
  FileAudio, 
  CheckCircle, 
  XCircle, 
  Clock,
  Download,
  RefreshCw
} from 'lucide-react';
import { transcriptionsApi, Transcription } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface AudioTranscriptionProps {
  meetingId: number;
  transcriptions: Transcription[];
  onTranscriptionUpdate: () => void;
}

export function AudioTranscription({ 
  meetingId, 
  transcriptions, 
  onTranscriptionUpdate 
}: AudioTranscriptionProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg', 'audio/m4a'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(wav|mp3|m4a|ogg)$/i)) {
      toast({
        title: 'Archivo no válido',
        description: 'Por favor, sube un archivo de audio válido (WAV, MP3, M4A, OGG)',
        variant: 'destructive',
      });
      return;
    }

    // Validar tamaño (máximo 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: 'Archivo muy grande',
        description: 'El archivo debe ser menor a 100MB',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      // Simular progreso de subida
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await transcriptionsApi.uploadAudio(meetingId, file);

      setUploadProgress(100);
      
      toast({
        title: 'Audio subido exitosamente',
        description: 'La transcripción se está procesando. Recibirás una notificación cuando esté lista.',
      });

      // Refrescar transcripciones después de un momento
      setTimeout(() => {
        onTranscriptionUpdate();
        setUploading(false);
        setUploadProgress(0);
      }, 1000);

    } catch (error) {
      console.error('Error uploading audio:', error);
      toast({
        title: 'Error al subir audio',
        description: 'Hubo un problema al subir el archivo. Inténtalo de nuevo.',
        variant: 'destructive',
      });
      setUploading(false);
      setUploadProgress(0);
    }
  }, [meetingId, onTranscriptionUpdate, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.wav', '.mp3', '.m4a', '.ogg']
    },
    maxFiles: 1,
    disabled: uploading,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'failed':
        return 'Falló';
      case 'processing':
        return 'Procesando';
      default:
        return 'Pendiente';
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'failed':
        return 'destructive';
      case 'processing':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const regenerateSummary = async (transcriptionId: number) => {
    try {
      await transcriptionsApi.regenerateSummary(transcriptionId);
      toast({
        title: 'Regenerando resumen',
        description: 'El resumen se está regenerando. Esto puede tardar unos minutos.',
      });
      
      // Refrescar después de un momento
      setTimeout(onTranscriptionUpdate, 2000);
    } catch (error) {
      console.error('Error regenerating summary:', error);
      toast({
        title: 'Error',
        description: 'No se pudo regenerar el resumen. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    }
  };

  const downloadTranscription = (transcription: Transcription) => {
    const content = `Transcripción de la reunión
Fecha: ${new Date(transcription.created_at).toLocaleString('es-ES', { timeZone: 'America/Bogota' })}
Confianza: ${transcription.confidence_score ? Math.round(transcription.confidence_score * 100) : 'N/A'}%

TRANSCRIPCIÓN:
${transcription.transcript_text}

${transcription.summary ? `RESUMEN:
${transcription.summary}` : ''}

${transcription.key_points?.length ? `PUNTOS CLAVE:
${transcription.key_points.map(point => `• ${point}`).join('\n')}` : ''}

${transcription.commitments?.length ? `COMPROMISOS:
${transcription.commitments.map(commitment => `• ${commitment}`).join('\n')}` : ''}

${transcription.next_steps?.length ? `PRÓXIMOS PASOS:
${transcription.next_steps.map(step => `• ${step}`).join('\n')}` : ''}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcripcion-${transcription.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Área de subida */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Subir Audio para Transcripción
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-blue-400 bg-blue-50' 
                : uploading 
                ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            
            {uploading ? (
              <div className="space-y-4">
                <RefreshCw className="h-12 w-12 mx-auto text-blue-600 animate-spin" />
                <div>
                  <p className="text-lg font-medium">Subiendo archivo...</p>
                  <Progress value={uploadProgress} className="mt-2 max-w-xs mx-auto" />
                  <p className="text-sm text-muted-foreground mt-1">
                    {uploadProgress}% completado
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <FileAudio className="h-12 w-12 mx-auto text-gray-400" />
                <div>
                  <p className="text-lg font-medium">
                    {isDragActive
                      ? 'Suelta el archivo aquí'
                      : 'Arrastra un archivo de audio o haz clic para seleccionar'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Formatos soportados: WAV, MP3, M4A, OGG (máximo 100MB)
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lista de transcripciones */}
      <Card>
        <CardHeader>
          <CardTitle>Transcripciones</CardTitle>
        </CardHeader>
        <CardContent>
          {transcriptions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileAudio className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No hay transcripciones aún</p>
              <p className="text-sm">Sube un archivo de audio para comenzar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transcriptions.map((transcription) => (
                <div key={transcription.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(transcription.processing_status)}
                      <Badge variant={getStatusVariant(transcription.processing_status)}>
                        {getStatusText(transcription.processing_status)}
                      </Badge>
                      {transcription.confidence_score && (
                        <Badge variant="outline">
                          Confianza: {Math.round(transcription.confidence_score * 100)}%
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(transcription.created_at), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </span>
                      
                      {transcription.processing_status === 'completed' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadTranscription(transcription)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => regenerateSummary(transcription.id)}
                          >
                            <RefreshCw className="h-4 w-4" />
                            Regenerar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {transcription.processing_status === 'completed' && (
                    <div className="space-y-3">
                      {transcription.summary && (
                        <div>
                          <h4 className="font-medium mb-1">Resumen:</h4>
                          <p className="text-sm text-muted-foreground">
                            {transcription.summary}
                          </p>
                        </div>
                      )}

                      {transcription.key_points && transcription.key_points.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-1">Puntos clave:</h4>
                          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                            {transcription.key_points.map((point, index) => (
                              <li key={index}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {transcription.commitments && transcription.commitments.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-1">Compromisos:</h4>
                          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                            {transcription.commitments.map((commitment, index) => (
                              <li key={index}>{commitment}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {transcription.next_steps && transcription.next_steps.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-1">Próximos pasos:</h4>
                          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                            {transcription.next_steps.map((step, index) => (
                              <li key={index}>{step}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <Separator />
                      
                      <details className="group">
                        <summary className="cursor-pointer text-sm font-medium">
                          Ver transcripción completa
                        </summary>
                        <div className="mt-2 p-3 bg-gray-50 rounded text-sm whitespace-pre-wrap">
                          {transcription.transcript_text}
                        </div>
                      </details>
                    </div>
                  )}

                  {transcription.processing_status === 'failed' && (
                    <p className="text-sm text-red-600">
                      La transcripción falló. Por favor, intenta subir el archivo de nuevo.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
