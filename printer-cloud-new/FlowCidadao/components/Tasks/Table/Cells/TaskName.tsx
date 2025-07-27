import * as React from 'react';
import { TypographyV3 as Typography } from 'printer-ui';
import { CellProps } from '../types';

const TaskNameCell = ({ task }: CellProps) => {
  return (
    <div className="flex items-center justify-center">
      <div>
        <Typography family="jakartaLight" variant="bodyMd" align="center">
          {task.name}
        </Typography>
      </div>
    </div>
  );
};

export default TaskNameCell;
