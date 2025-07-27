import * as React from 'react';
import { Skeleton } from 'printer-ui';

const SubjectsListFieldSkeleton = () => {
  const RowSkeleton = () => {
    return (
      <div className="sm:pl-6 pl-2 w-full h-16 items-center flex justify-between bg-white">
        <div className="flex items-center justify-center">
          <Skeleton w={10} h={10} rounded="full" className="mr-4" />
          <Skeleton w={32} h={4} rounded="md" />
        </div>
        <div className="mr-4">
          <Skeleton w={10} h={10} rounded="full" />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full divide-y-2 divide-lighterGray">
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
  );
};

export default SubjectsListFieldSkeleton;
