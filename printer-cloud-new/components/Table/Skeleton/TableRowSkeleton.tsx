import * as React from 'react';
import { Skeleton } from 'printer-ui';

const TableRowSkeleton = () => {
  return (
    <div className="flex items-center pl-8 h-20 border border-lighterGray">
      <Skeleton w={10} h={10} rounded="full" />
      <div className="flex flex-col gap-2 pl-4">
        <Skeleton w={32} h={5} />
        <Skeleton w={40} h={5} />
      </div>
    </div>
  );
};

export default TableRowSkeleton;
