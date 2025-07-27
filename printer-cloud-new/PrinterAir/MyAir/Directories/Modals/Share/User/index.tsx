import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { SharedObjectService } from '../../../../../../services/printer-air';
import { useAuth, useSession } from '../../../../../../hooks';
import { ShareListDirectoryModalContainerProps } from './types';
import ShareDirectoryModalUserList from './List';
import ShareDirectoryModalUserListError from './Error';
import ShareDirectoryModalUserListSkeleton from './Skeleton';
import ShareDirectoryModalUserListItemEmptyStatus from './EmptyState';

const ShareDirectoryModalUserListContainer = ({
  directory,
}: ShareListDirectoryModalContainerProps) => {
  const { subdomain, token } = useAuth();
  const { session } = useSession();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['directories', directory.id, 'sharedObjects', { token }],
    queryFn: () =>
      SharedObjectService.indexDirectories(
        token,
        subdomain,
        session.organization.id,
        directory.id
      ),
    refetchInterval: 1000, // TODO: REFACTOR TO ACTION SHEET
  });

  if (isLoading) return <ShareDirectoryModalUserListSkeleton />;

  if (isError) return <ShareDirectoryModalUserListError />;

  if (data.meta.total === 0) {
    return <ShareDirectoryModalUserListItemEmptyStatus />;
  }

  return (
    <ShareDirectoryModalUserList sharedDirectories={data.sharedDirectories} />
  );
};

export default ShareDirectoryModalUserListContainer;
