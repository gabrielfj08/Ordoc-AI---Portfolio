'use client';

import React from 'react';
import {
    Building2,
    Plus,
    Search,
    MoreHorizontal,
    MapPin,
    Users,
    Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockOrgs = [
    { id: 1, name: 'Adsum Tec', cnpj: '12.345.678/0001-90', type: 'Matriz', status: 'active', city: 'São Paulo', state: 'SP', users: 15 },
    { id: 2, name: 'Adsum Tec - Filial RJ', cnpj: '12.345.678/0002-71', type: 'Filial', status: 'active', city: 'Rio de Janeiro', state: 'RJ', users: 5 },
    { id: 3, name: 'Parceiro Logística', cnpj: '98.765.432/0001-10', type: 'Parceiro', status: 'inactive', city: 'Curitiba', state: 'PR', users: 0 },
];

export const OrganizationsManager = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar organizações..." className="pl-9 bg-background" />
                </div>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
                    <Plus className="w-4 h-4" /> Nova Organização
                </Button>
            </div>

            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-orange-600" />
                        Organizações e Filiais
                    </CardTitle>
                    <CardDescription>Gerencie a estrutura corporativa e parceiros externos.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Organização</TableHead>
                                <TableHead>Localização</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Usuários</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockOrgs.map((org) => (
                                <TableRow key={org.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{org.name}</span>
                                            <span className="text-xs text-muted-foreground font-mono">{org.cnpj}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <MapPin className="w-3 h-3" />
                                            {org.city}/{org.state}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-normal capitalize">
                                            {org.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={org.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                                            {org.status === 'active' ? 'Ativa' : 'Inativa'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Users className="w-3 h-3 text-muted-foreground" />
                                            {org.users}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>Editar Detalhes</DropdownMenuItem>
                                                <DropdownMenuItem>Gerenciar Unidades</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Desativar</DropdownMenuItem>
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
    );
};
