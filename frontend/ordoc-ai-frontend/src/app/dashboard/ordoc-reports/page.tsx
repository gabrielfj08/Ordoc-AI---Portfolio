'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { reportsService, ReportTemplate } from '@/services/reports';
import TemplateList from '@/components/ordoc-reports/TemplateList';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';

export default function OrdocReportsPage() {
  const [, setShowCreateModal] = useState(false);
  const {
    data: templates = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['report-templates'],
    queryFn: () => reportsService.getTemplates(),
  });
  const isEmpty = !isLoading && !error && templates.length === 0;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                  ← Voltar ao Dashboard
                </Link>
                <div className="h-6 w-px bg-gray-300"></div>
                <h1 className="text-xl font-bold text-gray-900">OrdocReports</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex space-x-4">
            <Link href="/dashboard/ordoc-reports/create" className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm">Novo Relatório</Link>
            <Link href="/dashboard/ordoc-reports/reports" className="px-3 py-2 bg-green-600 text-white rounded-md text-sm">Relatórios Gerados</Link>
            <Link href="/dashboard/ordoc-reports/dashboard" className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-sm">Dashboard</Link>
          </div>
          {isLoading ? (
            <p>Carregando...</p>
          ) : error ? (
            <ErrorState message="Erro ao conectar com o servidor" />
          ) : isEmpty ? (
            <EmptyState
              icon={DocumentTextIcon}
              title="Nenhum template de relatório"
              description="Crie seu primeiro template para começar a gerar relatórios"
              actionButton={{ text: 'Criar Template', onClick: () => setShowCreateModal(true) }}
            />
          ) : (
            <TemplateList templates={templates} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
