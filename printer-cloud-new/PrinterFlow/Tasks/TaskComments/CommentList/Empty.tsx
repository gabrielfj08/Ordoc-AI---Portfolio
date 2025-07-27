import * as React from 'react';
import { Typography } from 'printer-ui';

const TaskCommentListEmpty = () => {
  return (
    <Typography variant="footnote1" className="italic" color="gray">
      Nenhum comentário adicionado
    </Typography>
  );
};

export default TaskCommentListEmpty;
