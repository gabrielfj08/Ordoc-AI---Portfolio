import * as React from 'react';
import { Skeleton } from 'printer-ui';

const ProcedureCountSkeleton = () => {
  return (
    <div className="space-y-6">
      <Skeleton w="full" h={20} rounded="lg" />
    </div>
  );
};

export default ProcedureCountSkeleton;
