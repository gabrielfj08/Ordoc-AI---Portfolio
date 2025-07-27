import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../../../queryClient';
import { useAuth, useExternalAuth, useV3Snackbar } from '../../../../../hooks';
import { ExternalSharedProceduresService } from '../../../../../services/flow-cidadao';
import { SharedRequestersContainerProps } from './types';
import SharedRequesters from './SharedRequesters';

const SharedRequestersContainer = ({
  sharedProcedures,
}: SharedRequestersContainerProps) => {
  const { externalToken } = useExternalAuth();
  const { subdomain } = useAuth();
  const { showV3Snackbar } = useV3Snackbar();

  const mutation = useMutation(
    (value: number) =>
      ExternalSharedProceduresService.destroy(
        externalToken as string,
        subdomain,
        value
      ),
    {
      onSuccess: () => {
        showV3Snackbar(
          'Este usuário não tem mais acesso a este processo.',
          'success',
          'Compartilhamento removido.'
        );
        queryClient.invalidateQueries([
          'externalSharedProcedure',
          externalToken,
          subdomain,
        ]);
      },
    }
  );

  const handleClick = (value: number) => {
    return mutation.mutateAsync(value);
  };

  return (
    <SharedRequesters
      sharedProcedures={sharedProcedures}
      handleClick={handleClick}
    />
  );
};

export default SharedRequestersContainer;
