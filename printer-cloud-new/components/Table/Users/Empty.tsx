import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const UsersTableEmpty = () => {
  return (
    <div className="border-2 border-lighterGray mt-20 flex items-center space-x-2 justify-center py-4 mb-10">
      <Icon alt="info" name="info" color="gray" stroke w={28} h={28} />
      <Typography variant="footnote1" color="gray" align="center">
        Nenhum resultado a ser exibido. Caso necessite, solicite ajuda do
        responsável da instituição.
      </Typography>
    </div>
  );
};

export default UsersTableEmpty;
