import * as React from 'react';
import router from 'next/router';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useAuth, useSessionGroupRequester } from '../../../hooks';
import { ProcedureService } from '../../../services/printer-flow';
import {
  UpdateProcedureAPIResponse,
  UpdateProcedurePayload,
} from '../../../services/printer-flow/types';
import { UpdateProcedureFieldsContainerProps } from './types';
import UpdateProcedureFields from './Update';

const UpdateProcedureFieldsContainer = ({
  procedure,
  setEdit,
}: UpdateProcedureFieldsContainerProps) => {
  const { subdomain, token } = useAuth();
  const { sessionGroupRequester } = useSessionGroupRequester();
  const queryClient = useQueryClient();

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
        queryClient.invalidateQueries([
          'procedure',
          token,
          subdomain,
          sessionGroupRequester.id,
          Number(router.query.procedureId),
        ]);
      },
    }
  );

  const handleSubmit = (values): Promise<UpdateProcedureAPIResponse> => {
    return mutation.mutateAsync({
      ...values,
    });
  };

  return (
    <UpdateProcedureFields
      procedure={procedure}
      setEdit={setEdit}
      onSubmit={handleSubmit}
    />
  );
};

export default UpdateProcedureFieldsContainer;
