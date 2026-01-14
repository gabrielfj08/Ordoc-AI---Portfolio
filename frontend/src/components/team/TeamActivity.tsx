"use client";

import { Activity, TrendingUp, FileCheck, Users } from "lucide-react";

export const TeamActivity = () => {
    const activityData = [
        { department: "Logística", action: "Validou canhotos via IA", count: 450, trend: "+12%", color: "bg-blue-500" },
        { department: "Jurídico", action: "Revisou contratos", count: 23, trend: "+5%", color: "bg-purple-500" },
        { department: "Financeiro", action: "Processou notas fiscais", count: 187, trend: "+8%", color: "bg-green-500" },
        { department: "RH", action: "Admissões processadas", count: 12, trend: "+2%", color: "bg-orange-500" },
    ];

    return (
        <div className="bg-background rounded-[40px] border border-border p-6">
            <div className="mb-6">
                <h3 className="text-lg font-black text-foreground">Atividade do Time</h3>
                <p className="text-xs text-muted-foreground">Heatmap de produtividade por departamento (últimas 24h).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activityData.map((dept, idx) => (
                    <div key={idx} className="p-4 bg-muted rounded-2xl border border-border">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 ${dept.color} rounded-xl`}>
                                    <Activity size={18} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-foreground">{dept.department}</p>
                                    <p className="text-xs text-muted-foreground">{dept.action}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
                                <TrendingUp size={12} />
                                {dept.trend}
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-foreground">{dept.count}</span>
                            <span className="text-xs text-muted-foreground">ações</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-2xl">
                <div className="flex items-center gap-3">
                    <FileCheck size={20} className="text-orange-600" />
                    <div className="flex-1">
                        <p className="text-sm font-bold text-foreground">Total de Documentos Processados Hoje</p>
                        <p className="text-xs text-muted-foreground">Todos os departamentos combinados</p>
                    </div>
                    <span className="text-2xl font-black text-orange-600">672</span>
                </div>
            </div>
        </div>
    );
};
