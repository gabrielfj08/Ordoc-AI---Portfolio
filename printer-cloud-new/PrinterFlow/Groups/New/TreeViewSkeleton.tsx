import * as React from 'react';
import { Skeleton } from 'printer-ui';

const TreeViewSkeleton = () => {
  return (
    <div className="w-full">
      <Skeleton h={16} w="full" rounded="lg" />
    </div>
  );
};

export default TreeViewSkeleton;
