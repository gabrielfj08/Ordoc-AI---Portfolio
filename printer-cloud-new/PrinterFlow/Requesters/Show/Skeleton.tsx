import * as React from 'react';
import { Skeleton, Typography } from 'printer-ui';

const ShowRequesterSkeleton = () => {
  return (
    <div className="m-1 items-center justify-center md:mt-5 md:space-y-0 w-full h-full sm:block mb-6">
      <div className="space-y-6 pl-4 sm:pl-0">
        <Skeleton w={72} h={10} rounded="lg" />
        <div className="w-9/12">
          <Skeleton w="full" h={48} rounded="lg" />
        </div>
      </div>
      <div className="space-y-4 pt-6 pl-4 sm:pl-0">
        <Skeleton w={72} h={10} rounded="lg" />
        <div className="w-9/12">
          <Skeleton w="full" h={36} rounded="lg" />
        </div>
      </div>
    </div>
  );
};

export default ShowRequesterSkeleton;
