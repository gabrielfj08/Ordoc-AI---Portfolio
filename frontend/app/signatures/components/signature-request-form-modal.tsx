"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    ChevronLeft,
    ChevronRight,
    FileText,
    Users,
    Settings,
    CheckCircle2,
    Plus,
    Trash2
} from 'lucide-react'
import { useSignatureRequests } from '../hooks/use-signature-requests'
import { CreateSignatureRequestDto, CreateSignerDto } from '../types'

interface SignatureRequestFormModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function SignatureRequestFormModal({
    open,
    onOpenChange,
    onSuccess
}: SignatureRequestFormModalProps) {
    const [currentStep, setCurrentStep] = useState(1)
    const { createRequest, loading } = useSignatureRequests()

    // Form data
    const [formData, setFormData] = useState<Partial<CreateSignatureRequestDto>>({
        title: '',
        description: '',
        document: '', // UUID do documento
        template: '', // UUID do template
        priority: 'normal',
        expires_at: null,
        require_sequential_signing: false,
        allow_decline: true,
        require_all_signatures: true,
        signers: [],
    })

    const [signers, setSigners] = useState<CreateSignerDto[]>([])
    const [currentSigner, setCurrentSigner] = useState<Partial<CreateSignerDto>>({
        signer_type: 'internal',
        email: '',
        full_name: '',
        phone: '',
        signing_order: 1,
        require_certificate: false,
    })

    const steps = [
        { number: 1, title: 'Informações Básicas', icon: FileText },
        { number: 2, title: 'Assinantes', icon: Users },
        { number: 3, title: 'Configurações', icon: Settings },
        { number: 4, title: 'Revisão', icon: CheckCircle2 },
    ]

    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleAddSigner = () => {
        if (currentSigner.email && currentSigner.full_name) {
            setSigners([
                ...signers,
                {
                    ...currentSigner,
                    signing_order: signers.length + 1,
                } as CreateSignerDto,
            ])
            setCurrentSigner({
                signer_type: 'internal',
                email: '',
                full_name: '',
                phone: '',
                signing_order: signers.length + 2,
                require_certificate: false,
            })
        }
    }

    const handleRemoveSigner = (index: number) => {
        const newSigners = signers.filter((_, i) => i !== index)
        // Reorder signing_order
        const reorderedSigners = newSigners.map((signer, i) => ({
            ...signer,
            signing_order: i + 1,
        }))
        setSigners(reorderedSigners)
    }

    const handleSubmit = async () => {
        try {
            const requestData: CreateSignatureRequestDto = {
                ...formData,
                signers,
            } as CreateSignatureRequestDto

            await createRequest(requestData)

            // Reset form
            setFormData({
                title: '',
                description: '',
                document: '',
                template: '',
                priority: 'normal',
                expires_at: null,
                require_sequential_signing: false,
                allow_decline: true,
                require_all_signatures: true,
                signers: [],
            })
            setSigners([])
            setCurrentStep(1)

            onSuccess?.()
            onOpenChange(false)
        } catch (error) {
            // Error handled by hook
        }
    }

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return formData.title && formData.document && formData.template
            case 2:
                return signers.length > 0
            case 3:
                return true
            case 4:
                return true
            default:
                return false
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Nova Solicitação de Assinatura</DialogTitle>
                </DialogHeader>

                {/* Steps Indicator */}
                <div className="flex items-center justify-between mb-6">
                    {steps.map((step, index) => {
                        const Icon = step.icon
                        const isActive = currentStep === step.number
                        const isCompleted = currentStep > step.number

                        return (
                            <div key={step.number} className="flex items-center flex-1">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted
                                                ? 'bg-green-100 text-green-600'
                                                : isActive
                                                    ? 'bg-orange-100 text-orange-600'
                                                    : 'bg-gray-100 text-gray-400'
                                            }`}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle2 className="h-5 w-5" />
                                        ) : (
                                            <Icon className="h-5 w-5" />
                                        )}
                                    </div>
                                    <span className={`text-xs mt-1 ${isActive ? 'font-semibold' : 'text-muted-foreground'}`}>
                                        {step.title}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-2 ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}`} />
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Step Content */}
                <div className="space-y-4 max-h-[50vh] overflow-y-auto">
                    {/* Step 1: Basic Information */}
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Título da Solicitação *</Label>
                                <Input
                                    id="title"
                                    placeholder="Ex: Assinatura de Contrato de Prestação de Serviços"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descrição</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Descreva o propósito desta solicitação..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="document">Documento *</Label>
                                <Select
                                    value={formData.document}
                                    onValueChange={(value) => setFormData({ ...formData, document: value })}
                                >
                                    <SelectTrigger id="document">
                                        <SelectValue placeholder="Selecione o documento" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="doc-1">Contrato_Prestacao_Servicos.pdf</SelectItem>
                                        <SelectItem value="doc-2">Proposta_Comercial.pdf</SelectItem>
                                        <SelectItem value="doc-3">Termo_Adesao.pdf</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="template">Template de Assinatura *</Label>
                                <Select
                                    value={formData.template}
                                    onValueChange={(value) => setFormData({ ...formData, template: value })}
                                >
                                    <SelectTrigger id="template">
                                        <SelectValue placeholder="Selecione o template" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tpl-1">Assinatura Padrão</SelectItem>
                                        <SelectItem value="tpl-2">Assinatura com QR Code</SelectItem>
                                        <SelectItem value="tpl-3">Assinatura Avançada</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="priority">Prioridade</Label>
                                    <Select
                                        value={formData.priority}
                                        onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                                    >
                                        <SelectTrigger id="priority">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Baixa</SelectItem>
                                            <SelectItem value="normal">Normal</SelectItem>
                                            <SelectItem value="high">Alta</SelectItem>
                                            <SelectItem value="urgent">Urgente</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="expires_at">Data de Expiração</Label>
                                    <Input
                                        id="expires_at"
                                        type="datetime-local"
                                        value={formData.expires_at || ''}
                                        onChange={(e) => setFormData({ ...formData, expires_at: e.target.value || null })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Signers */}
                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <Card className="p-4 space-y-4">
                                <h3 className="font-semibold">Adicionar Assinante</h3>

                                <div className="space-y-2">
                                    <Label htmlFor="signer_type">Tipo</Label>
                                    <Select
                                        value={currentSigner.signer_type}
                                        onValueChange={(value: any) => setCurrentSigner({ ...currentSigner, signer_type: value })}
                                    >
                                        <SelectTrigger id="signer_type">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="internal">Interno</SelectItem>
                                            <SelectItem value="external">Externo</SelectItem>
                                            <SelectItem value="email_only">Apenas Email</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="full_name">Nome Completo *</Label>
                                        <Input
                                            id="full_name"
                                            placeholder="João Silva"
                                            value={currentSigner.full_name}
                                            onChange={(e) => setCurrentSigner({ ...currentSigner, full_name: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="joao@empresa.com"
                                            value={currentSigner.email}
                                            onChange={(e) => setCurrentSigner({ ...currentSigner, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telefone</Label>
                                    <Input
                                        id="phone"
                                        placeholder="(11) 99999-9999"
                                        value={currentSigner.phone}
                                        onChange={(e) => setCurrentSigner({ ...currentSigner, phone: e.target.value })}
                                    />
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleAddSigner}
                                    disabled={!currentSigner.email || !currentSigner.full_name}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Adicionar Assinante
                                </Button>
                            </Card>

                            {/* Signers List */}
                            {signers.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="font-semibold">Assinantes ({signers.length})</h3>
                                    {signers.map((signer, index) => (
                                        <Card key={index} className="p-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Badge variant="outline">{signer.signing_order}</Badge>
                                                    <div>
                                                        <p className="font-medium text-sm">{signer.full_name}</p>
                                                        <p className="text-xs text-muted-foreground">{signer.email}</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemoveSigner(index)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Settings */}
                    {currentStep === 3 && (
                        <div className="space-y-4">
                            <Card className="p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Assinatura Sequencial</p>
                                        <p className="text-sm text-muted-foreground">
                                            Os assinantes devem assinar na ordem definida
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={formData.require_sequential_signing}
                                        onChange={(e) => setFormData({ ...formData, require_sequential_signing: e.target.checked })}
                                        className="h-4 w-4"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Permitir Recusa</p>
                                        <p className="text-sm text-muted-foreground">
                                            Assinantes podem recusar a assinatura
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={formData.allow_decline}
                                        onChange={(e) => setFormData({ ...formData, allow_decline: e.target.checked })}
                                        className="h-4 w-4"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Requer Todas as Assinaturas</p>
                                        <p className="text-sm text-muted-foreground">
                                            Todos os assinantes devem assinar para completar
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={formData.require_all_signatures}
                                        onChange={(e) => setFormData({ ...formData, require_all_signatures: e.target.checked })}
                                        className="h-4 w-4"
                                    />
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* Step 4: Review */}
                    {currentStep === 4 && (
                        <div className="space-y-4">
                            <Card className="p-4 space-y-3">
                                <h3 className="font-semibold">Resumo da Solicitação</h3>

                                <div className="space-y-2 text-sm">
                                    <div className="grid grid-cols-3 gap-2">
                                        <span className="text-muted-foreground">Título:</span>
                                        <span className="col-span-2 font-medium">{formData.title}</span>
                                    </div>

                                    {formData.description && (
                                        <div className="grid grid-cols-3 gap-2">
                                            <span className="text-muted-foreground">Descrição:</span>
                                            <span className="col-span-2">{formData.description}</span>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-3 gap-2">
                                        <span className="text-muted-foreground">Prioridade:</span>
                                        <span className="col-span-2 capitalize">{formData.priority}</span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        <span className="text-muted-foreground">Assinantes:</span>
                                        <span className="col-span-2">{signers.length}</span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        <span className="text-muted-foreground">Assinatura Sequencial:</span>
                                        <span className="col-span-2">{formData.require_sequential_signing ? 'Sim' : 'Não'}</span>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-4">
                                <h3 className="font-semibold mb-3">Assinantes</h3>
                                <div className="space-y-2">
                                    {signers.map((signer, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm">
                                            <Badge variant="outline" className="w-6 h-6 flex items-center justify-center p-0">
                                                {signer.signing_order}
                                            </Badge>
                                            <span>{signer.full_name}</span>
                                            <span className="text-muted-foreground">({signer.email})</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Anterior
                    </Button>

                    {currentStep < 4 ? (
                        <Button
                            type="button"
                            onClick={handleNext}
                            disabled={!canProceed()}
                            className="bg-orange-600 hover:bg-orange-700"
                        >
                            Próximo
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading || !canProceed()}
                            className="bg-orange-600 hover:bg-orange-700"
                        >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            {loading ? 'Criando...' : 'Criar Solicitação'}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
