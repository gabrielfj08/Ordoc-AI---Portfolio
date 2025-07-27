import * as React from 'react';
import { TaskTemplateDescriptionCellContainerProps } from './types';
import TaskTemplateDescriptionCell from './Description';

const TaskTemplateDescriptionCellContainer = ({
  taskTemplate,
}: TaskTemplateDescriptionCellContainerProps) => {
  return <TaskTemplateDescriptionCell taskTemplate={taskTemplate} />;
};

export default TaskTemplateDescriptionCellContainer;
