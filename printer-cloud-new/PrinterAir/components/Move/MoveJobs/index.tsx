import * as React from 'react';
import { MoveJobsContainerProps } from './types';
import MoveDirectoryJob from './MoveDirectoryJob';
import MoveDocumentJob from './MoveDocumentJob';

const MoveJobsContainer = ({
  moveDirectoryJobId,
  moveDocumentJobId,
}: MoveJobsContainerProps) => {
  return (
    <div>
      {moveDirectoryJobId && (
        <MoveDirectoryJob moveDirectoryJobId={moveDirectoryJobId} />
      )}
      {moveDocumentJobId && (
        <MoveDocumentJob moveDocumentJobId={moveDocumentJobId} />
      )}
    </div>
  );
};

export default MoveJobsContainer;
