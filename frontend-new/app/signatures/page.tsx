"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Shield, CheckCircle2, FileText, Settings, ChevronRight, ListChecks } from 'lucide-react'
import {
    ManageCertificatesModal,
    AddCertificateModal,
    ValidatorModal,
    AuditLogsModal,
    SignatureConfigModal,
    SignatureRequestList,
    SignatureRequestDetailModal,
    SignatureRequestFormModal
} from './components'
import { useCertificates } from './hooks/use-certificates'

export default function SignaturesPage() {
    const { certificates } = useCertificates()

    // Modals state
    const [showManageCertificates, setShowManageCertificates] = useState(false)
    const [showAddCertificate, setShowAddCertificate] = useState(false)
    const [showValidator, setShowValidator] = useState(false)
    const [showAuditLogs, setShowAuditLogs] = useState(false)
    const [showConfig, setShowConfig] = useState(false)
    const [showCreateRequest, setShowCreateRequest] = useState(false)
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)

    const features = [
        {
            id: 'certificates',
            icon: Shield,
            title: 'Certificados Digitais',
            description: 'Gerencie certificados ICP-Brasil (A1)',
            iconColor: 'text-orange-600',
            bgColor: 'bg-orange-100',
            action: () => setShowManageCertificates(true),
        },
        {
            id: 'validator',
            icon: CheckCircle2,
            title: 'Validador de Assinaturas',
            description: 'Verifique autenticidade e validade',
            iconColor: 'text-green-600',
            bgColor: 'bg-green-100',
            action: () => setShowValidator(true),
        },
        {
            id: 'logs',
            icon: FileText,
            title: 'Logs de Autenticação',
            description: 'Histórico de uso e autenticações',
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-100',
            action: () => setShowAuditLogs(true),
        },
        {
            id: 'config',
            icon: Settings,
            title: 'Configurar Assinatura',
            description: 'Templates e posicionamento',
            iconColor: 'text-purple-600',
            bgColor: 'bg-purple-100',
            action: () => setShowConfig(true),
        },
    ]

    const hasCertificates = certificates.length > 0

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="container mx-auto px-6 py-6">
                <div>
                    <h1 className="text-2xl font-bold">Central de Assinaturas e Certificados</h1>
                    <p className="text-muted-foreground mt-1">
                        Gestão de identidade digital, validações ICP-Brasil e logs de auditoria
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 pb-8">
                <Tabs defaultValue="requests" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="requests" className="gap-2">
                            <ListChecks className="h-4 w-4" />
                            Solicitações
                        </TabsTrigger>
                        <TabsTrigger value="tools" className="gap-2">
                            <Settings className="h-4 w-4" />
                            Ferramentas
                        </TabsTrigger>
                    </TabsList>

                    {/* Tab: Solicitações */}
                    <TabsContent value="requests" className="space-y-6">
                        <SignatureRequestList
                            onCreateNew={() => setShowCreateRequest(true)}
                            onSelectRequest={(id) => setSelectedRequestId(id)}
                        />
                    </TabsContent>

                    {/* Tab: Ferramentas */}
                    <TabsContent value="tools" className="space-y-6">
                        {/* Feature Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature) => {
                                const Icon = feature.icon
                                return (
                                    <Card
                                        key={feature.id}
                                        className="p-6 hover:shadow-lg transition-all cursor-pointer group"
                                        onClick={feature.action}
                                    >
                                        <div className="flex flex-col h-full">
                                            <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                                                <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                                            </div>
                                            <h3 className="font-semibold mb-2">{feature.title}</h3>
                                            <p className="text-sm text-muted-foreground mb-4 flex-1">{feature.description}</p>
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-between text-orange-600 hover:text-orange-700 hover:bg-orange-50 group-hover:bg-orange-50"
                                            >
                                                Acessar
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>

                        {/* Quick Access Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Meus Certificados */}
                            <Card className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-orange-100">
                                        <Shield className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <h2 className="text-lg font-semibold">Meus Certificados</h2>
                                </div>

                                <div className="flex flex-col items-center justify-center py-12">
                                    <Shield className="h-16 w-16 text-muted-foreground/30 mb-4" />
                                    <p className="text-muted-foreground mb-4">
                                        {hasCertificates
                                            ? `${certificates.length} certificado${certificates.length > 1 ? 's' : ''} configurado${certificates.length > 1 ? 's' : ''}`
                                            : 'Nenhum certificado configurado'
                                        }
                                    </p>
                                    <Button
                                        className="bg-orange-600 hover:bg-orange-700"
                                        onClick={() => setShowAddCertificate(true)}
                                    >
                                        <Shield className="h-4 w-4 mr-2" />
                                        {hasCertificates ? 'Gerenciar Certificados' : 'Adicionar Certificado'}
                                    </Button>
                                </div>
                            </Card>

                            {/* Validador de Assinaturas */}
                            <Card className="p-6">
                                <h2 className="text-lg font-semibold mb-4">Validador de Assinaturas</h2>

                                <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        Verifique a autenticidade e validade jurídica de documentos assinados digitalmente
                                    </p>

                                    <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <FileText className="h-16 w-16 text-muted-foreground/30 mb-2" />
                                            <p className="text-sm text-muted-foreground">
                                                Arraste um arquivo aqui
                                                <br />
                                                ou clique para selecionar
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full bg-orange-600 hover:bg-orange-700"
                                        onClick={() => setShowValidator(true)}
                                    >
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        Validar Documento
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Modals */}
            <ManageCertificatesModal
                open={showManageCertificates}
                onOpenChange={setShowManageCertificates}
            />

            <AddCertificateModal
                open={showAddCertificate}
                onOpenChange={setShowAddCertificate}
            />

            <ValidatorModal
                open={showValidator}
                onOpenChange={setShowValidator}
            />

            <AuditLogsModal
                open={showAuditLogs}
                onOpenChange={setShowAuditLogs}
            />

            <SignatureConfigModal
                open={showConfig}
                onOpenChange={setShowConfig}
            />

            <SignatureRequestFormModal
                open={showCreateRequest}
                onOpenChange={setShowCreateRequest}
                onSuccess={() => {
                    // Refresh will happen automatically via hook
                }}
            />

            <SignatureRequestDetailModal
                requestId={selectedRequestId}
                open={!!selectedRequestId}
                onOpenChange={(open) => !open && setSelectedRequestId(null)}
            />
        </div>
    )
}
