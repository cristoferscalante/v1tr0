'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Clock, Download, FileText, Search } from 'lucide-react';
import { Transcription } from '@/lib/api';

interface AudioTranscriptionProps {
  transcriptions: Transcription[];
  onDownload?: (transcriptionId: number) => void;
}

export default function AudioTranscription({ 
  transcriptions, 
  onDownload 
}: AudioTranscriptionProps) {
  const [selectedTranscription, setSelectedTranscription] = useState<Transcription | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar transcripciones basado en el término de búsqueda
  const filteredTranscriptions = transcriptions.filter(transcription => 
    transcription.transcript_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transcription.summary?.toLowerCase().includes(searchTerm.toLowerCase())
  );



  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">Transcripciones de Audio</h3>
          <Badge variant="outline">
            {transcriptions.length} transcripción{transcriptions.length !== 1 ? 'es' : ''}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar en transcripciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {transcriptions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay transcripciones</h3>
            <p className="text-gray-500 text-center max-w-sm">
              Las transcripciones de audio aparecerán aquí una vez que se procesen las grabaciones de las reuniones.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de transcripciones */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Transcripciones</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-96">
                  <div className="space-y-2 p-4">
                    {filteredTranscriptions.map((transcription) => (
                      <div
                        key={transcription.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedTranscription?.id === transcription.id
                            ? 'bg-blue-50 border-blue-200'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedTranscription(transcription)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Transcripción #{transcription.id}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={transcription.processing_status === 'completed' ? 'default' : 'secondary'}>
                                {transcription.processing_status === 'completed' ? 'Completada' : 
                                 transcription.processing_status === 'processing' ? 'Procesando' : 'Pendiente'}
                              </Badge>
                              <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(transcription.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          {onDownload && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDownload(transcription.id);
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Contenido de la transcripción seleccionada */}
          <div className="lg:col-span-2">
            {selectedTranscription ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Transcripción #{selectedTranscription.id}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        Creada el {new Date(selectedTranscription.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {onDownload && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDownload(selectedTranscription.id)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Descargar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="transcript" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="transcript">Transcripción</TabsTrigger>
                      <TabsTrigger value="summary">Resumen</TabsTrigger>
                      <TabsTrigger value="details">Detalles</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="transcript" className="mt-4">
                      <ScrollArea className="h-96">
                        <div className="prose prose-sm max-w-none">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {selectedTranscription.transcript_text || 'No hay texto de transcripción disponible.'}
                          </p>
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    
                    <TabsContent value="summary" className="mt-4">
                      <ScrollArea className="h-96">
                        <div className="space-y-4">
                          {selectedTranscription.summary && (
                            <div>
                              <h4 className="font-medium mb-2">Resumen</h4>
                              <p className="text-gray-700">{selectedTranscription.summary}</p>
                            </div>
                          )}
                          {selectedTranscription.key_points && selectedTranscription.key_points.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Puntos Clave</h4>
                              <ul className="list-disc list-inside space-y-1">
                                {selectedTranscription.key_points.map((point, index) => (
                                  <li key={index} className="text-gray-700">{point}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {selectedTranscription.commitments && selectedTranscription.commitments.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Compromisos</h4>
                              <ul className="list-disc list-inside space-y-1">
                                {selectedTranscription.commitments.map((commitment, index) => (
                                  <li key={index} className="text-gray-700">{commitment}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {selectedTranscription.next_steps && selectedTranscription.next_steps.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Próximos Pasos</h4>
                              <ul className="list-disc list-inside space-y-1">
                                {selectedTranscription.next_steps.map((step, index) => (
                                  <li key={index} className="text-gray-700">{step}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    
                    <TabsContent value="details" className="mt-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Estado</h4>
                            <Badge variant={selectedTranscription.processing_status === 'completed' ? 'default' : 'secondary'}>
                              {selectedTranscription.processing_status}
                            </Badge>
                          </div>
                          {selectedTranscription.confidence_score && (
                            <div>
                              <h4 className="font-medium mb-2">Confianza</h4>
                              <p className="text-gray-700">{Math.round(selectedTranscription.confidence_score * 100)}%</p>
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium mb-2">Creada</h4>
                            <p className="text-gray-700">{new Date(selectedTranscription.created_at).toLocaleString()}</p>
                          </div>
                          {selectedTranscription.processed_at && (
                            <div>
                              <h4 className="font-medium mb-2">Procesada</h4>
                              <p className="text-gray-700">{new Date(selectedTranscription.processed_at).toLocaleString()}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona una transcripción</h3>
                    <p className="text-gray-500">
                      Elige una transcripción de la lista para ver su contenido
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}