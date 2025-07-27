import * as React from 'react';
import { Typography } from 'printer-ui';
import { ProcedureCellProps } from '../../types';

const ProcedureCell = ({ procedure }: ProcedureCellProps) => {
  return (
    <div className="hidden xl:flex flex-col items-center justify-center max-w-[240px] truncate px-2">
      <Typography
        variant="footnote1"
        className="truncate w-full"
        align="center"
      >
        {procedure.processNumber}
      </Typography>
      <Typography variant="footnote1">
        {procedure.procedureTemplateName}
      </Typography>
    </div>
  );
};

export default ProcedureCell;
