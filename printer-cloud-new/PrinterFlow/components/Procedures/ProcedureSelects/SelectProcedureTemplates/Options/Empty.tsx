import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const ProcedureTemplateSelectOptionsEmpty = () => {
  return (
    <div className="m-1 flex items-center space-x-2 justify-center">
      <Icon alt="info" name="info" color="gray" w={25} h={25} stroke />
      <Typography variant="footnote1" color="gray">
        Nenhum tipo de processo encontrado!
      </Typography>
    </div>
  );
};

export default ProcedureTemplateSelectOptionsEmpty;
