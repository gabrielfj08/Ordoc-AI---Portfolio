import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const ShowProcedureTemplateUnauthorized = () => {
  return (
    <div className="flex justify-center items-center my-20 sm:mr-10 space-x-3 p-4 py-7 sm:ml-0 ml-3 w-11/12 border border-lighterGray">
      <Icon name="alert" alt="alert" color="yellow" stroke w={26} h={26} />
      <Typography variant="footnote2" color="gray">
        Para visualizar esse recurso, você precisa estar inserido em uma
        permissão de acesso. Solicite o acesso ao gerente da instituição.
      </Typography>
    </div>
  );
};

export default ShowProcedureTemplateUnauthorized;
