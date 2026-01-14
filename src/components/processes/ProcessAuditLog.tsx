"use client";

import { CheckCircle2, Cpu, User, AlertTriangle, Clock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const ProcessAuditLog = () => {
    const [filter, setFilter] = useState<'all' | 'ai' | 'user' | 'system'>('all');
    const logs = [
        { id: 1, type: 'ai', action: 'Triagem Cognitiva concluída', details: 'Metadados extraídos com 98% de confiança.', time: 'Há 2h', icon: Cpu, color: 'text-purple-500', bg: 'bg-purple-50' },
        { id: 2, type: 'system', action: 'Validação de Compliance', details: 'Documento aprovado automaticamente (Regra #42).', time: 'Há 1h', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
        { id: 3, type: 'user', action: 'Intervenção Necessária', details: 'Ricardo Silva solicitou nova Certidão Negativa.', time: 'Há 15min', icon: User, color: 'text-blue-500', bg: 'bg-blue-50' },
        { id: 4, type: 'warning', action: 'SLA em Alerta', details: 'Tempo limite do milestone "Assinatura" atingindo 80%.', time: 'Agora', icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50' },
    ];

    const filteredLogs = filter === 'all' ? logs : logs.filter(l => l.type === filter || (filter === 'system' && l.type === 'warning'));
    return (
        <div className="bg-card rounded-3xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Clock size={14} /> Histórico
                </h3>
                <div className="flex gap-1">
                    <FilterButton active={filter === 'all'} label="Geral" onClick={() => setFilter('all')} />
                    <FilterButton active={filter === 'ai'} label="IA" onClick={() => setFilter('ai')} />
                    <FilterButton active={filter === 'user'} label="Humano" onClick={() => setFilter('user')} />
                </div>
            </div>
            <div className="space-y-6">
                {filteredLogs.map((log) => (
                    <div key={log.id} className="flex gap-4 relative group cursor-pointer hover:bg-muted p-2 -mx-2 rounded-xl transition-colors">
                        {/* Linha conectora */}
                        <div className="absolute left-6 top-10 bottom-[-24px] w-0.5 bg-border group-last:hidden" />
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${log.bg} ${log.color} ring-4 ring-card relative z-10`}>
                            <log.icon size={16} />
                        </div>
                        <div className="flex-1 pb-2">
                            <div className="flex justify-between items-start">
                                <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{log.action}</p>
                                <span className="text-xs text-muted-foreground font-medium">{log.time}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{log.details}</p>
                        </div>
                    </div>
                ))}
            </div>
            <Button variant="ghost" className="w-full mt-6 text-xs font-bold text-muted-foreground hover:text-primary gap-2 border-t border-border pt-4 rounded-none h-auto">
                Ver histórico completo <ArrowRight size={12} />
            </Button>
        </div>
    );
};

const FilterButton = ({ active, label, onClick }: any) => (
    <Button
        variant={active ? "default" : "ghost"}
        size="xs"
        onClick={onClick}
        className="uppercase"
    >
        {label}
    </Button>
);