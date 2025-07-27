import * as React from 'react';
import { Skeleton } from 'printer-ui';

const OrganizationLogoSkeleton = () => {
  return (
    <div className="w-32 h-[100px] sm:w-44 sm:h-[159px]">
      <Skeleton w="full" h="full" />
    </div>
  );
};

export default OrganizationLogoSkeleton;
