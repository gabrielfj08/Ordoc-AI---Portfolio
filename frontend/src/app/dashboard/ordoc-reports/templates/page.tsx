'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { PlusIcon, DocumentChartBarIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { reportsService } from '@/services/reports';
import { ReportTemplate } from '@/types/ordoc-reports';

export default function TemplatesPage() {
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const { data: templates = [], isLoading, error, refetch } = useQuery({
    queryKey: ['report-templates'],
    queryFn: () => reportsService.getTemplates(),
  });

  const handleDelete = async (templateId: string) => {
    if (!confirm('Tem certeza que deseja excluir este template?')) {
      return;
    }

    setDeleteLoading(templateId);
    try {
      await reportsService.deleteTemplate(templateId);
      refetch();
    } catch (error) {
      console.error('Erro ao excluir template:', error);
      alert('Erro ao excluir template. Tente novamente.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Ativo
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Inativo
      </span>
    );
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
                <h1 className="text-xl font-bold text-gray-900">Templates de Relatórios</h1>
              </div>
              <Link
                href="/dashboard/ordoc-reports/templates/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Novo Template
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                onClick={() => refetch()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Tentar novamente
              </button>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-12">
              <DocumentChartBarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum template criado</h3>
              <p className="text-gray-600 mb-4">Crie seu primeiro template para começar a gerar relatórios personalizados.</p>
              <Link
                href="/dashboard/ordoc-reports/templates/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Criar Primeiro Template
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template: ReportTemplate) => (
                <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {template.category || 'Geral'}
                          </span>
                          {getStatusBadge(template.isActive)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        {template.fields?.length || 0} campos • {template.charts?.length || 0} gráficos
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/dashboard/ordoc-reports/templates/${template.id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Editar"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(template.id)}
                          disabled={deleteLoading === template.id}
                          className="p-2 text-gray-400 hover:text-red-600 disabled:opacity-50 transition-colors"
                          title="Excluir"
                        >
                          {deleteLoading === template.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <TrashIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-6 py-3">
                    <Link
                      href={`/dashboard/ordoc-reports/create?template=${template.id}`}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Usar este template →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
