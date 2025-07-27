import { Skeleton } from 'printer-ui';
import * as React from 'react';
import SignaturesTableSkeleton from '../components/Signatures/Table/Skeleton';
import SignaturesTable from '../components/Signatures/Table/Table';
import SignaturesPage from './Signatures';

const SignaturesPageSkeleton = () => {
  return (
    <div className="w-full h-full">
      <div className="h-full w-full bg-lighterGray rounded-lg">
        <div className="h-12 w-full bg-lightGray rounded-t-lg" />
        <div className="p-3">
          <div className="pt-4 flex items-center justify-between">
            <div className="flex space-x-2.5 items-center">
              <div className="hidden sm:block">
                <Skeleton h={4} w={20} rounded="default" />
              </div>
              <div className="hidden sm:block">
                <Skeleton h={9} w={52} rounded="lg" />
              </div>
              <div className="sm:hidden">
                <Skeleton h={7} w={36} rounded="lg" />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Skeleton h={4} w={12} rounded="default" />
              <Skeleton h={7} w={7} rounded="full" />
              <Skeleton h={7} w={7} rounded="full" />
            </div>
          </div>
          <SignaturesTableSkeleton />
        </div>
      </div>
    </div>
  );
};

export default SignaturesPageSkeleton;
