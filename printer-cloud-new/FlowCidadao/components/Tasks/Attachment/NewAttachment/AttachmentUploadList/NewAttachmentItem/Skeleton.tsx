import * as React from 'react';
import { Skeleton } from 'printer-ui';

const NewAttachmentTaskItemSkeleton = () => {
  return (
    <div className="space-y-2">
      <Skeleton w="full" h={11} rounded="default" />
    </div>
  );
};

export default NewAttachmentTaskItemSkeleton;
