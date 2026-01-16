'use client';

import { useInitiateGovBrLogin, useGovBrConfig } from '@/hooks/queries/useIntegrations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Shield, CheckCircle2 } from 'lucide-react';

interface GovBrAuthButtonProps {
    redirectUri?: string;
    onAuthStart?: () => void;
    variant?: 'default' | 'outline' | 'card';
}

export function GovBrAuthButton({
    redirectUri,
    onAuthStart,
    variant = 'default',
}: GovBrAuthButtonProps) {
    const { data: config, isLoading: configLoading } = useGovBrConfig();
    const initiateLoginMutation = useInitiateGovBrLogin();

    const handleLogin = () => {
        onAuthStart?.();
        initiateLoginMutation.mutate(redirectUri);
    };

    if (variant === 'card') {
        return (
            <Card className="p-6">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Shield className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">Autenticação gov.br</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Conecte-se de forma segura usando sua conta gov.br para acessar serviços
                            integrados do governo federal.
                        </p>

                        {config && (
                            <div className="mb-4 space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <span className="text-muted-foreground">
                                        Autenticação segura com OAuth 2.0
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <span className="text-muted-foreground">
                                        Acesso aos seus dados cadastrais
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <span className="text-muted-foreground">
                                        Validação de CPF e documentos
                                    </span>
                                </div>
                            </div>
                        )}

                        <Button
                            onClick={handleLogin}
                            disabled={configLoading || initiateLoginMutation.isPending}
                            className="w-full"
                        >
                            {initiateLoginMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Redirecionando...
                                </>
                            ) : (
                                <>
                                    <Shield className="mr-2 h-4 w-4" />
                                    Conectar com gov.br
                                </>
                            )}
                        </Button>

                        <p className="text-xs text-muted-foreground mt-3 text-center">
                            Você será redirecionado para o site oficial do gov.br
                        </p>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Button
            onClick={handleLogin}
            disabled={configLoading || initiateLoginMutation.isPending}
            variant={variant}
        >
            {initiateLoginMutation.isPending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redirecionando...
                </>
            ) : (
                <>
                    <Shield className="mr-2 h-4 w-4" />
                    Login com gov.br
                </>
            )}
        </Button>
    );
}
