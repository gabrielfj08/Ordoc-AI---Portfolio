import * as React from 'react';
import DirectoryCell from './Directory';
import { DirectoryCellContainerProps } from './types';

const DirectoryCellContainer = ({ directory }: DirectoryCellContainerProps) => {
  return <DirectoryCell directory={directory} />;
};

export default DirectoryCellContainer;
