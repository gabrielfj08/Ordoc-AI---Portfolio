import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const ShowGroupTreeUnauthorized = () => {
  return (
    <div className="flex justify-center items-center sm:mr-10 space-x-3 p-4 py-7 mx-5 sm:w-full sm:ml-0 ml-3 w-80 border border-lighterGray">
      <Icon name="alert" alt="alert" color="yellow" stroke w={26} h={26} />
      <Typography variant="footnote2" color="gray">
        Para visualizar esse recurso, você precisa estar inserido em uma
        permissão de acesso. Solicite o acesso ao gerente da instituição.
      </Typography>
    </div>
  );
};

export default ShowGroupTreeUnauthorized;
