import * as React from 'react';
import { TypographyV3 as Typography } from 'printer-ui';
import { useSession } from '../../../../hooks';

const ExternalTaskDescription = ({ task }) => {
  const { themeColor } = useSession();

  return (
    <div
      className={`w-full min-h-16 max-h-32 overflow-x-auto px-4 py-2 border border-${themeColor} rounded-lg space-y-1`}
    >
      <div className="">
        <Typography
          variant="bodyMd"
          family="jakartaBold"
          color={themeColor}
          align="start"
        >
          Descrição:
        </Typography>
      </div>
      <Typography
        variant="label"
        family="jakartaBold"
        color="darkGray"
        align="start"
      >
        Atualizado em {''}
        {new Intl.DateTimeFormat('pt-BR', {
          dateStyle: 'short',
        }).format(
          new Date(new Date(task.updatedAt).toISOString().replace('.000Z', ''))
        )}
      </Typography>
      <Typography
        variant="bodyMd"
        family="jakarta"
        color="darkGray"
        align="start"
      >
        {task.description}
      </Typography>
    </div>
  );
};

export default ExternalTaskDescription;
