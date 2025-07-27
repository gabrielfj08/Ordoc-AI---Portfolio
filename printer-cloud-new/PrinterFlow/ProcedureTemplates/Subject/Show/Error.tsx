import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const ShowSubjectError = () => {
  return (
    <div className="sm:w-full w-fit items-center justify-center flex mt-12 sm:mx-0 mx-4">
      <Icon alt="alert" name="alert" color="error" stroke />
      <Typography
        variant="footnote1"
        color="gray"
        align="center"
        className="sm:pl-4 pl-0"
      >
        Erro! Não foi possível carregar os dados do assunto, tente novamente
        mais tarde.
      </Typography>
    </div>
  );
};

export default ShowSubjectError;
