import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useSession } from '../../../../../hooks';
import { DirectoryService } from '../../../../../services/printer-air';
import { RemoveDirectoryContainerProps } from './types';
import RemoveDirectoryError from './Error';
import RemoveDirectorySkeleton from './Skeleton';
import RemoveDirectory from './RemoveDirectory';

const RemoveDirectoryContainer = ({
  directoryId,
}: RemoveDirectoryContainerProps) => {
  const { token, subdomain } = useAuth();
  const { session } = useSession();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['RemoveDirectory', directoryId, token],
    queryFn: () =>
      DirectoryService.show(
        token,
        subdomain,
        session.organization.id,
        directoryId
      ),
  });

  if (isError) return <RemoveDirectoryError />;

  if (isLoading) return <RemoveDirectorySkeleton />;

  return <RemoveDirectory directoryName={data.name} />;
};

export default RemoveDirectoryContainer;
