'use client';

import React, { useState } from 'react';
import {
    LayoutDashboard,
    FileBarChart,
    ShieldAlert,
    Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsCharts } from './analytics-charts';
import { ReportsManager } from './reports-manager';
import { GlobalAudit } from './global-audit';

type View = 'dashboard' | 'reports' | 'audit';

export const AnalyticsView = () => {
    const [view, setView] = useState<View>('dashboard');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 space-y-6">
                <Card className="border-border/50 shadow-sm bg-background/50 backdrop-blur sticky top-6">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Analytics</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 space-y-1">
                        <button
                            onClick={() => setView('dashboard')}
                            className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${view === 'dashboard' ? 'bg-orange-50 text-orange-700 font-medium' : 'hover:bg-secondary/80 text-foreground'}`}
                        >
                            <LayoutDashboard className={`w-5 h-5 ${view === 'dashboard' ? 'text-orange-600' : 'text-muted-foreground'}`} />
                            <span className="text-sm">Visão Geral</span>
                        </button>
                        <button
                            onClick={() => setView('reports')}
                            className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${view === 'reports' ? 'bg-orange-50 text-orange-700 font-medium' : 'hover:bg-secondary/80 text-foreground'}`}
                        >
                            <FileBarChart className={`w-5 h-5 ${view === 'reports' ? 'text-orange-600' : 'text-muted-foreground'}`} />
                            <span className="text-sm">Relatórios</span>
                        </button>
                        <button
                            onClick={() => setView('audit')}
                            className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${view === 'audit' ? 'bg-orange-50 text-orange-700 font-medium' : 'hover:bg-secondary/80 text-foreground'}`}
                        >
                            <ShieldAlert className={`w-5 h-5 ${view === 'audit' ? 'text-orange-600' : 'text-muted-foreground'}`} />
                            <span className="text-sm">Auditoria</span>
                        </button>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
                {view === 'dashboard' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold tracking-tight">Painel de Métricas</h2>
                            <span className="text-sm text-muted-foreground">Atualizado agora</span>
                        </div>
                        <AnalyticsCharts />
                    </div>
                )}

                {view === 'reports' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold tracking-tight">Gerador de Relatórios</h2>
                        </div>
                        <ReportsManager />
                    </div>
                )}

                {view === 'audit' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold tracking-tight">Auditoria do Sistema</h2>
                        </div>
                        <GlobalAudit />
                    </div>
                )}
            </div>
        </div>
    );
};
