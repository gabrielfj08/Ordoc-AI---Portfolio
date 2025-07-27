import * as React from 'react';
import router from 'next/router';
import { ButtonRounded, Icon, Skeleton } from 'printer-ui';
import { Header } from '../../../Layout';

const UserViewSkeleton = () => {
  return (
    <>
      <Header className="pr-5 sm:px-5 py-5 justify-between">
        <div className="flex space-x-5 px-2 items-center h-full">
          <div className="invisible w-0 sm:visible sm:w-fit">
            <ButtonRounded
              onClick={() => {
                router.push(`/printer-cloud/users`);
              }}
            >
              <Icon
                name="return"
                alt="voltar"
                color="gray"
                w={30}
                h={30}
                fill
                stroke
              />
            </ButtonRounded>
          </div>
          <div className="mt-2">
            <Skeleton h={8} w={112} rounded="md" />
          </div>
        </div>
      </Header>
      <div className="mt-4">
        <div className="flex items-center">
          <div className="space-x-2 flex items-center">
            <Skeleton w={9} h={9} />
            <Skeleton w={40} h={7} />
          </div>
        </div>
        <div className="space-y-3 mt-6">
          <div className="flex items-center h-7">
            <div className="w-28">
              <Skeleton w={14} h={4} />
            </div>
            <div className="flex items-center justify-end space-x-1">
              <Skeleton w={24} h={4} />
            </div>
          </div>
          <div className="flex h-7 items-center">
            <div className="w-28">
              <Skeleton w={16} h={4} />
            </div>
            <Skeleton w={24} h={4} />
          </div>
          <div className="flex h-7 items-center">
            <div className="w-28">
              <Skeleton w={14} h={4} />
            </div>
            <Skeleton w={44} h={4} />
          </div>
          <div className="flex h-7 items-center">
            <div className="w-28">
              <Skeleton w={14} h={4} />
            </div>
            <Skeleton w={36} h={4} />
          </div>
          <div className="flex h-7 items-center">
            <div className="w-28">
              <Skeleton w={20} h={4} />
            </div>
            <Skeleton w={36} h={4} />
          </div>
          <div className="flex h-7 items-center">
            <div className="w-28">
              <Skeleton w={14} h={4} />
            </div>
            <Skeleton w={44} h={4} />
          </div>
          <div className="flex h-7 items-center">
            <div className="w-28">
              <Skeleton w={20} h={4} />
            </div>
            <Skeleton w={36} h={4} />
          </div>
          <div className="flex h-7 items-center">
            <div className="w-28">
              <Skeleton w={20} h={4} />
            </div>
            <Skeleton w={36} h={4} />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserViewSkeleton;
