'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { reportsService } from '@/services/reports';
import ReportsList from '@/components/ordoc-reports/ReportsList';
import ReportsFilter from '@/components/ordoc-reports/ReportsFilter';
import { FilterReportsParams } from '@/types/ordoc-reports';

export default function ReportsListPage() {
  const [filters, setFilters] = useState<FilterReportsParams>({
    page: 1,
    page_size: 20
  });

  const { data: reportsData, isLoading, error, refetch } = useQuery({
    queryKey: ['reports-list', filters],
    queryFn: () => reportsService.getReports(filters),
  });

  const reports = reportsData || [];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard/ordoc-reports" className="text-gray-500 hover:text-gray-700">
                  ← Voltar
                </Link>
                <div className="h-6 w-px bg-gray-300" />
                <h1 className="text-xl font-bold text-gray-900">Relatórios Gerados</h1>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => refetch()}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Atualizar
                </button>
                <Link
                  href="/dashboard/ordoc-reports/create"
                  className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                >
                  Novo Relatório
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ReportsFilter 
            filters={filters} 
            onFiltersChange={setFilters} 
            loading={isLoading} 
          />
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Carregando relatórios...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar relatórios</h3>
              <p className="text-gray-600 mb-4">Não foi possível carregar a lista de relatórios.</p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <ReportsList reports={reports} onRefresh={refetch} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
