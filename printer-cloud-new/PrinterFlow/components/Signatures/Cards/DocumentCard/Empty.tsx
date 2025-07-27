import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const DocumentCardEmpty = () => {
  return (
    <div className="border-2 bg-white border-lightGray mt-20 flex items-center space-x-2 justify-center py-4">
      <Icon alt="info" name="info" color="gray" stroke w={28} h={28} />
      <Typography variant="footnote1" color="gray" align="center">
        Nenhuma assinatura encontrada!
      </Typography>
    </div>
  );
};

export default DocumentCardEmpty;
