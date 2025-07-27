import * as React from 'react';
import router from 'next/router';
import { queryClient } from '../../queryClient';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth, useExternalAuth } from '../../hooks';
import { ExternalProcedureService } from '../../services/flow-cidadao';
import { UpdateProcedureFormValues } from './types';
import NewProcedureFields from './NewProcedureFields';
import NewFieldsPreviewSkeleton from './Skeleton';
import NewProceduresFieldError from './Error';

const NewProcedureFieldsContainer = () => {
  const { subdomain } = useAuth();
  const { externalToken } = useExternalAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['extrnalProcedure', externalToken, subdomain],
    queryFn: () =>
      ExternalProcedureService.show(
        String(externalToken),
        subdomain,
        Number(router.query.procedureId)
      ),
  });

  const mutation = useMutation(
    (payload: UpdateProcedureFormValues) =>
      ExternalProcedureService.update(
        String(externalToken),
        subdomain,
        Number(router.query.procedureId),
        payload
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
    }
  );

  if (isError) return <NewProceduresFieldError />;

  if (isLoading) return <NewFieldsPreviewSkeleton />;

  const handleSubmit = (values: UpdateProcedureFormValues) => {
    return mutation.mutateAsync({
      ...values,
    });
  };

  return <NewProcedureFields handleSubmit={handleSubmit} procedure={data} />;
};

export default NewProcedureFieldsContainer;
