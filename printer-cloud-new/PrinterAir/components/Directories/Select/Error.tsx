import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const SelectDirectorySkeleton = () => {
  return (
    <div className="flex items-center w-full h-8 gap-2">
      <Icon name="info" alt="info" color="red" stroke w={22} h={22} />
      <Typography variant="footnote2" color="gray">
        Erro ao listar pastas.
      </Typography>
    </div>
  );
};

export default SelectDirectorySkeleton;
