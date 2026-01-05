"use client"

import { useState } from 'react'
import { Download, Trash2, FileText } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileIcon, formatFileSize } from './file-upload'
import type { TaskAttachment } from '../types'

interface AttachmentListProps {
    attachments: TaskAttachment[]
    onDownload?: (attachment: TaskAttachment) => void
    onDelete?: (id: string) => void
    loading?: boolean
}

export function AttachmentList({
    attachments,
    onDownload,
    onDelete,
    loading = false
}: AttachmentListProps) {
    if (loading) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                Carregando anexos...
            </div>
        )
    }

    if (attachments.length === 0) {
        return (
            <Card className="p-8 text-center border-dashed">
                <FileText className="size-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Nenhum anexo adicionado</p>
            </Card>
        )
    }

    return (
        <div className="space-y-3">
            {attachments.map((attachment) => (
                <Card key={attachment.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="size-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                            <FileIcon fileType={attachment.file_type} className="size-5 text-orange-600" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm truncate">
                                    {attachment.name}
                                </span>
                                <Badge variant="secondary" className="text-[10px]">
                                    {attachment.attachment_type}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span>{formatFileSize(attachment.file_size)}</span>
                                <span>•</span>
                                <span>{new Date(attachment.created_at).toLocaleDateString('pt-BR')}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {onDownload && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 rounded-full"
                                    onClick={() => onDownload(attachment)}
                                >
                                    <Download className="size-4" />
                                </Button>
                            )}

                            {onDelete && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => onDelete(attachment.id)}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    {attachment.description && (
                        <p className="text-sm text-muted-foreground mt-3 pl-14">
                            {attachment.description}
                        </p>
                    )}
                </Card>
            ))}
        </div>
    )
}
