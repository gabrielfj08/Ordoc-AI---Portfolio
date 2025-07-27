import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useSession } from '../../../../../hooks';
import { DirectoryService } from '../../../../../services/printer-air';
import { IndexDirectoriesFromAirContainerProps } from './types';
import IndexDirectoriesFromAir from './IndexDirectories';
import IndexDirectoriesFromAirSkeleton from './Skeleton';
import IndexDirectoriesFromAirError from './Error';

const IndexDirectoriesFromAirContainer = ({
  setDirectoryId,
  directoryId,
  total,
  setTotal,
}: IndexDirectoriesFromAirContainerProps) => {
  const { token, subdomain } = useAuth();
  const { session } = useSession();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['indexAirDirectories', subdomain, token, directoryId],
    queryFn: () =>
      DirectoryService.index(token, subdomain, session.organization.id, {
        directoryId: directoryId,
      }),
    onSuccess: (data: any) =>
      setTotal({ ...total, directories: data.meta.total }),
  });

  if (isError) return <IndexDirectoriesFromAirError />;

  if (isLoading) return <IndexDirectoriesFromAirSkeleton />;

  return (
    <IndexDirectoriesFromAir
      directories={data.directories}
      setDirectoryId={setDirectoryId}
    />
  );
};

export default IndexDirectoriesFromAirContainer;
