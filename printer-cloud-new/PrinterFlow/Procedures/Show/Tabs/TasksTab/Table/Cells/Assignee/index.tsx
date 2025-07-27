import * as React from 'react';
import { AssigneeCellContainerProps } from './types';
import AssigneeCell from './Assignee';

const AssigneeCellContainer = ({
  task,
}: AssigneeCellContainerProps) => {
  return <AssigneeCell task={task} />;
};

export default AssigneeCellContainer;
