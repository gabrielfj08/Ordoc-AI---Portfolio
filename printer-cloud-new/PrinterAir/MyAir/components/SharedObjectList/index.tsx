import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../../queryClient';
import { useAuth, useSession } from '../../../../hooks';
import { SharedObjectService } from '../../../../services/printer-air';
import { DestroySharedObjectAPIResponse } from '../../../../services/printer-air/types';
import {
  ShareModalUserListItemFormValues,
  ShareModalUserListItemContainerProps,
} from './types';
import SharedModalUserListItem from './Item';

const ShareDirectoryModalUserListItemContainer = ({
  sharedObjectId,
  user,
}: ShareModalUserListItemContainerProps) => {
  const { subdomain, token } = useAuth();
  const { session } = useSession();

  const mutation = useMutation(
    (values: ShareModalUserListItemFormValues) => {
      return SharedObjectService.destroy(
        token,
        subdomain,
        session.organization.id,
        values.sharedObjectId
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['directories']);
        queryClient.invalidateQueries(['documents']);
      },
    }
  );

  const handleSubmit = (
    values: ShareModalUserListItemFormValues
  ): Promise<DestroySharedObjectAPIResponse> => {
    return mutation.mutateAsync(values);
  };

  return (
    <SharedModalUserListItem
      sharedObjectId={sharedObjectId}
      onSubmit={handleSubmit}
      user={user}
    />
  );
};

export default ShareDirectoryModalUserListItemContainer;
