'use client';

import { useState } from 'react';
import { useCreateSignatureRequest, useSignatureTemplates } from '@/hooks/queries/useSignature';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus, X, FileSignature } from 'lucide-react';
import { toast } from 'sonner';

interface Signer {
    email: string;
    name: string;
    order: number;
}

interface SignatureRequestFormProps {
    documentId: string;
    onSuccess?: (request: any) => void;
    onCancel?: () => void;
}

export function SignatureRequestForm({
    documentId,
    onSuccess,
    onCancel,
}: SignatureRequestFormProps) {
    const [signers, setSigners] = useState<Signer[]>([{ email: '', name: '', order: 1 }]);
    const [message, setMessage] = useState('');
    const [deadline, setDeadline] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('');

    const { data: templatesData } = useSignatureTemplates({ is_active: true });
    const templates = templatesData?.results || [];

    const createMutation = useCreateSignatureRequest({
        onSuccess: (data) => {
            toast.success('Solicitação de assinatura criada com sucesso');
            onSuccess?.(data);
        },
    });

    const addSigner = () => {
        setSigners([...signers, { email: '', name: '', order: signers.length + 1 }]);
    };

    const removeSigner = (index: number) => {
        if (signers.length > 1) {
            const newSigners = signers.filter((_, i) => i !== index);
            // Reordenar
            newSigners.forEach((signer, i) => {
                signer.order = i + 1;
            });
            setSigners(newSigners);
        }
    };

    const updateSigner = (index: number, field: keyof Signer, value: string | number) => {
        const newSigners = [...signers];
        newSigners[index] = { ...newSigners[index], [field]: value };
        setSigners(newSigners);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validar signatários
        const invalidSigners = signers.filter((s) => !s.email || !s.name);
        if (invalidSigners.length > 0) {
            toast.error('Todos os signatários devem ter email e nome');
            return;
        }

        createMutation.mutate({
            document_id: documentId,
            signers: signers.map((s) => ({
                email: s.email,
                name: s.name,
                order: s.order,
            })),
            message: message || undefined,
            deadline: deadline || undefined,
            template_id: selectedTemplate || undefined,
        });
    };

    return (
        <Card className="p-6">
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <FileSignature className="h-5 w-5" />
                        Nova Solicitação de Assinatura
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Configure os signatários e as opções de assinatura
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Template Selection */}
                    {templates.length > 0 && (
                        <div className="space-y-2">
                            <Label htmlFor="template">Template (opcional)</Label>
                            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione um template" />
                                </SelectTrigger>
                                <SelectContent>
                                    {templates.map((template) => (
                                        <SelectItem key={template.id} value={template.id}>
                                            {template.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Signers */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>Signatários *</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addSigner}>
                                <Plus className="h-4 w-4 mr-1" />
                                Adicionar
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {signers.map((signer, index) => (
                                <div
                                    key={index}
                                    className="flex gap-2 items-start p-3 border rounded-lg"
                                >
                                    <div className="flex-shrink-0 w-8 h-9 bg-primary/10 rounded flex items-center justify-center text-sm font-medium">
                                        {index + 1}
                                    </div>

                                    <div className="flex-1 grid gap-2 md:grid-cols-2">
                                        <Input
                                            placeholder="Nome completo"
                                            value={signer.name}
                                            onChange={(e) => updateSigner(index, 'name', e.target.value)}
                                            required
                                        />
                                        <Input
                                            type="email"
                                            placeholder="Email"
                                            value={signer.email}
                                            onChange={(e) => updateSigner(index, 'email', e.target.value)}
                                            required
                                        />
                                    </div>

                                    {signers.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeSigner(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Os signatários receberão as solicitações na ordem listada
                        </p>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                        <Label htmlFor="message">Mensagem (opcional)</Label>
                        <Textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Adicione uma mensagem para os signatários"
                            rows={3}
                        />
                    </div>

                    {/* Deadline */}
                    <div className="space-y-2">
                        <Label htmlFor="deadline">Prazo (opcional)</Label>
                        <Input
                            id="deadline"
                            type="datetime-local"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 justify-end">
                        {onCancel && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={createMutation.isPending}
                            >
                                Cancelar
                            </Button>
                        )}
                        <Button type="submit" disabled={createMutation.isPending}>
                            {createMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Criando...
                                </>
                            ) : (
                                <>
                                    <FileSignature className="mr-2 h-4 w-4" />
                                    Criar Solicitação
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </Card>
    );
}
