"use client"

import { SignatureRequest } from '../types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { FileText, Users, Clock, ChevronRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface SignatureRequestCardProps {
    request: SignatureRequest
    onClick?: () => void
}

export function SignatureRequestCard({ request, onClick }: SignatureRequestCardProps) {
    const getStatusBadge = (status: string) => {
        const statusConfig = {
            draft: { label: 'Rascunho', className: 'bg-gray-100 text-gray-700' },
            pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-700' },
            in_progress: { label: 'Em Andamento', className: 'bg-blue-100 text-blue-700' },
            completed: { label: 'Concluído', className: 'bg-green-100 text-green-700' },
            cancelled: { label: 'Cancelado', className: 'bg-red-100 text-red-700' },
            expired: { label: 'Expirado', className: 'bg-orange-100 text-orange-700' },
            rejected: { label: 'Rejeitado', className: 'bg-red-100 text-red-700' },
        }

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
        return <Badge className={`${config.className} hover:${config.className}`}>{config.label}</Badge>
    }

    const getPriorityBadge = (priority: string) => {
        const priorityConfig = {
            low: { label: 'Baixa', className: 'bg-gray-100 text-gray-600' },
            normal: { label: 'Normal', className: 'bg-blue-100 text-blue-600' },
            high: { label: 'Alta', className: 'bg-orange-100 text-orange-600' },
            urgent: { label: 'Urgente', className: 'bg-red-100 text-red-600' },
        }

        const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.normal
        return <Badge variant="outline" className={`${config.className} border-0`}>{config.label}</Badge>
    }

    return (
        <Card
            className="p-6 hover:shadow-md transition-all cursor-pointer"
            onClick={onClick}
        >
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg truncate">{request.title}</h3>
                            {getStatusBadge(request.status)}
                            {getPriorityBadge(request.priority)}
                        </div>
                        {request.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">{request.description}</p>
                        )}
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="font-medium">{request.progress_percentage}%</span>
                    </div>
                    <Progress value={request.progress_percentage} className="h-2" />
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>{request.document_name || 'Documento'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{request.signed_count}/{request.signers_count} assinados</span>
                    </div>
                    {request.expires_at && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>
                                Expira {formatDistanceToNow(new Date(request.expires_at), {
                                    addSuffix: true,
                                    locale: ptBR
                                })}
                            </span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                        Criado {formatDistanceToNow(new Date(request.created_at), {
                            addSuffix: true,
                            locale: ptBR
                        })}
                    </span>
                    {request.created_by_name && (
                        <span className="text-xs text-muted-foreground">
                            por {request.created_by_name}
                        </span>
                    )}
                </div>
            </div>
        </Card>
    )
}
