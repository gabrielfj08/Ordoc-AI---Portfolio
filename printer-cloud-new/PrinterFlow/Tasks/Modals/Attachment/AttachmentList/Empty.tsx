import * as React from 'react';
import { Typography } from 'printer-ui';

const TaskAttachmentListEmpty = () => {
  return (
    <>
      <Typography variant="footnote1" className="italic" color="gray">
        Nenhum anexo adicionado
      </Typography>
    </>
  );
};

export default TaskAttachmentListEmpty;
