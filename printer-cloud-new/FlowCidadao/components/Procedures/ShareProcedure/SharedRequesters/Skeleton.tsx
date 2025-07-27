import * as React from 'react';
import { Skeleton } from 'printer-ui';

const ShareProcedureModalSkeleton = () => {
  return (
    <div>
      <Skeleton
        className="sm:w-[50vw] sm:h-[60vh]"
        w={96}
        h={96}
        rounded="lg"
      />
    </div>
  );
};

export default ShareProcedureModalSkeleton;
