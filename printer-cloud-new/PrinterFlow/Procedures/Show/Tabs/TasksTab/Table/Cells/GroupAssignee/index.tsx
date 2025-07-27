import * as React from 'react';
import { GroupAssigneeCellContainerProps } from './types';
import GroupAssigneeCell from './GroupAssignee';

const GroupAssigneeCellContainer = ({
  task,
}: GroupAssigneeCellContainerProps) => {
  return <GroupAssigneeCell task={task} />;
};

export default GroupAssigneeCellContainer;
