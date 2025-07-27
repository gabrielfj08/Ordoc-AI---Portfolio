import * as React from 'react';
import { Skeleton } from 'printer-ui';

const DocumentCardSkeleton = () => {
  const CardSkeleton = () => {
    return (
      <div className="w-full rounded-2xl h-fit p-2 border bg-white border-lightGray max-w-full">
        <div className="flex justify-between items-center">
          <Skeleton w={56} h={4} rounded="sm" />
          <Skeleton h={7} w={7} rounded="full" />
        </div>
        <Skeleton w={40} h={4} rounded="sm" />
        <div className="space-y-1 mt-3">
          <div className="flex justify-start items-center space-x-2">
            <Skeleton h={5} w={5} rounded="full" />
            <Skeleton w={40} h={4} rounded="sm" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
};

export default DocumentCardSkeleton;
