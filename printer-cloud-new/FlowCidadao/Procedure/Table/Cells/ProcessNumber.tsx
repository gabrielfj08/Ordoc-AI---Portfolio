import * as React from 'react';
import { TypographyV3 as Typography } from 'printer-ui';
import { CellProps } from '../types';

const ProcessNumberCell = ({ procedure }: CellProps) => {
  return (
    <div className="flex items-center justify-center">
      <div>
        <Typography family="jakartaLight" variant="bodyMd">
          {procedure.processNumber}
        </Typography>
      </div>
    </div>
  );
};

export default ProcessNumberCell;
