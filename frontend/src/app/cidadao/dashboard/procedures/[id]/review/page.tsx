'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ReviewProcedureFields } from '@/components/ordoc-cidadao/ReviewProcedureFields';
import { ExternalProcedureService } from '@/services/ordoc-cidadao';
import type { ShowExternalProcedure } from '@/services/ordoc-cidadao';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ErrorState } from '@/components/ui/ErrorState';

export default function ProcedureReviewPage() {
  const params = useParams();
  const procedureId = parseInt(params.id as string);
  const [procedure, setProcedure] = useState<ShowExternalProcedure | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProcedure();
  }, [procedureId]);

  const loadProcedure = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('cidadao_token') || '';
      const response = await ExternalProcedureService.show(token, 'demo', procedureId);
      setProcedure(response.data);
    } catch (error) {
      console.error('Erro ao carregar procedimento:', error);
      setError('Erro ao carregar procedimento. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (values: any) => {
    try {
      const token = localStorage.getItem('cidadao_token') || '';
      await ExternalProcedureService.update(token, 'demo', procedureId, values);
      // Recarregar procedimento após atualização
      await loadProcedure();
    } catch (error) {
      console.error('Erro ao atualizar campos:', error);
      throw error;
    }
  };

  const handleFinalize = async () => {
    try {
      const token = localStorage.getItem('cidadao_token') || '';
      await ExternalProcedureService.run(token, 'demo', procedureId);
    } catch (error) {
      console.error('Erro ao finalizar procedimento:', error);
      throw error;
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <ErrorState
        title="Erro ao carregar procedimento"
        message={error}
        action={{
          label: "Tentar Novamente",
          onClick: loadProcedure
        }}
      />
    );
  }

  if (!procedure) {
    return (
      <ErrorState
        title="Procedimento não encontrado"
        message="O procedimento solicitado não foi encontrado."
      />
    );
  }

  return (
    <ReviewProcedureFields 
      procedure={procedure} 
      onUpdate={handleUpdate}
      onFinalize={handleFinalize}
    />
  );
}