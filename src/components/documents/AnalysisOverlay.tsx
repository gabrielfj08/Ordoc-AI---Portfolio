"use client";

import { Zap, FileText, Search, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";

interface AnalysisOverlayProps {
    analysis: any;
    isLoading: boolean;
}

export const AnalysisOverlay = ({ analysis, isLoading }: AnalysisOverlayProps) => {
    // Definimos marcadores "fantasma" ou de processamento se ainda não temos dados reais
    // mas mostramos que a IA está ativa
    const alerts = analysis?.council_deliberation?.alerts || [];
    const clauses = analysis?.extraction_result?.clauses || [];

    const hasData = alerts.length > 0 || clauses.length > 0;

    // Se carregando e sem dados, mostramos animações de "escaneamento"
    if (isLoading && !hasData) {
        return (
            <div className="absolute inset-0 pointer-events-none z-30 flex flex-col items-center justify-center">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent animate-scan absolute top-0" />
                <div className="flex flex-col items-center gap-2 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-indigo-100">
                    <Loader2 size={32} className="text-indigo-600 animate-spin" />
                    <span className="text-xs font-bold text-indigo-900 uppercase tracking-widest">IA Escaneando Documento...</span>
                    <span className="text-[10px] text-slate-500">Extraindo insights em tempo real</span>
                </div>

                {/* Marcadores pulsantes de "descoberta" */}
                <div className="absolute top-[30%] left-[20%] w-4 h-4 rounded-full bg-indigo-400 opacity-20 animate-ping" />
                <div className="absolute top-[60%] left-[70%] w-4 h-4 rounded-full bg-orange-400 opacity-20 animate-ping [animation-delay:0.5s]" />
                <div className="absolute top-[15%] left-[60%] w-4 h-4 rounded-full bg-blue-400 opacity-20 animate-ping [animation-delay:1s]" />
            </div>
        );
    }

    if (!hasData) return null;

    // Combine all insights to show markers
    const markers = [
        ...alerts.map((a: any, i: number) => ({ ...a, type: 'alert', color: 'orange', icon: Zap })),
        ...clauses.map((c: any, i: number) => ({ ...c, type: 'clause', color: 'indigo', icon: FileText })),
    ];

    // Distribuição dos marcadores
    const getPosition = (index: number) => {
        const positions = [
            { top: '15%', left: '85%' }, // Top Right
            { top: '25%', left: '10%' }, // Top Left
            { top: '45%', left: '80%' }, // Middle Right
            { top: '65%', left: '15%' }, // Bottom Left
            { top: '80%', left: '85%' }, // Bottom Right
            { top: '10%', left: '20%' }, // Top Center-ish
        ];
        return positions[index % positions.length];
    };

    return (
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
            {markers.map((marker, idx) => {
                const pos = getPosition(idx);
                const Icon = marker.icon;
                const color = marker.color;

                const tooltipContent = (
                    <div className="min-w-[220px] overflow-hidden rounded-xl shadow-2xl border-0">
                        <div className={`p-3 bg-${color === 'orange' ? 'orange-500' : 'indigo-600'} text-white`}>
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em]">{marker.type === 'alert' ? 'ALERTA DE RISCO' : 'CLÁUSULA EXTRAÍDA'}</span>
                                {marker.severity && (
                                    <Badge className="bg-white/30 text-white border-none text-[8px] h-3.5 px-1.5 font-black">
                                        {marker.severity.toUpperCase()}
                                    </Badge>
                                )}
                            </div>
                            <h4 className="text-[12px] font-bold leading-tight">
                                {marker.title || marker.type.replace(/_/g, ' ')}
                            </h4>
                        </div>
                        <div className="bg-white p-3 border-t border-slate-50">
                            <p className="text-[11px] text-slate-600 leading-relaxed font-medium whitespace-normal">
                                {marker.message || marker.content}
                            </p>
                            <div className="mt-2 flex items-center gap-1 text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                                <Search size={10} /> Validado por Ordoc AI
                            </div>
                        </div>
                    </div>
                );

                return (
                    <div
                        key={idx}
                        className="absolute pointer-events-auto transition-all hover:scale-125 hover:z-50"
                        style={{ top: pos.top, left: pos.left }}
                    >
                        <Tooltip content={tooltipContent}>
                            <button className={`
                                group relative flex items-center justify-center
                                w-9 h-9 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.1)] border-2 border-white
                                bg-${color === 'orange' ? 'orange-500' : 'indigo-600'} text-white
                                transition-transform duration-300
                            `}
                                style={{ backgroundColor: color === 'orange' ? '#f97316' : '#4f46e5' }}
                            >
                                <Icon size={18} className="fill-current" />

                                {/* Anel pulsante mais visível */}
                                <span className={`absolute -inset-1 rounded-full animate-ping bg-${color === 'orange' ? 'orange-400' : 'indigo-400'} opacity-30`}
                                    style={{ backgroundColor: color === 'orange' ? '#fb923c' : '#818cf8' }}
                                />
                            </button>
                        </Tooltip>
                    </div>
                );
            })}
        </div>
    );
};
