import * as React from 'react';
import { DirectoryCellContainerProps } from './types';
import DirectoryCell from './Directory';

const DirectoryCellContainer = ({ directory }: DirectoryCellContainerProps) => {
  const directoryName = directory.name.substring(0, directory.name.length - 9);

  return <DirectoryCell directory={directory} directoryName={directoryName} />;
};

export default DirectoryCellContainer;
