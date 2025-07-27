import * as React from 'react';
import { Typography } from 'printer-ui';

const TaskFileMentionListEmpty = () => {
  return (
    <Typography variant="footnote1" className="italic" color="gray">
      Nenhuma menção adicionada
    </Typography>
  );
};

export default TaskFileMentionListEmpty;
