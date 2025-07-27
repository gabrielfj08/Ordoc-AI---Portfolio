import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useExternalAuth } from '../../../../hooks';
import { ExternalProcedureTemplateService } from '../../../../services/flow-cidadao';
import { ProcedureTemplateSelectContainerProps } from './types';
import ProcedureTemplateSelect from './ProcedureTemplate';
import SelectSkeleton from '../Skeleton';
import SelectError from '../Error';

const ProcedureTemplateSelectContainer = ({
  formik,
}: ProcedureTemplateSelectContainerProps) => {
  const { subdomain } = useAuth();
  const { externalToken } = useExternalAuth();

  const { isLoading, isFetching, isError, data } = useQuery({
    queryKey: ['procedureTemplatesExternal', subdomain, externalToken, {}],
    queryFn: () =>
      ExternalProcedureTemplateService.index(
        externalToken as string,
        subdomain,
        {
          order: 'name',
          direction: 'asc',
          q: '',
          perPage: 10,
          root: true,
        }
      ),
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
      items={data.procedureTemplates.map((item: any) => {
        return { label: item.name, value: item.id };
      })}
    />
  );
};

export default ProcedureTemplateSelectContainer;
