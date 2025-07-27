import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const DirectoriesListError = () => {
  return (
    <div className="flex space-x-2 justify-center items-center h-72">
      <Icon name="info" alt="info" color="red" stroke w={26} h={26} />
      <Typography variant="footnote2" color="gray">
        Erro! Não foi possível listar as pastas. Tente novamente mais tarde.
      </Typography>
    </div>
  );
};

export default DirectoriesListError;
