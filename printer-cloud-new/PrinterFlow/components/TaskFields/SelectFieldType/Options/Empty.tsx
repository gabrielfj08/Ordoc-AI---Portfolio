import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const SelectFieldTypeOptionsEmpty = () => {
  return (
    <div className="m-1 flex items-center space-x-2 justify-center">
      <Icon alt="info" name="info" color="gray" stroke />
      <Typography variant="footnote1" color="gray">
        Nenhum tipo de campo encontrado!
      </Typography>
    </div>
  );
};

export default SelectFieldTypeOptionsEmpty;
