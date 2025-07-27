import * as React from 'react';
import { Skeleton } from 'printer-ui';

const InactiveTaskTemplateDetailsSkeleton = () => {
  return (
    <>
      <Skeleton w="full" h={24} rounded="lg" />

      <Skeleton w="full" h={24} rounded="lg" />

      <Skeleton w="full" h={24} rounded="lg" />
    </>
  );
};

export default InactiveTaskTemplateDetailsSkeleton;
