import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const DocumentVersionsEmpty = () => {
  return (
    <div className="flex items-center justify-center gap-2 border border-lightGray rounded-md h-32 px-5">
      <Icon alt="alert" name="alert" color="error" stroke w={26} h={26} />
      <Typography variant="footnote2" color="gray">
        Você não possui autorização para visualizar as versões.
      </Typography>
    </div>
  );
};

export default DocumentVersionsEmpty;
