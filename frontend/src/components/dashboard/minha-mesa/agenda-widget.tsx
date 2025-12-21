'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, BrainCircuit } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

export const AgendaWidget = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Mock events
    const events: Record<string, { title: string; time: string; type: 'meeting' | 'deadline' | 'other' }> = {
        '2025-12-22': { title: 'Reunião de Orçamento', time: '14:00', type: 'meeting' },
        '2025-12-24': { title: 'Recesso Administrativo', time: 'Dia todo', type: 'other' },
        '2025-12-29': { title: 'Entrega Relatório Anual', time: '10:00', type: 'deadline' },
        '2025-12-20': { title: 'Revisão de Metas', time: '16:00', type: 'meeting' } // Hoje
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const { days, firstDay } = getDaysInMonth(currentDate);
    const monthName = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const renderCalendarDays = () => {
        const calendarDays = [];
        const today = new Date();
        const isCurrentMonth = today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();

        // Empty slots for days before first day of month
        for (let i = 0; i < firstDay; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
        }

        // Days of month
        for (let i = 1; i <= days; i++) {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const event = events[dateStr];
            const isToday = isCurrentMonth && i === today.getDate();

            const dayElement = (
                <div
                    key={i}
                    className={`
                        h-8 w-8 flex flex-col items-center justify-center rounded-full text-xs cursor-pointer transition-all relative
                        ${isToday ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-secondary'}
                        ${event ? 'font-semibold text-foreground' : 'text-muted-foreground'}
                    `}
                >
                    {i}
                    {event && !isToday && (
                        <span className={`absolute bottom-1 w-1 h-1 rounded-full ${event.type === 'deadline' ? 'bg-destructive' :
                            event.type === 'meeting' ? 'bg-blue-500' : 'bg-amber-500'
                            }`}></span>
                    )}
                </div>
            );

            if (event) {
                calendarDays.push(
                    <TooltipProvider key={i}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                {dayElement}
                            </TooltipTrigger>
                            <TooltipContent>
                                <div className="text-xs">
                                    <p className="font-semibold">{event.title}</p>
                                    <p className="text-muted-foreground">{event.time}</p>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            } else {
                calendarDays.push(dayElement);
            }
        }
        return calendarDays;
    };

    return (
        <Card className="flex-1 flex flex-col p-5 border-border/60 shadow-sm animate-in fade-in slide-in-from-right-4 duration-700 delay-900">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                    Agenda Inteligente
                </h2>
                <div className="flex items-center gap-1">
                    <button onClick={handlePrevMonth} className="p-1 hover:bg-secondary rounded-md">
                        <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <span className="text-xs font-medium capitalize min-w-[80px] text-center">{monthName}</span>
                    <button onClick={handleNextMonth} className="p-1 hover:bg-secondary rounded-md">
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="mb-6">
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                        <span key={i} className="text-[10px] font-medium text-muted-foreground">{d}</span>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1 place-items-center">
                    {renderCalendarDays()}
                </div>
            </div>

            {/* AI Insights Section - Pushed to bottom or just below */}
            <div className="mt-auto pt-4 border-t border-border/50">
                <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-primary" />
                    Insights da IA
                </h3>
                <div className="space-y-2">
                    <div className="bg-primary/5 dark:bg-primary/10 p-2.5 rounded-lg border border-primary/20">
                        <p className="text-xs text-foreground leading-snug">
                            <span className="font-semibold text-primary">Padrão identificado:</span> Alta demanda de processos nas últimas 48h.
                        </p>
                    </div>
                    <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                        <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                        <p className="text-xs text-muted-foreground leading-snug">
                            Sugestão: Reserve a sexta-feira para revisão de contratos acumulados.
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
};
