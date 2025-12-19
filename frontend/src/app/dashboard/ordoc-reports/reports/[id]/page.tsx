'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeftIcon, DocumentArrowDownIcon, EyeIcon, ClockIcon } from '@heroicons/react/24/outline';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { reportsService } from '@/services/reports';
import { Report } from '@/types/ordoc-reports';
import ReportViewer from '@/components/ordoc-reports/ReportViewer';

export default function ReportDetailPage() {
  const params = useParams();
  const reportId = params.id as string;

  const { data: report, isLoading, error } = useQuery<Report>({
    queryKey: ['report', reportId],
    queryFn: () => reportsService.getReport(reportId),
    enabled: !!reportId,
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard/ordoc-reports/reports" className="text-gray-500 hover:text-gray-700">
                  ← Voltar aos Relatórios
                </Link>
                <div className="h-6 w-px bg-gray-300" />
                <h1 className="text-xl font-bold text-gray-900">
                  {report ? report.title : 'Carregando...'}
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Carregando relatório...</span>
            </div>
          ) : error || !report ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">
                <EyeIcon className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Relatório não encontrado</h3>
              <p className="text-gray-600 mb-4">O relatório solicitado não existe ou você não tem permissão para acessá-lo.</p>
              <Link
                href="/dashboard/ordoc-reports/reports"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Voltar aos Relatórios
              </Link>
            </div>
          ) : (
            <ReportViewer report={report} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
