import * as React from 'react';
import { Icon, TypographyV3 as Typography } from 'printer-ui';
import { useSession } from '../../../hooks';

const TasksTableEmpty = () => {
  const { themeColor } = useSession();

  return (
    <div
      className={`border rounded-lg border-${themeColor} my-4 flex items-center space-x-2 justify-center py-7`}
    >
      <Icon alt="info" name="info" color={themeColor} stroke />
      <Typography
        family="jakartaBold"
        variant="bodyMd"
        color={themeColor}
        align="center"
      >
        Nenhuma tarefa encontrada!
      </Typography>
    </div>
  );
};

export default TasksTableEmpty;
