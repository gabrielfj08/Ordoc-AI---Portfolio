import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const UnauthorizedMessage = () => {
  return (
    <>
      <div className="border-2 border-lighterGray mt-20 flex items-center space-x-2 justify-center py-4 mb-10">
        <Icon alt="alert" name="alert" color="yellow" stroke w={28} h={28} />
        <Typography variant="footnote1" color="gray" align="center">
          Para visualizar este recurso, você precisa estar inserido em um grupo.
          Solicite o acesso ao gerente da instituição.
        </Typography>
      </div>
    </>
  );
};

export default UnauthorizedMessage;
