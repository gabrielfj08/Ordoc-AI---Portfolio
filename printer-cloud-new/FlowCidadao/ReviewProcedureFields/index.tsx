import * as React from 'react';
import router from 'next/router';
import { queryClient } from '../../queryClient';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth, useExternalAuth, useV3Snackbar } from '../../hooks';
import { ExternalProcedureService } from '../../services/flow-cidadao';
import { UpdateProcedureFormValues } from './types';
import ReviewProcedureFields from './ReviewProcedureFields';
import ReviewProcedureSkeleton from './Skeleton';

const ReviewProcedureFieldsContainer = ({}) => {
  const { subdomain } = useAuth();
  const { externalToken } = useExternalAuth();
  const { showV3Snackbar } = useV3Snackbar();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['procedure', externalToken, subdomain],
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

  const handleRunProcedure = () => {
    ExternalProcedureService.run(
      String(externalToken),
      subdomain,
      Number(router.query.procedureId)
    )
      .then(() => {
        router.push(`/flow-cidadao/procedures`);
        showV3Snackbar(
          'Processo criado com sucesso.',
          'success',
          'Processo criado!'
        );
      })
      .catch((err) => {
        showV3Snackbar(
          `${err.response.data.message}`,
          'error',
          'Algo deu errado!'
        );
      });
  };

  if (isError) return <ReviewProcedureSkeleton />;

  if (isLoading) return <ReviewProcedureSkeleton />;

  const handleSubmit = (values: UpdateProcedureFormValues) => {
    return mutation.mutateAsync({
      ...values,
    });
  };

  return (
    <ReviewProcedureFields
      handleSubmit={handleSubmit}
      procedure={data}
      handleRunProcedure={handleRunProcedure}
    />
  );
};

export default ReviewProcedureFieldsContainer;
