import * as React from 'react';
import { TypographyV3 as Typography } from 'printer-ui';
import { CellProps } from '../types';

const ExternalCreatedByCell = ({ task }: CellProps) => {
  return (
    <div className="flex items-center justify-center">
      <div>
        <Typography family="jakartaLight" variant="bodyMd">
          {task.createdBy.name}
        </Typography>
      </div>
    </div>
  );
};

export default ExternalCreatedByCell;
