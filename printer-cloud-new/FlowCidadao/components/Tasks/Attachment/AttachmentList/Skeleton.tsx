import * as React from 'react';
import { Skeleton } from 'printer-ui';

const AttachmentExternalTaskListSkeleton = () => {
  return (
    <div className="w-full space-y-2">
      <Skeleton w="full" h={24} rounded="md" />
    </div>
  );
};

export default AttachmentExternalTaskListSkeleton;
