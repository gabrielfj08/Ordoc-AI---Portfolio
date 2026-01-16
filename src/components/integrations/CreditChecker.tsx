'use client';

import { useState } from 'react';
import { useCheckCredit } from '@/hooks/queries/useIntegrations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2, AlertCircle, TrendingUp, Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CreditCheckerProps {
    onCheckComplete?: (result: any) => void;
}

export function CreditChecker({ onCheckComplete }: CreditCheckerProps) {
    const [document, setDocument] = useState('');
    const [documentType, setDocumentType] = useState<'cpf' | 'cnpj'>('cpf');
    const [checkResult, setCheckResult] = useState<any>(null);

    const checkMutation = useCheckCredit({
        onSuccess: (result) => {
            setCheckResult(result);
            onCheckComplete?.(result);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCheckResult(null);

        checkMutation.mutate({
            document: document.replace(/\D/g, ''),
            document_type: documentType,
        });
    };

    const formatDocument = (value: string, type: 'cpf' | 'cnpj') => {
        const numbers = value.replace(/\D/g, '');

        if (type === 'cpf' && numbers.length <= 11) {
            return numbers
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }

        if (type === 'cnpj' && numbers.length <= 14) {
            return numbers
                .replace(/(\d{2})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1/$2')
                .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
        }

        return value;
    };

    const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatDocument(e.target.value, documentType);
        setDocument(formatted);
    };

    const getRiskColor = (level?: string) => {
        switch (level) {
            case 'low':
                return 'bg-green-500';
            case 'medium':
                return 'bg-yellow-500';
            case 'high':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getRiskLabel = (level?: string) => {
        switch (level) {
            case 'low':
                return 'Baixo';
            case 'medium':
                return 'Médio';
            case 'high':
                return 'Alto';
            default:
                return 'Desconhecido';
        }
    };

    return (
        <Card className="p-6">
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Consulta de Crédito
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Verifique o score de crédito e restrições
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="documentType">Tipo de Documento</Label>
                        <Select
                            value={documentType}
                            onValueChange={(value: 'cpf' | 'cnpj') => {
                                setDocumentType(value);
                                setDocument('');
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cpf">CPF</SelectItem>
                                <SelectItem value="cnpj">CNPJ</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="document">
                            {documentType === 'cpf' ? 'CPF' : 'CNPJ'} *
                        </Label>
                        <Input
                            id="document"
                            value={document}
                            onChange={handleDocumentChange}
                            placeholder={
                                documentType === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'
                            }
                            maxLength={documentType === 'cpf' ? 14 : 18}
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={checkMutation.isPending || !document}
                        className="w-full"
                    >
                        {checkMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Consultando...
                            </>
                        ) : (
                            <>
                                <Search className="mr-2 h-4 w-4" />
                                Consultar Crédito
                            </>
                        )}
                    </Button>
                </form>

                {checkResult && (
                    <div className="mt-6 space-y-4 border-t pt-4">
                        {checkResult.score !== undefined && (
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground mb-2">Score de Crédito</p>
                                <div className="text-4xl font-bold">{checkResult.score}</div>
                                <div className="mt-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-primary h-2 rounded-full transition-all"
                                            style={{ width: `${(checkResult.score / 1000) * 100}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">0 - 1000</p>
                                </div>
                            </div>
                        )}

                        {checkResult.risk_level && (
                            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                <span className="text-sm font-medium">Nível de Risco</span>
                                <Badge className={getRiskColor(checkResult.risk_level)}>
                                    {getRiskLabel(checkResult.risk_level)}
                                </Badge>
                            </div>
                        )}

                        {checkResult.restrictions !== undefined && (
                            <div
                                className={`flex items-start gap-3 p-4 rounded-lg ${
                                    checkResult.restrictions
                                        ? 'bg-red-50 border border-red-200'
                                        : 'bg-green-50 border border-green-200'
                                }`}
                            >
                                <AlertCircle
                                    className={`h-5 w-5 mt-0.5 ${
                                        checkResult.restrictions ? 'text-red-500' : 'text-green-500'
                                    }`}
                                />
                                <div className="flex-1">
                                    <p className="font-semibold">
                                        {checkResult.restrictions
                                            ? 'Possui Restrições'
                                            : 'Sem Restrições'}
                                    </p>
                                    {checkResult.restrictions_details &&
                                        checkResult.restrictions_details.length > 0 && (
                                            <ul className="mt-2 space-y-1 text-sm">
                                                {checkResult.restrictions_details.map(
                                                    (restriction: any, index: number) => (
                                                        <li key={index} className="flex items-start gap-2">
                                                            <span className="text-red-500">•</span>
                                                            <span>
                                                                {restriction.type || restriction.description}
                                                                {restriction.value && (
                                                                    <span className="font-medium ml-2">
                                                                        R${' '}
                                                                        {restriction.value.toLocaleString('pt-BR', {
                                                                            minimumFractionDigits: 2,
                                                                        })}
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        )}
                                </div>
                            </div>
                        )}

                        {checkResult.last_updated && (
                            <p className="text-xs text-muted-foreground text-center">
                                Atualizado{' '}
                                {formatDistanceToNow(new Date(checkResult.last_updated), {
                                    addSuffix: true,
                                    locale: ptBR,
                                })}
                            </p>
                        )}

                        {checkResult.details && (
                            <details className="mt-4">
                                <summary className="text-sm font-medium cursor-pointer">
                                    Ver detalhes técnicos
                                </summary>
                                <pre className="text-xs bg-muted p-3 rounded-md overflow-auto mt-2">
                                    {JSON.stringify(checkResult.details, null, 2)}
                                </pre>
                            </details>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
}
