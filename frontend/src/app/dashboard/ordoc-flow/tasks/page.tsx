'use client';

import React, { useState, useEffect, DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
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
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'react-hot-toast';
import { NewTaskModal } from './NewTaskModal';

// Kanban Column Definition
type ColumnStatus = 'pending' | 'in_progress' | 'completed';

interface KanbanColumn {
  id: ColumnStatus;
  title: string;
  tasks: Task[];
  color: string;
  icon: React.ReactNode;
}

const TasksPage = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  // Initial params
  const [params, setParams] = useState<FilterTasksParams>({
    direction: 'asc',
    order: 'name',
    page: 1,
    perPage: 100, // Load more tasks for Kanban view
    q: '',
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
      const response = await tasksService.getTasks(params);
      setTasks(response.data);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      toast.error('Erro ao carregar tarefas.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (data: any) => {
    try {
      const response = await tasksService.createTask(data);
      if (response.success) {
        toast.success('Tarefa criada com sucesso!');
        await loadTasks(); // Reload to show new task
        setIsNewTaskModalOpen(false); // Close modal
      } else {
        toast.error(response.message || 'Erro ao criar tarefa');
      }
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      toast.error('Erro ao criar tarefa. Verifique os dados.');
    }
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    // Transparent ghost image or custom logic if needed
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>, targetStatus: ColumnStatus) => {
    e.preventDefault();

    if (!draggedTask) return;
    if (draggedTask.status === targetStatus) return; // No change

    // Optimistic Update
    const originalTasks = [...tasks];
    const updatedTasks = tasks.map(t =>
      t.id === draggedTask.id ? { ...t, status: targetStatus } : t
    );
    setTasks(updatedTasks);

    try {
      // Call API based on transition
      if (targetStatus === 'in_progress') {
        // Can be start() or run() depending on current state.
        // Assuming simple transition logic: pending -> start
        if (draggedTask.status === 'pending') {
            await tasksService.runTask(draggedTask.id); // Or startTask if applicable
        } else {
             // If moving back from completed, might need specific logic or just update status if API allows
             // For now, let's assume we can re-open tasks or just handle start
             await tasksService.runTask(draggedTask.id);
        }
      } else if (targetStatus === 'completed') {
        await tasksService.finishTask(draggedTask.id);
      } else if (targetStatus === 'pending') {
         // Logic to move back to pending/draft? The backend FSM might restrict this.
         // If backend doesn't support moving back to draft easily, we might warn user
         // or implement a specific 'reset' endpoint.
         // For now, let's try a status update if generic update is allowed, or show error.
         // Actually, FSM usually prevents finished -> pending.
         // Let's warn for now if it fails.
         toast.error("Não é possível voltar uma tarefa para Pendente via Kanban (Limitação FSM).");
         setTasks(originalTasks); // Revert
         return;
      }

      toast.success(`Tarefa movida para ${getColumnTitle(targetStatus)}`);
      // Reload to get consistent state from server (e.g. updated_at, history)
      loadTasks();

    } catch (error) {
      console.error('Erro ao mover tarefa:', error);
      toast.error('Não foi possível mover a tarefa.');
      setTasks(originalTasks); // Revert on error
    } finally {
      setDraggedTask(null);
    }
  };

  const getColumnTitle = (status: string) => {
      switch(status) {
          case 'pending': return 'A Fazer';
          case 'in_progress': return 'Em Andamento';
          case 'completed': return 'Concluído';
          default: return status;
      }
  }

  // Filter tasks into columns
  const columns: KanbanColumn[] = [
    {
      id: 'pending',
      title: 'A Fazer',
      color: 'bg-gray-100 border-gray-200',
      icon: <AlertCircle className="w-4 h-4 text-gray-500" />,
      tasks: tasks.filter(t => t.status === 'draft' || t.status === 'pending'), // Map draft to pending column
    },
    {
      id: 'in_progress',
      title: 'Em Andamento',
      color: 'bg-blue-50 border-blue-100',
      icon: <Clock className="w-4 h-4 text-blue-500" />,
      tasks: tasks.filter(t => t.status === 'running' || t.status === 'started'),
    },
    {
      id: 'completed',
      title: 'Concluído',
      color: 'bg-green-50 border-green-100',
      icon: <CheckSquare className="w-4 h-4 text-green-500" />,
      tasks: tasks.filter(t => t.status === 'finished' || t.status === 'completed'),
    },
  ];

  const getPriorityColorClass = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex-1 h-[calc(100vh-65px)] flex flex-col p-8 pt-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Quadro de Tarefas</h2>
            <p className="text-muted-foreground">
              Gerencie suas atividades arrastando entre as colunas.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={() => setIsNewTaskModalOpen(true)} className="bg-orange-600 hover:bg-orange-700">
              <Plus className="mr-2 h-4 w-4" />
              Nova Tarefa
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 mb-6">
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

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
          <div className="flex h-full gap-6 min-w-[1000px]">
            {columns.map((column) => (
              <div
                key={column.id}
                className={`flex-1 flex flex-col min-w-[300px] rounded-lg border bg-opacity-50 ${column.color}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {/* Column Header */}
                <div className="p-4 flex items-center justify-between border-b bg-white/50 backdrop-blur-sm rounded-t-lg">
                  <div className="flex items-center gap-2 font-semibold">
                    {column.icon}
                    {column.title}
                    <Badge variant="secondary" className="ml-2">
                      {column.tasks.length}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>

                {/* Tasks List */}
                <div className="flex-1 p-3 overflow-y-auto space-y-3 scrollbar-hide">
                  {loading && column.tasks.length === 0 ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    column.tasks.map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        className="group bg-white p-4 rounded-lg shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200"
                        onClick={() => router.push(`/dashboard/ordoc-flow/tasks/${task.id}`)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <Badge
                            variant="outline"
                            className={`text-xs font-normal ${getPriorityColorClass(task.priority)}`}
                          >
                            {task.priority === 'low' ? 'Baixa' :
                             task.priority === 'medium' ? 'Média' :
                             task.priority === 'high' ? 'Alta' : 'Urgente'}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => e.stopPropagation()} // Prevent card click
                              >
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/ordoc-flow/tasks/${task.id}/edit`); }}>
                                <Edit className="mr-2 h-3 w-3" /> Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={(e) => e.stopPropagation()}>
                                <Trash2 className="mr-2 h-3 w-3" /> Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">
                          {task.name}
                        </h4>

                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                          {task.description}
                        </p>

                        <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-2 border-t border-gray-50">
                          <div className="flex items-center gap-1">
                             <span className="truncate max-w-[100px]" title={task.procedure?.process_number}>
                                {task.procedure?.process_number || 'Sem Proc.'}
                             </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center" title="Prazo">
                              <Clock className="w-3 h-3 mr-1" />
                              {task.due_date ? new Date(task.due_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '-'}
                            </div>
                            <div className="flex items-center" title="Responsável">
                               <User className="w-3 h-3 mr-1" />
                               <span className="max-w-[80px] truncate">
                                   {task.assignee?.name?.split(' ')[0] || 'N/A'}
                               </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <NewTaskModal
          isOpen={isNewTaskModalOpen}
          onClose={() => setIsNewTaskModalOpen(false)}
          onSuccess={handleCreateTask}
        />
      </div>
    </ProtectedRoute>
  );
};

export default TasksPage;
