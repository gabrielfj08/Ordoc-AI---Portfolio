import * as React from 'react';
import { TypographyV3 as Typography } from 'printer-ui';
import { useSession } from '../../../../../hooks';

const TaskExternalAttachmentListEmpty = () => {
  const { themeColor } = useSession();

  return (
    <div
      className={`w-full h-fit overflow-y-auto px-4 py-2 border border-${themeColor} rounded-lg space-y-1`}
    >
      <Typography
        variant="bodyMd"
        family="jakartaBold"
        color={themeColor}
        align="start"
      >
        Meus anexos:
      </Typography>
      <Typography
        variant="bodyMd"
        family="jakarta"
        color="darkGray"
        className="italic"
      >
        Nenhum anexo
      </Typography>
    </div>
  );
};

export default TaskExternalAttachmentListEmpty;
