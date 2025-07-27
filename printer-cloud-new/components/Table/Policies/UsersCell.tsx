import * as React from 'react';
import { Typography } from 'printer-ui';
import { PolicyCellProps } from './types';

const UsersCell = ({ policy }: PolicyCellProps) => {
  return (
    <div>
      <div className="h-14 items-center justify-center cursor-pointer sm:flex hidden">
        <Typography variant="footnote1">
          {policy.usersCount === 1
            ? `${policy.usersCount} usuário`
            : `${policy.usersCount} usuários`}
        </Typography>
      </div>
    </div>
  );
};

export default UsersCell;
