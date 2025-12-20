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
  UserPlus,
  UserMinus
} from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import { groupsService } from '@/services/ordoc-flow/groups';
import { Group, FilterGroupsParams } from '@/types/ordoc-flow';
import ErrorState from '@/components/ui/ErrorState';

const GroupsPage = () => {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalObjects, setTotalObjects] = useState(0);

  const [params, setParams] = useState<FilterGroupsParams>({
    direction: 'asc',
    order: 'name',
    page: 1,
    perPage: 20,
    q: '',
    status: '',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showActions, setShowActions] = useState<number | null>(null);

  useEffect(() => {
    loadGroups();
  }, [params]);

  const loadGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await groupsService.getGroups(params);
      setGroups(response.data);
      setTotalPages(response.totalPages);
      setTotalObjects(response.total);
    } catch (error) {
      console.error('Erro ao carregar grupos:', error);
      setError('Erro ao carregar grupos.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams({ ...params, q: e.target.value, page: 1 });
  };

  const handleStatusFilter = (status: 'active' | 'inactive' | '') => {
    setParams({ ...params, status, page: 1 });
    setShowFilters(false);
  };

  const handleSort = (order: string) => {
    const direction = params.order === order && params.direction === 'asc' ? 'desc' : 'asc';
    setParams({ ...params, order, direction, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setParams({ ...params, page });
  };

  const handleToggleStatus = async (group: Group) => {
    const newStatus = group.status === 'active' ? 'inactive' : 'active';
    const response = await groupsService.toggleGroupStatus(group.id, newStatus);

    if (response.success) {
      loadGroups();
      setShowActions(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    if (status === 'active') {
      return `${baseClasses} bg-green-100 text-green-800`;
    }
    return `${baseClasses} bg-red-100 text-red-800`;
  };

  const getStatusText = (status: string) => {
    return status === 'active' ? 'Ativo' : 'Inativo';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Grupos</h1>
            <p className="text-gray-600">Gerencie grupos de usuários e permissões</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/ordoc-flow/groups/management/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Grupo
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar grupos..."
              value={params.q}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filtros
              {params.status && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  1
                </span>
              )}
            </button>

            {showFilters && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-2">
                  <p className="text-sm font-medium text-gray-700 mb-2">Status</p>
                  <button
                    onClick={() => handleStatusFilter('')}
                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${params.status === '' ? 'bg-blue-50 text-blue-700' : ''
                      }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => handleStatusFilter('active')}
                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${params.status === 'active' ? 'bg-blue-50 text-blue-700' : ''
                      }`}
                  >
                    Ativos
                  </button>
                  <button
                    onClick={() => handleStatusFilter('inactive')}
                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${params.status === 'inactive' ? 'bg-blue-50 text-blue-700' : ''
                      }`}
                  >
                    Inativos
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  onClick={() => handleSort('name')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
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
                  onClick={() => handleSort('status')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Status
                  {params.order === 'status' && (
                    <span className="ml-1">
                      {params.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Procedimentos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requerentes
                </th>
                <th
                  onClick={() => handleSort('created_at')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
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
              {loading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12">
                    <ErrorState message="Erro ao conectar com o servidor" />
                  </td>
                </tr>
              ) : groups.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12">
                    <EmptyState
                      icon={Users}
                      title="Nenhum grupo configurado"
                      description="Configure grupos para automatizar seus workflows"
                      actionButton={{ text: 'Criar Grupo', onClick: () => router.push('/dashboard/ordoc-flow/groups/management/new') }}
                    />
                  </td>
                </tr>
              ) : (
                groups.map((group) => (
                  <tr key={group.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{group.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {group.description || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(group.status)}>
                        {getStatusText(group.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {group.procedures_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {group.requesters_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(group.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button
                          onClick={() => setShowActions(showActions === group.id ? null : group.id)}
                          className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {showActions === group.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <button
                              onClick={() => {
                                router.push(`/dashboard/ordoc-flow/groups/management/${group.id}`);
                                setShowActions(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              Visualizar
                            </button>
                            <button
                              onClick={() => {
                                router.push(`/dashboard/ordoc-flow/groups/management/${group.id}/edit`);
                                setShowActions(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Editar
                            </button>
                            <button
                              onClick={() => handleToggleStatus(group)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              {group.status === 'active' ? (
                                <>
                                  <UserMinus className="w-4 h-4" />
                                  Desativar
                                </>
                              ) : (
                                <>
                                  <UserPlus className="w-4 h-4" />
                                  Ativar
                                </>
                              )}
                            </button>
                            <hr className="my-1" />
                            <button
                              onClick={() => {
                                // TODO: Implement delete confirmation
                                setShowActions(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Excluir
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(params.page - 1)}
                disabled={params.page <= 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() => handlePageChange(params.page + 1)}
                disabled={params.page >= totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando{' '}
                  <span className="font-medium">
                    {(params.page - 1) * params.perPage + 1}
                  </span>{' '}
                  até{' '}
                  <span className="font-medium">
                    {Math.min(params.page * params.perPage, totalObjects)}
                  </span>{' '}
                  de{' '}
                  <span className="font-medium">{totalObjects}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => handlePageChange(params.page - 1)}
                    disabled={params.page <= 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${params.page === pageNum
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(params.page + 1)}
                    disabled={params.page >= totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próximo
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close actions menu */}
      {showActions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowActions(null)}
        />
      )}

      {/* Click outside to close filters */}
      {showFilters && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowFilters(false)}
        />
      )}
    </div>
  );
};

export default GroupsPage;