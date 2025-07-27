import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../hooks';
import { queryClient } from '../../../../../queryClient';
import { DirectoryService } from '../../../../../services/printer-air';
import { getSubdomain } from '../../../../../utils';
import { DirectoriesListContainerProps } from './types';
import DirectoriesList from './DirectoriesList';
import DirectoriesListSkeleton from './Skeleton';
import DirectoriesListError from './Error';

const DirectoriesListContainer = ({
  onChange,
  organizationId,
  indexDirectoriesParams,
  selectedDirectory,
  setIndexDirectoriesParams,
}: DirectoriesListContainerProps) => {
  const { token } = useAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['DirectoriesList', indexDirectoriesParams, token],
    queryFn: () =>
      DirectoryService.index(
        token,
        getSubdomain(),
        organizationId,
        indexDirectoriesParams
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['DirectoriesList', indexDirectoriesParams, token],
      });
    },
  });

  if (isError) {
    return <DirectoriesListError />;
  }

  if (isLoading) {
    return <DirectoriesListSkeleton />;
  }

  return (
    <DirectoriesList
      selectedDirectory={selectedDirectory}
      onChange={onChange}
      directories={data.directories}
      indexDirectoriesParams={indexDirectoriesParams}
      setIndexDirectoriesParams={setIndexDirectoriesParams}
    />
  );
};

export default DirectoriesListContainer;
