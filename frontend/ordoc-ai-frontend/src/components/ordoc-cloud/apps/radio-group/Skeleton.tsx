'use client';

import * as React from 'react';

const AppsRadioGroupSkeleton = () => {
  return (
    <div className="pt-12 sm:pt-7">
      <div className="pb-2">
        <div className="h-4 w-44 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="pb-2">
        <div className="h-4 w-72 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="grid grid-cols-2 grid-flow-row gap-4 items-center">
        <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
};

export default AppsRadioGroupSkeleton;
