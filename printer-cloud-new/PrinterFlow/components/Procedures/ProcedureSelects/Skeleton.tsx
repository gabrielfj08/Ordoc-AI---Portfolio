import * as React from 'react';
import { Skeleton } from 'printer-ui';

const SelectSkeleton = () => {
  return (
    <div>
      <Skeleton w="full" h={10} rounded="md" />
    </div>
  );
};

export default SelectSkeleton;
