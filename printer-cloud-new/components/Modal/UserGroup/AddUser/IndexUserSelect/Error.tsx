import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const AddUserToUserGroupSelectError = () => {
  return (
    <div className=" h-12 w-full flex items-center justify-center gap-2">
      <Icon name="info" alt="alert" color="red" stroke w={26} h={26} />
      <Typography variant="footnote2" color="gray" align="left">
        Erro! Não foi possível carregar a lista de usuários, tente novamente
        mais tarde.
      </Typography>
    </div>
  );
};

export default AddUserToUserGroupSelectError;
