import * as React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { RequesterService } from '../../../../services/printer-flow';
import {
  DeactivateRequesterAPIResponse,
  DeactivateRequesterPayload,
} from '../../../../services/printer-flow/types';
import {
  DeactivateRequesterContainerModalProps,
  DeactivateRequesterFormValues,
} from './types';
import DeactivateRequesterModal from './Deactivate';

const DeactivateRequesterContainerModal = ({
  requesterId,
  requesterName,
}: DeactivateRequesterContainerModalProps) => {
  const { subdomain, token } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (payload: DeactivateRequesterPayload) =>
      RequesterService.deactivate(token, subdomain, requesterId, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['requesters', subdomain, token, {}]);
      },
    }
  );

  const handleSubmit = (
    values: DeactivateRequesterFormValues
  ): Promise<DeactivateRequesterAPIResponse> => {
    return mutation.mutateAsync({ ...values });
  };

  return (
    <DeactivateRequesterModal
      onSubmit={handleSubmit}
      requesterName={requesterName}
    />
  );
};

export default DeactivateRequesterContainerModal;
