"use client";

import React, { useState, useEffect } from "react";
import { Activity, AlertCircle, CheckCircle2, Clock } from "lucide-react";

interface RealtimeEvent {
    id: string;
    type: 'success' | 'warning' | 'error' | 'info';
    message: string;
    timestamp: string;
}

export function RealTimeMonitor() {
    const [events, setEvents] = useState<RealtimeEvent[]>([
        {
            id: '1',
            type: 'success',
            message: 'Processo "Contrato XYZ" concluído com sucesso',
            timestamp: '09:47:00'
        },
        {
            id: '2',
            type: 'warning',
            message: 'SLA do processo "Licitação 042" atingindo 80%',
            timestamp: '09:45:30'
        }
    ]);

    // Simular eventos em tempo real
    useEffect(() => {
        const interval = setInterval(() => {
            const newEvent: RealtimeEvent = {
                id: Date.now().toString(),
                type: ['success', 'warning', 'info'][Math.floor(Math.random() * 3)] as any,
                message: `Novo evento detectado às ${new Date().toLocaleTimeString()}`,
                timestamp: new Date().toLocaleTimeString()
            };

            setEvents(prev => [newEvent, ...prev].slice(0, 10));
        }, 10000); // A cada 10 segundos

        return () => clearInterval(interval);
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle2 size={16} className="text-orange-600" />;
            case 'warning': return <AlertCircle size={16} className="text-orange-600" />;
            case 'error': return <AlertCircle size={16} className="text-red-600" />;
            default: return <Activity size={16} className="text-orange-600" />;
        }
    };

    const getBgColor = (type: string) => {
        switch (type) {
            case 'success': return 'bg-orange-50 border-orange-200';
            case 'warning': return 'bg-orange-50 border-orange-200';
            case 'error': return 'bg-red-50 border-red-200';
            default: return 'bg-orange-50 border-orange-200';
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Activity size={20} className="text-orange-600" />
                    Monitor em Tempo Real
                </h3>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-slate-500 font-medium">Conectado</span>
                </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
                {events.map((event) => (
                    <div key={event.id} className={`p-3 rounded-lg border ${getBgColor(event.type)} transition-all`}>
                        <div className="flex items-start gap-3">
                            {getIcon(event.type)}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-slate-800 font-medium">{event.message}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Clock size={12} className="text-slate-400" />
                                    <span className="text-xs text-slate-500">{event.timestamp}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
