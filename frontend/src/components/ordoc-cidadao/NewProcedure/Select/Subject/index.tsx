'use client';

import * as React from 'react';
import { useFormikContext } from 'formik';
import { useQuery } from '@tanstack/react-query';
import { ExternalProcedureTemplateService } from '@/services/ordoc-cidadao';
import { SubjectSelectContainerProps } from './types';
import SelectSkeleton from '../Skeleton';
import SubjectSelect from './Subject';
import SubjectEmpty from './Empty';
import SelectError from '../Error';

const SubjectSelectContainer = ({
  formik,
  parentProcedureTemplateId,
}: SubjectSelectContainerProps) => {
  const { resetForm } = useFormikContext();

  // Mock data for now - replace with real API calls
  const { isLoading, isFetching, isError, data } = useQuery({
    queryKey: ['procedureTemplatesExternal', { parentProcedureTemplateId }],
    queryFn: async () => {
      if (!parentProcedureTemplateId) return { procedureTemplates: [] };
      
      // Mock data - replace with real service call
      const mockSubjects = {
        1: [
          { id: 11, name: 'Certidão de Nascimento' },
          { id: 12, name: 'Certidão de Casamento' },
          { id: 13, name: 'Certidão de Óbito' },
        ],
        2: [
          { id: 21, name: 'Licença Comercial' },
          { id: 22, name: 'Licença Industrial' },
        ],
        3: [
          { id: 31, name: 'Alvará Residencial' },
          { id: 32, name: 'Alvará Comercial' },
        ],
        4: [
          { id: 41, name: 'Pessoa Física' },
          { id: 42, name: 'Pessoa Jurídica' },
        ],
      };
      
      return {
        procedureTemplates: mockSubjects[parentProcedureTemplateId as keyof typeof mockSubjects] || []
      };
    },
    enabled: !!parentProcedureTemplateId,
  });

  React.useEffect(() => {
    resetForm({
      values: { procedureTemplateId: parentProcedureTemplateId },
    });
  }, [parentProcedureTemplateId, resetForm]);

  if (!parentProcedureTemplateId) return <SubjectEmpty />;

  if (isLoading || isFetching) {
    return <SelectSkeleton />;
  }

  if (isError) {
    return <SelectError />;
  }

  return (
    <SubjectSelect
      formik={formik}
      items={data?.procedureTemplates?.map((item: any) => ({
        label: item.name,
        value: item.id
      })) || []}
    />
  );
};

export default SubjectSelectContainer;
