import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '../../../../../queryClient';
import { useAuth } from '../../../../../hooks';
import { DirectoryService } from '../../../../../services/printer-air';
import { getSubdomain } from '../../../../../utils';
import { DirectoriesListParentDirectoryContainerProps } from './types';
import DirectoriesListParentDirectory from './DirectoriesListParentDirectory';
import ParentDirectoryError from './Error';
import ParentDirectorySkeleton from './Skeleton';

const DirectoriesListParentDirectoryContainer = ({
  indexDirectoriesParams,
  organizationId,
  setIndexDirectoriesParams,
  setParentDirectory,
}: DirectoriesListParentDirectoryContainerProps) => {
  const { token } = useAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['DirectoriesListParentDirectory', indexDirectoriesParams, token],
    queryFn: () =>
      DirectoryService.show(
        token,
        getSubdomain(),
        organizationId,
        indexDirectoriesParams.directoryId
      ),
    onSuccess: (data) => {
      setParentDirectory(data.id);
      queryClient.invalidateQueries({
        queryKey: [
          'DirectoriesListParentDirectory',
          indexDirectoriesParams,
          token,
        ],
      });
    },
  });

  if (isError) {
    return <ParentDirectoryError />;
  }

  if (isLoading) {
    return <ParentDirectorySkeleton />;
  }
  return (
    <DirectoriesListParentDirectory
      indexDirectoriesParams={indexDirectoriesParams}
      setIndexDirectoriesParams={setIndexDirectoriesParams}
      directory={data}
    />
  );
};

export default DirectoriesListParentDirectoryContainer;
