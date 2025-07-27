import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const SelectUserOptionsEmpty = () => {
  return (
    <div className=" flex items-center space-x-2 justify-center">
      <Icon alt="info" name="info" color="gray" stroke />
      <Typography variant="footnote1" color="gray">
        Nenhum usuário encontrado!
      </Typography>
    </div>
  );
};

export default SelectUserOptionsEmpty;
