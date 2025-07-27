import { Skeleton } from 'printer-ui';
import * as React from 'react';

const TreeSkeleton = () => {
  return (
    <div className="mb-4">
      <Skeleton h={16} w="full" rounded="lg" />
    </div>
  );
};

export default TreeSkeleton;
