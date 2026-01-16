'use client';

import { useReportSchedules, useRunScheduleNow, useDeleteReportSchedule } from '@/hooks/queries/useReports';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, Trash2, MoreVertical } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function ReportSchedulesList() {
    const { data: schedules, isLoading } = useReportSchedules();
    const runNowMutation = useRunScheduleNow();
    const deleteMutation = useDeleteReportSchedule();

    if (isLoading) {
        return <div className="p-4">Carregando agendamentos...</div>;
    }

    const getFrequencyLabel = (frequency: string) => {
        const labels: Record<string, string> = {
            daily: 'Diário',
            weekly: 'Semanal',
            monthly: 'Mensal',
            quarterly: 'Trimestral',
            yearly: 'Anual',
        };
        return labels[frequency] || frequency;
    };

    return (
        <div className="space-y-4">
            {schedules?.map((schedule) => (
                <Card key={schedule.id} className="p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <h3 className="font-semibold">{schedule.name}</h3>
                                <Badge variant={schedule.is_active ? 'default' : 'secondary'}>
                                    {schedule.is_active ? 'Ativo' : 'Inativo'}
                                </Badge>
                            </div>
                            {schedule.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    {schedule.description}
                                </p>
                            )}
                            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                                <span>Frequência: {getFrequencyLabel(schedule.frequency)}</span>
                                <span>Horário: {schedule.time_of_day}</span>
                                <span>Formato: {schedule.format.toUpperCase()}</span>
                            </div>
                            {schedule.next_run && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    Próxima execução:{' '}
                                    {formatDistanceToNow(new Date(schedule.next_run), {
                                        addSuffix: true,
                                        locale: ptBR,
                                    })}
                                </p>
                            )}
                            {schedule.recipients && schedule.recipients.length > 0 && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    Destinatários: {schedule.recipients.join(', ')}
                                </p>
                            )}
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {schedule.is_active && (
                                    <DropdownMenuItem
                                        onClick={() => runNowMutation.mutate(schedule.id)}
                                    >
                                        <Play className="mr-2 h-4 w-4" />
                                        Executar Agora
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                    onClick={() => deleteMutation.mutate(schedule.id)}
                                    className="text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Deletar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </Card>
            ))}
        </div>
    );
}
