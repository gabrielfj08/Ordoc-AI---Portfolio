import * as React from 'react';
import { Skeleton } from 'printer-ui';

const ProceduresTableSkeleton = () => {
  return (
    <div className="w-full sm:h-96 h-60">
      <div className="space-y-2">
        <Skeleton
          w="full"
          h={12}
          rounded="default"
          className="sm:flex hidden"
        />
        <Skeleton
          w="full"
          h={12}
          rounded="default"
          className="sm:flex hidden"
        />
        <Skeleton w="full" h={12} rounded="default" />
        <Skeleton w="full" h={12} rounded="default" />
        <Skeleton w="full" h={12} rounded="default" />
        <Skeleton w="full" h={12} rounded="default" />
      </div>
    </div>
  );
};

export default ProceduresTableSkeleton;
