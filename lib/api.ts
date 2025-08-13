import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Crear instancia de axios con configuración base
export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Tipos para la API
export interface User {
  id: number;
  email: string;
  full_name: string;
  is_admin: boolean;
  is_active: boolean;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  client_id: number;
  client_name: string;
  created_at: string;
  updated_at: string;
}

export interface Meeting {
  id: number;
  title: string;
  project_id: number;
  room_id: string;
  start_time: string;
  end_time?: string;
  status: string;
  recording_url?: string;
  created_at: string;
}

export interface Transcription {
  id: number;
  meeting_id: number;
  transcript_text: string;
  summary?: string;
  key_points?: string[];
  commitments?: string[];
  next_steps?: string[];
  confidence_score?: number;
  processing_status: string;
  created_at: string;
  processed_at?: string;
}

export interface ChatMessage {
  id: number;
  project_id: number;
  user_id: number;
  message: string;
  ai_response?: string;
  context_used?: any[];
  created_at: string;
  user_name: string;
}

// Funciones de la API

// Autenticación
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (userData: {
    email: string;
    full_name: string;
    password: string;
    is_admin?: boolean;
  }) => api.post('/auth/register', userData),
  
  me: () => api.get('/auth/me'),
};

// Proyectos
export const projectsApi = {
  getAll: () => api.get<Project[]>('/projects/'),
  
  getById: (id: number) => api.get<Project>(`/projects/${id}`),
  
  create: (data: {
    title: string;
    description: string;
    client_id: number;
  }) => api.post<Project>('/projects/', data),
  
  update: (id: number, data: Partial<Project>) =>
    api.put<Project>(`/projects/${id}`, data),
  
  delete: (id: number) => api.delete(`/projects/${id}`),
};

// Reuniones
export const meetingsApi = {
  getByProject: (projectId: number) =>
    api.get<Meeting[]>(`/meetings/project/${projectId}`),
  
  getById: (id: number) => api.get<Meeting>(`/meetings/${id}`),
  
  create: (data: {
    title: string;
    project_id: number;
    start_time: string;
  }) => api.post<Meeting>('/meetings/', data),
  
  update: (id: number, data: Partial<Meeting>) =>
    api.put<Meeting>(`/meetings/${id}`, data),
  
  join: (id: number) => api.post(`/meetings/${id}/join`),
  
  leave: (id: number) => api.post(`/meetings/${id}/leave`),
};

// Transcripciones
export const transcriptionsApi = {
  getByMeeting: (meetingId: number) =>
    api.get<Transcription[]>(`/transcriptions/meeting/${meetingId}`),
  
  getById: (id: number) => api.get<Transcription>(`/transcriptions/${id}`),
  
  uploadAudio: (meetingId: number, audioFile: File) => {
    const formData = new FormData();
    formData.append('audio_file', audioFile);
    return api.post(`/transcriptions/upload/${meetingId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  regenerateSummary: (id: number) =>
    api.post(`/transcriptions/${id}/regenerate-summary`),
};

// Chat con IA
export const aiApi = {
  sendMessage: (projectId: number, message: string) =>
    api.post<ChatMessage>(`/ai/chat/${projectId}`, { message }),
  
  getChatHistory: (projectId: number, limit?: number) =>
    api.get<ChatMessage[]>(`/ai/chat/${projectId}`, {
      params: { limit },
    }),
  
  askQuestion: (projectId: number, question: string) =>
    api.post(`/ai/ask/${projectId}`, null, {
      params: { question },
    }),
  
  getInsights: (projectId: number) =>
    api.get(`/ai/insights/${projectId}`),
  
  searchMemory: (projectId: number, query: string, limit?: number) =>
    api.get(`/ai/search/${projectId}`, {
      params: { query, limit },
    }),
};

export default api;
