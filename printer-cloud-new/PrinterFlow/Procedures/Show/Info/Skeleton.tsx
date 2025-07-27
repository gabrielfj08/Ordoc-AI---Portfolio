import * as React from 'react';
import { Skeleton } from 'printer-ui';

const ShowProcedureInfoSkeleton = () => {
  return (
    <main className="sm:pr-10 px-4">
      <div className="mt-11 mb-8 w-full">
        <div className="absolute bg-white -mt-2.5 sm:-mt-3.5 ml-4 sm:ml-10 px-3 h-7 flex items-center">
          <Skeleton w={40} h={6} rounded="default" />
        </div>
        <div className="border border-lightGray rounded-2xl px-4 py-7 mt-3">
          <div className=" flex space-x-4">
            <div className="  sm:grid sm:grid-cols-2 gap-6 space-y-6 sm:space-y-0 w-full">
              <div className="space-y-2">
                <Skeleton w={32} h={4} rounded="default" />
                <Skeleton w={40} h={4} rounded="default" />
              </div>
              <div className="space-y-2">
                <Skeleton w={20} h={4} rounded="default" />
                <Skeleton w={44} h={4} rounded="default" />
              </div>
              <div className="space-y-2">
                <Skeleton w={16} h={4} rounded="default" />
                <Skeleton w={44} h={4} rounded="default" />
              </div>
              <div className="space-y-2">
                <Skeleton w={28} h={4} rounded="default" />
                <Skeleton w={36} h={4} rounded="default" />
              </div>
              <div className="space-y-2">
                <Skeleton w={16} h={4} rounded="default" />
                <div className="flex items-center space-x-2">
                  <Skeleton w={6} h={6} rounded="default" />
                  <Skeleton w={32} h={4} rounded="default" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton w={16} h={4} rounded="default" />
                <div className="flex items-center space-x-2">
                  <Skeleton w={6} h={6} rounded="default" />
                  <Skeleton w={16} h={4} rounded="default" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton w={12} h={4} rounded="default" />
                <Skeleton w={20} h={4} rounded="default" />
              </div>
              <div className="space-y-2">
                <Skeleton w={20} h={4} rounded="default" />
                <div className="flex items-center space-x-2">
                  <Skeleton w={6} h={6} rounded="default" />
                  <Skeleton w={8} h={4} rounded="default" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton w={28} h={4} rounded="default" />
                <Skeleton w={48} h={4} rounded="default" />
              </div>
              <div className="space-y-2">
                <Skeleton w={48} h={4} rounded="default" />
                <Skeleton w={40} h={4} rounded="default" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ShowProcedureInfoSkeleton;
