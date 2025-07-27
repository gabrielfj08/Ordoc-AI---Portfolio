import { Icon, Typography } from 'printer-ui';
import * as React from 'react';

const NewGroupPageError = () => {
  return (
    <div className="border-2 bg-white border-lightGray mt-20 my-4 flex items-center space-x-2 justify-center py-7">
      <Icon alt="alert" name="alert" color="error" stroke />
      <Typography variant="footnote1" color="gray" align="center">
        Erro! Não foi possível carregar os grupos, tente novamente mais tarde.
      </Typography>
    </div>
  );
};

export default NewGroupPageError;
