import * as React from 'react';
import TableHeaderSkeleton from './TableHeaderSkeleton';
import TableRowSkeleton from './TableRowSkeleton';

const Skeleton = () => {
  return (
    <div className="w-full">
      <TableHeaderSkeleton />
      <TableRowSkeleton />
      <TableRowSkeleton />
      <TableRowSkeleton />
      <TableRowSkeleton />
      <TableRowSkeleton />
    </div>
  );
};

export default Skeleton;
