import * as React from 'react';
import router from 'next/router';
import { Popover } from '@headlessui/react';
import { Avatar, Icon, Typography } from 'printer-ui';
import { useSessionGroupRequester } from '../../../../../hooks';
import { DesktopUserButtonProps } from './types';
import FlowProfile from '../Profile';

const DesktopUserButton = ({ user }: DesktopUserButtonProps) => {
  const { sessionGroupRequester, setSessionGroupRequester } =
    useSessionGroupRequester();

  return (
    <Popover className="relative">
      {({ open }) => (
        <div className="flex align-center">
          <Popover.Button className="sticky h-16 rounded-lg items-center bg-white shadow-default w-full focus:outline-none flex">
            <div className="h-16 flex items-center p-4 space-x-4 truncate">
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
              <div
                className={`w-40 ${
                  sessionGroupRequester.id ? 'space-y-2' : 'space-y-0'
                } `}
              >
                <Typography className="w-full truncate" variant="footnote1">
                  {user.name}
                </Typography>
                <Typography
                  variant="footnote1"
                  family="robotoMedium"
                  className={`truncate ${
                    router.pathname.match('/printer-flow') ? 'block' : 'hidden'
                  }`}
                >
                  {sessionGroupRequester.id ? sessionGroupRequester.name : null}
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
            <FlowProfile
              currentGroup={sessionGroupRequester}
              setCurrentGroup={setSessionGroupRequester}
            />
          </Popover.Panel>
        </div>
      )}
    </Popover>
  );
};

export default DesktopUserButton;
