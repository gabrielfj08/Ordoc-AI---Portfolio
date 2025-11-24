'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { DocumentChartBarIcon } from '@heroicons/react/24/outline';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { reportsService } from '@/services/reports';
import ReportBuilder from '@/components/ordoc-reports/ReportBuilder';

export default function EditTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;

  const { data: template, isLoading, error } = useQuery({
    queryKey: ['report-template', templateId],
    queryFn: () => reportsService.getTemplate(templateId),
    enabled: !!templateId,
  });

  const handleSave = async (templateData: any) => {
    try {
      await reportsService.updateTemplate(templateId, templateData);
      router.push('/dashboard/ordoc-reports/templates');
    } catch (error) {
      console.error('Erro ao atualizar template:', error);
      alert('Erro ao atualizar template. Tente novamente.');
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/ordoc-reports/templates');
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Carregando template...</span>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !template) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <DocumentChartBarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Template não encontrado</h3>
            <p className="text-gray-600 mb-4">O template solicitado não existe ou você não tem permissão para editá-lo.</p>
            <Link
              href="/dashboard/ordoc-reports/templates"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Voltar aos Templates
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard/ordoc-reports/templates" className="text-gray-500 hover:text-gray-700">
                  ← Voltar
                </Link>
                <div className="h-6 w-px bg-gray-300" />
                <DocumentChartBarIcon className="h-5 w-5 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Editar Template: {template.name}</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ReportBuilder 
            initialData={template}
            onSave={handleSave} 
            onCancel={handleCancel}
            isEditing={true}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
