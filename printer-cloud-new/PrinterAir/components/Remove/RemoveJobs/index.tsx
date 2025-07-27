import * as React from 'react';
import { RemoveJobsContainerProps } from './types';
import RemoveDirectoryJob from './RemoveDirectoryJob';
import RemoveDocumentJob from './RemoveDocumentJob';

const RemoveJobsContainer = ({
  removeDirectoryJobId,
  removeDocumentJobId,
}: RemoveJobsContainerProps) => {
  return (
    <div>
      {removeDirectoryJobId && (
        <RemoveDirectoryJob removeDirectoryJobId={removeDirectoryJobId} />
      )}
      {removeDocumentJobId && (
        <RemoveDocumentJob removeDocumentJobId={removeDocumentJobId} />
      )}
    </div>
  );
};

export default RemoveJobsContainer;
