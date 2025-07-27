import * as React from 'react';
import { Typography } from 'printer-ui';
import { ProcessNumberCellProps } from './types';

const ProcessNumberCell = ({ procedure }: ProcessNumberCellProps) => {
  return (
    <div className="w-44 sm:w-auto sm:pl-12 px-2 truncate">
      <Typography variant="footnote1" className="truncate sm:hidden">
        {procedure.procedureTemplateName}
      </Typography>
      <Typography variant="footnote1" className="truncate">
        {procedure.processNumber}
      </Typography>
    </div>
  );
};

export default ProcessNumberCell;
