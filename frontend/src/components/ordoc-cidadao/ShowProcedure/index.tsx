'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { ExternalProcedureService } from '@/services/ordoc-cidadao';
import ShowProcedure from './ShowProcedure';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShowProcedureContainerProps } from './types';

const ShowProcedureContainer = ({ setProcedureName }: ShowProcedureContainerProps) => {
  const params = useParams();
  const procedureId = params?.id as string;

  // Mock data for now - replace with real API calls
  const { isLoading, isError, data: procedure } = useQuery({
    queryKey: ['externalProcedure', procedureId],
    queryFn: async () => {
      // Mock procedure data - replace with real service call
      return {
        id: Number(procedureId),
        status: 'started',
        createdAt: new Date().toISOString(),
        requesterId: 1,
        requester: {
          name: 'João da Silva',
          email: 'joao@email.com'
        },
        parentProcedureTemplateName: 'Solicitação de Certidão',
        procedureTemplateName: 'Certidão de Nascimento',
        responsibleGroup: {
          name: 'Cartório Civil'
        },
        payload: [
          {
            label: 'Nome completo',
            fieldType: 'text',
            value: 'João da Silva Santos'
          },
          {
            label: 'Data de nascimento',
            fieldType: 'date',
            value: '1990-05-15'
          },
          {
            label: 'CPF',
            fieldType: 'cpf',
            value: '12345678901'
          }
        ]
      };
    },
    enabled: !!procedureId,
  });

  React.useEffect(() => {
    if (procedure) {
      setProcedureName(procedure.procedureTemplateName);
    }
  }, [procedure, setProcedureName]);

  const handleGenerateReport = () => {
    // TODO: Implement report generation
    console.log('Generate report for procedure:', procedureId);
  };

  if (isLoading) {
    return (
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
    );
  }

  if (isError || !procedure) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Erro ao carregar os dados do procedimento. Tente novamente mais tarde.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ShowProcedure 
      procedure={procedure} 
      generateReport={handleGenerateReport}
    />
  );
};

export default ShowProcedureContainer;
