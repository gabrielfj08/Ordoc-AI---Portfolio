import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../../hooks';
import { ProcedureTemplateSelectOptionsContainerProps } from './types';
import { ProcedureTemplateService } from '../../../../../../services/printer-flow';
import SelectProcedureTemplateOptions from './Options';

const ProcedureTemplateSelectOptionsContainer = ({
  query,
  setError,
  open,
}: ProcedureTemplateSelectOptionsContainerProps) => {
  const { subdomain, token } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['procedureTemplates', subdomain, token, query, {}],
    queryFn: () =>
      ProcedureTemplateService.index(token, subdomain, {
        q: query,
        perPage: 10,
        order: 'name',
        direction: 'asc',
        status: 'active',
        root: true,
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
        open ? 'bg-white' : 'bg-transparent'
      } py-1 z-40`}
    >
      <SelectProcedureTemplateOptions
        procedureTemplates={data.procedureTemplates}
        isError={isError}
      />
    </div>
  );
};

export default ProcedureTemplateSelectOptionsContainer;
