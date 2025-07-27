import * as React from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { ProcedureTemplateService } from '../../../../services/printer-flow';
import {
  BaseProcedureTemplate,
  CreateProcedureTemplatePayload,
} from '../../../../services/printer-flow/types';
import { NewSubjectContainerProps, NewSubjectFormValues } from './types';
import NewSubjectError from './Error';
import NewSubjectSkeleton from './Skeleton';
import NewSubject from './New';

const NewSubjectContainer = ({
  parentProcedureTemplateId,
}: NewSubjectContainerProps) => {
  const { subdomain, token } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (payload: CreateProcedureTemplatePayload) =>
      ProcedureTemplateService.create(token, subdomain, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'procedureTemplatesSubject',
          subdomain,
          token,
          {},
        ]);
      },
    }
  );

  const { isLoading, isError, data } = useQuery({
    queryKey: ['procedureTemplates', subdomain, token, {}],
    queryFn: () =>
      ProcedureTemplateService.show(
        token,
        subdomain,
        parentProcedureTemplateId
      ),
  });

  if (isError) return <NewSubjectError />;

  if (isLoading) return <NewSubjectSkeleton />;

  const transformSource = (source: Array<string>): string => {
    if (source.includes('internal') && source.includes('external')) {
      return 'internal_external';
    }

    if (source.includes('external')) {
      return 'external';
    }

    if (source.includes('internal')) {
      return 'internal';
    }
    return data.source;
  };

  const handleSubmit = (
    values: NewSubjectFormValues
  ): Promise<BaseProcedureTemplate> => {
    return mutation.mutateAsync({
      ...values,
      source: transformSource(values.source),
    });
  };

  return (
    <NewSubject
      onSubmit={handleSubmit}
      parentProcedureTemplateId={parentProcedureTemplateId}
      source={data.source}
    />
  );
};

export default NewSubjectContainer;
