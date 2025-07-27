import * as React from 'react';
import { Skeleton } from 'printer-ui';

const RemoveDirectorySkeleton = () => {
  return (
    <div className="flex items-center">
      <Skeleton w="full" h={16} rounded="md" />
    </div>
  );
};

export default RemoveDirectorySkeleton;
