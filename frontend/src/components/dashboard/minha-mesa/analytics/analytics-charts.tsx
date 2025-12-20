'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    BarChart3,
    TrendingUp,
    Users,
    FileText,
    AlertCircle,
    CheckCircle2,
    Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock Data
const stats = [
    { title: 'Total de Documentos', value: '1,248', change: '+12%', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Usuários Ativos', value: '86', change: '+4%', icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Relatórios Gerados', value: '342', change: '+24%', icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Armazenamento', value: '45 GB', change: '65% Uso', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
];

export const AnalyticsCharts = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-border/50 shadow-sm">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                                <p className="text-xs text-green-600 font-medium mt-1 flex items-center">
                                    {stat.change.includes('+') ? <TrendingUp className="w-3 h-3 mr-1" /> : null}
                                    {stat.change}
                                </p>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Charts Area (Placeholder for actual chart lib) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-2 border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle>Atividade Semanal</CardTitle>
                        <CardDescription>Volume de documentos processados nos últimos 7 dias.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-end justify-between px-10 pb-4 gap-4">
                        {/* Mock Bars */}
                        {[65, 40, 75, 55, 80, 95, 60].map((h, i) => (
                            <div key={i} className="w-full bg-secondary/50 rounded-t-lg relative group transition-all hover:bg-orange-100 cursor-pointer" style={{ height: `${h}%` }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
                                    {h} docs
                                </div>
                                <div className={`w-full absolute bottom-0 bg-primary/80 rounded-t-lg transition-all duration-700`} style={{ height: `${h}%` }}></div>
                            </div>
                        ))}
                    </CardContent>
                    <div className="flex justify-between px-10 pb-6 text-xs text-muted-foreground uppercase font-medium">
                        <span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span><span>Dom</span>
                    </div>
                </Card>

                <Card className="col-span-1 border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle>Status do Sistema</CardTitle>
                        <CardDescription>Saúde dos serviços.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span className="text-sm font-medium">API Core</span>
                            </div>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Operacional</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span className="text-sm font-medium">Database</span>
                            </div>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Operacional</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-yellow-500" />
                                <span className="text-sm font-medium">Storage</span>
                            </div>
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">85% Cheio</span>
                        </div>
                        <div className="pt-6 mt-6 border-t border-border">
                            <Button variant="outline" className="w-full">Ver Status Completo</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
