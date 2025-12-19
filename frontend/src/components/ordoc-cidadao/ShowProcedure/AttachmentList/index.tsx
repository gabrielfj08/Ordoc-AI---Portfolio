'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ExternalProcedureService } from '@/services/ordoc-cidadao';
import AttachmentList from './AttachmentList';
import { Card, CardContent } from '@/components/ui/card';

interface AttachmentListContainerProps {
  procedureId: number;
  value: any;
}

const AttachmentListContainer = ({ procedureId, value }: AttachmentListContainerProps) => {
  // Mock data for now - replace with real API calls
  const { isLoading, isError, data: attachments } = useQuery({
    queryKey: ['procedureAttachments', procedureId],
    queryFn: async () => {
      // Mock attachment data - replace with real service call
      return [
        {
          id: 1,
          name: 'documento.pdf',
          size: 1024000,
          url: '/api/attachments/1/download'
        },
        {
          id: 2,
          name: 'comprovante.jpg',
          size: 512000,
          url: '/api/attachments/2/download'
        }
      ];
    },
    enabled: !!procedureId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-red-500 text-sm">Erro ao carregar anexos</p>
        </CardContent>
      </Card>
    );
  }

  return <AttachmentList attachments={attachments || []} />;
};

export default AttachmentListContainer;
