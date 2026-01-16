'use client';

import { useState } from 'react';
import {
    useCreateSignatureBatch,
    useSignatureTemplates,
    useSignatureRequests,
} from '@/hooks/queries/useSignature';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Layers, FileSignature } from 'lucide-react';
import { toast } from 'sonner';

interface SignatureBatchFormProps {
    onSuccess?: (batch: any) => void;
    onCancel?: () => void;
}

export function SignatureBatchForm({ onSuccess, onCancel }: SignatureBatchFormProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedRequests, setSelectedRequests] = useState<string[]>([]);

    const { data: requestsData, isLoading: requestsLoading } = useSignatureRequests({
        status: 'pending',
    });
    const requests = requestsData?.results || [];

    const createMutation = useCreateSignatureBatch({
        onSuccess: (data) => {
            toast.success('Lote de assinaturas criado com sucesso');
            onSuccess?.(data);
        },
    });

    const toggleRequest = (requestId: string) => {
        setSelectedRequests((prev) =>
            prev.includes(requestId)
                ? prev.filter((id) => id !== requestId)
                : [...prev, requestId]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedRequests.length === 0) {
            toast.error('Selecione pelo menos uma solicitação de assinatura');
            return;
        }

        createMutation.mutate({
            name,
            description: description || undefined,
            signature_requests: selectedRequests,
        });
    };

    return (
        <Card className="p-6">
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Layers className="h-5 w-5" />
                        Novo Lote de Assinaturas
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Agrupe múltiplas solicitações de assinatura para processamento em lote
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nome */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome do Lote *</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Contratos Q1 2024"
                            required
                        />
                    </div>

                    {/* Descrição */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição (opcional)</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Adicione uma descrição para o lote"
                            rows={3}
                        />
                    </div>

                    {/* Seleção de Solicitações */}
                    <div className="space-y-3">
                        <Label>Solicitações de Assinatura *</Label>

                        {requestsLoading ? (
                            <div className="flex items-center justify-center p-4">
                                <Loader2 className="h-5 w-5 animate-spin" />
                            </div>
                        ) : requests.length === 0 ? (
                            <Card className="p-4 text-center text-muted-foreground">
                                Nenhuma solicitação pendente disponível
                            </Card>
                        ) : (
                            <div className="border rounded-lg divide-y max-h-80 overflow-y-auto">
                                {requests.map((request) => (
                                    <label
                                        key={request.id}
                                        className="flex items-start gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                                    >
                                        <Checkbox
                                            checked={selectedRequests.includes(request.id)}
                                            onCheckedChange={() => toggleRequest(request.id)}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <FileSignature className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                <p className="font-medium">{request.title}</p>
                                            </div>
                                            {request.description && (
                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                    {request.description}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                                <span>
                                                    {request.signers?.length || 0} signatário(s)
                                                </span>
                                                <span>•</span>
                                                <span>
                                                    Criado em{' '}
                                                    {new Date(request.created_at).toLocaleDateString(
                                                        'pt-BR'
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}

                        <p className="text-xs text-muted-foreground">
                            {selectedRequests.length} solicitação(ões) selecionada(s)
                        </p>
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
                        <Button
                            type="submit"
                            disabled={createMutation.isPending || selectedRequests.length === 0}
                        >
                            {createMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Criando...
                                </>
                            ) : (
                                <>
                                    <Layers className="mr-2 h-4 w-4" />
                                    Criar Lote
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </Card>
    );
}
