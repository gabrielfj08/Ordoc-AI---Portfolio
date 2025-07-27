import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const ErrorFlowProfile = () => {
  return (
    <div className="items-center justify-center flex h-96 py-5 px-4 z-50">
      <div className="items-center justify-center block">
        <div className="items-center justify-center flex">
          <Icon name="alert" alt="alert" color="red" stroke w={26} h={26} />
        </div>
        <Typography variant="footnote2" color="gray">
          Erro ao carregar as informações do perfil!
        </Typography>
      </div>
    </div>
  );
};

export default ErrorFlowProfile;
