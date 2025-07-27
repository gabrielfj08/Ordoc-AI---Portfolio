import * as React from 'react';
import { Typography } from 'printer-ui';
import { ProcedureTemplateTableProps } from './types';

const ProcedureTemplateTable = ({
  procedureTemplates,
}: ProcedureTemplateTableProps) => {
  return (
    <div className="w-44 sm:w-auto md:max-w-md sm:max-w-sm sm:px-4 px-2 truncate flex justify-start items-center sm:h-20">
      <Typography variant="footnote1" className="truncate">
        {procedureTemplates.name}
      </Typography>
    </div>
  );
};

export default ProcedureTemplateTable;
