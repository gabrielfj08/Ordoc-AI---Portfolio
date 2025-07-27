import { Skeleton, Typography } from 'printer-ui';
import * as React from 'react';

const AttachmentListSkeleton = () => {
  return (
    <div className="w-full space-y-2">
      <Skeleton w={28} h={4} rounded="default" />
      <Skeleton w="full" h={32} rounded="md" />
    </div>
  );
};

export default AttachmentListSkeleton;
