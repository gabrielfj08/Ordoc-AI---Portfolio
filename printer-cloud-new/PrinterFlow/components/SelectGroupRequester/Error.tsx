import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const SelectGroupRequesterError = () => {
  return (
    <div className="w-full items-center justify-start flex">
      <Icon alt="alert" name="alert" color="error" stroke />
      <Typography
        variant="footnote1"
        color="gray"
        align="center"
        className="sm:pl-4 pl-0"
      >
        Erro! Não foi possível carregar os grupos.
      </Typography>
    </div>
  );
};

export default SelectGroupRequesterError;
