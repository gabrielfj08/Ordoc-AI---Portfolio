import * as React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { RequesterService } from '../../../../services/printer-flow';
import {
  DeactivateRequesterAPIResponse,
  DeactivateRequesterPayload,
} from '../../../../services/printer-flow/types';
import {
  DeactivateGroupContainerModalProps,
  DeactivateGroupFormValues,
} from './types';
import DeactivateGroupModal from './Deactivate';

const DeactivateGroupContainerModal = ({
  groupId,
  groupName,
}: DeactivateGroupContainerModalProps) => {
  const { subdomain, token } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (payload: DeactivateRequesterPayload) =>
      RequesterService.deactivate(token, subdomain, groupId, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'groupRequesters',
          subdomain,
          token,
          {},
        ]);
      },
    }
  );

  const handleSubmit = (
    values: DeactivateGroupFormValues
  ): Promise<DeactivateRequesterAPIResponse> => {
    return mutation.mutateAsync({ ...values });
  };

  return <DeactivateGroupModal onSubmit={handleSubmit} groupName={groupName} />;
};

export default DeactivateGroupContainerModal;
