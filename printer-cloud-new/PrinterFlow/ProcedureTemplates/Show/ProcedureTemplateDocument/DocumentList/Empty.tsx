import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const ProcedureTemplateDocumentListEmpty = () => {
  return (
    <div className="h-20 flex items-center justify-center border-2 border-lightGray bg-white">
      <Icon
        name="info"
        alt="info"
        color="gray"
        stroke
        w={26}
        h={26}
        className="mr-2"
      />
      <Typography variant="footnote2" color="gray">
        Este tipo de processo ainda não possui nenhum anexo.
      </Typography>
    </div>
  );
};

export default ProcedureTemplateDocumentListEmpty;
