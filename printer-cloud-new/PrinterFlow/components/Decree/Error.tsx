import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import AppBar from '../../../components/AppBar';

const DecreeError = () => {
  return (
    <div>
      <AppBar onClick={() => {}} />
      <div className="flex flex-col px-4 items-center h-screen justify-center py-10 space-x-2 sm:flex-row">
        <Icon alt="alert" name="alert" color="error" stroke />
        <Typography variant="footnote1" color="gray" align="center">
          Erro! Não foi possível carregar as informações do decreto, tente
          novamente mais tarde.
        </Typography>
      </div>
    </div>
  );
};

export default DecreeError;
