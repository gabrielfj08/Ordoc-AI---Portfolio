import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const EditProcedureTemplateUnauthorized = () => {
  return (
    <div className="border border-lighterGray flex items-center space-x-2 justify-center py-7 mt-10 mx-6">
      <Icon name="alert" alt="alert" color="yellow" stroke w={26} h={26} />
      <Typography variant="footnote2" color="gray">
        Para visualizar esse recurso, você precisa estar inserido em uma
        permissão de acesso. Solicite o acesso ao gerente da instituição.
      </Typography>
    </div>
  );
};

export default EditProcedureTemplateUnauthorized;
