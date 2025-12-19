'use client';

import React, { useState, useEffect } from 'react';

export interface ReportsFilters {
  search: string;
  status: string;
  format: string;
  dateRange: string;
  customDateFrom: string;
  customDateTo: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface ReportsFiltersProps {
  filters: ReportsFilters;
  onFiltersChange: (filters: ReportsFilters) => void;
  onClearFilters: () => void;
  totalCount?: number;
  filteredCount?: number;
}

const STATUS_OPTIONS = [
  { value: '', label: 'Todos os Status' },
  { value: 'pending', label: 'Pendente' },
  { value: 'processing', label: 'Processando' },
  { value: 'completed', label: 'Concluído' },
  { value: 'failed', label: 'Falhou' },
];

const FORMAT_OPTIONS = [
  { value: '', label: 'Todos os Formatos' },
  { value: 'pdf', label: 'PDF' },
  { value: 'xlsx', label: 'Excel' },
  { value: 'csv', label: 'CSV' },
  { value: 'html', label: 'HTML' },
];

const DATE_RANGE_OPTIONS = [
  { value: '', label: 'Todas as Datas' },
  { value: 'today', label: 'Hoje' },
  { value: 'week', label: 'Última Semana' },
  { value: 'month', label: 'Último Mês' },
  { value: 'quarter', label: 'Último Trimestre' },
  { value: 'custom', label: 'Período Personalizado' },
];

const SORT_OPTIONS = [
  { value: 'created_at', label: 'Data de Criação' },
  { value: 'title', label: 'Título' },
  { value: 'status', label: 'Status' },
  { value: 'format', label: 'Formato' },
  { value: 'file_size', label: 'Tamanho' },
];

export default function ReportsFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  totalCount = 0,
  filteredCount = 0,
}: ReportsFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  // Sincronizar com filtros externos
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof ReportsFilters, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    
    // Se mudou o range de data, limpar datas customizadas
    if (key === 'dateRange' && value !== 'custom') {
      newFilters.customDateFrom = '';
      newFilters.customDateTo = '';
    }
    
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: ReportsFilters = {
      search: '',
      status: '',
      format: '',
      dateRange: '',
      customDateFrom: '',
      customDateTo: '',
      sortBy: 'created_at',
      sortOrder: 'desc',
    };
    setLocalFilters(clearedFilters);
    onClearFilters();
  };

  const hasActiveFilters = () => {
    return (
      localFilters.search ||
      localFilters.status ||
      localFilters.format ||
      localFilters.dateRange ||
      localFilters.customDateFrom ||
      localFilters.customDateTo
    );
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.search) count++;
    if (localFilters.status) count++;
    if (localFilters.format) count++;
    if (localFilters.dateRange) count++;
    return count;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-6">
      {/* Header com busca e toggle */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between gap-4">
          {/* Busca */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar por título ou descrição..."
                value={localFilters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Controles */}
          <div className="flex items-center space-x-3">
            {/* Contador de resultados */}
            {totalCount > 0 && (
              <div className="text-sm text-gray-600">
                {filteredCount !== totalCount ? (
                  <span>
                    <span className="font-medium">{filteredCount}</span> de{' '}
                    <span className="font-medium">{totalCount}</span> relatórios
                  </span>
                ) : (
                  <span>
                    <span className="font-medium">{totalCount}</span> relatório{totalCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            )}

            {/* Botão de limpar filtros */}
            {hasActiveFilters() && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Limpar filtros
              </button>
            )}

            {/* Toggle filtros avançados */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              <svg
                className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span>Filtros</span>
              {getActiveFiltersCount() > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filtros expandidos */}
      {isExpanded && (
        <div className="p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={localFilters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Formato */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Formato</label>
              <select
                value={localFilters.format}
                onChange={(e) => handleFilterChange('format', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                {FORMAT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Período */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
              <select
                value={localFilters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                {DATE_RANGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Ordenação */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
              <div className="flex space-x-2">
                <select
                  value={localFilters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleFilterChange('sortOrder', localFilters.sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  title={`Ordenação ${localFilters.sortOrder === 'asc' ? 'crescente' : 'decrescente'}`}
                >
                  <svg
                    className={`h-4 w-4 transition-transform ${localFilters.sortOrder === 'desc' ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Datas customizadas */}
          {localFilters.dateRange === 'custom' && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data Inicial</label>
                <input
                  type="date"
                  value={localFilters.customDateFrom}
                  onChange={(e) => handleFilterChange('customDateFrom', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data Final</label>
                <input
                  type="date"
                  value={localFilters.customDateTo}
                  onChange={(e) => handleFilterChange('customDateTo', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
