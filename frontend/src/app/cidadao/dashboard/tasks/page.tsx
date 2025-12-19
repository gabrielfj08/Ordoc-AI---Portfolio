'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ClipboardDocumentListIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import { ExternalTaskService } from '@/services/ordoc-cidadao';
import type { IndexExternalTask, taskExternalStatus } from '@/services/ordoc-cidadao';

const statusConfig = {
  pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
  in_progress: { label: 'Em Andamento', color: 'bg-blue-100 text-blue-800', icon: PlayIcon },
  completed: { label: 'Concluída', color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
  cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-800', icon: XCircleIcon },
};

export default function CidadaoTasksPage() {
  const [tasks, setTasks] = useState<IndexExternalTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<taskExternalStatus | 'all'>('all');
  const router = useRouter();

  useEffect(() => {
    loadTasks();
  }, [selectedStatus]);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const params = selectedStatus !== 'all' ? { status: selectedStatus } : {};
      const response = await ExternalTaskService.index('', '', params);
      setTasks(response.tasks || []);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/cidadao/dashboard')}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Voltar
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Minhas Tarefas</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            {Object.entries(statusConfig).map(([status, config]) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status as taskExternalStatus)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedStatus === status
                    ? config.color
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando tarefas...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="p-8 text-center">
              <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma tarefa encontrada</h3>
              <p className="text-gray-600">
                {selectedStatus === 'all'
                  ? 'Você não possui tarefas atribuídas no momento.'
                  : `Não há tarefas com status "${statusConfig[selectedStatus as keyof typeof statusConfig]?.label}".`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {tasks.map((task) => {
                const statusInfo = statusConfig[task.status];
                const StatusIcon = statusInfo.icon;
                const overdue = isOverdue(task.dueDate);

                return (
                  <div
                    key={task.id}
                    className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/cidadao/dashboard/tasks/${task.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{task.name}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </span>
                          {overdue && task.status !== 'completed' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Atrasada
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Prazo: {formatDate(task.dueDate)}</span>
                          <span>Procedimento: {task.procedure.name}</span>
                          <span>Criada por: {task.createdBy.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/cidadao/dashboard/tasks/${task.id}`);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
