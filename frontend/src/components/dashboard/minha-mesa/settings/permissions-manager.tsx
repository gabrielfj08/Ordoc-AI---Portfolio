'use client';

import React from 'react';
import {
    Shield,
    Check,
    X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

const modules = [
    { name: 'Documentos', key: 'docs' },
    { name: 'Workflow', key: 'flow' },
    { name: 'Assinaturas', key: 'sign' },
    { name: 'Analytics', key: 'analytics' },
    { name: 'Configurações', key: 'settings' },
];

const roles = [
    { name: 'Admin', permissions: { docs: true, flow: true, sign: true, analytics: true, settings: true } },
    { name: 'Gestor', permissions: { docs: true, flow: true, sign: true, analytics: true, settings: false } },
    { name: 'Editor', permissions: { docs: true, flow: true, sign: true, analytics: false, settings: false } },
    { name: 'Visualizador', permissions: { docs: true, flow: false, sign: false, analytics: false, settings: false } },
];

export const PermissionsManager = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-orange-600" />
                        Matriz de Permissões
                    </CardTitle>
                    <CardDescription>Visualize o acesso de cada perfil aos módulos do sistema.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Perfil</TableHead>
                                {modules.map(mod => (
                                    <TableHead key={mod.key} className="text-center">{mod.name}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.map((role) => (
                                <TableRow key={role.name}>
                                    <TableCell className="font-medium">
                                        <Badge variant="outline" className="font-mono">{role.name}</Badge>
                                    </TableCell>
                                    {modules.map(mod => (
                                        <TableCell key={mod.key} className="text-center">
                                            {role.permissions[mod.key as keyof typeof role.permissions] ? (
                                                <Check className="w-5 h-5 text-green-500 mx-auto" />
                                            ) : (
                                                <X className="w-5 h-5 text-red-300 mx-auto" />
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};
