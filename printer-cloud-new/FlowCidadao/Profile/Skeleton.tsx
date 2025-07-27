import * as React from 'react';
import { Skeleton } from 'printer-ui';

const ExternalRequesterProfileSkeleton = () => {
  return (
    <div className="w-full flex flex-col sm:my-6 sm:pr-10 sm:pl-20 px-4">
      <div className="space-y-2 mt-5 sm:mb-0 mb-5 w-full">
        <div className="sm:hidden sm:justify-end justify-center items-center sm:space-x-4 space-y-2 sm:space-y-0 px-4 pb-4">
          <Skeleton w="full" h={16} rounded="lg" />
          <Skeleton w="full" h={16} rounded="lg" />
        </div>
        <div className="hidden sm:flex sm:justify-end justify-center items-center sm:space-x-4 space-y-2 sm:space-y-0 pb-4">
          <Skeleton w={56} h={16} rounded="lg" />
          <Skeleton w={56} h={16} rounded="lg" />
        </div>
      </div>
      <div className="w-full flex flex-col items-center space-y-4">
        <div className="w-full space-y-5 pb-4 px-4 sm:px-0">
          <div className="w-full space-y-2">
            <Skeleton w="full" h={12} rounded="default" />
          </div>
          <div className="justify-center sm:space-x-2 sm:space-y-0 space-y-2 flex-none sm:flex">
            <Skeleton w="full" h={12} rounded="default" />
            <Skeleton w="full" h={12} rounded="default" />
          </div>
          <div className="justify-center sm:space-x-2 sm:space-y-0 space-y-2 flex-none sm:flex">
            <Skeleton w="full" h={12} rounded="default" />
            <Skeleton w="full" h={12} rounded="default" />
          </div>
          <div className="justify-center sm:space-x-2 sm:space-y-0 space-y-2 flex-none sm:flex">
            <Skeleton w="full" h={12} rounded="default" />
            <Skeleton w="full" h={12} rounded="default" />
          </div>
          <div className="w-full space-y-2">
            <Skeleton w="full" h={12} rounded="default" />
          </div>
          <div className="justify-center pt-4 sm:space-x-2 sm:space-y-0 space-y-2 flex-none sm:flex">
            <Skeleton w="full" h={12} rounded="default" />
            <Skeleton w="full" h={12} rounded="default" />
            <Skeleton w="full" h={12} rounded="default" />
          </div>
          <div className="justify-center sm:space-x-2 sm:space-y-0 space-y-2 flex-none sm:flex">
            <Skeleton w="full" h={12} rounded="default" />
            <Skeleton w="full" h={12} rounded="default" />
            <Skeleton w="full" h={12} rounded="default" />
            <Skeleton w="full" h={12} rounded="default" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ExternalRequesterProfileSkeleton;
