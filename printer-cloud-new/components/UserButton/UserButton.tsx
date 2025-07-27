import * as React from 'react';
import { Popover } from '@headlessui/react';
import router from 'next/router';
import { Avatar, Icon, Typography } from 'printer-ui';
import { useDrawer } from '../../hooks';
import { UserButtonProps } from './types';
import Profile from '../Profile';

const UserButton = ({ user, currentOrganizationId }: UserButtonProps) => {
  const { openDrawer } = useDrawer();

  return (
    <>
      <Popover className="relative hidden sm:block">
        {({ open }) => (
          <div className="flex align-center">
            <Popover.Button className="sticky h-16 rounded-lg items-center bg-white shadow-default w-full focus:outline-none flex">
              <div className="h-16 flex items-center p-4 space-x-4">
                <Avatar
                  size="md"
                  placeholder={`${user?.name}`.charAt(0)}
                  src={user.avatarUrl}
                  color={
                    router.pathname.match('/printer-air')
                      ? 'red'
                      : router.pathname.match('/printer-flow')
                      ? 'yellow'
                      : 'blue'
                  }
                />
                <div className="w-40 truncate space-y-2">
                  <Typography className="truncate" variant="footnote1">
                    {user.name}
                  </Typography>
                </div>
                <Icon
                  alt="icon"
                  name="down"
                  color="darkGray"
                  stroke
                  fill
                  h={18}
                  w={18}
                  className={open ? 'rotate-180' : 'rotate-0'}
                />
              </div>
            </Popover.Button>
            <Popover.Panel className="absolute z-50 h-fit bg-white rounded-lg mt-[4.30rem] shadow-default w-full flex justify-center">
              <Profile currentOrganizationId={currentOrganizationId} />
            </Popover.Panel>
          </div>
        )}
      </Popover>
      <button
        className="sm:hidden h-16"
        onClick={() =>
          openDrawer(
            <div className="h-full w-full flex items-center">
              <Profile currentOrganizationId={currentOrganizationId} />
            </div>,
            'right'
          )
        }
      >
        <Avatar
          size="md"
          placeholder={`${user?.name}`.charAt(0)}
          color="white"
          textColor={
            router.pathname.match('/printer-air')
              ? 'red'
              : router.pathname.match('/printer-flow')
              ? 'yellow'
              : 'blue'
          }
          stroke
          src={user.avatarUrl}
        />
      </button>
    </>
  );
};

export default UserButton;
