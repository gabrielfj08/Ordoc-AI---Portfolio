import * as React from 'react';
import { TaskTemplateNameCellContaineProps } from './types';
import TaskTemplateNameCell from './Name';

const TaskTemplateNameCellContainer = ({
  taskTemplate,
}: TaskTemplateNameCellContaineProps) => {
  return <TaskTemplateNameCell taskTemplate={taskTemplate} />;
};

export default TaskTemplateNameCellContainer;
