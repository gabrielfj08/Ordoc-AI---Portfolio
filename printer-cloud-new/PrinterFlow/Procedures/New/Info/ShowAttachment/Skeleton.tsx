import * as React from 'react';
import { Skeleton, Typography } from 'printer-ui';

const ShowAttachmentSkeleton = () => {
  return (
    <div className="sm:w-1/2 w-full space-y-2">
      <Skeleton w="full" h={10} rounded="md" />
      <Skeleton w="full" h={10} rounded="md" />
      <Skeleton w="full" h={10} rounded="md" />
    </div>
  );
};

export default ShowAttachmentSkeleton;
