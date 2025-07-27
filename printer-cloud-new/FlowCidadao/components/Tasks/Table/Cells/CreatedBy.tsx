import * as React from 'react';
import { TypographyV3 as Typography } from 'printer-ui';
import { CellProps } from '../types';

const CreatedByCell = ({ task }: CellProps) => {
  return (
    <div className="sm:flex hidden items-center justify-center">
      <div>
        <Typography family="jakartaLight" variant="bodyMd">
          {task.createdBy.name}
        </Typography>
      </div>
    </div>
  );
};

export default CreatedByCell;
