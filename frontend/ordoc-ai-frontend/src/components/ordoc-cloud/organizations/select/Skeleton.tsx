'use client';

import * as React from 'react';

const SelectOrganizationSkeleton = () => {
  return (
    <div className="relative">
      <div className="block w-full px-3 py-2 pr-10 h-10 bg-gray-200 border border-gray-300 rounded-md animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
      </div>
      
      {/* Skeleton dropdown arrow */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <div className="h-5 w-5 bg-gray-300 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export default SelectOrganizationSkeleton;
