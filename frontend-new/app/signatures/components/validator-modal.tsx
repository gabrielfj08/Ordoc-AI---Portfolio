"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Upload, CheckCircle2, XCircle, AlertCircle, Loader2, ShieldCheck } from 'lucide-react'
import { signaturesApi, type SignatureVerification } from '@/services/signatures-api'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface ValidatorModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ValidatorModal({ open, onOpenChange }: ValidatorModalProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isValidating, setIsValidating] = useState(false)
    const [validationResult, setValidationResult] = useState<SignatureVerification | null>(null)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            setValidationResult(null)
            setError(null)
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
            setValidationResult(null)
            setError(null)
        }
    }

    const handleValidate = async () => {
        if (!selectedFile) return

        setIsValidating(true)
        setError(null)
        setValidationResult(null)

        try {
            const result = await signaturesApi.verifyFile(selectedFile)
            setValidationResult(result)

            if (result.is_valid) {
                toast({
                    title: 'Assinatura Válida',
                    description: result.message,
                })
            } else {
                toast({
                    title: 'Assinatura Inválida',
                    description: result.message,
                    variant: 'destructive',
                })
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 'Erro ao validar assinatura'
            setError(errorMessage)
            toast({
                title: 'Erro na Validação',
                description: errorMessage,
                variant: 'destructive',
            })
        } finally {
            setIsValidating(false)
        }
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

                    {/* Resultado da Validação */}
                    {validationResult && (
                        <Alert className={validationResult.is_valid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
                            <div className="flex items-start gap-3">
                                {validationResult.is_valid ? (
                                    <ShieldCheck className="h-5 w-5 text-green-600 mt-0.5" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                                )}
                                <div className="flex-1">
                                    <AlertTitle className={validationResult.is_valid ? 'text-green-900' : 'text-red-900'}>
                                        {validationResult.is_valid ? 'Assinatura Válida' : 'Assinatura Inválida'}
                                    </AlertTitle>
                                    <AlertDescription className={validationResult.is_valid ? 'text-green-800' : 'text-red-800'}>
                                        {validationResult.message}
                                    </AlertDescription>

                                    {/* Detalhes da verificação */}
                                    <div className="mt-3 space-y-1 text-xs">
                                        <div className="flex items-center gap-2">
                                            {validationResult.certificate_valid ? (
                                                <CheckCircle2 className="h-3 w-3 text-green-600" />
                                            ) : (
                                                <XCircle className="h-3 w-3 text-red-600" />
                                            )}
                                            <span className={validationResult.certificate_valid ? 'text-green-800' : 'text-red-800'}>
                                                Certificado {validationResult.certificate_valid ? 'válido' : 'inválido'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {validationResult.document_integrity ? (
                                                <CheckCircle2 className="h-3 w-3 text-green-600" />
                                            ) : (
                                                <XCircle className="h-3 w-3 text-red-600" />
                                            )}
                                            <span className={validationResult.document_integrity ? 'text-green-800' : 'text-red-800'}>
                                                Integridade do documento {validationResult.document_integrity ? 'preservada' : 'comprometida'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {validationResult.signature_valid ? (
                                                <CheckCircle2 className="h-3 w-3 text-green-600" />
                                            ) : (
                                                <XCircle className="h-3 w-3 text-red-600" />
                                            )}
                                            <span className={validationResult.signature_valid ? 'text-green-800' : 'text-red-800'}>
                                                Assinatura digital {validationResult.signature_valid ? 'válida' : 'inválida'}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-gray-600">
                                            Verificado em: {new Date(validationResult.verified_at).toLocaleString('pt-BR')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Alert>
                    )}

                    {/* Erro */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Erro</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Botão Validar */}
                    <Button
                        className="w-full bg-orange-600 hover:bg-orange-700"
                        onClick={handleValidate}
                        disabled={!selectedFile || isValidating}
                    >
                        {isValidating ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Validando...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Validar Documento
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
