'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { DocumentChartBarIcon } from '@heroicons/react/24/outline';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { reportsService } from '@/services/reports';
import CreateReportForm from '@/components/ordoc-reports/CreateReportForm';

export default function CreateReportPage() {
  const router = useRouter();
  const { data: templates = [], isLoading, error } = useQuery({
    queryKey: ['report-templates'],
    queryFn: () => reportsService.getTemplates(),
  });

  const handleReportGenerated = (reportId: string) => {
    router.push(`/dashboard/ordoc-reports/reports/${reportId}`);
  };

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
                <DocumentChartBarIcon className="h-5 w-5 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Novo Relatório</h1>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Carregando templates...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">
                <DocumentChartBarIcon className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar templates</h3>
              <p className="text-gray-600 mb-4">Não foi possível carregar os templates de relatórios.</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Tentar novamente
              </button>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-12">
              <DocumentChartBarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum template disponível</h3>
              <p className="text-gray-600 mb-4">Crie um template primeiro para gerar relatórios.</p>
              <Link
                href="/dashboard/ordoc-reports/templates/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Criar Template
              </Link>
            </div>
          ) : (
            <CreateReportForm 
              templates={templates} 
              onReportGenerated={handleReportGenerated}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
