import * as React from 'react';
import { UsersCountCellContainerProps } from './types';
import GroupsUsersCountCell from './UsersCount';

const GroupsUsersCountCellContainer = ({
  group,
}: UsersCountCellContainerProps) => {
  return <GroupsUsersCountCell group={group} />;
};

export default GroupsUsersCountCellContainer;
