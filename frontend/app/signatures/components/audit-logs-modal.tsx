"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, ChevronRight } from 'lucide-react'
import { useAuditLogs } from '../hooks/use-audit-logs'
import type { SignatureAuditLog } from '../types'

interface AuditLogsModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AuditLogsModal({ open, onOpenChange }: AuditLogsModalProps) {
    const { logs, loading } = useAuditLogs()
    const [selectedLog, setSelectedLog] = useState<SignatureAuditLog | null>(null)

    const getStatusBadge = (action: string) => {
        // Map actions to status colors
        if (action.includes('signed') || action.includes('completed')) {
            return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Sucesso</Badge>
        } else if (action.includes('declined') || action.includes('cancelled')) {
            return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Erro</Badge>
        } else if (action.includes('uploaded') || action.includes('notified')) {
            return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Atenção</Badge>
        }
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Info</Badge>
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Logs de Autenticação</DialogTitle>
                    </DialogHeader>

                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <p className="text-sm">Carregando logs...</p>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <p className="text-sm">Nenhum log encontrado</p>
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-[500px] overflow-y-auto">
                            {logs.map((log) => (
                                <Card
                                    key={log.id}
                                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                    onClick={() => setSelectedLog(log)}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-semibold text-sm">{log.action}</h4>
                                                {getStatusBadge(log.action)}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {log.user_name || log.user_email} • {new Date(log.created_at).toLocaleString('pt-BR')}
                                            </p>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Modal de Preview de Detalhes */}
            <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Detalhes do Log</DialogTitle>
                    </DialogHeader>

                    {selectedLog && (
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                    <h3 className="font-semibold">{selectedLog.action}</h3>
                                    {getStatusBadge(selectedLog.action)}
                                </div>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-muted-foreground">Usuário:</span>
                                    <span className="col-span-2 font-medium">{selectedLog.user_name || selectedLog.user_email}</span>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-muted-foreground">Data/Hora:</span>
                                    <span className="col-span-2 font-medium">
                                        {new Date(selectedLog.created_at).toLocaleString('pt-BR')}
                                    </span>
                                </div>

                                {selectedLog.description && (
                                    <div className="grid grid-cols-3 gap-2">
                                        <span className="text-muted-foreground">Descrição:</span>
                                        <span className="col-span-2 font-medium">{selectedLog.description}</span>
                                    </div>
                                )}

                                {selectedLog.ip_address && (
                                    <div className="grid grid-cols-3 gap-2">
                                        <span className="text-muted-foreground">IP:</span>
                                        <span className="col-span-2 font-medium">{selectedLog.ip_address}</span>
                                    </div>
                                )}

                                {selectedLog.user_agent && (
                                    <div className="grid grid-cols-3 gap-2">
                                        <span className="text-muted-foreground">User Agent:</span>
                                        <span className="col-span-2 font-medium text-xs">{selectedLog.user_agent}</span>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t">
                                <p className="text-xs text-muted-foreground">
                                    Este log foi registrado automaticamente pelo sistema de auditoria.
                                </p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
