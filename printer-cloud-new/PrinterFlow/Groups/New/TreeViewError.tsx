import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const ShowGroupTreeViewError = () => {
  return (
    <div className="flex justify-center items-center sm:mr-10 space-x-3 p-4 py-7 mx-5 sm:w-full sm:ml-0 ml-3 w-80 border border-lighterGray">
      <Icon alt="alert" name="alert" color="error" stroke />
      <Typography variant="footnote1" color="gray" align="center">
        Erro! Não foi possível carregar os grupos, tente novamente mais tarde.
      </Typography>
    </div>
  );
};

export default ShowGroupTreeViewError;
