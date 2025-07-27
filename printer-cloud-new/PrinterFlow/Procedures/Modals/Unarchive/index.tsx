import * as React from 'react';
import router from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../../queryClient';
import { useAuth } from '../../../../hooks';
import { ProcedureService } from '../../../../services/printer-flow';
import {
  ShowProcedureAPIResponse,
  UnarchiveProcedurePayload,
} from '../../../../services/printer-flow/types';
import {
  UnarchiveProcedureContainerModalProps,
  UnarchiveProcedureFormValues,
} from './types';
import UnarchiveProcedureModal from './Unarchive';

const UnarchiveProcedureContainerModal = ({
  procedureId,
  processNumber,
}: UnarchiveProcedureContainerModalProps) => {
  const { subdomain, token } = useAuth();

  const mutation = useMutation(
    (payload: UnarchiveProcedurePayload) =>
      ProcedureService.unarchive(
        token,
        subdomain,
        Number(router.query.responsibleGroupId),
        procedureId,
        payload
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

        queryClient.invalidateQueries([
          'procedureRecords',
          subdomain,
          token,
          {},
        ]);
        queryClient.invalidateQueries(['procedure', token, subdomain]);
      },
    }
  );

  const handleSubmit = (
    values: UnarchiveProcedureFormValues
  ): Promise<ShowProcedureAPIResponse> => {
    return mutation.mutateAsync({ ...values });
  };

  return (
    <UnarchiveProcedureModal
      onSubmit={handleSubmit}
      processNumber={processNumber}
    />
  );
};

export default UnarchiveProcedureContainerModal;
