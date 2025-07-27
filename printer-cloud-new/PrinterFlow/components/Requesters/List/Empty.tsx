import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const ListEmpty = () => {
  return (
    <div className="h-80 flex items-center justify-center">
      <Icon name="info" alt="info" color="gray" stroke w={26} h={26} />
      <Typography variant="footnote2" color="gray">
        Nenhum solicitante encontrado.
      </Typography>
    </div>
  );
};

export default ListEmpty;
