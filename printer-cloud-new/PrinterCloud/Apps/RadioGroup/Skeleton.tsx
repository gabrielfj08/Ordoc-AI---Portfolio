import * as React from 'react';
import { Skeleton } from 'printer-ui';

const AppsRadioGroupSkeleton = () => {
  return (
    <div className="pt-12 sm:pt-7">
      <div className="pb-2">
        <Skeleton h={4} w={44} rounded="default" />
      </div>
      <div className="pb-2">
        <Skeleton h={4} w={72} rounded="default" />
      </div>
      <div className="grid grid-cols-2 grid-flow-row gap-4 items-center">
        <Skeleton h={10} w="full" rounded="lg" />
        <Skeleton h={10} w="full" rounded="lg" />
        <Skeleton h={10} w="full" rounded="lg" />
        <Skeleton h={10} w="full" rounded="lg" />
      </div>
    </div>
  );
};

export default AppsRadioGroupSkeleton;
