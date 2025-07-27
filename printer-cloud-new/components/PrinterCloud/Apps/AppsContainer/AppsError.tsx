import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const AppsError = () => {
  return (
    <div className="border border-lighterGray h-96 sm:p-0 px-14 items-center justify-center flex w-full space-x-2">
      <Icon alt="alert" name="alert" color="error" stroke />
      <Typography variant="footnote1" color="gray" align="center">
        Erro! Não foi possível carregar a página home, tente novamente mais
        tarde.
      </Typography>
    </div>
  );
};

export default AppsError;
