import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const ParentDirectoryError = () => {
  return (
    <div className="items-center flex space-x-2 border-b border-lightGray pb-3 h-12">
      <Icon name="info" alt="info" color="red" stroke w={26} h={26} />
      <Typography variant="footnote2" color="gray" align="left">
        Erro! Não foi possivel carregar o nome da pasta pai, tente novamente
        mais tarde.
      </Typography>
    </div>
  );
};
export default ParentDirectoryError;
