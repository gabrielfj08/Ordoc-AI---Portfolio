import * as React from 'react';
import { Skeleton } from 'printer-ui';

const ShowProcedureFieldsSkeleton = () => {
  return (
    <main className="sm:pr-10 px-4">
      <div className="mt-11 mb-8">
        <div className="absolute bg-white h-7 -mt-2.5 sm:-mt-3.5 ml-4 sm:ml-10 px-3 flex items-center">
          <Skeleton w={48} h={6} rounded="default" />
        </div>
        <div className="border border-lightGray rounded-2xl px-4 py-7 mt-3">
          <div className=" flex space-x-4">
            <div className="  sm:grid sm:grid-cols-2 gap-6 space-y-6 sm:space-y-0 w-full">
              <div className="space-y-2">
                <Skeleton w={20} h={4} rounded="default" />
                <Skeleton w={40} h={4} rounded="default" />
              </div>
              <div className="space-y-2">
                <Skeleton w={16} h={4} rounded="default" />
                <Skeleton w={36} h={4} rounded="default" />
              </div>
              <div className="space-y-2">
                <Skeleton w={10} h={4} rounded="default" />
                <Skeleton w={24} h={4} rounded="default" />
              </div>
              <div className="space-y-2">
                <Skeleton w={20} h={4} rounded="default" />
                <Skeleton w={32} h={4} rounded="default" />
              </div>
              <div className="space-y-2">
                <Skeleton w={20} h={4} rounded="default" />
                <Skeleton w={32} h={4} rounded="default" />
              </div>
              <div className="space-y-2">
                <Skeleton w={10} h={4} rounded="default" />
                <Skeleton w={24} h={4} rounded="default" />
              </div>
              <div className="space-y-2">
                <Skeleton w={16} h={4} rounded="default" />
                <Skeleton w={36} h={4} rounded="default" />
              </div>
              <div className="space-y-2">
                <Skeleton w={20} h={4} rounded="default" />
                <Skeleton w={40} h={4} rounded="default" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ShowProcedureFieldsSkeleton;
