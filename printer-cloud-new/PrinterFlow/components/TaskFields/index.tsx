import * as React from 'react';
import { TaskFieldsContainerProps, taskFieldActionType } from './types';
import TaskFields from './TaskFields';

const TaskFieldsContainer = ({
  taskField,
  taskTemplate,
}: TaskFieldsContainerProps) => {
  const [type, setType] = React.useState<taskFieldActionType>('show');

  return (
    <TaskFields
      taskField={taskField}
      taskTemplate={taskTemplate}
      type={type}
      setType={setType}
    />
  );
};

export default TaskFieldsContainer;
