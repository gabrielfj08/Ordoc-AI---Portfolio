import * as React from 'react';
import { Typography } from 'printer-ui';
import { SharedByCellProps } from './types';

const SharedByCell = ({ sharedDocument }: SharedByCellProps) => {
  return (
    <div className="items-center space-x-8 hidden sm:flex px-4 justify-center">
      <Typography variant="footnote1">
        {sharedDocument.createdBy.name}
      </Typography>
    </div>
  );
};

export default SharedByCell;
