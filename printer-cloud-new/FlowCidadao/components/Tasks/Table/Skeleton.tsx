import * as React from 'react';
import { Skeleton } from 'printer-ui';

const TasksTableSkeleton = () => {
  return (
    <div className="w-full h-[289px]">
      <Skeleton w="full" h={12} rounded="default" className="flex mb-2" />
      <div className="space-y-4">
        <Skeleton w="full" h={8} rounded="default" />
        <Skeleton w="full" h={8} rounded="default" />
        <Skeleton w="full" h={8} rounded="default" />
        <Skeleton w="full" h={8} rounded="default" />
        <Skeleton w="full" h={8} rounded="default" />
      </div>
    </div>
  );
};

export default TasksTableSkeleton;
