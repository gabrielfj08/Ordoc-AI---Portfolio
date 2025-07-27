import * as React from 'react';
import router from 'next/router';
import { queryClient } from '../../../../queryClient';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { ProcedureService } from '../../../../services/printer-flow';
import { UpdateProcedurePayload } from '../../../../services/printer-flow/types';
import { EditProcedureInfoFormValues } from './types';
import EditProcedureModalSkeleton from './Skeleton';
import EditProcedureModalError from './Error';
import EditProcedureModal from './Edit';

const EditProcedureContainerModal = () => {
  const { token, subdomain } = useAuth();

  const mutation = useMutation(
    (payload: EditProcedureInfoFormValues) =>
      ProcedureService.update(
        token,
        subdomain,
        Number(router.query.responsibleGroupId),
        Number(router.query.procedureId),
        payload
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'procedure',
          token,
          subdomain,
          Number(router.query.responsibleGroupId),
          Number(router.query.procedureId),
        ]);
      },
    }
  );

  const { isError, isLoading, data } = useQuery({
    queryKey: [
      'procedure',
      token,
      subdomain,
      Number(router.query.responsibleGroupId),
      Number(router.query.procedureId),
    ],
    queryFn: () =>
      ProcedureService.show(
        token,
        subdomain,
        Number(router.query.responsibleGroupId),
        Number(router.query.procedureId)
      ),
    enabled: Boolean(Number(router.query.responsibleGroupId)),
  });

  if (isError) {
    return <EditProcedureModalError />;
  }

  if (isLoading) {
    return <EditProcedureModalSkeleton />;
  }

  const handleSubmit = (
    values: EditProcedureInfoFormValues
  ): Promise<UpdateProcedurePayload> => {
    return mutation.mutateAsync({ ...values });
  };

  return <EditProcedureModal onSubmit={handleSubmit} procedure={data} />;
};

export default EditProcedureContainerModal;
