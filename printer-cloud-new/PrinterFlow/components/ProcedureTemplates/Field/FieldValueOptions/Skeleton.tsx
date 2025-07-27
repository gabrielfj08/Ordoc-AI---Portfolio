import * as React from 'react';
import { Skeleton } from 'printer-ui';

const FieldValueOptionsSkeleton = () => {
  return (
    <div className="space-y-1">
      <Skeleton w={40} h={6} rounded="default" />
      <Skeleton w={40} h={6} rounded="default" />
    </div>
  );
};

export default FieldValueOptionsSkeleton;
