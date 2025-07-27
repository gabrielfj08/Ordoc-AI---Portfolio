import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const BreadcrumbsLinkError = () => {
  return (
    <div className="my-2 flex items-center space-x-2 justify-center ">
      <Icon alt="alert" name="alert" color="error" stroke />
      <Typography variant="footnote1" color="gray" align="center">
        Erro!
      </Typography>
    </div>
  );
};

export default BreadcrumbsLinkError;
