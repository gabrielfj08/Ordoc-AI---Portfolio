'use client';

import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { FilterReportsParams } from '@/types/ordoc-reports';

interface ReportsFilterProps {
  filters?: FilterReportsParams;
  onFiltersChange: (filters: FilterReportsParams) => void;
  loading?: boolean;
}

export default function ReportsFilter({ filters: externalFilters = {}, onFiltersChange, loading = false }: ReportsFilterProps) {
  const [filters, setFilters] = useState<FilterReportsParams>(externalFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof FilterReportsParams, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterReportsParams = { page: 1, page_size: 20 };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {showAdvanced ? 'Ocultar filtros avançados' : 'Mostrar filtros avançados'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Nome do relatório..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os status</option>
            <option value="pending">Pendente</option>
            <option value="processing">Processando</option>
            <option value="completed">Concluído</option>
            <option value="failed">Falhou</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Formato
          </label>
          <select
            value={filters.format || ''}
            onChange={(e) => handleFilterChange('format', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os formatos</option>
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
          </select>
        </div>
      </div>

      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template ID
              </label>
              <input
                type="text"
                placeholder="ID do template..."
                value={filters.template_id || ''}
                onChange={(e) => handleFilterChange('template_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de início
              </label>
              <input
                type="date"
                value={filters.created_after || ''}
                onChange={(e) => handleFilterChange('created_after', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de fim
              </label>
              <input
                type="date"
                value={filters.created_before || ''}
                onChange={(e) => handleFilterChange('created_before', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Limpar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
