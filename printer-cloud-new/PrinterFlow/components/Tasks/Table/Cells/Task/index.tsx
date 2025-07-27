import * as React from 'react';
import { TaskCellContainerProps } from './types';
import TaskCell from './Task';

const TaskCellContainer = ({ task }: TaskCellContainerProps) => {
  return <TaskCell task={task} />;
};
export default TaskCellContainer;
