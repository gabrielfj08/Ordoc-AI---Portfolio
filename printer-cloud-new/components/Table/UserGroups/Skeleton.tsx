import * as React from 'react';
import { Skeleton } from 'printer-ui';

const UserGroupsTableSkeleton = () => {
  const RowSkeleton = () => {
    return (
      <div className="h-20 flex w-full border-b border-lighterGray">
        <div className="w-9/12 sm:w-6/12 h-full space-x-4 flex items-center pl-4 sm:pl-6">
          <Skeleton h={8} w={8} rounded="full" />
          <div className="space-y-2 sm:block hidden">
            <Skeleton h={4} w={32} rounded="default" />
            <Skeleton h={4} w={60} rounded="default" />
          </div>
          <div className="space-y-2 block sm:hidden">
            <Skeleton h={4} w={32} rounded="default" />
            <Skeleton h={4} w={40} rounded="default" />
          </div>
        </div>
        <div className="hidden sm:flex w-2/12 h-full items-center justify-center">
          <Skeleton w={8} h={8} rounded="default" />
        </div>
        <div className="hidden sm:flex w-2/12 h-full items-center justify-center">
          <Skeleton w={28} h={4} rounded="default" />
        </div>
        <div className="hidden sm:flex w-3/12 h-full items-center justify-center">
          <Skeleton w={28} h={4} rounded="default" />
        </div>
        <div className="w-2/12 sm:w-1/12 h-full items-center sm:justify-center justify-end flex pr-2 sm:pr-0">
          <Skeleton w={9} h={9} rounded="full" />
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="border border-lighterGray mx-2">
        <div className="h-20 flex w-full  border-b border-lighterGray">
          <div className="w-9/12 sm:w-6/12 h-full space-x-4 flex items-center pl-4 sm:pl-6">
            <Skeleton h={5} w={16} rounded="default" />
          </div>
          <div className="hidden sm:flex w-2/12 h-full items-center justify-center">
            <Skeleton w={24} h={5} rounded="default" />
          </div>
          <div className="hidden sm:flex w-2/12 h-full items-center justify-center">
            <Skeleton w={24} h={5} rounded="default" />
          </div>
          <div className="hidden sm:flex w-3/12 h-full items-center justify-center">
            <Skeleton w={28} h={5} rounded="default" />
          </div>
          <div className="w-1/12 sm:w-1/12 h-full" />
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

export default UserGroupsTableSkeleton;
