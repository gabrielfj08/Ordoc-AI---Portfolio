import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const ParentDirectoryUnauthorizedMessage = () => {
  return (
    <div className="items-center flex space-x-2 px-10 h-full">
      <Icon name="alert" alt="alert" color="red" stroke w={26} h={26} />
      <Typography variant="footnote2" color="gray" align="left">
        Para visualizar este recurso, você precisa estar inserido em uma
        permissão de acesso. Solicite o acesso ao gerente da instituição.
      </Typography>
    </div>
  );
};
export default ParentDirectoryUnauthorizedMessage;
