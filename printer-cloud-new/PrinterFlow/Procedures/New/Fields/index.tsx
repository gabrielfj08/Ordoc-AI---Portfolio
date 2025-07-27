import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { queryClient } from '../../../../queryClient';
import { ProcedureService } from '../../../../services/printer-flow';
import {
  UpdateProcedureAPIResponse,
  UpdateProcedurePayload,
} from '../../../../services/printer-flow/types';
import { ProcedureFieldsContainerProps } from './types';
import ProcedureFields from './Fields';

const ProcedureFieldsContainer = ({
  procedure,
}: ProcedureFieldsContainerProps) => {
  const { subdomain, token } = useAuth();

  const mutation = useMutation(
    (payload: UpdateProcedurePayload) =>
      ProcedureService.update(
        token,
        subdomain,
        procedure.responsibleGroupId,
        procedure.id,
        payload
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
    }
  );

  const handleSubmit = (values): Promise<UpdateProcedureAPIResponse> => {
    return mutation.mutateAsync({
      ...values,
    });
  };

  return (
    <ProcedureFields
      procedure={procedure}
      fields={procedure.schema}
      onSubmit={handleSubmit}
    />
  );
};

export default ProcedureFieldsContainer;
