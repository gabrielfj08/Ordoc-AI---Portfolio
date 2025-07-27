import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const ErrorFlowUserButton = () => {
  return (
    <>
      <div className="sm:visible invisible flex justify-center items-center gap-4 h-16 w-60 bg-white rounded-lg">
        <Icon alt="alert" name="alert" stroke color="error" />
        <Typography variant="footnote1">Erro ao carregar!</Typography>
      </div>
      <div className="w-10 h-10 rounded-full bg-white justify-center items-center sm:hidden flex">
        <Icon alt="alert" name="alert" stroke color="error" />
      </div>
    </>
  );
};

export default ErrorFlowUserButton;
