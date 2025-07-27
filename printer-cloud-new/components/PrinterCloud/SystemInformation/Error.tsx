import { Icon, Typography } from 'printer-ui';
import * as React from 'react';

const SystemInformationError = () => {
  return (
    <div className="w-full md:w-1/2 px-4 sm:px-0">
      <div className="mb-5 md:mb-0 md:absolute">
        <Typography variant="title2" family="robotoBold">
          Informações do sistema
        </Typography>
      </div>
      <div className="flex h-full items-center justify-center">
        <div className="space-x-2 flex items-center">
          <Icon name="info" alt="info" color="red" stroke w={26} h={26} />
          <Typography variant="footnote2" color="gray" align="left">
            Erro! Não foi possível carregar as informações, <br /> tente
            novamente mais tarde
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default SystemInformationError;
