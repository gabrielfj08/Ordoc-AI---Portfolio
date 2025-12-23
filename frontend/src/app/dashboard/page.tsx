'use client';

import React, { Suspense, use } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { DaySummaryWidget } from '@/components/dashboard/minha-mesa/day-summary';
import { ImpactWidget } from '@/components/dashboard/minha-mesa/impact-widget';
import { PriorityList } from '@/components/dashboard/minha-mesa/priority-list';
import { WorkflowMonitor } from '@/components/dashboard/minha-mesa/workflow-monitor';
import { DocumentsView } from '@/components/dashboard/minha-mesa/documents/documents-view';
import { WorkflowsView } from '@/components/dashboard/minha-mesa/workflows/workflows-view';
import { SignaturesView } from '@/components/dashboard/minha-mesa/signatures/signatures-view';
import { AnalyticsView } from '@/components/dashboard/minha-mesa/analytics/analytics-view';
import { SettingsView } from '@/components/dashboard/minha-mesa/settings/settings-view';
import { AIAssistant } from '@/components/dashboard/minha-mesa/ai-assistant';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardProps {
  searchParams: Promise<{ view?: string }>;
}

function DashboardContent({ searchParams }: DashboardProps) {
  const { view } = use(searchParams);
  const activeTab = view || 'home';

  return (
    <div className="flex flex-col min-h-screen bg-transparent">

      <main className="flex-1 w-full px-4 py-6 space-y-6">

        {activeTab === 'home' && (
          <>
            {/* Seção Superior: Resumos */}
            <DaySummaryWidget />

            {/* Grid Principal */}
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">

              {/* Coluna Principal: Tarefas e Workflows */}
              <div className="xl:col-span-2 flex flex-col gap-6 h-full">
                <ImpactWidget />
                <PriorityList />

                {/* Monitor de Workflows */}
                <WorkflowMonitor />
              </div>

              {/* Coluna Lateral: Assistente IA e Notificações */}
              <aside className="xl:col-span-1">
                <AIAssistant />
              </aside>

            </section>
          </>
        )}

        {activeTab === 'documents' && (
          <DocumentsView />
        )}

        {activeTab === 'workflows' && (
          <Suspense fallback={<div>Carregando workflows...</div>}>
            <WorkflowsView />
          </Suspense>
        )}

        {activeTab === 'signatures' && (
          <SignaturesView />
        )}

        {activeTab === 'analises' && (
          <AnalyticsView />
        )}

        {['settings', 'profile', 'users', 'groups', 'organizations', 'policies'].includes(activeTab) && (
          <SettingsView
            key={activeTab} // Força remount ao trocar entre tabs
            initialView={(activeTab === 'settings' ? 'users' : activeTab) as any}
          />
        )}

      </main>
    </div>
  );
}

// Create a client instance for this dashboard
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function Dashboard(props: DashboardProps) {
  return (
    <ProtectedRoute>
      <QueryClientProvider client={queryClient}>
        <DashboardContent {...props} />
      </QueryClientProvider>
    </ProtectedRoute>
  );
}
