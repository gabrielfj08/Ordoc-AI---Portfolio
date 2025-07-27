import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../../queryClient';
import { ExternalSharedProceduresService } from '../../../../services/flow-cidadao';
import { useAuth, useExternalAuth } from '../../../../hooks';
import {
  RefuseSharedProcedureAPIResponse,
  RefuseSharedProcedurePayload,
} from '../../../../services/flow-cidadao/types';
import {
  RefuseSharedProcedureFormValues,
  RefuseSharedProcedureModalContainerProps,
} from './types';
import RefuseSharedProcedureModal from './RefuseSharedProcedure';

const RefuseSharedProcedureModalContainer = ({
  sharedProcedure,
}: RefuseSharedProcedureModalContainerProps) => {
  const { externalToken } = useExternalAuth();
  const { subdomain } = useAuth();

  const mutation = useMutation(
    (payload: RefuseSharedProcedurePayload) =>
      ExternalSharedProceduresService.refuse(
        externalToken as string,
        subdomain,
        sharedProcedure.id,
        payload
      ),
    {
      onSuccess: () =>
        queryClient.invalidateQueries([
          'externalSharedProcedures',
          subdomain,
          externalToken,
          {},
        ]),
    }
  );

  const handleSubmit = (
    values: RefuseSharedProcedureFormValues
  ): Promise<RefuseSharedProcedureAPIResponse> => {
    return mutation.mutateAsync({ ...values });
  };

  return <RefuseSharedProcedureModal onSubmit={handleSubmit} />;
};

export default RefuseSharedProcedureModalContainer;
