import * as React from 'react';
import router from 'next/router';
import { queryClient } from '../../../../queryClient';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { ProcedureService } from '../../../../services/printer-flow';
import { ShowProcedureAPIResponse } from '../../../../services/printer-flow/types';
import { FinishProcedureContainerModalProps } from './types';
import FinishProcedureModal from './Finish';

const FinishProcedureContainerModal = ({
  procedureId,
  processNumber,
}: FinishProcedureContainerModalProps) => {
  const { subdomain, token } = useAuth();

  const mutation = useMutation(
    () =>
      ProcedureService.finish(
        token,
        subdomain,
        Number(router.query.responsibleGroupId),
        procedureId
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['procedures', subdomain, token, {}]);
        queryClient.invalidateQueries([
          'proceduresCount',
          token,
          subdomain,
          {},
        ]);

        queryClient.invalidateQueries(['procedure', token, subdomain]);
      },
    }
  );

  const handleSubmit = (): Promise<ShowProcedureAPIResponse> => {
    return mutation.mutateAsync();
  };

  return (
    <FinishProcedureModal
      onSubmit={handleSubmit}
      processNumber={processNumber}
    />
  );
};

export default FinishProcedureContainerModal;
