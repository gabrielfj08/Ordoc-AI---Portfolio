'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Filter,
  Users,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import { requestersService } from '@/services/ordoc-flow/requesters';
import { Requester, FilterRequestersParams } from '@/types/ordoc-flow';
import ErrorState from '@/components/ui/ErrorState';

const RequestersPage = () => {
  const router = useRouter();
  const [requesters, setRequesters] = useState<Requester[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalObjects, setTotalObjects] = useState(0);
  
  const [params, setParams] = useState<FilterRequestersParams>({
    direction: 'asc',
    order: 'name',
    page: 1,
    perPage: 20,
    q: '',
    status: '',
    type: '',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedRequester, setSelectedRequester] = useState<Requester | null>(null);
  const [showActions, setShowActions] = useState<number | null>(null);

  useEffect(() => {
    loadRequesters();
  }, [params]);

  const loadRequesters = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await requestersService.getRequesters(params);
      setRequesters(response.data);
      setTotalPages(response.totalPages);
      setTotalObjects(response.total);
    } catch (error) {
      console.error('Erro ao carregar requerentes:', error);
      setError('Erro ao carregar requerentes.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setParams(prev => ({ ...prev, q: value, page: 1 }));
  };

  const handleStatusFilter = (status: string) => {
    setParams(prev => ({ ...prev, status: status as 'active' | 'inactive' | '', page: 1 }));
  };

  const handleTypeFilter = (type: string) => {
    setParams(prev => ({ ...prev, type: type as 'internal' | 'external' | '', page: 1 }));
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

  const handleToggleStatus = async (requester: Requester) => {
    try {
      await requestersService.toggleRequesterStatus(requester.id);
      loadRequesters();
    } catch (error) {
      console.error('Erro ao alterar status do requerente:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Ativo
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Inativo
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    return type === 'internal' ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Interno
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
        Externo
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Requerentes</h1>
            <p className="text-gray-600">Gerencie requerentes do sistema</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/ordoc-flow/requesters/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Requerente
          </button>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar requerentes..."
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
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={params.type}
                  onChange={(e) => handleTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos</option>
                  <option value="internal">Interno</option>
                  <option value="external">Externo</option>
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
            <p className="mt-2 text-gray-600">Carregando requerentes...</p>
          </div>
        ) : error ? (
          <ErrorState message="Erro ao conectar com o servidor" />
        ) : requesters.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Nenhum requerente configurado"
            description="Configure requerentes para automatizar seus workflows"
            actionButton={{ text: 'Criar Requerente', onClick: () => router.push('/dashboard/ordoc-flow/requesters/new') }}
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
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Documento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telefone
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('type')}
                    >
                      Tipo
                      {params.order === 'type' && (
                        <span className="ml-1">
                          {params.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
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
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requesters.map((requester) => (
                    <tr key={requester.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{requester.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{requester.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{requester.document}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{requester.phone || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getTypeBadge(requester.type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(requester.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="relative">
                          <button
                            onClick={() => setShowActions(showActions === requester.id ? null : requester.id)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {showActions === requester.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                              <button
                                onClick={() => {
                                  router.push(`/dashboard/ordoc-flow/requesters/${requester.id}`);
                                  setShowActions(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                Visualizar
                              </button>
                              <button
                                onClick={() => {
                                  router.push(`/dashboard/ordoc-flow/requesters/${requester.id}/edit`);
                                  setShowActions(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <Edit className="w-4 h-4" />
                                Editar
                              </button>
                              <button
                                onClick={() => {
                                  handleToggleStatus(requester);
                                  setShowActions(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              >
                                {requester.status === 'active' ? (
                                  <>
                                    <ToggleLeft className="w-4 h-4" />
                                    Desativar
                                  </>
                                ) : (
                                  <>
                                    <ToggleRight className="w-4 h-4" />
                                    Ativar
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedRequester(requester);
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
                  Mostrando {((params.page - 1) * params.perPage) + 1} a {Math.min(params.page * params.perPage, totalObjects)} de {totalObjects} requerentes
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

export default RequestersPage;
