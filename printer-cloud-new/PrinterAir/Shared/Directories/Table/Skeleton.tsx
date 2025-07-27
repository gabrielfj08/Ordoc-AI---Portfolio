import * as React from 'react';
import { Skeleton } from 'printer-ui';

const SharedDirectoriesTableSkeleton = () => {
  const RowSkeleton = () => {
    return (
      <div className="h-20 flex w-full border-b border-lighterGray">
        <div className="w-8/12 sm:w-6/12 h-full space-x-4 flex items-center pl-4 sm:pl-16">
          <Skeleton h={5} w={5} rounded="default" />
          <Skeleton h={4} w={32} rounded="default" />
        </div>
        <div className="hidden sm:flex w-4/12 h-full items-center justify-center">
          <Skeleton w={48} h={4} rounded="default" />
        </div>
        <div className="hidden sm:flex w-1/12 h-full items-center justify-center">
          <Skeleton w={36} h={4} rounded="default" />
        </div>
        <div className="hidden sm:flex w-1/12 h-full items-center justify-center">
          <Skeleton w={16} h={4} rounded="default" />
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex justify-end items-center mt-4 mb-8 mx-2">
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
          <div className="w-8/12 sm:w-6/12 h-full space-x-4 flex items-center pl-4 sm:pl-16">
            <Skeleton h={5} w={16} rounded="default" />
          </div>
          <div className="hidden sm:flex w-4/12 h-full items-center justify-center">
            <Skeleton w={20} h={5} rounded="default" />
          </div>
          <div className="hidden sm:flex w-1/12 h-full items-center justify-center">
            <Skeleton w={14} h={5} rounded="default" />
          </div>
          <div className="hidden sm:flex w-1/12 sm:w-1/12 h-full items-center justify-center">
            <Skeleton w={14} h={5} rounded="default" />
          </div>
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

export default SharedDirectoriesTableSkeleton;
