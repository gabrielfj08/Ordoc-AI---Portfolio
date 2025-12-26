"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Shield, Plus } from 'lucide-react'
import { AddCertificateModal } from './add-certificate-modal'
import { useCertificates } from '../hooks/use-certificates'

interface ManageCertificatesModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ManageCertificatesModal({ open, onOpenChange }: ManageCertificatesModalProps) {
    const { certificates, loading } = useCertificates()
    const [showAddModal, setShowAddModal] = useState(false)

    const hasCertificates = certificates.length > 0

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Gerenciar Certificados Digitais</DialogTitle>
                    </DialogHeader>

                    {/* Card Certificados ICP-Brasil */}
                    <Card className="p-6 bg-orange-50 border-orange-200">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-white">
                                    <Shield className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">Certificados ICP-Brasil</h3>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {loading
                                            ? 'Carregando certificados...'
                                            : hasCertificates
                                                ? `${certificates.length} certificado${certificates.length > 1 ? 's' : ''} configurado${certificates.length > 1 ? 's' : ''}`
                                                : 'Gerencie seus certificados digitais A1 e A3 para assinaturas com validade jurídica'
                                        }
                                    </p>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                className="bg-orange-600 hover:bg-orange-700 text-white"
                                onClick={() => setShowAddModal(true)}
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Importar Novo Certificado
                            </Button>
                        </div>
                    </Card>
                </DialogContent>
            </Dialog>

            {/* Modal de Adicionar Certificado */}
            <AddCertificateModal open={showAddModal} onOpenChange={setShowAddModal} />
        </>
    )
}
