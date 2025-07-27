import * as React from 'react';
import { Skeleton } from 'printer-ui';

const DirectoriesSkeleton = () => {
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
      <div className="flex justify-between items-center mt-4 mb-8 mx-2">
        <span className="flex items-center sm:space-x-2.5">
          <Skeleton
            w={32}
            h={4}
            rounded="default"
            className="hidden sm:block"
          />
          <div className="sm:w-52 w-44">
            <Skeleton w="full" h={9} rounded="lg" />
          </div>
        </span>
        <div className="flex items-center space-x-2">
          <Skeleton w={16} h={5} rounded="default" />
          <div className="flex space-x-3">
            <Skeleton w={7} h={7} rounded="full" />
            <Skeleton w={7} h={7} rounded="full" />
          </div>
        </div>
      </div>
      <div className="border border-lighterGray mx-2 ">
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
          <div className="w-2/12 sm:w-1/12 h-full"></div>
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

export default DirectoriesSkeleton;
