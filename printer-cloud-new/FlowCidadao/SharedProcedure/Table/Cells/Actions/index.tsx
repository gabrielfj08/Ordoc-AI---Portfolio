import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useExternalAuth } from '../../../../../hooks';
import { queryClient } from '../../../../../queryClient';
import { ExternalSharedProceduresService } from '../../../../../services/flow-cidadao';
import { AcceptSharedProcedureAPIResponse } from '../../../../../services/flow-cidadao/types';
import { CellProps } from '../../types';
import ActionsCell from './Actions';

const ActionsCellContainer = ({ sharedProcedure, color }: CellProps) => {
  const { externalToken, subdomain } = useExternalAuth();

  const mutation = useMutation(
    () =>
      ExternalSharedProceduresService.accept(
        externalToken as string,
        subdomain,
        sharedProcedure.id
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'externalSharedProcedures',
          subdomain,
          externalToken,
          {},
        ]);
      },
    }
  );

  const handleSubmit = (): Promise<AcceptSharedProcedureAPIResponse> => {
    return mutation.mutateAsync();
  };

  return (
    <ActionsCell
      sharedProcedure={sharedProcedure}
      color={color}
      onSubmit={handleSubmit}
    />
  );
};

export default ActionsCellContainer;
