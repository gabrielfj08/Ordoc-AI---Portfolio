'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, BrainCircuit, Loader2 } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import dashboardService, { AgendaEvent, AgendaInsight } from '@/services/dashboard';

export const AgendaWidget = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<Record<string, AgendaEvent>>({});
    const [insights, setInsights] = useState<AgendaInsight[]>([]);
    const [loading, setLoading] = useState(true);
    const [insightsLoading, setInsightsLoading] = useState(true);

    useEffect(() => {
        loadAgendaData();
    }, []);

    const loadAgendaData = async () => {
        setLoading(true);
        setInsightsLoading(true);
        try {
            const [eventsData, insightsData] = await Promise.all([
                dashboardService.getAgendaEvents(),
                dashboardService.getAgendaInsights(),
            ]);

            // Converter array de eventos para Record<date, event>
            const eventsMap: Record<string, AgendaEvent> = {};
            eventsData.forEach(event => {
                eventsMap[event.date] = event;
            });

            setEvents(eventsMap);
            setInsights(insightsData);
        } catch (error) {
            console.error('Failed to load agenda data:', error);
        } finally {
            setLoading(false);
            setInsightsLoading(false);
        }
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
                    Insights
                </h3>
                {insightsLoading ? (
                    <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        <span className="ml-2 text-xs text-muted-foreground">Carregando insights...</span>
                    </div>
                ) : insights.length === 0 ? (
                    <div className="text-center py-3 text-xs text-muted-foreground">
                        Nenhum insight disponível no momento
                    </div>
                ) : (
                    <div className="space-y-2">
                        {insights.map((insight, index) => (
                            <div
                                key={index}
                                className={`${insight.type === 'pattern'
                                    ? 'bg-primary/5 p-2.5 rounded-lg border border-primary/20'
                                    : 'flex items-start gap-2 p-2 rounded-lg hover:bg-secondary/50 transition-colors'
                                    }`}
                            >
                                {insight.type === 'pattern' ? (
                                    <p className="text-xs text-foreground leading-snug">
                                        <span className={`font-semibold ${insight.severity === 'warning' ? 'text-amber-600' : 'text-primary'}`}>
                                            Padrão identificado:
                                        </span>{' '}
                                        {insight.message}
                                    </p>
                                ) : (
                                    <>
                                        <div className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${insight.severity === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                                            }`}></div>
                                        <p className="text-xs text-muted-foreground leading-snug">
                                            <span className="font-medium">Sugestão:</span> {insight.message}
                                        </p>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
};
