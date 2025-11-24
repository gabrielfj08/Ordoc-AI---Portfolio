'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ClockIcon } from '@heroicons/react/24/outline';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { reportsService } from '@/services/reports';
import ScheduleModal from '@/components/ordoc-reports/ScheduleModal';

export default function CreateSchedulePage() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(true);

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['report-templates'],
    queryFn: () => reportsService.getTemplates(),
  });

  const handleScheduleCreated = (schedule: any) => {
    router.push('/dashboard/ordoc-reports/schedules');
  };

  const handleClose = () => {
    router.push('/dashboard/ordoc-reports/schedules');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard/ordoc-reports/schedules" className="text-gray-500 hover:text-gray-700">
                  ← Voltar
                </Link>
                <div className="h-6 w-px bg-gray-300" />
                <ClockIcon className="h-5 w-5 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Novo Agendamento</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Carregando templates...</span>
            </div>
          ) : (
            <div className="text-center py-12">
              <ClockIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Criar Agendamento de Relatório</h3>
              <p className="text-gray-600 mb-4">Configure quando e como seus relatórios devem ser gerados automaticamente.</p>
            </div>
          )}
        </div>

        <ScheduleModal
          isOpen={modalOpen}
          onClose={handleClose}
          templates={templates}
          onScheduleCreated={handleScheduleCreated}
        />
      </div>
    </ProtectedRoute>
  );
}
