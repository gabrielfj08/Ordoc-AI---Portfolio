import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../../../../queryClient';
import { useAuth, useSession, useSnackbar } from '../../../../../../hooks';
import { ShareableLinkService } from '../../../../../../services/printer-air';
import { ShareableLinksModalHistoryItemContainerProps } from './types';
import ShareableLinksModalHistoryItem from './Item';

const ShareableLinksModalHistoryItemContainer = ({
  shareableLinks,
  documentId,
}: ShareableLinksModalHistoryItemContainerProps) => {
  const { session } = useSession();
  const { subdomain, token } = useAuth();
  const { showSnackbar } = useSnackbar();

  const mutation = useMutation((id: number) =>
    ShareableLinkService.destroy(
      token,
      subdomain,
      session.organization.id,
      documentId,
      id
    )
      .then(() => {
        showSnackbar('Link excluído com sucesso!', 'success');
        queryClient.invalidateQueries();
      })
      .catch((error) => {
        if (error.response.status >= 400 && error.response.status < 500) {
          showSnackbar(error.response.data.message, 'error');
        } else {
          showSnackbar(
            'Oops, o link não pode ser excluído. Tente novamente mais tarde',
            'error'
          );
        }
      })
  );

  const handleSubmit = (id: number) => {
    return mutation.mutateAsync(id);
  };

  return (
    <ShareableLinksModalHistoryItem
      shareableLinks={shareableLinks}
      onSubmit={handleSubmit}
    />
  );
};

export default ShareableLinksModalHistoryItemContainer;
