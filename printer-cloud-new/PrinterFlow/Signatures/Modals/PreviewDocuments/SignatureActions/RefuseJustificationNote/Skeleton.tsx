import * as React from 'react';
import { Skeleton } from 'printer-ui';

const RefuseJustificationNoteSkeleton = () => {
  return (
    <div className="space-y-2">
      <Skeleton w={96} h={8} />
      <Skeleton w={144} h={8} />
    </div>
  );
};

export default RefuseJustificationNoteSkeleton;
