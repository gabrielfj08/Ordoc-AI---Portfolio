import * as React from 'react';
import { StatusCellContainerProps } from './types';
import StatusCell from './Status';

const StatusCellContainer = ({ task }: StatusCellContainerProps) => {
  return <StatusCell task={task} />;
};

export default StatusCellContainer;
