import * as React from 'react';
import { Skeleton } from 'printer-ui';

const TableHeaderSkeleton = () => {
  return (
    <div className="flex items-center pl-8 h-20 border border-lighterGray">
      <Skeleton w={32} h={8} />
    </div>
  );
};

export default TableHeaderSkeleton;
