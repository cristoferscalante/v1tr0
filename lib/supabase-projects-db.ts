import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================================
// TIPOS
// ============================================================

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  client_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Task {
  id: string;
  nombre: string;
  descripcion?: string;
  estado: 'completada' | 'en progreso' | 'pendiente';
  fecha_inicio?: string;
  fecha_final?: string;
  prioridad: 'alta' | 'media' | 'baja';
  categoria: 'planeacion' | 'diseño' | 'desarrollo' | 'testing' | 'despliegue';
  observaciones?: string;
  finalizada: boolean;
  project_id?: string;
  assigned_to?: string;
  created_at?: string;
  updated_at?: string;
  project?: Project;
}

export interface MeetingTask {
  id: string;
  meeting_summary_id?: string;
  title: string;
  description?: string;
  assigned_to?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: string;
  category?: string;
  tags?: string[];
  estimated_hours?: number;
  project_id?: string; // Para vincular con proyectos
  created_at?: string;
  updated_at?: string;
  project?: Project;
}

export interface MeetingSummary {
  id: string;
  title?: string;
  meeting_date?: string;
  participants?: Record<string, unknown>[];
  summary?: string;
  key_decisions?: Record<string, unknown>[];
  tasks?: Record<string, unknown>[];
  follow_ups?: Record<string, unknown>[];
  next_meeting?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface TaskComment {
  id: string;
  task_id: string;
  task_type: 'task' | 'meeting_task';
  user_id: string;
  content: string;
  created_at?: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

// ============================================================
// CLASE PRINCIPAL
// ============================================================

export class SupabaseProjectsDB {
  
  // ============================================================
  // PROYECTOS
  // ============================================================
  
  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
    
    return data || [];
  }

  async getActiveProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'active')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching active projects:', error);
      return [];
    }
    
    return data || [];
  }

  async getProjectById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching project:', error);
      return null;
    }
    
    return data;
  }

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating project:', error);
      return null;
    }
    
    return data;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating project:', error);
      return null;
    }
    
    return data;
  }

  // ============================================================
  // TAREAS DE PROYECTOS
  // ============================================================

  async getTasksByProject(projectId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*, project:projects(*)')
      .eq('project_id', projectId)
      .order('fecha_inicio', { ascending: true });
    
    if (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
    
    return data || [];
  }

  async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating task:', error);
      return null;
    }
    
    return data;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating task:', error);
      return null;
    }
    
    return data;
  }

  // ============================================================
  // TAREAS DE REUNIONES (meeting_tasks)
  // ============================================================

  async getMeetingTasks(): Promise<MeetingTask[]> {
    const { data, error } = await supabase
      .from('meeting_tasks')
      .select('*, project:projects(*)')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching meeting tasks:', error);
      return [];
    }
    
    return data || [];
  }

  async getUnassignedMeetingTasks(): Promise<MeetingTask[]> {
    const { data, error } = await supabase
      .from('meeting_tasks')
      .select('*')
      .is('project_id', null)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching unassigned meeting tasks:', error);
      return [];
    }
    
    return data || [];
  }

  async getMeetingTasksByProject(projectId: string): Promise<MeetingTask[]> {
    const { data, error } = await supabase
      .from('meeting_tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('due_date', { ascending: true });
    
    if (error) {
      console.error('Error fetching meeting tasks by project:', error);
      return [];
    }
    
    return data || [];
  }

  async assignMeetingTaskToProject(taskId: string, projectId: string): Promise<MeetingTask | null> {
    const { data, error } = await supabase
      .from('meeting_tasks')
      .update({ project_id: projectId, updated_at: new Date().toISOString() })
      .eq('id', taskId)
      .select()
      .single();
    
    if (error) {
      console.error('Error assigning meeting task to project:', error);
      return null;
    }
    
    return data;
  }

  async updateMeetingTask(id: string, updates: Partial<MeetingTask>): Promise<MeetingTask | null> {
    const { data, error } = await supabase
      .from('meeting_tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating meeting task:', error);
      return null;
    }
    
    return data;
  }

  // ============================================================
  // RESÚMENES DE REUNIONES
  // ============================================================

  async getMeetingSummaries(): Promise<MeetingSummary[]> {
    const { data, error } = await supabase
      .from('meeting_summaries')
      .select('*')
      .order('meeting_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching meeting summaries:', error);
      return [];
    }
    
    return data || [];
  }

  async getMeetingSummaryById(id: string): Promise<MeetingSummary | null> {
    const { data, error } = await supabase
      .from('meeting_summaries')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching meeting summary:', error);
      return null;
    }
    
    return data;
  }

  // ============================================================
  // ESTADÍSTICAS
  // ============================================================

  async getProjectStats(projectId: string): Promise<{
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    pendingTasks: number;
    meetingTasks: number;
  }> {
    // Obtener tareas del proyecto
    const { data: tasks } = await supabase
      .from('tasks')
      .select('estado')
      .eq('project_id', projectId);

    // Obtener meeting_tasks del proyecto
    const { data: meetingTasks } = await supabase
      .from('meeting_tasks')
      .select('status')
      .eq('project_id', projectId);

    const tasksList = tasks || [];
    const meetingTasksList = meetingTasks || [];

    return {
      totalTasks: tasksList.length,
      completedTasks: tasksList.filter(t => t.estado === 'completada').length,
      inProgressTasks: tasksList.filter(t => t.estado === 'en progreso').length,
      pendingTasks: tasksList.filter(t => t.estado === 'pendiente').length,
      meetingTasks: meetingTasksList.length
    };
  }

  async getUnassignedTasksCount(): Promise<number> {
    const { count, error } = await supabase
      .from('meeting_tasks')
      .select('*', { count: 'exact', head: true })
      .is('project_id', null);

    if (error) {
      console.error('Error counting unassigned tasks:', error);
      return 0;
    }

    return count || 0;
  }

  // ============================================================
  // SUSCRIPCIONES EN TIEMPO REAL
  // ============================================================

  subscribeToMeetingTasks(callback: (payload: { new: MeetingTask }) => void) {
    return supabase
      .channel('meeting_tasks_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'meeting_tasks' },
        (payload) => callback(payload as unknown as { new: MeetingTask })
      )
      .subscribe();
  }

  subscribeToTasks(projectId: string, callback: (payload: { new: Task; old: Task; eventType: string }) => void) {
    return supabase
      .channel(`tasks_${projectId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks', filter: `project_id=eq.${projectId}` },
        (payload) => callback({
          new: payload.new as Task,
          old: payload.old as Task,
          eventType: payload.eventType
        })
      )
      .subscribe();
  }
}

// Instancia singleton
export const supabaseProjectsDB = new SupabaseProjectsDB();
export default supabaseProjectsDB;
