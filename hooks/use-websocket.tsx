'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './use-auth';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function useWebSocket() {
  const { user, session } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (user && session?.access_token && !socketRef.current) {
      // Crear conexión WebSocket
      const newSocket = io(SOCKET_URL, {
        query: {
          userId: user.id.toString(),
        },
        auth: {
          token: session.access_token,
        },
      });

      newSocket.on('connect', () => {
        // WebSocket conectado exitosamente
        setConnected(true);
      });

      newSocket.on('disconnect', () => {
        // WebSocket desconectado
        setConnected(false);
      });

      socketRef.current = newSocket;
      setSocket(newSocket);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user, session]);

  const joinRoom = (roomId: string) => {
    if (socket) {
      socket.emit('join_room', roomId);
    }
  };

  const leaveRoom = (roomId: string) => {
    if (socket) {
      socket.emit('leave_room', roomId);
    }
  };

  const sendToRoom = (roomId: string, event: string, data: unknown) => {
    if (socket) {
      socket.emit('send_to_room', {
        room: roomId,
        event: event,
        data: data,
      });
    }
  };

  return {
    socket,
    connected,
    joinRoom,
    leaveRoom,
    sendToRoom,
  };
}
