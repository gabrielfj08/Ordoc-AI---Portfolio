import * as React from 'react';
import { UserGroupsCellProps } from '../types';
import { Typography } from 'printer-ui';

const UserPolicyCell = ({ userGroup }: UserGroupsCellProps) => {
  const textStatus = () => {
    if (userGroup.status == 'inactive') {
      return 'gray';
    }
  };

  return (
    <Typography
      color={textStatus}
      variant="footnote1"
      className="px-4 hidden sm:block"
    >
      {userGroup.policies_count === 1
        ? `${userGroup.policies_count} permissão`
        : `${userGroup.policies_count} permissões`}
    </Typography>
  );
};

export default UserPolicyCell;
