'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Eye, Calendar, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

export default function ProceduresPage() {
  const router = useRouter();

  // Mock data for procedures - replace with real API call
  const { data: procedures, isLoading } = useQuery({
    queryKey: ['userProcedures'],
    queryFn: async () => [
      {
        id: 1,
        name: 'Certidão de Nascimento',
        status: 'started',
        createdAt: '2024-01-15T10:30:00Z',
        requester: 'João da Silva'
      },
      {
        id: 2,
        name: 'Licença Comercial',
        status: 'running',
        createdAt: '2024-01-10T14:20:00Z',
        requester: 'Maria Santos'
      },
      {
        id: 3,
        name: 'Alvará de Construção',
        status: 'finished',
        createdAt: '2024-01-05T09:15:00Z',
        requester: 'Pedro Costa'
      }
    ]
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'started':
        return { label: 'TRAMITANDO', variant: 'default' as const };
      case 'running':
        return { label: 'EM ANÁLISE', variant: 'secondary' as const };
      case 'finished':
        return { label: 'FINALIZADO', variant: 'outline' as const };
      default:
        return { label: 'DESCONHECIDO', variant: 'secondary' as const };
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(dateString));
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">Meus Procedimentos</h1>
          <p className="text-gray-600">Acompanhe o status dos seus procedimentos</p>
        </div>
        <Button 
          onClick={() => router.push('/dashboard/ordoc-cidadao/procedures/new')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Procedimento
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Procedimentos</CardTitle>
        </CardHeader>
        <CardContent>
          {procedures && procedures.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Procedimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Solicitante</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {procedures.map((procedure) => {
                  const statusConfig = getStatusConfig(procedure.status);
                  return (
                    <TableRow key={procedure.id}>
                      <TableCell className="font-medium">{procedure.name}</TableCell>
                      <TableCell>
                        <Badge variant={statusConfig.variant}>
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          {procedure.requester}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          {formatDate(procedure.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/ordoc-cidadao/procedures/${procedure.id}`)}
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Você ainda não possui procedimentos</p>
              <Button 
                onClick={() => router.push('/dashboard/ordoc-cidadao/procedures/new')}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Criar Primeiro Procedimento
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
