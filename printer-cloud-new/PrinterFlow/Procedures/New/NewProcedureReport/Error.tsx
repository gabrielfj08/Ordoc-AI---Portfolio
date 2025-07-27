import { Icon, Typography } from 'printer-ui';
import React from 'react';

const NewProcedureReportError = () => {
  return (
    <div className="flex items-center gap-2 border border-lightGray rounded-md h-16 px-5">
      <Icon name="alert" alt="alert" color="red" stroke w={26} h={26} />
      <Typography variant="footnote1" color="gray">
        Erro ao gerar PDF do processo.
      </Typography>
    </div>
  );
};

export default NewProcedureReportError;
