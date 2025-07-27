import * as React from 'react';
import { Skeleton } from 'printer-ui';

const BreadcrumbsLinkSkeleton = () => {
  return (
    <div className="my-4 flex items-center space-x-2 justify-center py-7">
      <Skeleton h={5} w={20} rounded="sm" />
    </div>
  );
};

export default BreadcrumbsLinkSkeleton;
