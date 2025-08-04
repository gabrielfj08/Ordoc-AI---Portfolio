'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Filter,
  CheckSquare,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Clock,
  User,
  AlertCircle
} from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import { tasksService } from '@/services/ordoc-flow/tasks';
import { Task, FilterTasksParams } from '@/types/ordoc-flow';

const TasksPage = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalObjects, setTotalObjects] = useState(0);
  
  const [params, setParams] = useState<FilterTasksParams>({
    direction: 'asc',
    order: 'name',
    page: 1,
    perPage: 20,
    q: '',
    status: '',
    procedure_id: undefined,
    assignee_id: undefined,
    priority: '',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showActions, setShowActions] = useState<number | null>(null);

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

  const handleSearch = (value: string) => {
    setParams(prev => ({ ...prev, q: value, page: 1 }));
  };

  const handleStatusFilter = (status: string) => {
    setParams(prev => ({ ...prev, status: status as 'pending' | 'in_progress' | 'completed' | 'cancelled' | '', page: 1 }));
  };

  const handlePriorityFilter = (priority: string) => {
    setParams(prev => ({ ...prev, priority: priority as 'low' | 'medium' | 'high' | 'urgent' | '', page: 1 }));
  };

  const handleSort = (field: string) => {
    setParams(prev => ({
      ...prev,
      order: field,
      direction: prev.order === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handlePageChange = (page: number) => {
    setParams(prev => ({ ...prev, page }));
  };

  const handleToggleStatus = async (task: Task) => {
    try {
      await tasksService.toggleTaskStatus(task.id);
      loadTasks();
    } catch (error) {
      console.error('Erro ao alterar status da tarefa:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendente' },
      in_progress: { color: 'bg-blue-100 text-blue-800', text: 'Em Andamento' },
      completed: { color: 'bg-green-100 text-green-800', text: 'Concluída' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelada' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { color: 'bg-gray-100 text-gray-800', text: 'Baixa' },
      medium: { color: 'bg-blue-100 text-blue-800', text: 'Média' },
      high: { color: 'bg-orange-100 text-orange-800', text: 'Alta' },
      urgent: { color: 'bg-red-100 text-red-800', text: 'Urgente' },
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tarefas</h1>
            <p className="text-gray-600">Gerencie tarefas do sistema</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/ordoc-flow/tasks/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </button>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar tarefas..."
              value={params.q}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </div>

        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={params.status}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos</option>
                  <option value="pending">Pendente</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="completed">Concluída</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                <select
                  value={params.priority}
                  onChange={(e) => handlePriorityFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas</option>
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Carregando tarefas...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={CheckSquare}
            title="Nenhuma tarefa configurada"
            description="Configure tarefas para automatizar seus workflows"
            actionButton={{ text: 'Criar Tarefa', onClick: () => router.push('/dashboard/ordoc-flow/tasks/new') }}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('name')}
                    >
                      Nome
                      {params.order === 'name' && (
                        <span className="ml-1">
                          {params.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Procedimento
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('status')}
                    >
                      Status
                      {params.order === 'status' && (
                        <span className="ml-1">
                          {params.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('priority')}
                    >
                      Prioridade
                      {params.order === 'priority' && (
                        <span className="ml-1">
                          {params.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Responsável
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('due_date')}
                    >
                      Prazo
                      {params.order === 'due_date' && (
                        <span className="ml-1">
                          {params.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{task.name}</div>
                        <div className="text-sm text-gray-500">{task.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{task.procedure?.name || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(task.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPriorityBadge(task.priority)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{task.assignee?.name || 'Não atribuído'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {task.due_date ? new Date(task.due_date).toLocaleDateString('pt-BR') : '-'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="relative">
                          <button
                            onClick={() => setShowActions(showActions === task.id ? null : task.id)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {showActions === task.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                              <button
                                onClick={() => {
                                  router.push(`/dashboard/ordoc-flow/tasks/${task.id}`);
                                  setShowActions(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                Visualizar
                              </button>
                              <button
                                onClick={() => {
                                  router.push(`/dashboard/ordoc-flow/tasks/${task.id}/edit`);
                                  setShowActions(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <Edit className="w-4 h-4" />
                                Editar
                              </button>
                              <button
                                onClick={() => {
                                  handleToggleStatus(task);
                                  setShowActions(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <CheckSquare className="w-4 h-4" />
                                Alterar Status
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedTask(task);
                                  setShowActions(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                Excluir
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Mostrando {((params.page - 1) * params.perPage) + 1} a {Math.min(params.page * params.perPage, totalObjects)} de {totalObjects} tarefas
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(params.page - 1)}
                    disabled={params.page === 1}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Anterior
                  </button>
                  <span className="text-sm text-gray-700">
                    Página {params.page} de {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(params.page + 1)}
                    disabled={params.page === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
