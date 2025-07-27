import * as React from 'react';
import { Typography } from 'printer-ui';
import { GroupCodeCellProps } from './types';

const GroupCodeCell = ({ group }: GroupCodeCellProps) => {
  return (
    <div className="w-full px-4 justify-start">
      <Typography variant="footnote1">{group.code}</Typography>
    </div>
  );
};

export default GroupCodeCell;
