import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const SearchTableInitialMessage = () => {
  return (
    <div className="border-2 bg-white border-lightGray mt-20 flex sm:items-center sm:space-x-2 justify-center py-4">
      <Icon alt="info" name="info" color="gray" stroke w={28} h={28} />
      <Typography variant="footnote1" color="gray" align="center">
        Para iniciar a consulta, busque um número de processo OU um tipo de
        processo/assunto.
      </Typography>
    </div>
  );
};

export default SearchTableInitialMessage;
