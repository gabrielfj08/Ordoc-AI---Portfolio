"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, X, Plus } from 'lucide-react'
import { useCertificates } from '../hooks/use-certificates'

interface AddCertificateModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AddCertificateModal({ open, onOpenChange }: AddCertificateModalProps) {
    const { uploadCertificate, loading } = useCertificates()
    const [formData, setFormData] = useState({
        name: '',
        type: 'A1',
        validUntil: '',
        password: '',
    })
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedFile) {
            return
        }

        try {
            await uploadCertificate(
                selectedFile,
                formData.password || undefined,
                formData.type,
                false
            )

            // Reset form
            setFormData({ name: '', type: 'A1', validUntil: '', password: '' })
            setSelectedFile(null)
            onOpenChange(false)
        } catch (error) {
            // Error já tratado no hook
        }
    }

    const handleCancel = () => {
        setFormData({ name: '', type: 'A1', validUntil: '', password: '' })
        setSelectedFile(null)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Adicionar Certificado</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nome do Certificado */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome do Certificado</Label>
                        <Input
                            id="name"
                            placeholder="Ex: Certificado Empresa LTDA"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    {/* Tipo */}
                    <div className="space-y-2">
                        <Label htmlFor="type">Tipo</Label>
                        <Select
                            value={formData.type}
                            onValueChange={(value) => setFormData({ ...formData, type: value })}
                        >
                            <SelectTrigger id="type">
                                <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="A1">A1 (armazenado no computador)</SelectItem>
                                <SelectItem value="A3">A3 (cartão/token)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Válido até */}
                    <div className="space-y-2">
                        <Label htmlFor="validUntil">Válido até</Label>
                        <Input
                            id="validUntil"
                            type="date"
                            value={formData.validUntil}
                            onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                        />
                    </div>

                    {/* Senha (opcional para A1) */}
                    {formData.type === 'A1' && (
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha do Certificado (opcional)</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Digite a senha do certificado"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    )}

                    {/* Arquivo do Certificado */}
                    <div className="space-y-2">
                        <Label htmlFor="file">Arquivo do Certificado (.pfx ou .p12)</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="file"
                                type="file"
                                accept=".pfx,.p12"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => document.getElementById('file')?.click()}
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                {selectedFile ? selectedFile.name : 'Escolher arquivo'}
                            </Button>
                            {selectedFile && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedFile(null)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        {!selectedFile && (
                            <p className="text-xs text-muted-foreground">Nenhum arquivo escolhido</p>
                        )}
                    </div>

                    {/* Botões */}
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="bg-orange-600 hover:bg-orange-700"
                            disabled={loading || !selectedFile}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            {loading ? 'Adicionando...' : 'Adicionar'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
