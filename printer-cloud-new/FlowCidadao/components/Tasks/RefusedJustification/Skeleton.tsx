import * as React from 'react';
import { Skeleton } from 'printer-ui';

const RefuseJustificationNoteSkeleton = () => {
  return (
    <div className="space-y-2">
      <Skeleton w={28} h={4} rounded="sm" />
      <Skeleton w={32} h={4} rounded="sm" />
      <Skeleton w={28} h={4} rounded="sm" />
      <Skeleton w={32} h={4} rounded="sm" />
    </div>
  );
};

export default RefuseJustificationNoteSkeleton;
