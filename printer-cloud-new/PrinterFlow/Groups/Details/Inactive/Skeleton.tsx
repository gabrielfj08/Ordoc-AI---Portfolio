import * as React from 'react';
import { Skeleton } from 'printer-ui';

const InactiveGroupDetailsSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton w="full" h={20} rounded="lg" />
      <Skeleton w="full" h={20} rounded="lg" />
      <Skeleton w="full" h={20} rounded="lg" />
    </div>
  );
};

export default InactiveGroupDetailsSkeleton;
