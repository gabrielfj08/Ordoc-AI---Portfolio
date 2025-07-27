import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const InactiveTaskTemplateDetailsError = () => {
  return (
    <div className="h-96 sm:p-0 px-14 items-center justify-center flex w-full space-x-2">
      <Icon name="info" alt="info" color="red" stroke w={26} h={26} />
      <Typography variant="footnote2" color="gray" align="center">
        Erro! Não foi possível carregar os detalhes de desativação do tipo de
        tarefa, tente novamente mais tarde.
      </Typography>
    </div>
  );
};

export default InactiveTaskTemplateDetailsError;
