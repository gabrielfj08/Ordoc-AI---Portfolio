import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { DaySummaryWidget } from '@/components/dashboard/minha-mesa/day-summary';
import { ImpactWidget } from '@/components/dashboard/minha-mesa/impact-widget';
import { PriorityList } from '@/components/dashboard/minha-mesa/priority-list';
import { WorkflowMonitor } from '@/components/dashboard/minha-mesa/workflow-monitor';
import { DocumentsView } from '@/components/dashboard/minha-mesa/documents/documents-view';
import { WorkflowsView } from '@/components/dashboard/minha-mesa/workflows/workflows-view';
import { AnalyticsView } from '@/components/dashboard/minha-mesa/analytics/analytics-view';
import { SettingsView } from '@/components/dashboard/minha-mesa/settings/settings-view';
import { AIAssistant } from '@/components/dashboard/minha-mesa/ai-assistant';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardProps {
  searchParams: Promise<{ view?: string }>;
}

export default async function Dashboard({ searchParams }: DashboardProps) {
  const { view } = await searchParams;
  const activeTab = view || 'home';

  return (
    <ProtectedRoute>
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
            <WorkflowsView />
          )}

          {activeTab === 'signatures' && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Assinaturas</h1>
                <Button>Solicitar Assinatura</Button>
              </div>
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <div className="mx-auto w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <Settings className="text-muted-foreground w-6 h-6" />
                </div>
                <h2 className="text-lg font-semibold mb-1">Central de Assinaturas</h2>
                <p className="text-muted-foreground">Funcionalidade migrada para a aba "Documentos".</p>
                <Button variant="link" className="mt-2 text-primary">Ir para Documentos</Button>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
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
    </ProtectedRoute>
  );
}
