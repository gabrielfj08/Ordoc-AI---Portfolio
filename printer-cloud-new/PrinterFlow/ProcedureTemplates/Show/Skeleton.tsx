import * as React from 'react';
import { Skeleton } from 'printer-ui';

const ShowProcedureTemplateSkeleton = () => {
  return (
    <div className="sm:space-y-8 space-y-4">
      <div className="hidden sm:flex">
        <div className="space-y-4 mt-8">
          <Skeleton w={52} h={6} rounded="default" />
          <Skeleton w={80} h={6} rounded="default" />
        </div>
      </div>
      <div className="sm:hidden flex">
        <div className="space-y-4 mt-8 p-2">
          <Skeleton w={44} h={6} rounded="default" />
          <Skeleton w={32} h={6} rounded="default" />
        </div>
      </div>
      <div className="space-y-4 space-x-2 hidden sm:block">
        <Skeleton w={72} h={6} rounded="default" />
        <div className="flex space-x-3 justify-start">
          <div className="h-[1rem] w-[1rem] mt-1">
            <Skeleton w="full" h="full" rounded="sm" />
          </div>
          <Skeleton w={20} h={6} rounded="default" />

          <div className="h-[1rem] w-[1rem] mt-1">
            <Skeleton w="full" h="full" rounded="sm" />
          </div>
          <Skeleton w={20} h={6} rounded="default" />
        </div>
      </div>
      <div className="space-y-4 space-x-2 sm:hidden p-2">
        <Skeleton w={64} h={6} rounded="default" />
        <div className="flex space-x-3 justify-start">
          <div className="h-[1rem] w-[1rem] mt-1">
            <Skeleton w="full" h="full" rounded="sm" />
          </div>
          <Skeleton w={20} h={6} rounded="default" />

          <div className="h-[1rem] w-[1rem] mt-1">
            <Skeleton w="full" h="full" rounded="sm" />
          </div>
          <Skeleton w={20} h={6} rounded="default" />
        </div>
      </div>

      <div className="py-8 hidden sm:flex">
        <div className="space-y-6">
          <div className="w-[690px]">
            <Skeleton w="auto" h={16} rounded="default" />
          </div>
          <div className="w-[690px]">
            <Skeleton w="auto" h={16} rounded="default" />
          </div>
          <div className="w-[690px]">
            <Skeleton w="auto" h={16} rounded="default" />
          </div>
        </div>
      </div>
      <div className="py-8 sm:hidden p-3">
        <div className="space-y-6">
          <Skeleton w="auto" h={16} rounded="default" />
          <Skeleton w="auto" h={16} rounded="default" />
          <Skeleton w="auto" h={16} rounded="default" />
        </div>
      </div>
    </div>
  );
};

export default ShowProcedureTemplateSkeleton;
