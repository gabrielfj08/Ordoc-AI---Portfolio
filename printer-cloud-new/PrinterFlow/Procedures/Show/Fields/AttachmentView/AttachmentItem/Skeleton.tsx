import { Icon, Skeleton, Typography } from 'printer-ui';
import * as React from 'react';

const AttachmentListItemSkeleton = () => {
  return (
    <div className="space-y-2">
      <Skeleton w="full" h={11} rounded="default" />
    </div>
  );
};

export default AttachmentListItemSkeleton;
