'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  FileSignature,
  ShieldCheck,
  PenTool,
  CheckCircle,
  Clock
} from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import signatureService, { SignatureAssignment } from '@/services/signature';

// Components
import CertificateManager from '@/components/ordoc-sign/CertificateManager';
import DocumentSigner from '@/components/ordoc-sign/DocumentSigner';
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
import { Search } from 'lucide-react';

type View = 'list' | 'certificates' | 'sign';

export default function OrdocSignPage() {
  const router = useRouter(); // Although not used heavily, good to have
  const { data: assignments, isLoading } = useQuery<SignatureAssignment[]>({
    queryKey: ['my-signature-assignments'],
    queryFn: () => signatureService.getMyAssignments(),
  });

  const [view, setView] = useState<View>('list');
  const [signId, setSignId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const openSign = (id: string) => {
    setSignId(id);
    setView('sign');
  };

  const hasAssignments = (assignments && assignments.length > 0) || false;

  const filteredAssignments = assignments?.filter(a =>
    a.signature_request.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute>
      {view === 'list' && (
        <div className="flex-1 space-y-4 p-8 pt-6">

          {/* Header */}
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Assinaturas Pendentes</h2>
              <p className="text-muted-foreground">
                Gerencie documentos que aguardam sua assinatura digital.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => router.push('/dashboard/ordoc-sign')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <Button onClick={() => setView('certificates')}>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Meus Certificados
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2 py-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Documentos</CardTitle>
              <CardDescription>Lista de solicitações de assinatura atribuídas a você.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : !hasAssignments ? (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                  <div className="bg-green-50 p-4 rounded-full">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Tudo em dia!</h3>
                    <p className="text-muted-foreground mt-1">Você não tem documentos pendentes para assinar no momento.</p>
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Documento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data Recebimento</TableHead>
                      <TableHead className="text-right">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssignments?.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileSignature className="h-4 w-4 text-primary" />
                            <span>{assignment.signature_request.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                            {assignment.status === 'pending' ? 'Pendente' : assignment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-muted-foreground text-sm">
                            <Clock className="mr-1 h-3 w-3" />
                            Hoje {/* Placeholder for date if not in API */}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => openSign(assignment.id)}
                            disabled={!assignment.can_sign}
                          >
                            <PenTool className="mr-2 h-4 w-4" />
                            Assinar
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
      )}

      {/* Internal Views (Keeping logic wrapper but styles will depend on components) */}
      {view === 'certificates' && (
        <div className="p-8">
          <div className="mb-4">
            <Button variant="ghost" onClick={() => setView('list')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Lista
            </Button>
          </div>
          <CertificateManager onBack={() => setView('list')} />
        </div>
      )}

      {view === 'sign' && signId && (
        <div className="p-8 h-[calc(100vh-64px)]">
          <div className="mb-4">
            <Button variant="ghost" onClick={() => setView('list')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancelar / Voltar
            </Button>
          </div>
          <DocumentSigner assignmentId={signId} onBack={() => setView('list')} />
        </div>
      )}
    </ProtectedRoute>
  );
}
