import * as React from 'react';
import { Skeleton, Typography } from 'printer-ui';

const AttachmentTaskListSkeleton = () => {
  return (
    <div className="w-full space-y-2">
      <Typography variant="footnote1" family="robotoMedium" className="mb-2">
        Anexos:
      </Typography>
      <Skeleton w="full" h={32} rounded="md" />
    </div>
  );
};

export default AttachmentTaskListSkeleton;
