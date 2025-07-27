import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { useDrawer } from '../../../hooks';

const ProcedureTemplateDetailsError = () => {
  const { closeDrawer } = useDrawer();
  return (
    <div className="w-screen max-w-full h-screen px-4 sm:px-14 flex flex-col py-8 space-y-4 overflow-auto">
      <div className="flex justify-end">
        <button
          onClick={() => {
            closeDrawer();
          }}
        >
          <Icon name="close" alt="close" stroke w={35} h={35} />
        </button>
      </div>
      <div className="flex items-center justify-center space-x-2 py-4">
        <Icon alt="info" name="info" stroke w={26} h={26} />
        <Typography family="robotoMedium" variant="headline">
          Detalhes do tipo de processo
        </Typography>
      </div>

      <div className="h-96 sm:p-0 px-14 items-center justify-center flex w-full space-x-2">
        <Icon name="info" alt="info" color="red" stroke w={26} h={26} />
        <Typography variant="footnote2" color="gray" align="center">
          Erro! Não foi possível carregar os detalhes do processo, tente
          novamente mais tarde.
        </Typography>
      </div>
    </div>
  );
};

export default ProcedureTemplateDetailsError;
