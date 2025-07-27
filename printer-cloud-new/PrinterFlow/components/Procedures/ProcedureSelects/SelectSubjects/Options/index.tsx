import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../../hooks';
import { SubjectSelectOptionsContainerProps } from './types';
import { ProcedureTemplateService } from '../../../../../../services/printer-flow';
import SelectSubjectsOptions from './Options';

const SubjectSelectOptionsContainer = ({
  query,
  setError,
  open,
  procedureTemplateId,
}: SubjectSelectOptionsContainerProps) => {
  const { subdomain, token } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: [
      'procedureTemplates',
      subdomain,
      token,
      query,
      procedureTemplateId,
    ],
    queryFn: () =>
      ProcedureTemplateService.index(token, subdomain, {
        q: query,
        perPage: 10,
        order: 'name',
        direction: 'asc',
        status: 'active',
        parentProcedureTemplateId: procedureTemplateId,
      }),
  });

  if (isError) {
    setError(true);
    return null;
  }

  if (isLoading) return null;

  return (
    <div
      className={`absolute mt-1 max-h-60 w-full overflow-auto rounded-md shadow-lg ${
        open ? 'bg-white' : 'bg-transparente'
      } py-1 z-10`}
    >
      <SelectSubjectsOptions
        subjects={data.procedureTemplates}
        isError={isError}
      />
    </div>
  );
};

export default SubjectSelectOptionsContainer;
