import { Button, Skeleton, Typography } from 'printer-ui';
import * as React from 'react';

const VerifySignaturesSkeleton = () => {
  return (
    <div className="w-full space-y-10">
      <div className="sm:flex gap-6 justify-center hidden">
        <Skeleton w={96} h={64} rounded="2xl" />
        <Skeleton w={96} h={64} rounded="2xl" />
        <Skeleton w={96} h={64} rounded="2xl" />
      </div>
      <div className="flex gap-6 flex-col justify-center sm:hidden pb-10">
        <Skeleton w="full" h={64} rounded="2xl" />
        <Skeleton w="full" h={64} rounded="2xl" />
        <Skeleton w="full" h={64} rounded="2xl" />
      </div>
    </div>
  );
};

export default VerifySignaturesSkeleton;
