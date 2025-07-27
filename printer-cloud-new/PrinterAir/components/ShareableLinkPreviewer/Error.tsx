import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const ShareableLinkPreviewerError = () => {
  return (
    <div className="flex items-center justify-center gap-2 border border-lightGray rounded-md h-[80vh]">
      <Icon name="info" alt="info" color="red" stroke w={26} h={26} />
      <Typography variant="footnote2" color="gray">
        Esse link de compartilhamento expirou
      </Typography>
    </div>
  );
};

export default ShareableLinkPreviewerError;
