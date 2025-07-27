import * as React from 'react';
import { TaskTemplateStatusCellContainerProps } from './types';
import TaskTemplateStatusCell from './Status';

const TaskTemplateStatusCellContainer = ({
  taskTemplate,
}: TaskTemplateStatusCellContainerProps) => {
  return <TaskTemplateStatusCell taskTemplate={taskTemplate} />;
};

export default TaskTemplateStatusCellContainer;
