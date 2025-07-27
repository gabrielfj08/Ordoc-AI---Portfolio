import * as React from 'react';
import { useDrawer } from '../../../hooks';
import { Icon, Typography } from 'printer-ui';

const DetailsGroupError = () => {
  const { closeDrawer } = useDrawer();

  return (
    <main className="h-full max-w-full p-4 sm:p-8 overflow-y-auto">
      <div className="flex items-end justify-end px-6">
        <button
          onClick={() => {
            closeDrawer();
          }}
        >
          <Icon name="close" alt="close" stroke w={35} h={35} />
        </button>
      </div>
      <header className="flex justify-center items-center pb-8 p-6">
        <Icon name="info" alt="info" stroke w={26} h={26} />
        <Typography variant="headline" family="robotoMedium" className="pl-2">
          Detalhes do grupo
        </Typography>
      </header>
      <div className="flex justify-center items-center space-x-3 h-36 w-full">
        <Icon name="alert" alt="alert" color="red" stroke w={26} h={26} />
        <Typography variant="footnote2" color="gray">
          Erro! Não foi possível carregar os detalhes do grupo, tente novamente
          mais tarde.
        </Typography>
      </div>
    </main>
  );
};

export default DetailsGroupError;
