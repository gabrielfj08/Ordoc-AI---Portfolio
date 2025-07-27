import * as React from 'react';
import { TaskFieldsProps } from './types';
import ShowTaskField from './Show';
import UpdateTaskField from './Update';

const TaskFields = ({
  taskField,
  taskTemplate,
  type,
  setType,
}: TaskFieldsProps) => {
  const taskFieldMapping: any = {
    show: (
      <ShowTaskField
        taskField={taskField}
        taskTemplate={taskTemplate}
        type={type}
        setType={setType}
      />
    ),
    edit: (
      <UpdateTaskField
        taskField={taskField}
        taskTemplate={taskTemplate}
        type={type}
        setType={setType}
      />
    ),
  };

  return <div className="mt-8">{taskFieldMapping[type]}</div>;
};

export default TaskFields;
