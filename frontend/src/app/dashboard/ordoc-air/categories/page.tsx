'use client';

import React, { useState } from 'react';
import {
    FolderIcon,
    PencilIcon,
    TrashIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    CheckBadgeIcon
} from '@heroicons/react/24/outline';
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
import { MoreHorizontal } from 'lucide-react';

// Mock Data for Categories
const initialCategories = [
    { id: 1, name: 'Financeiro', description: 'Documentos fiscais, faturas e comprovantes', docCount: 154, status: 'Ativo', lastUpdate: '12/12/2024' },
    { id: 2, name: 'Recursos Humanos', description: 'Contratos, holerites e feedback', docCount: 89, status: 'Ativo', lastUpdate: '10/12/2024' },
    { id: 3, name: 'Jurídico', description: 'Contratos legais, termos e NDAs', docCount: 234, status: 'Ativo', lastUpdate: '15/12/2024' },
    { id: 4, name: 'Marketing', description: 'Assets de marca, campanhas e briefings', docCount: 45, status: 'Ativo', lastUpdate: '01/12/2024' },
    { id: 5, name: 'Operacional', description: 'Manuais, procedimentos e relatórios diários', docCount: 312, status: 'Ativo', lastUpdate: '18/12/2024' },
    { id: 6, name: 'Projetos', description: 'Documentação técnica de projetos', docCount: 67, status: 'Arquivado', lastUpdate: '20/11/2024' },
];

export default function CategoriesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState(initialCategories);

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ProtectedRoute>
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Categorias</h2>
                        <p className="text-muted-foreground">
                            Gerencie as categorias de classificação dos documentos.
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Nova Categoria
                        </Button>
                    </div>
                </div>

                <div className="flex items-center space-x-2 py-4">
                    <div className="relative flex-1 max-w-sm">
                        <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar categorias..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Listagem</CardTitle>
                        <CardDescription>
                            Visualize e edite as categorias disponíveis no sistema.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Descrição</TableHead>
                                    <TableHead>Documentos</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Última Atualização</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCategories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center">
                                                <FolderIcon className="mr-2 h-4 w-4 text-blue-500" />
                                                {category.name}
                                            </div>
                                        </TableCell>
                                        <TableCell>{category.description}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="rounded-full">
                                                {category.docCount}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={category.status === 'Ativo' ? 'default' : 'secondary'} className={category.status === 'Ativo' ? 'bg-green-500 hover:bg-green-600' : ''}>
                                                {category.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{category.lastUpdate}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Abrir menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                    <DropdownMenuItem>
                                                        <PencilIcon className="mr-2 h-4 w-4" />
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600">
                                                        <TrashIcon className="mr-2 h-4 w-4" />
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
