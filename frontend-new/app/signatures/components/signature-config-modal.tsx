"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Save } from 'lucide-react'

interface SignatureConfigModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

type SignaturePosition = 'inferior_direito' | 'inferior_esquerdo' | 'superior_direito' | 'superior_esquerdo' | 'personalizado'
type SignatureTemplate = 'minimalista' | 'completo' | 'corporativo'

export function SignatureConfigModal({ open, onOpenChange }: SignatureConfigModalProps) {
    const [position, setPosition] = useState<SignaturePosition>('inferior_direito')
    const [template, setTemplate] = useState<SignatureTemplate>('minimalista')
    const [includeQR, setIncludeQR] = useState(true)

    const templates = [
        { id: 'minimalista', label: 'Minimalista', icon: '📝' },
        { id: 'completo', label: 'Completo', icon: '📄' },
        { id: 'corporativo', label: 'Corporativo', icon: '🏢' },
    ]

    const handleSave = () => {
        // TODO: Salvar configurações via API
        console.log('Salvando configurações:', { position, template, includeQR })
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Configurar Assinatura</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
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
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Salvar Configurações
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
