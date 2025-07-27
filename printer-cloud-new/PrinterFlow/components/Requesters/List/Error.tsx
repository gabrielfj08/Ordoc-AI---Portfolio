import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const ListError = () => {
  return (
    <div className="h-80 items-center justify-center flex sm:w-[38.5rem] w-full space-x-2">
      <Icon name="info" alt="info" color="red" stroke w={26} h={26} />
      <Typography variant="footnote2" color="gray">
        Erro ao listar solicitantes.
      </Typography>
    </div>
  );
};

export default ListError;
