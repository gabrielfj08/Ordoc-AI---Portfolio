'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Filter,
  FileText,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  User,
  CheckSquare,
  Clock,
  PlayCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import { proceduresService } from '@/services/ordoc-flow/procedures';
import { Procedure, FilterProceduresParams } from '@/types/ordoc-flow';
import ErrorState from '@/components/ui/ErrorState';

const ProceduresPage = () => {
  const router = useRouter();
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalObjects, setTotalObjects] = useState(0);
  
  const [params, setParams] = useState<FilterProceduresParams>({
    direction: 'asc',
    order: 'name',
    page: 1,
    perPage: 20,
    q: '',
    status: '',
    procedure_template_id: undefined,
    requester_id: undefined,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null);
  const [showActions, setShowActions] = useState<number | null>(null);

  useEffect(() => {
    loadProcedures();
  }, [params]);

  const loadProcedures = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await proceduresService.getProcedures(params);
      setProcedures(response.data);
      setTotalPages(response.totalPages);
      setTotalObjects(response.total);
    } catch (error) {
      console.error('Erro ao carregar procedimentos:', error);
      setError('Erro ao carregar procedimentos.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setParams(prev => ({ ...prev, q: value, page: 1 }));
  };

  const handleStatusFilter = (status: string) => {
    setParams(prev => ({ ...prev, status: status as 'draft' | 'active' | 'completed' | 'cancelled' | '', page: 1 }));
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

  const handleToggleStatus = async (procedure: Procedure) => {
    try {
      await proceduresService.toggleProcedureStatus(procedure.id);
      loadProcedures();
    } catch (error) {
      console.error('Erro ao alterar status do procedimento:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', text: 'Rascunho', icon: FileText },
      active: { color: 'bg-blue-100 text-blue-800', text: 'Ativo', icon: PlayCircle },
      completed: { color: 'bg-green-100 text-green-800', text: 'Concluído', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelado', icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const getProgressBadge = (procedure: Procedure) => {
    const total = procedure.tasks_count || 0;
    const completed = procedure.completed_tasks_count || 0;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return (
      <div className="flex items-center gap-2">
        <div className="w-16 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="text-xs text-gray-600">{completed}/{total}</span>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Procedimentos</h1>
            <p className="text-gray-600">Gerencie procedimentos do sistema</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/ordoc-flow/procedures/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Procedimento
          </button>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar procedimentos..."
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
                  <option value="draft">Rascunho</option>
                  <option value="active">Ativo</option>
                  <option value="completed">Concluído</option>
                  <option value="cancelled">Cancelado</option>
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
            <p className="mt-2 text-gray-600">Carregando procedimentos...</p>
          </div>
        ) : error ? (
          <ErrorState message="Erro ao conectar com o servidor" />
        ) : procedures.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="Nenhum procedimento configurado"
            description="Configure procedimentos para automatizar seus workflows"
            actionButton={{ text: 'Criar Procedimento', onClick: () => router.push('/dashboard/ordoc-flow/procedures/new') }}
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
                      Descrição
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progresso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requerente
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('created_at')}
                    >
                      Criado em
                      {params.order === 'created_at' && (
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
                  {procedures.map((procedure) => (
                    <tr key={procedure.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{procedure.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {procedure.description || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(procedure.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getProgressBadge(procedure)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">Requerente #{procedure.requester_id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(procedure.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="relative">
                          <button
                            onClick={() => setShowActions(showActions === procedure.id ? null : procedure.id)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {showActions === procedure.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                              <button
                                onClick={() => {
                                  router.push(`/dashboard/ordoc-flow/procedures/${procedure.id}`);
                                  setShowActions(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                Visualizar
                              </button>
                              <button
                                onClick={() => {
                                  router.push(`/dashboard/ordoc-flow/procedures/${procedure.id}/edit`);
                                  setShowActions(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <Edit className="w-4 h-4" />
                                Editar
                              </button>
                              <button
                                onClick={() => {
                                  router.push(`/dashboard/ordoc-flow/procedures/${procedure.id}/tasks`);
                                  setShowActions(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <CheckSquare className="w-4 h-4" />
                                Ver Tarefas
                              </button>
                              <button
                                onClick={() => {
                                  handleToggleStatus(procedure);
                                  setShowActions(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <Clock className="w-4 h-4" />
                                Alterar Status
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedProcedure(procedure);
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
                  Mostrando {((params.page - 1) * params.perPage) + 1} a {Math.min(params.page * params.perPage, totalObjects)} de {totalObjects} procedimentos
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

export default ProceduresPage;
