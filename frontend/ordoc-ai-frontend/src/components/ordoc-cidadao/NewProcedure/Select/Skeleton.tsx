'use client';

import * as React from 'react';

const SelectSkeleton = () => {
  return (
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
      <div className="h-12 bg-gray-200 rounded-lg w-full animate-pulse"></div>
    </div>
  );
};

export default SelectSkeleton;
