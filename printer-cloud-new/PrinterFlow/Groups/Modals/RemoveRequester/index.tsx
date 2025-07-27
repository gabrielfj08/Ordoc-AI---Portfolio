import * as React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import {
  useAuth,
  useSession,
  useSessionGroupRequester,
} from '../../../../hooks';
import { GroupRequesterService } from '../../../../services/printer-flow';
import { RemoveRequesterFromGroupAPIResponse } from '../../../../services/printer-flow/types';
import { RemoveRequesterContainerModalProps } from './types';
import RemoveRequesterModal from './RemoveRequester';

const RemoveRequesterContainerModal = ({
  groupId,
  groupName,
  requesterId,
  requesterName,
}: RemoveRequesterContainerModalProps) => {
  const { subdomain, token } = useAuth();
  const queryClient = useQueryClient();

  const { session } = useSession();
  const { clearSessionGroupRequester, sessionGroupRequester } =
    useSessionGroupRequester();

  const mutation = useMutation(
    () =>
      GroupRequesterService.removeRequesterFromGroup(
        token,
        subdomain,
        groupId,
        { requesterId: requesterId }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'groupRequestersList',
          subdomain,
          token,
          {},
        ]);
        if (
          sessionGroupRequester.id === groupId &&
          requesterId === session.user.internalRequester?.id
        ) {
          clearSessionGroupRequester();
        }
      },
    }
  );

  const handleSubmit = (): Promise<RemoveRequesterFromGroupAPIResponse> => {
    return mutation.mutateAsync();
  };

  return (
    <RemoveRequesterModal
      onSubmit={handleSubmit}
      groupName={groupName}
      requesterName={requesterName}
    />
  );
};

export default RemoveRequesterContainerModal;
