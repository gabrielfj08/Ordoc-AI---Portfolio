import * as React from 'react';
import { Skeleton } from 'printer-ui';

const AttachmentListSkeleton = () => {
  return (
    <div className="grid sm:grid-cols-3 gap-2 sm:gap-6 w-full">
      <Skeleton w="full" h={10} rounded="lg" />
      <Skeleton w="full" h={10} rounded="lg" />
      <Skeleton w="full" h={10} rounded="lg" />
    </div>
  );
};

export default AttachmentListSkeleton;
