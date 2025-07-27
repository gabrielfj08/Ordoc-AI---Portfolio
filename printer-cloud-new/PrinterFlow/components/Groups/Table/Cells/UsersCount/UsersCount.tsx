import * as React from 'react';
import { UsersCountCellProps } from './types';
import { Typography } from 'printer-ui';

const GroupsUsersCountCell = ({ group }: UsersCountCellProps) => {
  return (
    <div className="w-44 justify-center hidden md:flex">
      <Typography variant="footnote1">{group.usersCount}</Typography>
    </div>
  );
};

export default GroupsUsersCountCell;
