import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useSession } from '../../../../../../hooks';
import { SharedObjectService } from '../../../../../../services/printer-air';
import { SharedListModalContainerProps } from './types';
import ShareDocumentModalUserList from './List';
import ShareDocumentModalUserListError from './Error';
import ShareDocumentModalUserListSkeleton from './Skeleton';
import ShareDocumentModalUserListItemEmptyStatus from './EmptyState';

const ShareDocumentModalUserListContainer = ({
  document,
}: SharedListModalContainerProps) => {
  const { subdomain, token } = useAuth();
  const { session } = useSession();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['documents', document.id, 'sharedObjects', { token }],
    queryFn: () =>
      SharedObjectService.indexDocuments(
        token,
        subdomain,
        session.organization.id,
        document.id
      ),
    refetchInterval: 1000,
    // TODO: REFACTOR TO ACTION SHEET
  });

  if (isLoading) return <ShareDocumentModalUserListSkeleton />;

  if (isError) return <ShareDocumentModalUserListError />;

  if (data.meta.total === 0) {
    return <ShareDocumentModalUserListItemEmptyStatus />;
  }

  return <ShareDocumentModalUserList sharedDocuments={data.sharedDocuments} />;
};

export default ShareDocumentModalUserListContainer;
