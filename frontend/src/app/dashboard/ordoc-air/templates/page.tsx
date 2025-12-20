'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    FileText,
    Plus,
    Search,
    MoreVertical,
    Pencil,
    Trash2,
    Copy,
    FileCode
} from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock Data for Templates
const initialTemplates = [
    { id: 1, name: 'Contrato de Prestação de Serviços', category: 'Jurídico', version: '1.2', status: 'Ativo', lastUpdate: '10/12/2024' },
    { id: 2, name: 'Proposta Comercial Padrão', category: 'Comercial', version: '2.0', status: 'Ativo', lastUpdate: '15/12/2024' },
    { id: 3, name: 'Termo de Confidencialidade (NDA)', category: 'Jurídico', version: '1.0', status: 'Ativo', lastUpdate: '05/11/2024' },
    { id: 4, name: 'Briefing Inicial de Projeto', category: 'Projetos', version: '3.1', status: 'Rascunho', lastUpdate: '18/12/2024' },
    { id: 5, name: 'Solicitação de Férias', category: 'RH', version: '1.0', status: 'Ativo', lastUpdate: '20/10/2024' },
];

export default function TemplatesPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [templates, setTemplates] = useState(initialTemplates);

    const filteredTemplates = templates.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ProtectedRoute>
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Templates de Documentos</h2>
                        <p className="text-muted-foreground">
                            Crie e gerencie modelos para padronizar a documentação.
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button onClick={() => router.push('/dashboard/ordoc-air/templates/new')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Template
                        </Button>
                    </div>
                </div>

                <div className="flex items-center space-x-2 py-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar templates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Meus Templates</CardTitle>
                        <CardDescription>
                            Modelos disponíveis para geração de documentos.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Categoria</TableHead>
                                    <TableHead>Versão</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Última Atualização</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTemplates.map((template) => (
                                    <TableRow key={template.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center">
                                                <FileText className="mr-2 h-4 w-4 text-blue-500" />
                                                {template.name}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{template.category}</Badge>
                                        </TableCell>
                                        <TableCell>v{template.version}</TableCell>
                                        <TableCell>
                                            <Badge variant={template.status === 'Ativo' ? 'default' : 'secondary'} className={template.status === 'Ativo' ? 'bg-green-500 hover:bg-green-600' : ''}>
                                                {template.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{template.lastUpdate}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Abrir menu</span>
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => router.push('/dashboard/ordoc-air/templates/new')}>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Copy className="mr-2 h-4 w-4" />
                                                        Duplicar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Excluir
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </ProtectedRoute>
    );
}
