'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ExternalProcedureTemplateService } from '@/services/ordoc-cidadao';
import ProcedureInfoPreview from './ProcedureInfoPreview';
import { Card, CardContent } from '@/components/ui/card';

interface ProcedureInfoPreviewContainerProps {
  formik: any;
  procedureTemplateId: number;
  subjectId: number;
}

const ProcedureInfoPreviewContainer = ({
  formik,
  procedureTemplateId,
  subjectId,
}: ProcedureInfoPreviewContainerProps) => {
  // Mock data for now - replace with real API calls
  const { isLoading, data: procedureTemplate } = useQuery({
    queryKey: ['procedureTemplate', procedureTemplateId],
    queryFn: async () => {
      // Mock data - replace with real service call
      const mockTemplates = {
        1: { id: 1, name: 'Solicitação de Certidão' },
        2: { id: 2, name: 'Licença de Funcionamento' },
        3: { id: 3, name: 'Alvará de Construção' },
        4: { id: 4, name: 'Cadastro de Contribuinte' },
      };
      return mockTemplates[procedureTemplateId as keyof typeof mockTemplates];
    },
    enabled: !!procedureTemplateId,
  });

  const { isLoading: isLoadingSubject, data: subject } = useQuery({
    queryKey: ['procedureSubject', subjectId],
    queryFn: async () => {
      // Mock data - replace with real service call
      const mockSubjects = {
        11: { id: 11, name: 'Certidão de Nascimento', groupRequester: { name: 'Cartório Civil' } },
        12: { id: 12, name: 'Certidão de Casamento', groupRequester: { name: 'Cartório Civil' } },
        21: { id: 21, name: 'Licença Comercial', groupRequester: { name: 'Secretaria de Desenvolvimento' } },
        31: { id: 31, name: 'Alvará Residencial', groupRequester: { name: 'Secretaria de Obras' } },
        41: { id: 41, name: 'Pessoa Física', groupRequester: { name: 'Secretaria da Fazenda' } },
      };
      return mockSubjects[subjectId as keyof typeof mockSubjects];
    },
    enabled: !!subjectId,
  });

  if (isLoading || isLoadingSubject) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <ProcedureInfoPreview
      subject={subject}
      procedureTemplate={procedureTemplate}
    />
  );
};

export default ProcedureInfoPreviewContainer;
