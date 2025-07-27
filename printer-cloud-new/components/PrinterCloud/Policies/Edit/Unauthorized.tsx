import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const UnauthorizedEditPage = () => {
  return (
    <>
      <main className="pt-40 flex items-center justify-center space-x-2 px-6">
        <Icon name="alert" alt="erro" color="error" stroke />
        <Typography variant="footnote1" color="gray">
          Para visualizar este recurso, você precisa estar inserido em uma
          permissão de acesso. Solicite o acesso ao gerente da instituição.
        </Typography>
      </main>
    </>
  );
};

export default UnauthorizedEditPage;
