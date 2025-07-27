import * as React from 'react';
import { Skeleton } from 'printer-ui';

const ShowFieldSubjectSkeleton = () => {
  return (
    <div className="items-center p-4 rounded-lg bg-lighterGray">
      <div className="px-4 pt-4">
        <div className="flex mb-4 space-x-2 justify-between items-center">
          <div className="block">
            <Skeleton w={40} h={10} rounded="default" />
          </div>
          <div className="flex space-x-2 items-center">
            <Skeleton w={16} h={6} rounded="default" />
            <Skeleton w={8} h={8} rounded="full" />
            <Skeleton w={8} h={8} rounded="full" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="w-full h-52 rounded-2xl bg-white">
            <div className="w-full justify-end flex p-4">
              <Skeleton w={8} h={8} rounded="full" />
            </div>
            <div className="space-y-1 mb-5 ml-5">
              <Skeleton w={40} h={6} rounded="default" />
              <Skeleton w={72} h={6} rounded="default" />
            </div>
            <div className="space-y-1 ml-5">
              <Skeleton w={40} h={6} rounded="default" />
              <Skeleton w={72} h={6} rounded="default" />
            </div>
          </div>
          <div className="w-full h-52 rounded-2xl bg-white">
            <div className="w-full justify-end flex p-4">
              <Skeleton w={8} h={8} rounded="full" />
            </div>
            <div className="space-y-1 mb-5 ml-5">
              <Skeleton w={40} h={6} rounded="default" />
              <Skeleton w={72} h={6} rounded="default" />
            </div>
            <div className="space-y-1 ml-5">
              <Skeleton w={40} h={6} rounded="default" />
              <Skeleton w={72} h={6} rounded="default" />
            </div>
          </div>
          <div className="w-full h-52 rounded-2xl bg-white">
            <div className="w-full justify-end flex p-4">
              <Skeleton w={8} h={8} rounded="full" />
            </div>
            <div className="space-y-1 mb-5 ml-5">
              <Skeleton w={40} h={6} rounded="default" />
              <Skeleton w={72} h={6} rounded="default" />
            </div>
            <div className="space-y-1 ml-5">
              <Skeleton w={40} h={6} rounded="default" />
              <Skeleton w={72} h={6} rounded="default" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowFieldSubjectSkeleton;
