import * as React from 'react';
import { DirectoryhareJobContainerProps } from './types';
import DirectoryShareJob from './DirectoryShareJob';

const DocumentShareJobContainer = ({
  batchOperationJob,
}: DirectoryhareJobContainerProps) => {
  if (!batchOperationJob) return null;

  return <DirectoryShareJob shareDirectoryId={batchOperationJob.id} />;
};

export default DocumentShareJobContainer;
