import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const FieldValueOptionsError = () => {
  return (
    <div className="w-full  bg-white flex items-center justify-center">
      <Icon alt="alert" name="alert" color="error" stroke />
      <Typography variant="footnote1" color="gray" align="center">
        Erro! Não foi possível carregar as opções do campo, tente novamente mais
        tarde.
      </Typography>
    </div>
  );
};

export default FieldValueOptionsError;
