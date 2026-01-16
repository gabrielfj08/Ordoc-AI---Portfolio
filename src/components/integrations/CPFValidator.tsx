'use client';

import { useState } from 'react';
import { useValidateCPF } from '@/hooks/queries/useIntegrations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Search } from 'lucide-react';

interface CPFValidatorProps {
    onValidationComplete?: (result: any) => void;
}

export function CPFValidator({ onValidationComplete }: CPFValidatorProps) {
    const [cpf, setCpf] = useState('');
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [validationResult, setValidationResult] = useState<any>(null);

    const validateMutation = useValidateCPF({
        onSuccess: (result) => {
            setValidationResult(result);
            onValidationComplete?.(result);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setValidationResult(null);

        validateMutation.mutate({
            cpf: cpf.replace(/\D/g, ''),
            name: name || undefined,
            birth_date: birthDate || undefined,
        });
    };

    const formatCPF = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 11) {
            return numbers
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }
        return value;
    };

    const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCPF(e.target.value);
        setCpf(formatted);
    };

    return (
        <Card className="p-6">
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold">Validar CPF</h3>
                    <p className="text-sm text-muted-foreground">
                        Valide um CPF e opcionalmente verifique nome e data de nascimento
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="cpf">CPF *</Label>
                        <Input
                            id="cpf"
                            value={cpf}
                            onChange={handleCPFChange}
                            placeholder="000.000.000-00"
                            maxLength={14}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Nome (opcional)</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nome completo"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="birthDate">Data de Nascimento (opcional)</Label>
                        <Input
                            id="birthDate"
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={validateMutation.isPending || !cpf}
                        className="w-full"
                    >
                        {validateMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Validando...
                            </>
                        ) : (
                            <>
                                <Search className="mr-2 h-4 w-4" />
                                Validar CPF
                            </>
                        )}
                    </Button>
                </form>

                {validationResult && (
                    <div className="mt-6 space-y-3">
                        <div className="flex items-start gap-2">
                            {validationResult.valid ? (
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                            ) : (
                                <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                            )}
                            <div className="flex-1">
                                <p className="font-semibold">
                                    {validationResult.valid ? 'CPF Válido' : 'CPF Inválido'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {validationResult.formatted_cpf}
                                </p>
                            </div>
                        </div>

                        {validationResult.name_match !== undefined && (
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">Nome:</span>
                                <Badge variant={validationResult.name_match ? 'default' : 'destructive'}>
                                    {validationResult.name_match ? 'Confere' : 'Não confere'}
                                </Badge>
                            </div>
                        )}

                        {validationResult.birth_date_match !== undefined && (
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">Data de Nascimento:</span>
                                <Badge
                                    variant={validationResult.birth_date_match ? 'default' : 'destructive'}
                                >
                                    {validationResult.birth_date_match ? 'Confere' : 'Não confere'}
                                </Badge>
                            </div>
                        )}

                        {validationResult.status && (
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">Status:</span>
                                <span className="font-medium">{validationResult.status}</span>
                            </div>
                        )}

                        {validationResult.details && (
                            <div className="mt-4">
                                <p className="text-sm font-medium mb-2">Detalhes:</p>
                                <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">
                                    {JSON.stringify(validationResult.details, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
}
