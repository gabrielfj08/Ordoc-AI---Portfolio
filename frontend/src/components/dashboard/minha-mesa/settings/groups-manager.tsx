'use client';

import React from 'react';
import {
    Plus,
    Search,
    MoreHorizontal,
    Users,
    ShieldCheck
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

const mockGroups = [
    { id: 1, name: 'Administradores', members: 2, permissions: 'Acesso Total', description: 'Controle total do sistema' },
    { id: 2, name: 'Financeiro', members: 5, permissions: 'Relatórios, Documentos', description: 'Acesso a contratos e financeiro' },
    { id: 3, name: 'RH', members: 3, permissions: 'Assinaturas, Documentos', description: 'Gestão de pessoal' },
];

export const GroupsManager = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar grupos..." className="pl-9 bg-background" />
                </div>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
                    <Plus className="w-4 h-4" /> Novo Grupo
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockGroups.map((group) => (
                    <Card key={group.id} className="border-border/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                                    <Users className="w-5 h-5 text-primary" />
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </div>
                            <CardTitle className="text-lg">{group.name}</CardTitle>
                            <CardDescription className="line-clamp-2 min-h-[40px]">{group.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 mb-4">
                                <ShieldCheck className="w-4 h-4 text-green-600" />
                                <span className="text-xs font-medium text-muted-foreground">{group.permissions}</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-border/50 pt-3">
                                <span className="text-xs text-muted-foreground">Membros</span>
                                <Badge variant="secondary">{group.members} usuários</Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
