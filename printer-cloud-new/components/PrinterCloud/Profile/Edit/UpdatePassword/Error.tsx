import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const UpdatePasswordError = () => {
  return (
    <div className=" h-12 w-full flex items-center justify-center gap-2 my-12 px-8">
      <Icon name="info" alt="alert" color="red" stroke w={26} h={26} />

      <Typography variant="footnote2" color="gray">
        Erro! Não foi possível carregar o formulário de alteração de senha,
        tente novamente mais tarde.
      </Typography>
    </div>
  );
};

export default UpdatePasswordError;
