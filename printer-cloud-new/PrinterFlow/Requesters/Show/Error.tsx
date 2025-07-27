import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const ShowRequesterError = () => {
  return (
    <div className="m-1 items-center justify-center md:mt-5 md:space-y-0 w-full h-full sm:block mb-6">
      <div className="space-y-6 pl-4 sm:pl-0">
        <Typography family="robotoBold" variant="title2">
          Dados do solicitante
        </Typography>
        <div className="flex justify-center items-center space-x-3 h-36 sm:w-full sm:ml-0 ml-3 w-80">
          <Icon name="alert" alt="alert" color="red" stroke w={26} h={26} />
          <Typography variant="footnote2" color="gray">
            Erro! Não foi possível carregar os dados do solicitante, tente
            novamente mais tarde.
          </Typography>
        </div>
      </div>
      <div className="space-y-4 pt-6 pl-4 sm:pl-0">
        <Typography family="robotoBold" variant="title2">
          Endereço
        </Typography>
        <div className="flex justify-center items-center space-x-3 h-36 sm:w-full sm:ml-0 ml-3 w-80">
          <Icon name="alert" alt="alert" color="red" stroke w={26} h={26} />
          <Typography variant="footnote2" color="gray">
            Erro! Não foi possível carregar o endereço do solicitante, tente
            novamente mais tarde.
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default ShowRequesterError;
