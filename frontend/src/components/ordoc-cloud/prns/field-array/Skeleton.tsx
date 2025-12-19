import * as React from 'react';

const PrnsFieldArraySkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-5 w-32 bg-gray-200 rounded"></div>
        <div className="h-8 w-20 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="flex-1">
              <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
            </div>
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
      <div className="flex justify-end space-x-2">
        <div className="h-8 w-16 bg-gray-200 rounded"></div>
        <div className="h-8 w-20 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default PrnsFieldArraySkeleton;
