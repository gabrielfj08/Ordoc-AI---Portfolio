import * as React from 'react';
import DirectoriesTable from '../Directories/Table';
import { DirectoriesContainerProps } from './types';

const DirectoriesContainer = ({
  directoryId,
  organizationId,
  setSelectedDirectoryIds,
}: DirectoriesContainerProps) => {
  return (
    <DirectoriesTable
      organizationId={organizationId}
      parentDirectoryId={directoryId}
      setSelectedDirectoryIds={setSelectedDirectoryIds}
    />
  );
};

export default DirectoriesContainer;
