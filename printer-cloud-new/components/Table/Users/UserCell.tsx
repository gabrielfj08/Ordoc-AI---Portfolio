import * as React from 'react';
import { Avatar, Typography } from 'printer-ui';
import { UsersCellProps } from './types';

const UserCell = ({ user }: UsersCellProps) => {
  return (
    <div className="px-4 cursor-pointer flex justify-start items-center">
      <div className="flex gap-2 h-30 justify-start items-center">
        <div>
          <Avatar
            size="md"
            placeholder={`${user.name}`.charAt(0)}
            src={user.avatarUrl}
          />
        </div>
        <div className="w-44 sm:w-auto truncate">
          <Typography family="robotoBold" className="truncate">
            {user.name}
          </Typography>
          <Typography className="truncate">{user.email}</Typography>
        </div>
      </div>
    </div>
  );
};

export default UserCell;
