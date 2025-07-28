'use client';

import React, { useEffect, useState } from 'react';
import { reportsService, DashboardMetrics } from '@/services/reports';

export default function DashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await reportsService.getDashboardMetrics();
        setMetrics(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (!metrics) return <p className="text-gray-500">Nenhum dado</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <p className="text-2xl font-bold text-blue-600">{metrics.total_reports}</p>
        <p className="text-sm text-gray-500">Total de Relatórios</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <p className="text-2xl font-bold text-green-600">{metrics.reports_this_month}</p>
        <p className="text-sm text-gray-500">Este Mês</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <p className="text-2xl font-bold text-purple-600">{metrics.active_templates}</p>
        <p className="text-sm text-gray-500">Templates Ativos</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <p className="text-2xl font-bold text-yellow-600">{metrics.active_schedules}</p>
        <p className="text-sm text-gray-500">Agendamentos Ativos</p>
      </div>
    </div>
  );
}
