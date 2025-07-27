import * as React from 'react';
import { Skeleton } from 'printer-ui';

const ShowDirectorySkeleton = () => {
  return (
    <main className="h-full max-w-full p-4 sm:p-8 space-y-3">
      <div className="space-y-4">
        <Skeleton w="full" h={44} rounded="lg" />
        <Skeleton w="full" h={24} rounded="lg" />
        <Skeleton w="full" h={24} rounded="lg" />
      </div>
    </main>
  );
};

export default ShowDirectorySkeleton;
