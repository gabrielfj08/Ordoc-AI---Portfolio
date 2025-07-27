import * as React from 'react';
import { RestoreJobsContainerProps } from './types';
import RestoreDirectoryJob from './RestoreDirectoryJob';
import RestoreDocumentJob from './RestoreDocumentJob';

const RestoreJobsContainer = ({
  restoreDirectoryJobId,
  restoreDocumentJobId,
}: RestoreJobsContainerProps) => {
  return (
    <div>
      {restoreDirectoryJobId && (
        <RestoreDirectoryJob restoreDirectoryJobId={restoreDirectoryJobId} />
      )}
      {restoreDocumentJobId && (
        <RestoreDocumentJob restoreDocumentJobId={restoreDocumentJobId} />
      )}
    </div>
  );
};

export default RestoreJobsContainer;
