import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const IndexDocumentsFromAirError = () => {
  return (
    <div className="justify-center items-center flex space-x-2 pb-3">
      <Icon name="info" alt="info" color="red" stroke w={26} h={26} />
      <Typography variant="footnote2" color="gray" align="left">
        Erro! Não foi possivel carregar os arquivos, tente novamente mais tarde.
      </Typography>
    </div>
  );
};
export default IndexDocumentsFromAirError;
