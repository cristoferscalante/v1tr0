'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  FolderOpen, 
  Calendar,
  Plus,
  Edit,
  Trash2,
  UserPlus,
  Settings
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { projectsApi, authApi, Project, User } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);

  // Form states
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    client_id: '',
  });

  const [userForm, setUserForm] = useState({
    email: '',
    full_name: '',
    password: '',
    is_admin: false,
  });

  useEffect(() => {
    if (!isAdmin) {
      router.push('/dashboard');
      return;
    }
    loadData();
  }, [isAdmin]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectsResponse] = await Promise.all([
        projectsApi.getAll(),
        // Aquí añadiríamos la API para usuarios cuando esté disponible
      ]);
      setProjects(projectsResponse.data);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar la información',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    try {
      await projectsApi.create({
        title: projectForm.title,
        description: projectForm.description,
        client_id: parseInt(projectForm.client_id),
      });

      toast({
        title: 'Proyecto creado',
        description: 'El proyecto se ha creado exitosamente',
      });

      setShowCreateProject(false);
      setProjectForm({ title: '', description: '', client_id: '' });
      loadData();
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: 'Error',
        description: 'No se pudo crear el proyecto',
        variant: 'destructive',
      });
    }
  };

  const createUser = async () => {
    try {
      await authApi.register({
        email: userForm.email,
        full_name: userForm.full_name,
        password: userForm.password,
        is_admin: userForm.is_admin,
      });

      toast({
        title: 'Usuario creado',
        description: 'El usuario se ha creado exitosamente',
      });

      setShowCreateUser(false);
      setUserForm({ email: '', full_name: '', password: '', is_admin: false });
      loadData();
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: 'Error',
        description: 'No se pudo crear el usuario',
        variant: 'destructive',
      });
    }
  };

  const deleteProject = async (projectId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      return;
    }

    try {
      await projectsApi.delete(projectId);
      toast({
        title: 'Proyecto eliminado',
        description: 'El proyecto se ha eliminado exitosamente',
      });
      loadData();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el proyecto',
        variant: 'destructive',
      });
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-muted-foreground">Gestiona proyectos, usuarios y configuraciones</p>
        </div>
        <Badge variant="default">Administrador</Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <FolderOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{projects.length}</p>
                <p className="text-sm text-muted-foreground">Proyectos activos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-sm text-muted-foreground">Usuarios registrados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">-</p>
                <p className="text-sm text-muted-foreground">Reuniones este mes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList>
          <TabsTrigger value="projects">Proyectos</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Gestión de Proyectos</h2>
            <Dialog open={showCreateProject} onOpenChange={setShowCreateProject}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nuevo Proyecto
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título del proyecto</Label>
                    <Input
                      id="title"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      placeholder="Nombre del proyecto"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      placeholder="Descripción del proyecto"
                    />
                  </div>
                  <div>
                    <Label htmlFor="client">Cliente</Label>
                    <Input
                      id="client"
                      type="number"
                      value={projectForm.client_id}
                      onChange={(e) => setProjectForm({ ...projectForm, client_id: e.target.value })}
                      placeholder="ID del cliente"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={createProject} className="flex-1">
                      Crear Proyecto
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowCreateProject(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{project.title}</h3>
                        <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {project.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Cliente: {project.client_name} • Creado: {new Date(project.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteProject(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Gestión de Usuarios</h2>
            <Dialog open={showCreateUser} onOpenChange={setShowCreateUser}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Nuevo Usuario
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      placeholder="usuario@ejemplo.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="full_name">Nombre completo</Label>
                    <Input
                      id="full_name"
                      value={userForm.full_name}
                      onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })}
                      placeholder="Nombre completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      placeholder="Contraseña segura"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_admin"
                      checked={userForm.is_admin}
                      onChange={(e) => setUserForm({ ...userForm, is_admin: e.target.checked })}
                    />
                    <Label htmlFor="is_admin">¿Es administrador?</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={createUser} className="flex-1">
                      Crear Usuario
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowCreateUser(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                La gestión detallada de usuarios estará disponible próximamente.
                Por ahora puedes crear nuevos usuarios usando el botón de arriba.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <h2 className="text-xl font-semibold">Configuración del Sistema</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuración General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Las opciones de configuración estarán disponibles próximamente.
                Incluirán configuración de IA, Jitsi, notificaciones y más.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
