'use client';

import { useState } from 'react';
import { useValidateCNPJ } from '@/hooks/queries/useIntegrations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Search, Building2 } from 'lucide-react';

interface CNPJValidatorProps {
    onValidationComplete?: (result: any) => void;
}

export function CNPJValidator({ onValidationComplete }: CNPJValidatorProps) {
    const [cnpj, setCnpj] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [validationResult, setValidationResult] = useState<any>(null);

    const validateMutation = useValidateCNPJ({
        onSuccess: (result) => {
            setValidationResult(result);
            onValidationComplete?.(result);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setValidationResult(null);

        validateMutation.mutate({
            cnpj: cnpj.replace(/\D/g, ''),
            company_name: companyName || undefined,
        });
    };

    const formatCNPJ = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 14) {
            return numbers
                .replace(/(\d{2})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1/$2')
                .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
        }
        return value;
    };

    const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCNPJ(e.target.value);
        setCnpj(formatted);
    };

    return (
        <Card className="p-6">
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Validar CNPJ
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Valide um CNPJ e obtenha informações da empresa
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="cnpj">CNPJ *</Label>
                        <Input
                            id="cnpj"
                            value={cnpj}
                            onChange={handleCNPJChange}
                            placeholder="00.000.000/0000-00"
                            maxLength={18}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="companyName">Razão Social (opcional)</Label>
                        <Input
                            id="companyName"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Nome da empresa"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={validateMutation.isPending || !cnpj}
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
                                Validar CNPJ
                            </>
                        )}
                    </Button>
                </form>

                {validationResult && (
                    <div className="mt-6 space-y-4">
                        <div className="flex items-start gap-2">
                            {validationResult.valid ? (
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                            ) : (
                                <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                            )}
                            <div className="flex-1">
                                <p className="font-semibold">
                                    {validationResult.valid ? 'CNPJ Válido' : 'CNPJ Inválido'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {validationResult.formatted_cnpj}
                                </p>
                            </div>
                        </div>

                        {validationResult.valid && (
                            <div className="space-y-3 border-t pt-4">
                                {validationResult.company_name && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Razão Social</p>
                                        <p className="font-medium">{validationResult.company_name}</p>
                                    </div>
                                )}

                                {validationResult.trade_name && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Nome Fantasia</p>
                                        <p className="font-medium">{validationResult.trade_name}</p>
                                    </div>
                                )}

                                {validationResult.status && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">Situação:</span>
                                        <Badge>{validationResult.status}</Badge>
                                    </div>
                                )}

                                {validationResult.registration_date && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Data de Abertura</p>
                                        <p className="font-medium">
                                            {new Date(validationResult.registration_date).toLocaleDateString(
                                                'pt-BR'
                                            )}
                                        </p>
                                    </div>
                                )}

                                {validationResult.legal_nature && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Natureza Jurídica</p>
                                        <p className="font-medium">{validationResult.legal_nature}</p>
                                    </div>
                                )}

                                {validationResult.address && (
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Endereço</p>
                                        <div className="text-sm space-y-1">
                                            {validationResult.address.street && (
                                                <p>
                                                    {validationResult.address.street}
                                                    {validationResult.address.number &&
                                                        `, ${validationResult.address.number}`}
                                                </p>
                                            )}
                                            {validationResult.address.complement && (
                                                <p>{validationResult.address.complement}</p>
                                            )}
                                            {validationResult.address.neighborhood && (
                                                <p>{validationResult.address.neighborhood}</p>
                                            )}
                                            {validationResult.address.city && (
                                                <p>
                                                    {validationResult.address.city}
                                                    {validationResult.address.state &&
                                                        ` - ${validationResult.address.state}`}
                                                </p>
                                            )}
                                            {validationResult.address.zip_code && (
                                                <p>CEP: {validationResult.address.zip_code}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {validationResult.activities && validationResult.activities.length > 0 && (
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-2">Atividades</p>
                                        <div className="space-y-1">
                                            {validationResult.activities.map((activity: any, index: number) => (
                                                <div key={index} className="text-sm">
                                                    <Badge variant="outline" className="mr-2">
                                                        {activity.code}
                                                    </Badge>
                                                    {activity.description}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {validationResult.details && (
                            <details className="mt-4">
                                <summary className="text-sm font-medium cursor-pointer">
                                    Ver detalhes técnicos
                                </summary>
                                <pre className="text-xs bg-muted p-3 rounded-md overflow-auto mt-2">
                                    {JSON.stringify(validationResult.details, null, 2)}
                                </pre>
                            </details>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
}
