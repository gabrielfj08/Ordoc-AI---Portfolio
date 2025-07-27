import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const ShowGroupError = () => {
  return (
    <div className="border-2 border-lighterGray mt-20 flex items-center space-x-2 justify-center py-4 px-10 sm:px-0 mb-10">
      <Icon alt="alert" name="alert" color="error" stroke />
      <Typography variant="footnote1" color="gray" align="center">
        Erro! Não foi possível carregar os dados do grupo solicitante, tente
        novamente mais tarde.
      </Typography>
    </div>
  );
};

export default ShowGroupError;
