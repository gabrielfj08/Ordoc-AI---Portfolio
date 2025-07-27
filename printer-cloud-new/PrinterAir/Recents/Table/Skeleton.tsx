import * as React from 'react';
import { Skeleton } from 'printer-ui';

const RecentDocumentsSkeleton = () => {
  const RowSkeleton = () => {
    return (
      <div className="h-20 flex w-full border-b border-lighterGray">
        <div className="w-2/12 sm:w-1/12 h-full items-center justify-center flex">
          <div className="h-[0.813rem] w-[0.813rem] ">
            <Skeleton w="full" h="full" rounded="sm" />
          </div>
        </div>
        <div className="w-8/12 sm:w-5/12 h-full space-x-4 flex items-center pl-4 sm:pl-16">
          <Skeleton h={5} w={5} rounded="default" />
          <Skeleton h={4} w={32} rounded="default" />
        </div>
        <div className="hidden sm:flex w-3/12 h-full items-center justify-center">
          <Skeleton w={36} h={4} rounded="default" />
        </div>
        <div className="hidden sm:flex w-2/12 h-full items-center justify-center">
          <Skeleton w={7} h={7} rounded="default" />
        </div>
        <div className="w-2/12 sm:w-1/12 h-full items-center justify-center flex pr-2 sm:pr-0">
          <Skeleton w={9} h={9} rounded="full" />
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="border border-lighterGray mx-2 mt-8">
        <div className="h-20 flex w-full  border-b border-lighterGray">
          <div className="w-2/12 sm:w-1/12 h-full items-center justify-center flex">
            <div className="h-[0.813rem] w-[0.813rem] ">
              <Skeleton w="full" h="full" rounded="sm" />
            </div>
          </div>
          <div className="w-8/12 sm:w-5/12 h-full space-x-4 flex items-center pl-4 sm:pl-16">
            <Skeleton h={5} w={16} rounded="default" />
          </div>
          <div className="hidden sm:flex w-3/12 h-full items-center justify-center">
            <Skeleton w={20} h={5} rounded="default" />
          </div>
          <div className="hidden sm:flex w-2/12 h-full items-center justify-center">
            <Skeleton w={14} h={5} rounded="default" />
          </div>
          <div className="w-2/12 sm:w-1/12 h-full" />
        </div>
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
      </div>
    </>
  );
};

export default RecentDocumentsSkeleton;
