"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Plus, Filter } from 'lucide-react'
import { SignatureRequestCard } from './signature-request-card'
import { useSignatureRequests } from '../hooks/use-signature-requests'

interface SignatureRequestListProps {
    onCreateNew?: () => void
    onSelectRequest?: (id: string) => void
}

export function SignatureRequestList({ onCreateNew, onSelectRequest }: SignatureRequestListProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [priorityFilter, setPriorityFilter] = useState<string>('all')

    const { requests, loading, fetchRequests } = useSignatureRequests()

    // Filter requests based on search and filters
    const filteredRequests = requests.filter((request) => {
        const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.description?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || request.status === statusFilter
        const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter

        return matchesSearch && matchesStatus && matchesPriority
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Solicitações de Assinatura</h2>
                    <p className="text-muted-foreground">
                        {filteredRequests.length} {filteredRequests.length === 1 ? 'solicitação' : 'solicitações'}
                    </p>
                </div>
                <Button
                    className="bg-orange-600 hover:bg-orange-700"
                    onClick={onCreateNew}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Solicitação
                </Button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por título ou descrição..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos os Status</SelectItem>
                        <SelectItem value="draft">Rascunho</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="in_progress">Em Andamento</SelectItem>
                        <SelectItem value="completed">Concluído</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                        <SelectItem value="expired">Expirado</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-[180px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas as Prioridades</SelectItem>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* List */}
            {loading ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Carregando solicitações...</p>
                </div>
            ) : filteredRequests.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                        {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                            ? 'Nenhuma solicitação encontrada com os filtros aplicados'
                            : 'Nenhuma solicitação de assinatura ainda'}
                    </p>
                    {!searchTerm && statusFilter === 'all' && priorityFilter === 'all' && (
                        <Button
                            variant="outline"
                            onClick={onCreateNew}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Criar primeira solicitação
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredRequests.map((request) => (
                        <SignatureRequestCard
                            key={request.id}
                            request={request}
                            onClick={() => onSelectRequest?.(request.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
