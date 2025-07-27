import * as React from 'react';
import { DirectoryCellContainerProps } from './types';
import DirectoryCell from './Directory';

const DirectoryCellContainer = ({
  sharedDirectory,
}: DirectoryCellContainerProps) => {
  return <DirectoryCell sharedDirectory={sharedDirectory} />;
};

export default DirectoryCellContainer;
