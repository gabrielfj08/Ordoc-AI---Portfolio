import { Skeleton } from 'printer-ui';
import * as React from 'react';

const TasksPageSkeleton = () => {
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
    <div className="w-full h-full">
      <div className="h-full w-full bg-lighterGray rounded-lg">
        <div className="h-12 w-full bg-lightGray rounded-t-lg" />
        <div className="p-3">
          <div className="pt-4 flex items-center justify-between">
            <div className="flex space-x-2.5 items-center">
              <div className="hidden sm:block">
                <Skeleton h={4} w={20} rounded="default" />
              </div>
              <div className="hidden sm:block">
                <Skeleton h={9} w={52} rounded="lg" />
              </div>
              <div className="sm:hidden">
                <Skeleton h={7} w={36} rounded="lg" />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Skeleton h={4} w={12} rounded="default" />
              <Skeleton h={7} w={7} rounded="full" />
              <Skeleton h={7} w={7} rounded="full" />
            </div>
          </div>
          <RowSkeleton />
          <RowSkeleton />
          <RowSkeleton />
          <RowSkeleton />
          <RowSkeleton />
          <RowSkeleton />
        </div>
      </div>
    </div>
  );
};

export default TasksPageSkeleton;
