import { Skeleton } from 'printer-ui';
import * as React from 'react';

const SystemInformationSkeleton = () => {
  return (
    <>
      <div className="w-1/2">
        <div className="space-y-3 w-full md:w-1/2 px-4 sm:px-0">
          <div className="pb-2">
            <Skeleton h={6} w={60} rounded="default" />
          </div>
          <Skeleton h={4} w={44} rounded="default" />
          <Skeleton h={4} w={60} rounded="default" />
          <Skeleton h={4} w={56} rounded="default" />
          <Skeleton h={4} w={24} rounded="default" />
        </div>
      </div>
    </>
  );
};

export default SystemInformationSkeleton;
