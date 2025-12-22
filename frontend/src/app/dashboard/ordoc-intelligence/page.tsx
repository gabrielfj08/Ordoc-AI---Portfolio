'use client';

/**
 * Intelligence Dashboard - Central de Inteligência Artificial
 *
 * Visualiza alertas, insights, padrões aprendidos e analytics da IA
 */

import React, { useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Brain, TrendingUp, Bell, Settings, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AlertsMetrics } from '@/components/intelligence/AlertsMetrics';
import { InsightsPanel } from '@/components/intelligence/InsightsPanel';
import { PatternsView } from '@/components/intelligence/PatternsView';
import { AlertPanel } from '@/components/ui/AlertPanel';
import { useIntelligence } from '@/hooks/useIntelligence';

type TabType = 'overview' | 'alerts' | 'patterns' | 'insights';

export default function IntelligenceDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const { alerts, loadAlerts, acceptAlert, rejectAlert, analyzing } = useIntelligence();

  // Carregar alertas ao montar o componente
  React.useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  const handleAcceptAll = async () => {
    const pendingAlerts = alerts.filter(a => a.user_response === 'pending');
    for (const alert of pendingAlerts) {
      await acceptAlert(alert);
    }
    await loadAlerts();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  ← Voltar
                </Link>
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
                <Brain className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Central de Inteligência</h1>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Settings className="h-4 w-4" />
                Configurações
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 mt-2 border-b border-gray-200 dark:border-gray-700">
              <TabButton
                active={activeTab === 'overview'}
                onClick={() => setActiveTab('overview')}
                icon={Activity}
              >
                Visão Geral
              </TabButton>
              <TabButton
                active={activeTab === 'alerts'}
                onClick={() => setActiveTab('alerts')}
                icon={Bell}
              >
                Alertas
              </TabButton>
              <TabButton
                active={activeTab === 'patterns'}
                onClick={() => setActiveTab('patterns')}
                icon={Brain}
              >
                Padrões
              </TabButton>
              <TabButton
                active={activeTab === 'insights'}
                onClick={() => setActiveTab('insights')}
                icon={TrendingUp}
              >
                Insights
              </TabButton>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Métricas */}
              <section>
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Métricas em Tempo Real</h2>
                <AlertsMetrics />
              </section>

              {/* Insights + Alertas Recentes */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <InsightsPanel />
                <AlertPanel
                  alerts={alerts.slice(0, 5)}
                  loading={analyzing}
                  onAccept={acceptAlert}
                  onReject={rejectAlert}
                  className="max-h-[500px]"
                />
              </section>

              {/* Descrição do sistema */}
              <section className="rounded-lg border bg-card p-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Sobre a Inteligência da Plataforma
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  O sistema de Inteligência Artificial da Ordoc-AI monitora continuamente toda a plataforma,
                  gerando insights proativos, detectando padrões e alertando sobre compliance e segurança.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-1">Análise Automática</h4>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Documentos analisados automaticamente no upload com extração de entidades e classificação
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-700 dark:text-green-300 mb-1">Aprendizado Contínuo</h4>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      Sistema aprende com suas ações e feedback, criando padrões hierárquicos
                    </p>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                    <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-1">Alertas Proativos</h4>
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      Compliance, segurança e problemas detectados automaticamente antes de se tornarem críticos
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'alerts' && (
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Todos os Alertas</h2>
                <p className="text-sm text-muted-foreground">
                  Visualize e gerencie todos os alertas gerados pela IA
                </p>
              </div>
              <AlertPanel
                alerts={alerts}
                loading={analyzing}
                onAccept={acceptAlert}
                onReject={rejectAlert}
                onAcceptAll={handleAcceptAll}
              />
            </section>
          )}

          {activeTab === 'patterns' && (
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Padrões Aprendidos</h2>
                <p className="text-sm text-muted-foreground">
                  Padrões identificados pelo sistema de aprendizado hierárquico
                </p>
              </div>
              <PatternsView />
            </section>
          )}

          {activeTab === 'insights' && (
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Insights e Descobertas</h2>
                <p className="text-sm text-muted-foreground">
                  Análises e descobertas geradas automaticamente pela IA
                </p>
              </div>
              <InsightsPanel />
            </section>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  children: React.ReactNode;
}

function TabButton({ active, onClick, icon: Icon, children }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors',
        active
          ? 'border-primary text-primary'
          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
      )}
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  );
}
