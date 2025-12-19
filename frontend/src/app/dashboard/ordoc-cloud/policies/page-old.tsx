'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface Policy {
  id: string;
  name: string;
  description: string;
  effect: 'Allow' | 'Deny';
  resource: string;
  actions: string[];
  status: 'active' | 'inactive';
  created_at: string;
}

export default function PoliciesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [effectFilter, setEffectFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data - será substituído por chamada à API
  const policies: Policy[] = [
    {
      id: '1',
      name: 'Admin Full Access',
      description: 'Política que concede acesso total aos administradores',
      effect: 'Allow',
      resource: '*',
      actions: ['*'],
      status: 'active',
      created_at: '2025-07-27T09:37:11.749656-03:00'
    },
    {
      id: '2',
      name: 'User Read Only',
      description: 'Política que permite apenas leitura para usuários comuns',
      effect: 'Allow',
      resource: 'documents:*',
      actions: ['read', 'list'],
      status: 'active',
      created_at: '2025-07-26T14:22:33.123456-03:00'
    },
    {
      id: '3',
      name: 'Deny Sensitive Data',
      description: 'Política que nega acesso a dados sensíveis',
      effect: 'Deny',
      resource: 'sensitive:*',
      actions: ['*'],
      status: 'active',
      created_at: '2025-07-25T10:15:22.987654-03:00'
    }
  ];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleEffectFilter = (effect: string) => {
    setEffectFilter(effect);
    setCurrentPage(1);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    if (status === 'active') {
      return `${baseClasses} bg-green-100 text-green-800`;
    }
    return `${baseClasses} bg-red-100 text-red-800`;
  };

  const getStatusText = (status: string) => {
    return status === 'active' ? 'Ativa' : 'Inativa';
  };

  const getEffectBadge = (effect: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    if (effect === 'Allow') {
      return `${baseClasses} bg-blue-100 text-blue-800`;
    }
    return `${baseClasses} bg-red-100 text-red-800`;
  };

  const getEffectText = (effect: string) => {
    return effect === 'Allow' ? 'Permitir' : 'Negar';
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard/ordoc-cloud" className="text-gray-500 hover:text-gray-700">
                  ← Voltar ao OrdocCloud
                </Link>
                <div className="h-6 w-px bg-gray-300"></div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                    <ShieldCheckIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Políticas de Acesso</h1>
                    <p className="text-sm text-gray-500">Definir permissões e controle de acesso</p>
                  </div>
                </div>
              </div>
              <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors">
                <PlusIcon className="w-4 h-4 mr-2" />
                Nova Política
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar políticas..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-80"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <FunnelIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                  <div className="flex space-x-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value=""
                        checked={statusFilter === ''}
                        onChange={(e) => handleStatusFilter(e.target.value)}
                        className="mr-1"
                      />
                      <span className="text-sm">Todas</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="active"
                        checked={statusFilter === 'active'}
                        onChange={(e) => handleStatusFilter(e.target.value)}
                        className="mr-1"
                      />
                      <span className="text-sm">Ativas</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="inactive"
                        checked={statusFilter === 'inactive'}
                        onChange={(e) => handleStatusFilter(e.target.value)}
                        className="mr-1"
                      />
                      <span className="text-sm">Inativas</span>
                    </label>
                  </div>
                </div>

                {/* Effect Filter */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Efeito:</span>
                  <select
                    value={effectFilter}
                    onChange={(e) => handleEffectFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Todos</option>
                    <option value="Allow">Permitir</option>
                    <option value="Deny">Negar</option>
                  </select>
                </div>
              </div>

              {/* Sort */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
                <select
                  value={`${sortBy}-${sortDirection}`}
                  onChange={(e) => {
                    const [field, direction] = e.target.value.split('-');
                    setSortBy(field);
                    setSortDirection(direction as 'asc' | 'desc');
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="name-asc">Nome A-Z</option>
                  <option value="name-desc">Nome Z-A</option>
                  <option value="created_at-desc">Mais recentes</option>
                  <option value="created_at-asc">Mais antigas</option>
                </select>
              </div>
            </div>
          </div>

          {/* Policies Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('name')}
                    >
                      Nome da Política
                      {sortBy === 'name' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Efeito
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recurso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('created_at')}
                    >
                      Data de Criação
                      {sortBy === 'created_at' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gerenciar
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {policies.map((policy) => (
                    <tr key={policy.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{policy.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate" title={policy.description}>
                          {policy.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getEffectBadge(policy.effect)}>
                          {getEffectText(policy.effect)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                          {policy.resource}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {policy.actions.length > 3 ? (
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                              {policy.actions.slice(0, 3).join(', ')} +{policy.actions.length - 3}
                            </span>
                          ) : (
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                              {policy.actions.join(', ')}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(policy.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(policy.status)}>
                          {getStatusText(policy.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/dashboard/ordoc-cloud/policies/${policy.id}`}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            Visualizar
                          </Link>
                          <Link
                            href={`/dashboard/ordoc-cloud/policies/${policy.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Editar
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {policies.length === 0 && (
              <div className="text-center py-12">
                <ShieldCheckIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma política encontrada</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || statusFilter || effectFilter
                    ? 'Tente ajustar os filtros de busca.' 
                    : 'Comece criando sua primeira política de acesso.'}
                </p>
                <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Nova Política
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {policies.length > 0 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg shadow-sm">
              <div className="flex-1 flex justify-between sm:hidden">
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Anterior
                </button>
                <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Próximo
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">1</span> a <span className="font-medium">{policies.length}</span> de{' '}
                    <span className="font-medium">{policies.length}</span> resultados
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      Anterior
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-purple-50 text-sm font-medium text-purple-600">
                      1
                    </button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      Próximo
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
