import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const RemoveDirectoryJobError = () => {
  return (
    <div className="flex items-center gap-2 border border-lightGray rounded-md h-16 px-5">
      <Icon name="info" alt="info" color="red" stroke w={26} h={26} />
      <Typography variant="footnote2" color="gray">
        Erro ao remover pasta(s)
      </Typography>
    </div>
  );
};

export default RemoveDirectoryJobError;
