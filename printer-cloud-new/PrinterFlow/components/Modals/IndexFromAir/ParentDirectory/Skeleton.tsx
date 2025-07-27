import * as React from 'react';
import { Skeleton } from 'printer-ui';

const ParentDirectorySkeleton = () => {
  return (
    <div className="flex space-x-3.5 pb-3 border-b border-lightGray items-center h-12">
      <Skeleton w={8} h={8} rounded="full" />
      <Skeleton w={28} h={6} />
    </div>
  );
};
export default ParentDirectorySkeleton;
