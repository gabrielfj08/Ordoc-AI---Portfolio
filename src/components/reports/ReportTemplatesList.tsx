'use client';

import { useReportTemplates, useActivateReportTemplate, useDeactivateReportTemplate, useDuplicateReportTemplate } from '@/hooks/queries/useReports';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Play, Pause, Copy, Eye } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ReportTemplatesListProps {
    onPreview?: (id: string) => void;
    onGenerate?: (templateId: string) => void;
}

export function ReportTemplatesList({ onPreview, onGenerate }: ReportTemplatesListProps) {
    const { data: templates, isLoading } = useReportTemplates();
    const activateMutation = useActivateReportTemplate();
    const deactivateMutation = useDeactivateReportTemplate();
    const duplicateMutation = useDuplicateReportTemplate();

    if (isLoading) {
        return <div className="p-4">Carregando templates...</div>;
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates?.map((template) => (
                <Card key={template.id} className="p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h3 className="font-semibold">{template.name}</h3>
                            {template.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    {template.description}
                                </p>
                            )}
                            <div className="flex gap-2 mt-2">
                                <Badge variant="outline">{template.category}</Badge>
                                <Badge variant="outline">{template.type}</Badge>
                                <Badge
                                    variant={template.status === 'active' ? 'default' : 'secondary'}
                                >
                                    {template.status}
                                </Badge>
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {onPreview && (
                                    <DropdownMenuItem onClick={() => onPreview(template.id)}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        Prévia
                                    </DropdownMenuItem>
                                )}
                                {onGenerate && template.status === 'active' && (
                                    <DropdownMenuItem onClick={() => onGenerate(template.id)}>
                                        <Play className="mr-2 h-4 w-4" />
                                        Gerar Relatório
                                    </DropdownMenuItem>
                                )}
                                {template.status === 'active' ? (
                                    <DropdownMenuItem
                                        onClick={() => deactivateMutation.mutate(template.id)}
                                    >
                                        <Pause className="mr-2 h-4 w-4" />
                                        Desativar
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem
                                        onClick={() => activateMutation.mutate(template.id)}
                                    >
                                        <Play className="mr-2 h-4 w-4" />
                                        Ativar
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                    onClick={() => duplicateMutation.mutate(template.id)}
                                >
                                    <Copy className="mr-2 h-4 w-4" />
                                    Duplicar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </Card>
            ))}
        </div>
    );
}
