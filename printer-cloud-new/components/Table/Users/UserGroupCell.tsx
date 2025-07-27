import * as React from 'react';
import { Typography } from 'printer-ui';
import { UsersCellProps } from './types';

const UserGroupCell = ({ user }: UsersCellProps) => {
  return (
    <div className="h-14 items-center justify-center cursor-pointer sm:flex hidden">
      <Typography variant="footnote1">
        {user.userGroupsCount === 1
          ? `${user.userGroupsCount} grupo`
          : `${user.userGroupsCount} grupos`}
      </Typography>
    </div>
  );
};

export default UserGroupCell;
