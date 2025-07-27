import * as React from 'react';
import { Skeleton } from 'printer-ui';

const SharedSkeleton = () => {
  return (
    <div className="flex w-full h-full border-b border-lighterGray">
      <Skeleton w="full" h="full" rounded="default" />
    </div>
  );
};

export default SharedSkeleton;
