'use client';

import React from 'react';
import {
    ShieldCheck,
    Plus,
    Search,
    MoreHorizontal,
    CheckCircle2,
    XCircle,
    Layers
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

const mockPolicies = [
    { id: 1, name: 'Admin Full Access', description: 'Acesso total a todos os recursos do sistema', effect: 'allow', type: 'Sistema', scope: 'Global' },
    { id: 2, name: 'Visualização de Documentos', description: 'Permite apenas visualizar documentos, sem editar', effect: 'allow', type: 'Personalizada', scope: 'OrdocAir' },
    { id: 3, name: 'Bloqueio Financeiro', description: 'Nega acesso aos módulos financeiros', effect: 'deny', type: 'Personalizada', scope: 'Financeiro' },
];

export const AccessPoliciesManager = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar políticas..." className="pl-9 bg-background" />
                </div>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
                    <Plus className="w-4 h-4" /> Nova Política
                </Button>
            </div>

            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-orange-600" />
                        Políticas de Acesso
                    </CardTitle>
                    <CardDescription>Defina regras granulares de permissão para recursos e dados.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Política</TableHead>
                                <TableHead>Escopo</TableHead>
                                <TableHead>Efeito</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockPolicies.map((policy) => (
                                <TableRow key={policy.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{policy.name}</span>
                                            <span className="text-xs text-muted-foreground max-w-md truncate">{policy.description}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Layers className="w-3 h-3 text-muted-foreground" />
                                            {policy.scope}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {policy.effect === 'allow' ? (
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
                                                <CheckCircle2 className="w-3 h-3" /> Permitir
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1">
                                                <XCircle className="w-3 h-3" /> Negar
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="font-normal text-xs">
                                            {policy.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>Visualizar Regras</DropdownMenuItem>
                                                <DropdownMenuItem>Duplicar</DropdownMenuItem>
                                                {policy.type !== 'Sistema' && (
                                                    <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                                                )}
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
