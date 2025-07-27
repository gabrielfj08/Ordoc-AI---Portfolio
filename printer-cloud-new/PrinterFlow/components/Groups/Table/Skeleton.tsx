import * as React from 'react';
import { Skeleton } from 'printer-ui';

const RequestersTableSkeleton = () => {
  const RowSkeleton = () => {
    return (
      <div className="h-20 flex w-full border-b border-lighterGray items-center">
        <div className="w-2/12 sm:w-1/12 h-full flex items-center pl-4 ">
          <Skeleton
            w={10}
            h={5}
            rounded="default"
            className="hidden sm:block"
          />
          <Skeleton w={8} h={5} rounded="default" className="sm:hidden" />
        </div>
        <div className="flex w-5/12 h-full items-center sm:w-6/12 pl-8 ">
          <Skeleton w={24} h={5} rounded="default" className="sm:hidden" />
          <Skeleton w={32} h={5} rounded="default" className="hidden sm:flex" />
        </div>
        <div className="flex w-3/12 sm:w-2/12 h-full items-center justify-center ">
          <Skeleton
            w={10}
            h={5}
            rounded="default"
            className="hidden sm:block"
          />{' '}
          <Skeleton w={8} h={5} rounded="default" className="sm:hidden" />
        </div>
        <div className="hidden sm:flex w-3/12 h-full items-center justify-center ">
          <Skeleton w={10} h={5} rounded="default" />
        </div>
        <div className="w-2/12 sm:w-1/12 h-full flex justify-center items-center ">
          <Skeleton w={8} h={8} rounded="full" />
        </div>
      </div>
    );
  };

  return (
    <div className="border border-lighterGray mx-2">
      <div className="h-20 flex w-full border-b border-lighterGray items-center mt-4">
        <div className="w-2/12 sm:w-1/12 h-full flex items-center pl-4 ">
          <Skeleton w={14} h={5} rounded="default" />
        </div>
        <div className="flex w-5/12 h-full items-center sm:w-6/12 pl-8 ">
          <Skeleton w={20} h={5} rounded="default" className="sm:hidden" />
          <Skeleton w={28} h={5} rounded="default" className="hidden sm:flex" />
        </div>
        <div className="flex w-3/12 sm:w-2/12 h-full items-center justify-center ">
          <Skeleton w={16} h={5} rounded="default" />
        </div>
        <div className="hidden sm:flex w-3/12 h-full items-center justify-center ">
          <Skeleton w={32} h={5} rounded="default" />
        </div>
        <div className="w-2/12 sm:w-1/12 h-full " />
      </div>
      <RowSkeleton />
      <RowSkeleton />
      <RowSkeleton />
      <RowSkeleton />
      <RowSkeleton />
    </div>
  );
};

export default RequestersTableSkeleton;
