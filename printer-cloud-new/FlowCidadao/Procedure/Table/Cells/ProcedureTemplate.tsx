import * as React from 'react';
import { TypographyV3 as Typography } from 'printer-ui';
import { CellProps } from '../types';

const ProcedureTemplateCell = ({ procedure }: CellProps) => {
  return (
    <div className="flex items-center justify-center">
      <div>
        <Typography family="jakarta" variant="bodyMd">
          {procedure.procedureTemplateName}
        </Typography>
      </div>
    </div>
  );
};

export default ProcedureTemplateCell;
