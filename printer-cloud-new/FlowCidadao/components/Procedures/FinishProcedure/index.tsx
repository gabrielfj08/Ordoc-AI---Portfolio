import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../../queryClient';
import { useAuth, useExternalAuth } from '../../../../hooks';
import { ExternalProcedureService } from '../../../../services/flow-cidadao';
import {
  FinishProcedureModalContainerProps,
  RequestFinishProcedureForm,
} from './types';
import FinishProcedureModal from './FinishProcedure';

const FinishProcedureModalContainer = ({
  procedureId,
}: FinishProcedureModalContainerProps) => {
  const { subdomain } = useAuth();
  const { externalToken } = useExternalAuth();

  const mutation = useMutation(
    (payload: RequestFinishProcedureForm) =>
      ExternalProcedureService.requestFinish(
        String(externalToken),
        subdomain,
        procedureId,
        payload
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
    }
  );

  const handleSubmit = (values: RequestFinishProcedureForm) => {
    return mutation.mutateAsync({ ...values });
  };

  return <FinishProcedureModal onSubmit={handleSubmit} />;
};

export default FinishProcedureModalContainer;
