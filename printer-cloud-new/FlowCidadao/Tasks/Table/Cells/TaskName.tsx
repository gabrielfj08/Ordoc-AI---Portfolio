import * as React from 'react';
import { Icon, TypographyV3 as Typography } from 'printer-ui';
import { useSession } from '../../../../hooks';
import { CellProps } from '../types';

const ExternalTaskNameCell = ({ task }: CellProps) => {
  const { themeColor } = useSession();

  return (
    <div className="flex items-center justify-center space-x-2">
      <Icon
        className="sm:block hidden"
        name="tasksV3"
        alt="tarefas"
        stroke
        color={themeColor}
        w={20}
        h={20}
      />
      <Typography family="jakartaLight" variant="bodyMd" align="center">
        {task.name}
      </Typography>
    </div>
  );
};

export default ExternalTaskNameCell;
