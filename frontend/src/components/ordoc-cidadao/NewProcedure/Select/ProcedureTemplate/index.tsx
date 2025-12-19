'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ExternalProcedureTemplateService } from '@/services/ordoc-cidadao';
import { ProcedureTemplateSelectContainerProps } from './types';
import ProcedureTemplateSelect from './ProcedureTemplate';
import SelectSkeleton from '../Skeleton';
import SelectError from '../Error';

const ProcedureTemplateSelectContainer = ({
  formik,
}: ProcedureTemplateSelectContainerProps) => {
  // Mock data for now - replace with real API calls
  const { isLoading, isFetching, isError, data } = useQuery({
    queryKey: ['procedureTemplatesExternal'],
    queryFn: async () => {
      // Mock data - replace with real service call
      return {
        procedureTemplates: [
          { id: 1, name: 'Solicitação de Certidão' },
          { id: 2, name: 'Licença de Funcionamento' },
          { id: 3, name: 'Alvará de Construção' },
          { id: 4, name: 'Cadastro de Contribuinte' },
        ]
      };
    },
  });

  if (isLoading || isFetching) {
    return <SelectSkeleton />;
  }

  if (isError) {
    return <SelectError />;
  }

  return (
    <ProcedureTemplateSelect
      formik={formik}
      items={data?.procedureTemplates?.map((item: any) => ({
        label: item.name,
        value: item.id
      })) || []}
    />
  );
};

export default ProcedureTemplateSelectContainer;
