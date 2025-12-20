'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
    ArrowLeft,
    FileCheck,
    ShieldCheck,
    Download,
    Calendar,
    Search,
    BadgeCheck
} from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import signatureService, { SignatureAssignment } from '@/services/signature';

// Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function OrdocSignSignedPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const { data: assignments, isLoading } = useQuery<SignatureAssignment[]>({
        queryKey: ['my-signature-assignments'],
        queryFn: () => signatureService.getMyAssignments(),
    });

    const signedAssignments = assignments?.filter(a =>
        a.status === 'signed' &&
        a.signature_request.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <ProtectedRoute>
            <div className="flex-1 space-y-4 p-8 pt-6">

                {/* Header */}
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Documentos Assinados</h2>
                        <p className="text-muted-foreground">
                            Histórico de documentos que você já assinou digitalmente.
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" onClick={() => router.push('/dashboard/ordoc-sign')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center space-x-2 py-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar nos assinados..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>

                {/* Content */}
                <Card>
                    <CardHeader>
                        <CardTitle>Arquivo Morto</CardTitle>
                        <CardDescription>Lista completa de suas assinaturas realizadas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center p-8">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : signedAssignments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                                <div className="bg-gray-100 p-4 rounded-full">
                                    <FileCheck className="h-10 w-10 text-gray-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium">Nenhum documento assinado</h3>
                                    <p className="text-muted-foreground mt-1">
                                        Documentos que você assinar aparecerão aqui.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Documento</TableHead>
                                        <TableHead>Data da Assinatura</TableHead>
                                        <TableHead>Validade</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {signedAssignments.map((assignment) => (
                                        <TableRow key={assignment.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <BadgeCheck className="h-4 w-4 text-green-600" />
                                                    <span>{assignment.signature_request.title}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center text-muted-foreground text-sm">
                                                    <Calendar className="mr-1 h-3 w-3" />
                                                    {assignment.signed_at ? new Date(assignment.signed_at).toLocaleDateString('pt-BR') : '-'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                                    Assinado
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Baixar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </ProtectedRoute>
    );
}
