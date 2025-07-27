import * as React from 'react';
import { Button, Input, Skeleton, Typography } from 'printer-ui';
import router from 'next/router';
import PasswordChecklist from '../../../../PasswordChecklist';

const UpdatePasswordSkeleton = () => {
  return (
    <div className="flex flex-col space-y-8 w-full px-7 sm:px-0 sm:w-5/12 py-8">
      <div className="space-y-2">
        <Skeleton h={4} w={20} rounded="default" />
        <Skeleton h={12} w="full" rounded="md" />
      </div>
      <div className="space-y-2">
        <div className="space-y-2">
          <Skeleton h={4} w={20} rounded="default" />
          <Skeleton h={12} w="full" rounded="md" />
        </div>
        <div className="space-y-2">
          <Skeleton h={3} w={72} rounded="default" />
          <Skeleton h={3} w={64} rounded="default" />
          <Skeleton h={3} w={56} rounded="default" />
          <Skeleton h={3} w={80} rounded="default" />
          <Skeleton h={3} w={20} rounded="default" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton h={4} w={40} rounded="default" />
        <Skeleton h={12} w="full" rounded="md" />
      </div>
      <div className=" flex justify-between">
        <Skeleton h={9} w={24} rounded="md" />
        <Skeleton h={9} w={40} rounded="md" />
      </div>
    </div>
  );
};

export default UpdatePasswordSkeleton;
