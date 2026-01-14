"use client";

import { Timer, AlertCircle } from "lucide-react";

import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";

interface SLATimerProps {
    limitHours: number;
    currentHours: number;
}

export const SLATimer = ({ limitHours, currentHours }: SLATimerProps) => {
    const percent = (currentHours / limitHours) * 100;
    const isUrgent = percent > 75;
    const remaining = limitHours - currentHours;

    // Mock dates for demo
    const startDate = "12/01/2026 10:00";
    const endDate = "14/01/2026 10:00";

    return (
        <TooltipProvider>
            <Tooltip content={
                <div className="text-left space-y-1">
                    <p><span className="text-slate-400">Início:</span> {startDate}</p>
                    <p><span className="text-slate-400">Previsão:</span> {endDate}</p>
                    <p className="font-bold text-orange-400">Restante: {remaining} horas</p>
                </div>
            }>
                <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl border cursor-help ${isUrgent ? 'bg-red-50 border-red-100 text-red-600' : 'bg-slate-50 border-slate-100 text-slate-600'
                    }`}>
                    <Timer size={14} className={isUrgent ? 'animate-pulse' : ''} />
                    <div className="flex-1 min-w-[120px]">
                        <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                            <span>SLA do Milestone</span>
                            <span>{currentHours}h / {limitHours}h</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${isUrgent ? 'bg-red-500' : 'bg-blue-500'}`}
                                style={{ width: `${percent}%` }}
                            />
                        </div>
                    </div>
                    {isUrgent && <AlertCircle size={14} />}
                </div>
            </Tooltip>
        </TooltipProvider>
    );
};