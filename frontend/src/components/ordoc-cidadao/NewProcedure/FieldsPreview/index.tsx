'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ExternalProcedureTemplateService } from '@/services/ordoc-cidadao';
import ExternalFieldsPreview from './FieldsPreview';
import { Card, CardContent } from '@/components/ui/card';

interface ExternalFieldsPreviewContainerProps {
  procedureTemplateId: number;
  formik: any;
}

const ExternalFieldsPreviewContainer = ({
  procedureTemplateId,
  formik,
}: ExternalFieldsPreviewContainerProps) => {
  // Mock data for now - replace with real API calls
  const { isLoading, data: fields } = useQuery({
    queryKey: ['procedureFields', procedureTemplateId],
    queryFn: async () => {
      if (!procedureTemplateId) return [];
      
      // Mock field data - replace with real service call
      const mockFields = {
        11: [
          {
            fieldType: 'text',
            label: 'Nome completo',
            value: '',
            fieldValueOptions: []
          },
          {
            fieldType: 'date',
            label: 'Data de nascimento',
            value: '',
            fieldValueOptions: []
          }
        ],
        21: [
          {
            fieldType: 'text',
            label: 'Razão social',
            value: '',
            fieldValueOptions: []
          },
          {
            fieldType: 'select',
            label: 'Tipo de atividade',
            value: '',
            fieldValueOptions: [
              { value: 'Comércio' },
              { value: 'Serviços' },
              { value: 'Indústria' }
            ]
          }
        ]
      };
      
      return mockFields[procedureTemplateId as keyof typeof mockFields] || [];
    },
    enabled: !!procedureTemplateId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-3">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <ExternalFieldsPreview fields={fields} formik={formik} />;
};

export default ExternalFieldsPreviewContainer;
