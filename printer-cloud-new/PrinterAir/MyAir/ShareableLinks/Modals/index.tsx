import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../../queryClient';
import { ShareableLinkService } from '../../../../services/printer-air';
import { useAuth, useSession } from '../../../../hooks';
import {
  CreateShareableLinkAPIResponse,
  CreateShareableLinkPayload,
} from '../../../../services/printer-air/types';
import {
  CreateShareableLinkFormValues,
  ShareableLinksModalContainerProps,
} from './types';
import ShareableLinksModal from './ShareableLink';

const ShareableLinksModalContainer = ({
  documentId,
}: ShareableLinksModalContainerProps) => {
  const { session } = useSession();
  const { subdomain, token } = useAuth();

  const mutation = useMutation(
    (payload: CreateShareableLinkPayload) =>
      ShareableLinkService.create(
        token,
        subdomain,
        session.organization.id,
        documentId,
        payload
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'shareableLinks',
          session.organization.id,
          documentId,
          token,
        ]);
      },
    }
  );

  const handleSubmit = (
    values: CreateShareableLinkFormValues
  ): Promise<CreateShareableLinkAPIResponse> => {
    return mutation.mutateAsync({
      expiresIn: values.expiresIn ? values.expiresIn : null,
    });
  };

  return (
    <ShareableLinksModal onSubmit={handleSubmit} documentId={documentId} />
  );
};

export default ShareableLinksModalContainer;
