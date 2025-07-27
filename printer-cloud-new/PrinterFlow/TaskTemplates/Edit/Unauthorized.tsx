import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const EditTaskTemplateUnauthorized = () => {
  return (
    <div className="border border-lighterGray my-20 sm:mr-10 mx-5 flex items-center space-x-2 justify-center py-7 px-4">
      <Icon name="alert" alt="alert" color="yellow" stroke w={26} h={26} />
      <Typography variant="footnote2" color="gray">
        Para visualizar esse recurso, você precisa estar inserido em uma
        permissão de acesso. Solicite o acesso ao gerente da instituição.
      </Typography>
    </div>
  );
};

export default EditTaskTemplateUnauthorized;
