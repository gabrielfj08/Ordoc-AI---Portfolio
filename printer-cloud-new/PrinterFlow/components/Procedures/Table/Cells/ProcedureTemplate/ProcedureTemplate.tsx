import * as React from 'react';
import { Typography } from 'printer-ui';
import { ProcedureTemplateCellProps } from './types';

const ProcedureTemplateCell = ({ procedure }: ProcedureTemplateCellProps) => {
  return (
    <div className="hidden sm:flex sm:w-80 justify-center items-center truncate">
      <Typography variant="footnote1" className="truncate">
        {procedure.procedureTemplateName}
      </Typography>
    </div>
  );
};

export default ProcedureTemplateCell;
