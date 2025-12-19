'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { ExternalTaskService } from '@/services/ordoc-cidadao';
import Tasks from './Tasks';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const TasksContainer = () => {
  const params = useParams();
  const procedureId = params?.id as string;

  // Mock data for now - replace with real API calls
  const { isLoading, isError, data: tasks } = useQuery({
    queryKey: ['procedureTasks', procedureId],
    queryFn: async () => {
      // Mock task data - replace with real service call
      return [
        {
          id: 1,
          name: 'Análise de documentação',
          status: 'completed',
          assignedTo: { name: 'Maria Santos' },
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          completedAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 2,
          name: 'Verificação de dados',
          status: 'in_progress',
          assignedTo: { name: 'João Silva' },
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          completedAt: null,
        },
        {
          id: 3,
          name: 'Aprovação final',
          status: 'pending',
          assignedTo: { name: 'Ana Costa' },
          createdAt: new Date().toISOString(),
          completedAt: null,
        }
      ];
    },
    enabled: !!procedureId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Erro ao carregar tarefas do procedimento
        </AlertDescription>
      </Alert>
    );
  }

  return <Tasks tasks={tasks || []} />;
};

export default TasksContainer;
