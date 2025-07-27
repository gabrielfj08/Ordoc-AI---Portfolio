import * as React from 'react';
import { UserGroupsCellProps } from './types';
import { Typography } from 'printer-ui';

const UsersCell = ({ userGroup }: UserGroupsCellProps) => {
  const textStatus = () => {
    if (userGroup.status == 'inactive') {
      return 'gray';
    }
  };

  return (
    <Typography
      color={textStatus()}
      variant="footnote1"
      className="px-4 hidden sm:block"
    >
      {userGroup.users_count === 1
        ? `${userGroup.users_count} usuário`
        : `${userGroup.users_count} usuários`}
    </Typography>
  );
};

export default UsersCell;
