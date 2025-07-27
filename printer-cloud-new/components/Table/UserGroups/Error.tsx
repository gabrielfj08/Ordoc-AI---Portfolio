import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const UserGroupsTableError = () => {
  return (
    <div className="border border-lighterGray my-4 flex items-center space-x-2 justify-center py-7">
      <Icon alt="alert" name="alert" color="error" stroke />
      <Typography variant="footnote1" color="gray" align="center">
        Erro! Não foi possível carregar a tabela de grupos, tente novamente mais
        tarde.
      </Typography>
    </div>
  );
};

export default UserGroupsTableError;
