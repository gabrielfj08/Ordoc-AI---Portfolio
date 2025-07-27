import * as React from 'react';
import { Skeleton } from 'printer-ui';

const ReportSkeleton = () => {
  return (
    <div className="flex items-center p-4 space-x-2">
      <div className="h-[22px] w-[22px]">
        <Skeleton w="full" h="full" rounded="full" />
      </div>
      <Skeleton w="full" h={4} rounded="default" />
    </div>
  );
};

const ReportListSkeleton = () => {
  return (
    <div className="h-[349px] space-y-4 p-2">
      <ReportSkeleton />
      <ReportSkeleton />
      <ReportSkeleton />
      <ReportSkeleton />
      <ReportSkeleton />
    </div>
  );
};

export default ReportListSkeleton;
