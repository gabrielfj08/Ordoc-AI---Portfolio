'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Bell, BellOff, Check, X, TestTube2, Info } from 'lucide-react'
import { usePushNotifications } from '@/hooks/use-push-notifications'

export function PushNotificationsSettings() {
    const {
        isSupported,
        permission,
        isGranted,
        isDenied,
        loading,
        requestPermission,
        unsubscribe,
        sendTestNotification,
    } = usePushNotifications()

    const getStatusBadge = () => {
        if (!isSupported) {
            return (
                <Badge variant="secondary" className="gap-1">
                    <X className="size-3" />
                    Não suportado
                </Badge>
            )
        }

        if (isGranted) {
            return (
                <Badge variant="default" className="gap-1 bg-success text-success-foreground">
                    <Check className="size-3" />
                    Ativado
                </Badge>
            )
        }

        if (isDenied) {
            return (
                <Badge variant="destructive" className="gap-1">
                    <X className="size-3" />
                    Bloqueado
                </Badge>
            )
        }

        return (
            <Badge variant="secondary" className="gap-1">
                <Info className="size-3" />
                Inativo
            </Badge>
        )
    }

    return (
        <Card className="p-6">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Bell className="size-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Notificações Push</h3>
                                <p className="text-sm text-muted-foreground">
                                    Receba alertas mesmo com o aplicativo fechado
                                </p>
                            </div>
                        </div>
                    </div>
                    {getStatusBadge()}
                </div>

                <Separator />

                {/* Status e Controles */}
                {!isSupported ? (
                    <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-start gap-3">
                            <BellOff className="size-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="font-medium text-sm mb-1">
                                    Notificações push não disponíveis
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Seu navegador não suporta notificações push ou você está
                                    usando HTTP. Notificações push requerem HTTPS.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Switch principal */}
                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                            <div className="flex-1">
                                <Label className="text-base font-medium">
                                    Habilitar notificações push
                                </Label>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {isGranted &&
                                        'Você receberá alertas de novos documentos, tarefas e avisos importantes'}
                                    {isDenied &&
                                        'Você bloqueou as notificações. Altere nas configurações do navegador.'}
                                    {!isGranted &&
                                        !isDenied &&
                                        'Permita que o Ordoc-AI envie notificações'}
                                </p>
                            </div>
                            <Switch
                                checked={isGranted}
                                onCheckedChange={async checked => {
                                    if (checked) {
                                        await requestPermission()
                                    } else {
                                        await unsubscribe()
                                    }
                                }}
                                disabled={loading || isDenied}
                            />
                        </div>

                        {/* Informações adicionais */}
                        {isGranted && (
                            <>
                                <div className="space-y-3">
                                    <h4 className="font-medium text-sm">O que você receberá:</h4>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary mt-0.5">✓</span>
                                            <span>Novos documentos que requerem sua atenção</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary mt-0.5">✓</span>
                                            <span>Tarefas atribuídas a você</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary mt-0.5">✓</span>
                                            <span>Alertas críticos da IA</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary mt-0.5">✓</span>
                                            <span>
                                                Atualizações de processos e aprovações pendentes
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full gap-2"
                                    onClick={sendTestNotification}
                                >
                                    <TestTube2 className="size-4" />
                                    Enviar notificação de teste
                                </Button>
                            </>
                        )}

                        {isDenied && (
                            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                                <h4 className="font-semibold text-sm mb-2 text-destructive">
                                    Como desbloquear notificações:
                                </h4>
                                <ol className="space-y-1 text-xs text-muted-foreground list-decimal list-inside">
                                    <li>Clique no ícone de cadeado/informação na barra de endereço</li>
                                    <li>Procure por "Notificações" nas configurações do site</li>
                                    <li>Altere de "Bloqueado" para "Permitir"</li>
                                    <li>Recarregue a página</li>
                                </ol>
                            </div>
                        )}
                    </div>
                )}

                {/* Info adicional */}
                <div className="pt-2">
                    <p className="text-xs text-muted-foreground">
                        💡 <strong>Dica:</strong> As notificações push funcionam mesmo quando você
                        fecha o navegador. Para desativar, desmarque a opção acima.
                    </p>
                </div>
            </div>
        </Card>
    )
}
