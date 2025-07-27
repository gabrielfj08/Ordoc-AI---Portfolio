import * as React from 'react';
import { Icon, TypographyV3 as Typography } from 'printer-ui';

const SharedRequesterEmpty = () => {
  return (
    <div className="flex items-center space-x-2 pt-4 pb-4 border-b-2 border-lightGray">
      <Icon
        name="info"
        alt="empty"
        fill
        stroke
        color="lightGray"
        w={20}
        h={20}
      />
      <Typography family="jakarta" variant="bodySm" color="gray">
        Este processo ainda não foi compartilhado.
      </Typography>
    </div>
  );
};

export default SharedRequesterEmpty;
