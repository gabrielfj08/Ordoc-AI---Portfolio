"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Save, Loader2 } from 'lucide-react'
import { templatesApi } from '@/services/signatures-api'
import { useToast } from '@/hooks/use-toast'

interface SignatureConfigModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    templateId?: string // Se fornecido, atualiza; senão, cria novo
}

type SignaturePosition = 'inferior_direito' | 'inferior_esquerdo' | 'superior_direito' | 'superior_esquerdo' | 'personalizado'
type SignatureTemplate = 'minimalista' | 'completo' | 'corporativo'

export function SignatureConfigModal({ open, onOpenChange, templateId }: SignatureConfigModalProps) {
    const [position, setPosition] = useState<SignaturePosition>('inferior_direito')
    const [template, setTemplate] = useState<SignatureTemplate>('minimalista')
    const [includeQR, setIncludeQR] = useState(true)
    const [templateName, setTemplateName] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const { toast } = useToast()

    const templates = [
        { id: 'minimalista', label: 'Minimalista', icon: '📝' },
        { id: 'completo', label: 'Completo', icon: '📄' },
        { id: 'corporativo', label: 'Corporativo', icon: '🏢' },
    ]

    const handleSave = async () => {
        if (!templateName.trim()) {
            toast({
                title: 'Nome Obrigatório',
                description: 'Por favor, informe um nome para o template',
                variant: 'destructive',
            })
            return
        }

        setIsSaving(true)

        try {
            const templateData = {
                name: templateName,
                description: `Template ${template} com assinatura em ${position}`,
                signature_type: 'digital' as const,
                hash_algorithm: 'SHA256' as const,
                show_signature_image: true,
                signature_position: position,
                signature_size: {
                    width: template === 'minimalista' ? 150 : template === 'completo' ? 200 : 180,
                    height: template === 'minimalista' ? 50 : template === 'completo' ? 100 : 80,
                },
                require_reason: template === 'completo' || template === 'corporativo',
                require_location: template === 'completo' || template === 'corporativo',
                require_contact_info: template === 'completo',
                require_approval: template === 'corporativo',
                notify_signers: true,
                notify_completion: true,
                is_active: true,
                is_default: false,
            }

            if (templateId) {
                // Atualizar template existente
                await templatesApi.update(templateId, templateData)
                toast({
                    title: 'Configurações Atualizadas',
                    description: 'O template de assinatura foi atualizado com sucesso',
                })
            } else {
                // Criar novo template
                await templatesApi.create(templateData)
                toast({
                    title: 'Template Criado',
                    description: 'O template de assinatura foi criado com sucesso',
                })
            }

            onOpenChange(false)

            // Resetar formulário
            setTemplateName('')
            setPosition('inferior_direito')
            setTemplate('minimalista')
            setIncludeQR(true)
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Erro ao salvar configurações'
            toast({
                title: 'Erro ao Salvar',
                description: errorMessage,
                variant: 'destructive',
            })
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Configurar Assinatura</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Nome do Template */}
                    <div className="space-y-2">
                        <Label htmlFor="template-name">Nome do Template</Label>
                        <Input
                            id="template-name"
                            placeholder="Ex: Template Padrão da Empresa"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                        />
                    </div>

                    {/* Posição da Assinatura no PDF */}
                    <div className="space-y-2">
                        <Label htmlFor="position">Posição da Assinatura no PDF</Label>
                        <Select value={position} onValueChange={(value) => setPosition(value as SignaturePosition)}>
                            <SelectTrigger id="position">
                                <SelectValue placeholder="Selecione a posição" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="inferior_direito">Inferior Direito</SelectItem>
                                <SelectItem value="inferior_esquerdo">Inferior Esquerdo</SelectItem>
                                <SelectItem value="superior_direito">Superior Direito</SelectItem>
                                <SelectItem value="superior_esquerdo">Superior Esquerdo</SelectItem>
                                <SelectItem value="personalizado">Personalizado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Template de Assinatura Visual */}
                    <div className="space-y-3">
                        <Label>Template de Assinatura Visual</Label>
                        <div className="grid grid-cols-3 gap-3">
                            {templates.map((t) => (
                                <button
                                    key={t.id}
                                    type="button"
                                    className={`p-6 border-2 rounded-lg text-center transition-all hover:border-orange-400 ${template === t.id
                                            ? 'border-orange-500 bg-orange-50'
                                            : 'border-gray-200 hover:bg-gray-50'
                                        }`}
                                    onClick={() => setTemplate(t.id as SignatureTemplate)}
                                >
                                    <div className="text-3xl mb-2">{t.icon}</div>
                                    <p className="text-sm font-medium">{t.label}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Incluir código QR */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="qr-code"
                            checked={includeQR}
                            onCheckedChange={(checked) => setIncludeQR(checked as boolean)}
                        />
                        <div>
                            <label
                                htmlFor="qr-code"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                                Incluir código QR na assinatura
                            </label>
                            <p className="text-xs text-muted-foreground mt-1">
                                Para validação rápida via smartphone
                            </p>
                        </div>
                    </div>

                    {/* Botão Salvar */}
                    <Button
                        className="w-full bg-orange-600 hover:bg-orange-700"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Salvar Configurações
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
