import * as React from 'react';
import { StatusRefusedTaskCellContainerProps } from './types';
import StatusRefusedTaskCell from './Status';

const StatusRefusedTaskCellContainer = ({
  task,
}: StatusRefusedTaskCellContainerProps) => {
  return <StatusRefusedTaskCell task={task} />;
};
export default StatusRefusedTaskCellContainer;
