'use client';

import { useState } from 'react';
import { useReportTemplates, useGenerateReport } from '@/hooks/queries/useReports';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';

export function ReportGenerator() {
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [format, setFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');

    const { data: templates } = useReportTemplates({ status: 'active' });
    const generateMutation = useGenerateReport();

    const handleGenerate = () => {
        if (!selectedTemplate) return;

        generateMutation.mutate(
            {
                template_id: selectedTemplate,
                format,
                title: title || undefined,
                description: description || undefined,
            },
            {
                onSuccess: () => {
                    setSelectedTemplate('');
                    setTitle('');
                    setDescription('');
                },
            }
        );
    };

    return (
        <Card className="p-6">
            <div className="space-y-4">
                <div>
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Gerar Novo Relatório
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Selecione um template e configure as opções de geração
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="template">Template</Label>
                        <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                            <SelectTrigger id="template">
                                <SelectValue placeholder="Selecione um template" />
                            </SelectTrigger>
                            <SelectContent>
                                {templates?.map((template) => (
                                    <SelectItem key={template.id} value={template.id}>
                                        {template.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Título (opcional)</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Título personalizado do relatório"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição (opcional)</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Descrição ou observações sobre o relatório"
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="format">Formato</Label>
                        <Select value={format} onValueChange={(v: any) => setFormat(v)}>
                            <SelectTrigger id="format">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pdf">PDF</SelectItem>
                                <SelectItem value="excel">Excel</SelectItem>
                                <SelectItem value="csv">CSV</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        onClick={handleGenerate}
                        disabled={!selectedTemplate || generateMutation.isPending}
                        className="w-full"
                    >
                        {generateMutation.isPending ? 'Gerando...' : 'Gerar Relatório'}
                    </Button>
                </div>
            </div>
        </Card>
    );
}
