"use client"

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    FileText,
    Users,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Send,
    Ban
} from 'lucide-react'
import { useSignatureRequests } from '../hooks/use-signature-requests'
import { useSigners } from '../hooks/use-signers'
import { SignatureRequest, SignatureRequestSigner } from '../types'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface SignatureRequestDetailModalProps {
    requestId: string | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SignatureRequestDetailModal({
    requestId,
    open,
    onOpenChange
}: SignatureRequestDetailModalProps) {
    const [request, setRequest] = useState<SignatureRequest | null>(null)
    const { getRequest, submitRequest, cancelRequest, loading: requestLoading } = useSignatureRequests()
    const { signers, fetchSigners, loading: signersLoading } = useSigners()

    useEffect(() => {
        if (requestId && open) {
            loadRequestDetails()
        }
    }, [requestId, open])

    const loadRequestDetails = async () => {
        if (!requestId) return

        try {
            const requestData = await getRequest(requestId)
            setRequest(requestData)

            // fetchSigners atualiza o estado interno do hook
            await fetchSigners(requestId)
        } catch (error) {
            console.error('Error loading request details:', error)
        }
    }

    const handleSubmit = async () => {
        if (!requestId) return
        try {
            await submitRequest(requestId)
            await loadRequestDetails()
        } catch (error) {
            // Error handled by hook
        }
    }

    const handleCancel = async () => {
        if (!requestId) return
        try {
            await cancelRequest(requestId)
            onOpenChange(false)
        } catch (error) {
            // Error handled by hook
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'signed':
                return <CheckCircle2 className="h-4 w-4 text-green-600" />
            case 'declined':
                return <XCircle className="h-4 w-4 text-red-600" />
            case 'pending':
            case 'notified':
                return <Clock className="h-4 w-4 text-yellow-600" />
            default:
                return <AlertCircle className="h-4 w-4 text-gray-600" />
        }
    }

    const getStatusBadge = (status: string) => {
        const config = {
            pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-700' },
            notified: { label: 'Notificado', className: 'bg-blue-100 text-blue-700' },
            viewed: { label: 'Visualizado', className: 'bg-purple-100 text-purple-700' },
            signed: { label: 'Assinado', className: 'bg-green-100 text-green-700' },
            declined: { label: 'Recusado', className: 'bg-red-100 text-red-700' },
            expired: { label: 'Expirado', className: 'bg-orange-100 text-orange-700' },
        }
        const cfg = config[status as keyof typeof config] || config.pending
        return <Badge className={`${cfg.className} hover:${cfg.className}`}>{cfg.label}</Badge>
    }

    if (!request) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[700px]">
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">Carregando detalhes...</p>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{request.title}</DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[calc(90vh-120px)]">
                    <div className="space-y-6 pr-4">
                        {/* Status and Actions */}
                        <Card className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    <div className="flex items-center gap-2">
                                        {getStatusBadge(request.status)}
                                        <span className="text-sm text-muted-foreground">
                                            {request.progress_percentage}% concluído
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {request.status === 'draft' && (
                                        <Button
                                            size="sm"
                                            className="bg-orange-600 hover:bg-orange-700"
                                            onClick={handleSubmit}
                                            disabled={requestLoading}
                                        >
                                            <Send className="h-4 w-4 mr-2" />
                                            Enviar para Assinatura
                                        </Button>
                                    )}
                                    {(request.status === 'pending' || request.status === 'in_progress') && (
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={handleCancel}
                                            disabled={requestLoading}
                                        >
                                            <Ban className="h-4 w-4 mr-2" />
                                            Cancelar
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Document Info */}
                        <div className="space-y-3">
                            <h3 className="font-semibold flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Informações do Documento
                            </h3>
                            <Card className="p-4 space-y-2">
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                    <span className="text-muted-foreground">Documento:</span>
                                    <span className="col-span-2 font-medium">{request.document_name || 'Documento'}</span>
                                </div>
                                {request.description && (
                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                        <span className="text-muted-foreground">Descrição:</span>
                                        <span className="col-span-2">{request.description}</span>
                                    </div>
                                )}
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                    <span className="text-muted-foreground">Prioridade:</span>
                                    <span className="col-span-2 capitalize">{request.priority}</span>
                                </div>
                                {request.expires_at && (
                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                        <span className="text-muted-foreground">Expira em:</span>
                                        <span className="col-span-2">
                                            {formatDistanceToNow(new Date(request.expires_at), {
                                                addSuffix: true,
                                                locale: ptBR
                                            })}
                                        </span>
                                    </div>
                                )}
                            </Card>
                        </div>

                        <Separator />

                        {/* Signers List */}
                        <div className="space-y-3">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Assinantes ({request.signed_count}/{request.signers_count})
                            </h3>
                            <div className="space-y-2">
                                {signersLoading ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        Carregando assinantes...
                                    </p>
                                ) : signers.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        Nenhum assinante adicionado
                                    </p>
                                ) : (
                                    signers
                                        .sort((a, b) => a.signing_order - b.signing_order)
                                        .map((signer) => (
                                            <Card key={signer.id} className="p-4">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex items-start gap-3 flex-1">
                                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-semibold text-sm">
                                                            {signer.signing_order}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium">{signer.full_name}</p>
                                                            <p className="text-sm text-muted-foreground">{signer.email}</p>
                                                            {signer.signed_at && (
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    Assinado {formatDistanceToNow(new Date(signer.signed_at), {
                                                                        addSuffix: true,
                                                                        locale: ptBR
                                                                    })}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {getStatusIcon(signer.status)}
                                                        {getStatusBadge(signer.status)}
                                                    </div>
                                                </div>
                                            </Card>
                                        ))
                                )}
                            </div>
                        </div>

                        {/* Metadata */}
                        <Separator />
                        <div className="text-xs text-muted-foreground space-y-1">
                            <p>Criado {formatDistanceToNow(new Date(request.created_at), { addSuffix: true, locale: ptBR })}</p>
                            {request.created_by_name && <p>por {request.created_by_name}</p>}
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
