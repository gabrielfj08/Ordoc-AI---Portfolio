import * as React from 'react';
import { Typography } from 'printer-ui';
import { PolicyCellProps } from './types';

const GroupCell = ({ policy }: PolicyCellProps) => {
  return (
    <div>
      <div className="h-14 items-center justify-center cursor-pointer sm:flex hidden">
        <Typography variant="footnote1">
          {policy.userGroupsCount === 1
            ? `${policy.userGroupsCount} grupo`
            : `${policy.userGroupsCount} grupos`}
        </Typography>
      </div>
    </div>
  );
};

export default GroupCell;
