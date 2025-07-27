import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const SearchDocumentsTableEmpty = () => {
  return (
    <div className="border border-lighterGray my-4 flex items-center space-x-2 justify-center py-7">
      <Icon alt="info" name="info" color="gray" stroke w={28} h={28} />
      <Typography variant="footnote1" color="gray" align="center">
        Nenhum documento encontrado.
      </Typography>
    </div>
  );
};

export default SearchDocumentsTableEmpty;
