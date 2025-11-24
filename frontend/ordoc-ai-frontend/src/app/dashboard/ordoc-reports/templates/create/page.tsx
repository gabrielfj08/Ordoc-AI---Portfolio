'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DocumentChartBarIcon } from '@heroicons/react/24/outline';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { reportsService } from '@/services/reports';
import ReportBuilder from '@/components/ordoc-reports/ReportBuilder';

export default function CreateTemplatePage() {
  const router = useRouter();

  const handleSave = async (template: any) => {
    try {
      const savedTemplate = await reportsService.createTemplate(template);
      router.push(`/dashboard/ordoc-reports/templates/${savedTemplate.id}`);
    } catch (error) {
      console.error('Erro ao salvar template:', error);
      alert('Erro ao salvar template. Tente novamente.');
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/ordoc-reports/templates');
  };

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
                <h1 className="text-xl font-bold text-gray-900">Criar Template</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ReportBuilder onSave={handleSave} onCancel={handleCancel} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
