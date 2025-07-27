import * as React from 'react';
import { Icon, TypographyV3 as Typography } from 'printer-ui';
import { useSession } from '../../../../../hooks';

const TaskExternalCommentItemError = () => {
  const { themeColor } = useSession();

  return (
    <Typography
      family="jakarta"
      variant="bodySm"
      color="error"
      className="px-2"
    >
      Erro!
    </Typography>
  );
};

export default TaskExternalCommentItemError;
