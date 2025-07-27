import * as React from 'react';
import { GroupCellContainerProps } from './types';
import GroupCell from './Group';

const GroupCellContainer = ({ group }: GroupCellContainerProps) => {
  return <GroupCell group={group} />;
};

export default GroupCellContainer;
