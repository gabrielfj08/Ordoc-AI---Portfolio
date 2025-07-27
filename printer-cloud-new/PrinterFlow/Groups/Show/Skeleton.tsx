import * as React from 'react';
import { Skeleton } from 'printer-ui';

const ShowGroupSkeleton = () => {
  return (
    <div className="w-full sm:w-12/12 space-y-4 sm:mr-10 mt-10 sm:mt-0">
      <div className="hidden sm:flex justify-between">
        <Skeleton w={52} h={10} rounded="lg" />
        <Skeleton w={36} h={10} rounded="lg" />
      </div>
      <div className="hidden sm:flex justify-between">
        <Skeleton w={128} h={28} rounded="lg" />
        <Skeleton w={160} h={144} rounded="lg" />
      </div>

      <div className="sm:hidden w-10/12 flex flex-col ml-8 space-y-4">
        <Skeleton w={40} h={10} rounded="lg" />
        <Skeleton w="full" h={20} rounded="lg" />
        <Skeleton w="full" h={10} rounded="lg" />
        <Skeleton w="full" h={96} rounded="lg" />
      </div>
    </div>
  );
};

export default ShowGroupSkeleton;
