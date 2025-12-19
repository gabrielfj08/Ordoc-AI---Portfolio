'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { ExternalProcedureService } from '@/services/ordoc-cidadao';
import Report from './Report';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ReportContainer = () => {
  const params = useParams();
  const procedureId = params?.id as string;

  // Mock data for now - replace with real API calls
  const { isLoading, isError, data: reportData } = useQuery({
    queryKey: ['procedureReport', procedureId],
    queryFn: async () => {
      // Mock report data - replace with real service call
      return {
        messages: [
          {
            id: 1,
            createdAt: new Date().toISOString(),
            message: 'Procedimento criado pelo cidadão',
            user: { name: 'Sistema' },
            type: 'system'
          },
          {
            id: 2,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            message: 'Documentação recebida e em análise',
            user: { name: 'João Silva - Atendente' },
            type: 'user'
          }
        ]
      };
    },
    enabled: !!procedureId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Erro ao carregar histórico do procedimento
        </AlertDescription>
      </Alert>
    );
  }

  if (!reportData) {
    return <div>Carregando relatório...</div>;
  }
  
  return <Report reportData={reportData} />;
};

export default ReportContainer;
