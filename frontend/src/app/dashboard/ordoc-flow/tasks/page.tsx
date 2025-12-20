'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  CheckSquare,
  Clock,
  User,
  AlertCircle
} from 'lucide-react';
import { tasksService } from '@/services/ordoc-flow/tasks';
import { Task, FilterTasksParams } from '@/types/ordoc-flow';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const TasksPage = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalObjects, setTotalObjects] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const [params, setParams] = useState<FilterTasksParams>({
    direction: 'asc',
    order: 'name',
    page: 1,
    perPage: 20,
    q: '',
    status: '',
    priority: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setParams(prev => ({ ...prev, q: searchTerm, page: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    loadTasks();
  }, [params]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tasksService.getTasks(params);
      setTasks(response.data);
      setTotalPages(response.totalPages);
      setTotalObjects(response.total);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      setError('Erro ao carregar tarefas.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (task: Task) => {
    try {
      await tasksService.toggleTaskStatus(task.id);
      loadTasks();
    } catch (error) {
      console.error('Erro ao alterar status da tarefa:', error);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'in_progress': return 'default'; // Blue usually
      case 'completed': return 'default'; // Green
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'in_progress': return 'bg-blue-600 hover:bg-blue-700';
      case 'completed': return 'bg-green-600 hover:bg-green-700';
      case 'cancelled': return '';
      default: return '';
    }
  };

  const getPriorityColorClass = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-slate-100 text-slate-800 hover:bg-slate-200';
      case 'medium': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'high': return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'urgent': return 'bg-red-100 text-red-800 hover:bg-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Tarefas</h2>
            <p className="text-muted-foreground">
              Acompanhe e execute suas tarefas pendentes.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={() => router.push('/dashboard/ordoc-flow/tasks/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Tarefa
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2 py-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tarefas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Minhas Tarefas</CardTitle>
            <CardDescription>
              Lista de atividades atribuídas ou supervisionadas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                Nenhuma tarefa encontrada.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarefa</TableHead>
                    <TableHead>Procedimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Prazo</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{task.name}</span>
                          <span className="text-xs text-muted-foreground truncate max-w-[200px]">{task.description}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{task.procedure?.name || '-'}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={'secondary'} // Using custom colors
                          className={getStatusColorClass(task.status)}
                        >
                          {task.status === 'pending' ? 'Pendente' :
                            task.status === 'in_progress' ? 'Em Andamento' :
                              task.status === 'completed' ? 'Concluída' : 'Cancelada'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={'secondary'}
                          className={getPriorityColorClass(task.priority)}
                        >
                          {task.priority === 'low' ? 'Baixa' :
                            task.priority === 'medium' ? 'Média' :
                              task.priority === 'high' ? 'Alta' : 'Urgente'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <User className="mr-1 h-3 w-3" />
                          {task.assignee?.name || 'Não atribuído'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {task.due_date ? new Date(task.due_date).toLocaleDateString('pt-BR') : '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/ordoc-flow/tasks/${task.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/ordoc-flow/tasks/${task.id}/edit`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleToggleStatus(task)}>
                              <CheckSquare className="mr-2 h-4 w-4" />
                              Alterar Status
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default TasksPage;
