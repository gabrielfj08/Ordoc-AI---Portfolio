import * as React from 'react';
import { ShowTaskFieldContainerProps } from './types';
import ShowTaskField from './Show';

const ShowTaskFieldContainer = ({
  taskField,
  taskTemplate,
  type,
  setType,
}: ShowTaskFieldContainerProps) => {
  return (
    <ShowTaskField
      taskField={taskField}
      taskTemplate={taskTemplate}
      type={type}
      setType={setType}
    />
  );
};

export default ShowTaskFieldContainer;
