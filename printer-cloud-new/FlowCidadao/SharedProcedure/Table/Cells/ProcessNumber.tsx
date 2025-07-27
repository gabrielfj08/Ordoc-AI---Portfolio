import * as React from 'react';
import { Icon, TypographyV3 as Typography } from 'printer-ui';
import { CellProps } from '../types';

const ProcessNumberCell = ({ sharedProcedure, color }: CellProps) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <Icon alt="file" name="fileV3" stroke h={20} w={20} color={color} />
      <Typography family="jakarta" variant="bodyMd">
        {sharedProcedure.procedure.processNumber}
      </Typography>
    </div>
  );
};

export default ProcessNumberCell;
