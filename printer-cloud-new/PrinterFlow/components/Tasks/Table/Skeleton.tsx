import * as React from 'react';
import { Skeleton } from 'printer-ui';

const TasksTableSkeleton = () => {
  const RowSkeleton = () => {
    return (
      <div className="h-20 flex w-full justify-between border-b border-lighterGray">
        <div className="h-full block space-y-2 sm:space-y-0 sm:hidden items-center pl-4">
          <Skeleton w={16} h={4} rounded="default" />
          <Skeleton w={16} h={4} rounded="default" />
        </div>
        <div className="h-full sm:flex hidden items-center pl-4">
          <Skeleton w={16} h={4} rounded="default" />
        </div>
        <div className="h-full sm:flex hidden items-center pl-4">
          <Skeleton w={16} h={4} rounded="default" />
        </div>
        <div className="h-full sm:flex hidden items-center pl-4">
          <Skeleton w={16} h={4} rounded="default" />
        </div>
        <div className="h-full sm:flex hidden items-center pl-4">
          <Skeleton w={16} h={4} rounded="default" />
        </div>
        <div className="h-full sm:flex hidden items-center pl-4">
          <Skeleton w={16} h={4} rounded="default" />
        </div>
        <div className="h-full sm:flex hidden items-center pl-4">
          <Skeleton w={16} h={4} rounded="default" />
        </div>
        <div className="w-2/12 sm:w-1/12 h-full items-center justify-center flex pr-2 sm:pr-0">
          <Skeleton w={9} h={9} rounded="full" />
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex justify-between items-center mt-4 mb-8 mx-2" />
      <div className="border border-lighterGray mx-2 w-full">
        <div className="h-20 flex justify-between w-full border-b border-lighterGray">
          <div className="hidden sm:flex h-full space-x-4 items-center pl-4">
            <Skeleton w={20} h={5} rounded="default" />
          </div>
          <div className="sm:hidden block h-full sm:space-x-4 space-y-2 sm:space-y-0 items-center pl-4">
            <Skeleton w={24} h={5} rounded="default" />
            <Skeleton w={24} h={5} rounded="default" />
          </div>
          <div className="hidden sm:flex h-full items-center justify-center">
            <Skeleton w={20} h={5} rounded="default" />
          </div>
          <div className="hidden sm:flex h-full items-center justify-center">
            <Skeleton w={20} h={5} rounded="default" />
          </div>
          <div className="hidden sm:flex h-full items-center justify-center">
            <Skeleton w={20} h={5} rounded="default" />
          </div>
          <div className="hidden sm:flex h-full items-center justify-center">
            <Skeleton w={20} h={5} rounded="default" />
          </div>
          <div className="hidden sm:flex h-full items-center justify-center">
            <Skeleton w={20} h={5} rounded="default" />
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

export default TasksTableSkeleton;
