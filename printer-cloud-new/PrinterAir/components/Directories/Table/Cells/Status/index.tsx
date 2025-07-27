import * as React from 'react';
import StatusCell from './Status';
import { StatusCellContainerProps } from './types';

const DirectoryStatusContainer = ({ directory }: StatusCellContainerProps) => {
  return <StatusCell directory={directory} />;
};

export default DirectoryStatusContainer;
