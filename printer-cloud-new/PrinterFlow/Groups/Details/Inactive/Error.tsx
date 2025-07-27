import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const InactiveGroupDetailsError = () => {
  return (
    <main className="h-full max-w-full p-4 sm:p-4 overflow-y-auto">
      <div className="flex justify-center items-center space-x-3 h-36 w-full">
        <Icon name="alert" alt="alert" color="red" stroke w={26} h={26} />
        <Typography variant="footnote2" color="gray">
          Erro! Não foi possivel carregar as informações de desativação do
          grupo. Tente novamente mais tarde.
        </Typography>
      </div>
    </main>
  );
};

export default InactiveGroupDetailsError;
