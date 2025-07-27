import * as React from 'react';
import { Skeleton } from 'printer-ui';

const SignaturesTableSkeleton = () => {
  const RowSkeleton = () => {
    return (
      <div className="h-20 flex w-full border-b border-lighterGray">
        <div className="hidden sm:w-1/12 h-full items-center justify-center sm:flex pr-2 sm:pr-0">
          <Skeleton w={8} h={8} rounded="sm" />
        </div>
        <div className="w-5/12 sm:w-4/12 flex items-center pl-4">
          <div className="hidden sm:flex">
            <Skeleton w={32} h={4} rounded="default" />
          </div>
          <div className="sm:hidden">
            <Skeleton w={20} h={4} rounded="default" />
          </div>
        </div>
        <div className="w-2/12 sm:flex flex-col hidden justify-center items-center space-y-2.5">
          <Skeleton w={16} h={4} rounded="default" />
          <Skeleton w={32} h={4} rounded="default" />
        </div>
        <div className="w-2/12 sm:flex hidden justify-center items-center">
          <Skeleton w={32} h={4} rounded="default" />
        </div>
        <div className=" w-5/12 sm:w-2/12 flex justify-center items-center">
          <Skeleton w={20} h={4} rounded="default" />
        </div>
        <div className="w-2/12 sm:w-1/12 h-full items-center justify-center flex sm:pr-0">
          <Skeleton w={9} h={9} rounded="full" />
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-between items-center mt-4 mb-8 bg-white">
      <div className="border border-lighterGray w-full">
        <div className="h-20 flex w-full border-b border-lighterGray">
          <div className="hidden sm:flex sm:w-1/12 h-full items-center justify-center" />
          <div className="flex w-5/12 sm:w-4/12 h-full items-center px-4">
            <div className="hidden sm:flex">
              <Skeleton w={28} h={5} rounded="default" />
            </div>
            <div className="sm:hidden">
              <Skeleton w={16} h={4} rounded="default" />
            </div>
          </div>
          <div className="hidden sm:flex h-full w-2/12 items-center justify-center">
            <Skeleton w={20} h={5} rounded="default" />
          </div>
          <div className="hidden sm:flex h-full w-2/12  items-center justify-center">
            <Skeleton w={20} h={5} rounded="default" />
          </div>
          <div className="flex h-full w-5/12 sm:w-2/12 items-center justify-center">
            <div className="hidden sm:flex">
              <Skeleton w={20} h={5} rounded="default" />
            </div>
            <div className="sm:hidden">
              <Skeleton w={20} h={4} rounded="default" />
            </div>
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
    </div>
  );
};

export default SignaturesTableSkeleton;
