"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Upload, CheckCircle2 } from 'lucide-react'

interface ValidatorModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ValidatorModal({ open, onOpenChange }: ValidatorModalProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const file = e.dataTransfer.files?.[0]
        if (file) {
            setSelectedFile(file)
        }
    }

    const handleValidate = () => {
        if (!selectedFile) return

        // TODO: Implementar validação de assinatura
        console.log('Validando arquivo:', selectedFile.name)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Validador de Assinaturas</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Faça upload de um documento assinado digitalmente para verificar sua autenticidade
                    </p>

                    {/* Área de Upload */}
                    <div
                        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${isDragging
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-300 hover:border-orange-400'
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('file-upload')?.click()}
                    >
                        <input
                            id="file-upload"
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        <div className="flex flex-col items-center gap-3">
                            <div className="p-3 rounded-lg bg-gray-100">
                                <Upload className="h-8 w-8 text-gray-600" />
                            </div>

                            {selectedFile ? (
                                <div className="space-y-1">
                                    <p className="font-medium text-sm">{selectedFile.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {(selectedFile.size / 1024).toFixed(2)} KB
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <p className="font-medium text-sm">Arraste o arquivo aqui</p>
                                        <p className="text-xs text-muted-foreground">ou clique para selecionar</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Formatos aceitos: PDF com assinatura digital
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Botão Validar */}
                    <Button
                        className="w-full bg-orange-600 hover:bg-orange-700"
                        onClick={handleValidate}
                        disabled={!selectedFile}
                    >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Validar Documento
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
