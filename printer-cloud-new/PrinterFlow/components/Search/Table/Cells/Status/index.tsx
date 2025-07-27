import * as React from 'react';
import { StatusCellContainerProps } from './types';
import StatusCell from './Status';

const StatusCellContainer = ({ procedure }: StatusCellContainerProps) => {
  return <StatusCell procedure={procedure} />;
};

export default StatusCellContainer;
