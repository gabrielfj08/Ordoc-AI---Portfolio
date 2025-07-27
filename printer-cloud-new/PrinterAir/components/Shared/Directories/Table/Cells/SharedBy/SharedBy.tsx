import * as React from 'react';
import { Typography } from 'printer-ui';
import { SharedByCellProps } from './types';

const SharedByCell = ({ sharedDirectory }: SharedByCellProps) => {
  return (
    <div className="items-center space-x-8 hidden sm:flex px-4 justify-center">
      <Typography variant="footnote1">
        {sharedDirectory.createdBy.name}
      </Typography>
    </div>
  );
};

export default SharedByCell;
