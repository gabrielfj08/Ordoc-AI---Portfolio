import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const ErrorEditPage = () => {
  return (
    <>
      <main className="pt-40 flex items-center justify-center space-x-2 px-6">
        <Icon name="alert" alt="erro" color="error" stroke />
        <Typography variant="footnote1" color="gray">
          Erro! Não foi possível carregar a página de edição de permissão, tente
          novamente mais tarde.
        </Typography>
      </main>
    </>
  );
};

export default ErrorEditPage;
