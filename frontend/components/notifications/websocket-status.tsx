'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { Wifi, WifiOff, RefreshCw } from 'lucide-react'

interface WebSocketStatusProps {
    isConnected: boolean
    reconnectAttempts: number
    onReconnect?: () => void
}

export function WebSocketStatus({
    isConnected,
    reconnectAttempts,
    onReconnect,
}: WebSocketStatusProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                        {isConnected ? (
                            <Badge
                                variant="outline"
                                className="gap-1.5 bg-success/10 text-success border-success/20"
                            >
                                <div className="size-2 rounded-full bg-success animate-pulse" />
                                <Wifi className="size-3" />
                                <span className="text-xs">Tempo real</span>
                            </Badge>
                        ) : (
                            <Badge
                                variant="outline"
                                className="gap-1.5 bg-muted text-muted-foreground"
                            >
                                <WifiOff className="size-3" />
                                <span className="text-xs">Desconectado</span>
                            </Badge>
                        )}
                    </div>
                </TooltipTrigger>
                <TooltipContent className="w-64 p-4">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-sm">
                                Notificações em Tempo Real
                            </h4>
                            <div
                                className={`size-3 rounded-full ${
                                    isConnected ? 'bg-success animate-pulse' : 'bg-muted'
                                }`}
                            />
                        </div>

                        <div className="text-xs text-muted-foreground space-y-1">
                            {isConnected ? (
                                <>
                                    <p>✅ Conexão ativa</p>
                                    <p>
                                        Você está recebendo notificações instantâneas via WebSocket
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p>❌ Desconectado</p>
                                    {reconnectAttempts > 0 && (
                                        <p>
                                            Tentando reconectar... (tentativa {reconnectAttempts})
                                        </p>
                                    )}
                                    <p className="mt-2">
                                        As notificações serão carregadas manualmente até a reconexão
                                    </p>
                                </>
                            )}
                        </div>

                        {!isConnected && onReconnect && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full gap-2"
                                onClick={onReconnect}
                            >
                                <RefreshCw className="size-3" />
                                Reconectar agora
                            </Button>
                        )}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
