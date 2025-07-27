import * as React from 'react';
import { Skeleton } from 'printer-ui';
import AppBar from '../../../components/AppBar';

const DecreeSkeleton = () => {
  return (
    <div className="w-full">
      <AppBar onClick={() => {}} />
      <div className="flex flex-col items-center h-screen justify-between py-10">
        <div className="pt-28 flex flex-col items-center space-y-2">
          <Skeleton h={12} w={64} rounded="default" />
          <Skeleton h={8} w={80} rounded="default" />
        </div>
        <div className="w-8/12 space-y-2">
          <div className="pr-10">
            <Skeleton h={6} w="full" rounded="default" />
          </div>
          <Skeleton h={6} w="full" rounded="default" />
          <div className="pr-24">
            <Skeleton h={6} w="full" rounded="default" />
          </div>
        </div>
        <div className="flex space-x-11">
          <Skeleton h={4} w={20} rounded="default" />
          <Skeleton h={4} w={12} rounded="default" />
        </div>
      </div>
    </div>
  );
};

export default DecreeSkeleton;
