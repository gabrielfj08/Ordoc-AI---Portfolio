import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const IndexGroupRequestersEmpty = () => {
  return (
    <div className="border-2 border-lighterGray mt-20 flex items-center space-x-2 justify-center py-4">
      <Icon alt="info" name="info" color="gray" stroke w={28} h={28} />
      <Typography variant="footnote1" color="gray" align="center">
        Nenhum grupo solicitante encontrado!
      </Typography>
    </div>
  );
};

export default IndexGroupRequestersEmpty;
