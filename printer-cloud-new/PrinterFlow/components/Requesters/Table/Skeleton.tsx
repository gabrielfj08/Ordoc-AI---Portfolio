import * as React from 'react';
import { Skeleton } from 'printer-ui';

const RequestersTableSkeleton = () => {
  const RowSkeleton = () => {
    return (
      <div className="h-20 flex w-full border-b border-lighterGray">
        <div className="w-7/12 sm:w-5/12 h-full flex items-center pl-4">
          <Skeleton w={44} h={4} rounded="default" className="sm:hidden flex" />
          <Skeleton w={52} h={4} rounded="default" className="hidden sm:flex" />
        </div>
        <div className="hidden sm:flex w-2/12 h-full space-x-2 items-center justify-center">
          <Skeleton w={16} h={4} rounded="default" />
          <Skeleton w={5} h={5} rounded="default" />
        </div>
        <div className="flex w-3/12 sm:w-2/12 h-full space-x-2 items-center justify-center">
          <Skeleton w={16} h={4} rounded="default" className="hidden sm:flex" />
          <Skeleton w={5} h={5} rounded="default" />
        </div>
        <div className="hidden sm:flex w-3/12 h-full items-center justify-center">
          <Skeleton w={24} h={4} rounded="default" />
        </div>
        <div className="w-2/12 sm:w-1/12 h-full items-center justify-center flex pr-2 sm:pr-0">
          <Skeleton w={9} h={9} rounded="full" />
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex justify-between items-center mt-4 mb-8 mx-2"></div>
      <div className="border border-lighterGray mx-2">
        <div className="h-20 flex w-full  border-b border-lighterGray">
          <div className="w-7/12 sm:w-5/12 h-full space-x-4 flex items-center pl-4">
            <Skeleton w={36} h={5} rounded="default" />
          </div>
          <div className="hidden sm:flex w-2/12 h-full items-center justify-center">
            <Skeleton w={20} h={5} rounded="default" />
          </div>
          <div className="flex w-3/12 sm:w-2/12 h-full items-center justify-center">
            <Skeleton w={14} h={5} rounded="default" />
          </div>
          <div className="hidden sm:flex w-3/12 h-full items-center justify-center">
            <Skeleton w={14} h={5} rounded="default" />
          </div>
          <div className="w-2/12 sm:w-1/12 h-full" />
        </div>
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
      </div>
    </>
  );
};

export default RequestersTableSkeleton;
