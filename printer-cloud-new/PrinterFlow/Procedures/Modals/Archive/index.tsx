import * as React from 'react';
import router from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../../queryClient';
import { useAuth } from '../../../../hooks';
import { ProcedureService } from '../../../../services/printer-flow';
import {
  ShowProcedureAPIResponse,
  ArchiveProcedurePayload,
} from '../../../../services/printer-flow/types';
import {
  ArchiveProcedureContainerModalProps,
  ArchiveProcedureFormValues,
} from './types';
import ArchiveProcedureModal from './Archive';

const ArchiveProcedureContainerModal = ({
  procedureId,
  processNumber,
}: ArchiveProcedureContainerModalProps) => {
  const { subdomain, token } = useAuth();

  const mutation = useMutation(
    (payload: ArchiveProcedurePayload) =>
      ProcedureService.archive(
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
        queryClient.invalidateQueries([
          'JustificationNote',
          token,
          subdomain,
          'procedures',
        ]);
      },
    }
  );

  const handleSubmit = (
    values: ArchiveProcedureFormValues
  ): Promise<ShowProcedureAPIResponse> => {
    return mutation.mutateAsync({ ...values });
  };

  return (
    <ArchiveProcedureModal
      onSubmit={handleSubmit}
      processNumber={processNumber}
    />
  );
};

export default ArchiveProcedureContainerModal;
