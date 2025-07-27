import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const TaskPriority = ({ priority }) => {
  switch (priority) {
    case 'normal':
      return (
        <>
          <Icon
            alt="normalPriority"
            name="mediumPriority"
            stroke
            w={30}
            h={30}
            color="yellow"
          />
          <Typography variant="footnote1">Normal</Typography>
        </>
      );
    case 'high':
      return (
        <>
          <Icon
            alt="highPriority"
            name="highPriority"
            stroke
            w={30}
            h={30}
            color="error"
          />
          <Typography variant="footnote1">Alta</Typography>
        </>
      );
    default:
      return (
        <>
          <Icon
            alt="normalPriority"
            name="mediumPriority"
            stroke
            w={30}
            h={30}
            color="yellow"
          />
          <Typography variant="footnote1">Normal</Typography>
        </>
      );
  }
};

export default TaskPriority;
