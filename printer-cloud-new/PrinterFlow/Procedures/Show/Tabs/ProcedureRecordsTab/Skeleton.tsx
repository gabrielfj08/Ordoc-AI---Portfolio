import * as React from 'react';
import { Skeleton } from 'printer-ui';

const ProcedureRecordsSkeleton = () => {
  const SkeletonRow = () => {
    return (
      <div className="w-full h-20 bg-white opacity-70 mb-1">
        <div className="p-5 flex items-center space-x-3">
          <Skeleton w={8} h={8} rounded="full" />
          <div className="hidden sm:block">
            <Skeleton w={112} h={4} rounded="default" />
          </div>
          <div className="sm:hidden">
            <Skeleton w={40} h={4} rounded="default" />
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="flex flex-wrap p-5 w-full justify-between border-b border-lighterGray">
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
    </div>
  );
};

export default ProcedureRecordsSkeleton;
