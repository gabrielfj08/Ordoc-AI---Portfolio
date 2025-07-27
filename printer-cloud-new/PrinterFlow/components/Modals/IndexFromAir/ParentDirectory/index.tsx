import * as React from 'react';
import { AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '../../../../../queryClient';
import { useAuth, useSession } from '../../../../../hooks';
import { DirectoryService } from '../../../../../services/printer-air';
import { ParentDirectoryContainerProps } from './types';
import ParentDirectoryError from './Error';
import ParentDirectorySkeleton from './Skeleton';
import ParentDirectory from './ParentDirectory';
import UnauthorizedMessage from './UnauthorizedMessage';

const ParentDirectoryContainer = ({
  directoryId,
  setDirectoryId,
  setIsAuthorized,
}: ParentDirectoryContainerProps) => {
  const { token, subdomain } = useAuth();
  const { session } = useSession();
  const [error, setError] = React.useState<AxiosError>();

  const { isError, isLoading, data } = useQuery({
    queryKey: [
      'DirectoriesListParentDirectory',
      token,
      'subdomain',
      directoryId,
    ],
    queryFn: () =>
      DirectoryService.show(
        token,
        subdomain,
        session.organization.id,
        directoryId
      ),
    onSuccess: (data) => {
      setDirectoryId(data.id);
      setIsAuthorized(true);
      queryClient.invalidateQueries({
        queryKey: [
          'DirectoriesListParentDirectory',
          token,
          subdomain,
          directoryId,
        ],
      });
    },
    onError: (err: AxiosError) => {
      setError(err);
    },
  });

  if (isError) {
    if (error?.response?.status === 401) return <UnauthorizedMessage />;
    return <ParentDirectoryError />;
  }

  if (isLoading) {
    return <ParentDirectorySkeleton />;
  }

  return <ParentDirectory directory={data} setDirectoryId={setDirectoryId} />;
};

export default ParentDirectoryContainer;
