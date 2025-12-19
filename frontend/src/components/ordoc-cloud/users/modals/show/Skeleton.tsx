import * as React from 'react';

const ShowUserModalSkeleton = () => {
  return (
    <div className="sm:h-[592.5px] sm:w-[617px] w-full">
      <div className="w-full h-[88px] bg-gray-200 rounded-t-lg animate-pulse" />
      <div className="bg-white p-6">
        <div className="sm:w-full h-[390.5px] flex flex-col space-y-[12.5px] w-72">
          <div className="flex flex-col justify-between space-y-1">
            <div className="h-6 w-12 bg-gray-200 rounded animate-pulse mb-[1.5px]" />
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex flex-col justify-between space-y-1">
            <div className="h-6 w-12 bg-gray-200 rounded animate-pulse mb-[1.5px]" />
            <div className="h-4 w-56 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex flex-col justify-between space-y-1">
            <div className="h-6 w-8 bg-gray-200 rounded animate-pulse mb-[1.5px]" />
            <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex flex-col justify-between space-y-1">
            <div className="h-6 w-36 bg-gray-200 rounded animate-pulse mb-[1.5px]" />
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex flex-col justify-between space-y-1">
            <div className="h-6 w-16 bg-gray-200 rounded animate-pulse mb-[1.5px]" />
            <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex flex-col justify-between space-y-1">
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse mb-[1.5px]" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex flex-col justify-between space-y-1">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-[1.5px]" />
            <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex flex-col justify-between space-y-1">
            <div className="h-6 w-18 bg-gray-200 rounded animate-pulse mb-[1.5px]" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default ShowUserModalSkeleton;
