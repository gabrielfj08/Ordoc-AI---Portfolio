import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../hooks';
import { DirectoryService } from '../../../../../services/printer-air/Directory';
import { getSubdomain } from '../../../../../utils';
import { ShowDirectoryPropertiesContainerProps } from './types';
import ShowDirectorySkeleton from './Skeleton';
import ShowDirectoryError from './Error';
import ShowDirectoryProperties from './Show';

const ShowDirectoryPropertiesContainer = ({
  directoryId,
  organizationId,
}: ShowDirectoryPropertiesContainerProps) => {
  const { token } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: [
      'organizations',
      organizationId,
      'directories',
      directoryId,
      { token },
    ],
    queryFn: () =>
      DirectoryService.show(token, getSubdomain(), organizationId, directoryId),
  });

  if (isError) {
    return <ShowDirectoryError />;
  }

  if (isLoading) {
    return <ShowDirectorySkeleton />;
  }

  return <ShowDirectoryProperties directory={data} />;
};

export default ShowDirectoryPropertiesContainer;
