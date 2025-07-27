import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import Header from '../../components/Layout/Header';

const UnauthorizedMessage = () => {
  return (
    <>
      <Header className="pl-4 sm:pl-8 mt-8 mb-1 sm:m-0">
        <Typography family="robotoMedium" color="darkGray" variant="title2">
          Meu Air
        </Typography>
      </Header>
      <div className="w-full flex justify-center">
        <div className="border-2 border-lighterGray mt-20 flex w-11/12 items-center space-x-2 justify-center px-4 py-4 mb-10">
          <Icon alt="alert" name="alert" color="error" stroke w={28} h={28} />
          <Typography variant="footnote1" color="gray" align="center">
            Para visualizar este recurso, você precisa estar inserido em uma
            permissão de acesso. Solicite o acesso ao gerente da instituição.
          </Typography>
        </div>
      </div>
    </>
  );
};

export default UnauthorizedMessage;
