import * as React from 'react';
import { DirectoryPropertiesContainerProps } from './types';
import DirectoryProperties from './Properties';

const DirectoryPropertiesContainer = ({
  directoryId,
  organizationId,
}: DirectoryPropertiesContainerProps) => {
  return (
    <DirectoryProperties
      directoryId={directoryId}
      organizationId={organizationId}
    />
  );
};

export default DirectoryPropertiesContainer;
